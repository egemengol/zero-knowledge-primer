---
title: Introducing Spread
description: Ergonomic PubSub/EventBus in Golang
---

<div style="margin: -1.5rem -1.5rem 2rem -1.5rem; max-width: none;">
  <img src="/images/spread_cut.jpeg" alt="Spread" style="width: 100%; max-height: 350px; object-fit: cover;">
</div>

# Spread

<!-- ![spread](/images/spread_cut.jpg) -->

<span style="font-size: 20px; "><i>Ergonomic PubSub/EventBus in Golang</i></span>

## Why

When one wants pub/sub functionality in a Golang application, there are mainly two choices.

One: You bring a **_Big Boi_** like _RabbitMQ, Kafka, Redis_ or some other messaging solution. They are battle-tested and scalable, however they come with some drawbacks:

1. <u>Development complexity</u>:  
   Every developer needs to know the sdk, semantics and performance characteristics of given message broker.
2. <u>Deployment complexity</u>:  
   If you are hosting the broker yourself, there is another service you need to manage and keep track of, as well as creating a repeatable development environment in your system for you and your colleagues.
3. <u>Expensive</u>:  
   In terms of cloud costs or energy consumption, it is quite a bit heavier than your standalone Golang application.

Two: You implement a custom solution, like the chatroom examples of [gorilla/websocket](https://github.com/gorilla/websocket/blob/main/examples/chat/hub.go) or [nhooyr/websocket](https://github.com/nhooyr/websocket/blob/master/internal/examples/chat/chat.go). It works well, you use no external dependencies in typical Gopher fashion, but:

1. <u>Error prone</u>:  
   It is notoriously easy to miss subtle bugs in concurrent code. We use Golang which makes things so much easier, it is still a problem
2. <u>Tight coupling</u>:  
   If you are using channels, opening and closing channels in a correct manner is hard (`malloc` and `free` vibes anyone?) and requires synchronization between producers and consumers.  
   It makes your application hard to modify as well, since you never know if you introduced a new bug, too subtle to catch, right away.

There are a lot of problems that live in between. I will go out of a limb and will claim that %90 of startup ideas and side projects will never grow out of a singular beefy multicore server that hosts a well-written Golang monolith. In the case you do, you have wonderful problems, have at thee with the **_Big Bois_**, but only then.

There is the really nice [asaskevich/EventBus](https://github.com/asaskevich/EventBus) library which covers a lot, and is the main inspiration of this library.  
A couple minor notes:

- Unmaintained in the last 4 years.
- Uses mutexes, hard to grasp what is going on.
- Precedes generics, interfaces are clunky to work with.

So [Spread](https://github.com/egemengol/spread), this library here, is a

- Single process and in-memory,
- PubSub / EventBus / Broadcast / Fanout  
  library with
- Ergonomic, type-safe _topics_ implemented using generics,
- Based on channels.

Intended to be useful for:

- In-memory pipelines with persistence _==> Event Sourcing_
- Decoupled aggregates for said pipelines
- Soft-realtime applications that needs broadcast, like chatrooms.

## Overview

You can subscribe to a `Topic` in three ways, _simultaneously_ and _dynamically_:

```go
var topic *spread.Topic[T]

// Channel based
recvChan, _, _ := topic.GetRecvChannel(bufSize)
for msg := range recvChan {
    ...
}

// A separate, freshly spawned goroutine per message
topic.HandleAsync(
    func(context.Context, T) {}
)

// Synchronous but blocks the topic
topic.HandleSync(
    func(T) {}
)
```

### Performance Characteristics

- Every topic has a inbound channel with a dedicated goroutine for broadcasting.
- Synchronous handlers in `HandleSync` get executed in this goroutine.
- Asynchronous handlers or receiver channels that cannot keep up (with full buffers) get eliminated from the subscribers.
- Publishing is the same as sending to a buffered channel, blocks when full.

## Plans

I love the excellent [Phoenix.PubSub](https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html) library in the Elixir ecosystem, and would love to achieve the same flavor and balance of usefulness, reliability and flexibility with **Spread**. I believe we can come close.

I also am very impressed by the [LMAX Architecture](https://martinfowler.com/articles/lmax.html), which prompted me to think about the PubSub pattern.  
There are at least two impressive implementations of it in Golang, [go-distruptor](https://github.com/smarty-prototypes/go-disruptor) and [zenq](https://github.com/alphadose/zenq), which I will thoroughly study and will try to join their very performant ideas with an easy-to-use API, in the long run.

I also want to make it really easy to build _Event Sourced_ applications, **Spread** can be a good building block for it.

---

Github: [egemengol/spread](https://github.com/egemengol/spread)

If you think it is worth trying out or talking about, if you have any ideas, lets meet!
