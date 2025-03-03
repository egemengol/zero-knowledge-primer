# Building a Chatroom

We are trying to build a websocket based chatroom, using Spread the PubSub library.

There are two excellent examples of websocket based chatrooms already, let's go over them.

---

[nhooyr/websocket example](https://github.com/nhooyr/websocket/blob/master/internal/examples/chat/chat.go)

The server struct holds a set of subscriber structs, each consisting of a `chan []byte` while knowing how to close themselves.  
The server manages access to this set via a mutex and helper functions to keep it current for all of the subscribers coming and going.

---

[gorilla/websocket example](https://github.com/gorilla/websocket/blob/main/examples/chat/hub.go)

There is a `Hub` structure that keeps a set of `Client` structs which point to the `Hub` and a channel, and manages access to them via exposed channels.
The clients, however, send pointers of themselves over these channels whenever they want to come and go.  
The `Hub` and `Client` structures are highly coupled, and the logic is _spread_ (pun intended) over two files.

---

#### Our Plan

We will use:

- [nhooyr/websocket](https://github.com/nhooyr/websocket) for handling websockets.
- [egemengol/spread](https://github.com/egemengol/spread) for handling the PubSub between multiple websocket connections, with clean and obvious code.

### Message Struct

Let's create our `Message` type.

This struct will be the "message" type of the PubSub topic later.

```go
type Message struct {
	Username string `json:"name"`
	Message  string `json:"msg"`
}
```

### Publish HTTP Handler

Creating a `http.Handler` for publishing messages to the PubSub topic is easy.

The clients will use it by sending `HTTP POST` requests to the `/publish` endpoint

1. We read the incoming websocket message body and parse it into our `Message` struct.
2. We call the `spread.Topic.Publish` method with our `Message`.

When we call this function with its required dependencies (logger and topic), we will obtain a `http.Handler`. We will pass that to `http.ServeMux` for serving, later.

```go
func HandlePublish(logger *slog.Logger, topic *spread.Topic[Message]) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var msg Message
		if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
			logger.Warn("error decoding message", "err", err)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		r.Body.Close()

		logger.Info("publishing message", "msg", msg)

		if err := topic.Publish(msg); err != nil {
			logger.Error("error publishing message", "err", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	})
}
```

As you can see from the accepted `topic` argument, the topic knows and restricts the message types it broadcasts. Only `Message` structs are allowed into this particular topic.

Also, the handler does not know or care anything about its subscribers, it blissfully fires and forgets.

### Subscribe Websocket Handler

The clients will connect to this endpoint by making a connection to `ws://localhost:8000/subscribe` endpoint with their WebSocket library.

Our chatroom implementation chooses to use this websocket connection only for sending messages from the server to the client, even though it could potentially use it in both ways. Makes the implementation and error handling easier. Also, the writer of our websocket library has chosen to implement the chat functionality in this way.

1. We will upgrade the incoming request to a WebSocket connection by calling `Accept`.
2. We will subscribe to the topic, by getting a `<-chan Message` from it.
3. We loop through the messages and write them to the client.  
   We keep in mind that at any point, client can disconnect, or topic can be cancelled (on shutdown). We handle these cases in our loop.

```go
func HandleSubscribe(logger *slog.Logger, topic *spread.Topic[Message]) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, nil)
		if err != nil {
			logger.Error("error accepting websocket", "err", err)
			return
		}
		defer conn.CloseNow()

		recvChan, removeRecvChan, err := topic.GetRecvChannel(20)
		if err != nil {
			logger.Error("error getting recv channel", "err", err)
			return
		}
		defer removeRecvChan()

		ctx := conn.CloseRead(r.Context())

		for {
			select {
			case <-ctx.Done():
				logger.Info("client disconnected", "err", ctx.Err())
				return
			case msg, ok := <-recvChan:
				if !ok {
					logger.Info("recv channel closed")
					conn.Close(websocket.StatusGoingAway, "")
					return
				}
				data, err := json.Marshal(msg)
				if err != nil {
					logger.Error("error marshaling message", "err", err)
					return
				}
				if err := conn.Write(r.Context(), websocket.MessageText, data); err != nil {
					logger.Warn("error writing message", "err", err)
					return
				}
				logger.Info(
                    "forwarded to listener",
                    "fromUser", msg.Username,
                    "msg", msg.Message
                )
			}
		}
	})
}
```

When we subscribe to the topic by requesting a read channel, a copy of all of the messages published to the topic start to getting sent to the newly created channel. We are responsible for closing it via the returned destructor function.

> `ctx := conn.CloseRead(r.Context())`  
> Our websocket library detects the disconnected clients, only when it tries to read or write.  
> Since we know we do not read anything from client, we use this helper function to create a context, which gets cancelled when the client disconnects.

### Construct http.Server

1. We create a logger to be used by both our handlers and our topic.
2. We create a topic. It needs:
   - The type of the message it will carry, using generics.
   - A context, for easy cancellation
   - An optional logger, mainly for debug purposes.
   - A channel size for the publishers, they will block if the channel is full.
3. We populate the routes, via the handler factories defined above. We give each their dependencies. We then create the http server.

```go
func Run(ctx context.Context) error {
	logger := slog.New(slog.NewTextHandler(
        os.Stderr, &slog.HandlerOptions{Level: slog.LevelInfo}
    ))

	topic := spread.NewTopic[Message](ctx, logger, 20)

	mux := http.NewServeMux()

	mux.Handle("POST /publish", HandlePublish(logger, topic))
	mux.Handle("/subscribe", HandleSubscribe(logger, topic))

	httpServer := &http.Server{
		Addr:         "localhost:8000",
		Handler:      mux,
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 10,
	}
    //
    // We will run the server here
    //
}

func main() {
	ctx := context.Background()
	if err := Run(ctx); err != nil {
		log.Fatal(err)
	}
}
```

### Shutdown

Graceful shutdown is the hardest part of a http application in my opinion, especially a websocket enabled one.

We will implement an optimist but brutal shutdown mechanism here.

1. Get a context that gets cancelled when an interrupt is received.
2. Spawn a goroutine that waits on that context.
   1. Wait for the shutdown of websocket handlers, which `Shutdown` does not close.
   2. Shutdown the http server. The timeout is for the regular connections to close, in this case serving an `index.html`.

About the wait of the handlers:

- The topic is aware of the outer context, which gets cancelled on an interrupt.
- The topic notifies any channel based subscribers by closing their receive channels.
- The handlers return when they see their recv channels close.

```go
func Run(ctx context.Context) error {
    // Connect the context to interrupts.
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	//
	// Rest of the Run function
	//

	go func() {
		// Wait for the context be notified of an interrupt
		<-ctx.Done()

		// Topic is already listening to the context,
		// we know it will send close signals to the handlers
		// We wait for them to return for a bit
		time.Sleep(100 * time.Millisecond)

		// Give the server time to close all the connections
		timeoutCtx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
		defer cancel()
		if err := httpServer.Shutdown(timeoutCtx); err != nil {
			logger.Error("error closing http server", "err", err)
		}
	}()

	logger.Info("http server started listening on", "addr", httpServer.Addr)
	return httpServer.ListenAndServe()
}
```

> In principle, we could share a `sync.WaitGroup` between subscribe handlers, and wait on it instead of sleeping a fixed amount. The drawback would be waiting while blocking, which would hang on a non-progressing websocket handler, which is not good. We could wrap that blocking wait inside a goroutine and a channel, with a timeout around them.

> It is outside of the scope of this article, which is demonstrating how easy PubSub can be in Golang. The wait here is good enough, the remaining websocket connections are dropped and clients get notified via their websocket libraries anyway.

---

### Conclusion

The application may look complicated, but if we squint hard enough we can see it is mainly boilerplate whenever one writes http servers in golang via the standard library. The `/subscribe` part is typical for a listening websocket.

When we compare the approach here with the official examples, how obvious the code becomes, pushing all the synchronization work to the [egemengol/spread](https://github.com/egemengol/spread) library.

You can see the fully working implementation, along with [a simple UI](https://github.com/egemengol/spread/tree/main/examples/chatroom/index.html) at [spread examples directory](https://github.com/egemengol/spread/tree/main/examples/chatroom).
