# Techniques Employed

## Precalculation

We tried to take advantage of the underlying data properties whenever we could.

For example, realizing that DG1 is always the first item, and LDS header size and item width is determined by the the digest algorithm, we could say that "for every passport with SHA2-256 digest for the first part, DG1 digest is at offset 29 in LDS". This kinds of precalculation made circuits smaller and easier.

## State Machine Processing

This is a big one. Since most of our processing is compute heavy and sequential, this technique allowed us to fit our big computations into 65k gate limited circuits.

You must write your ZkProgram methods such that, all of the steps take the same public input and same public output. You are free to accept different private inputs in each.

The idea is, you write an arbitrary Struct as the 'State' that you 'carry' between different invocations of the methods. The orchestration happens outside the circuit, your user space code calls the methods one by one, in an arbitrary order, sometimes multiple times, creating a proof at each step. After the last invocation, you have your final proof.

There is a big requirement: you must take care to validate the public input is valid for you to work on. You can be sure that the proof is created by your zkprogram by `.verify()`ing it, you need to manually make sure you are at the correct step.

## SHA2 Hashing Big Payloads

Calculating the hash of the local certificate, definitely does not fit into a single circuit. Its size is also dynamic. For this, we made use of the `DynamicSHA` implementation from mina-attestations, where the interface allows to process the payload in chunks, carrying the state between chunks, just like how it happens in regular implementations of SHA hashing.

It uses the State Machine Processing idea explained above. You call `update` on the current state with the chunk you are provided, in the ZkProgram method.

It internally keeps two states for the same hash operation, one SHA and one Poseidon. Poseidon is very cheap.

After you finish hashing, you need to validate that indeed the big payload you have at hand is the one that got digested piece by piece, you do that by poseidon hashing it in one go (in circuit) and comparing it to the state's poseidon digest. If they match, you can finally trust the SHA digest.

## Subarray Check

Surprisingly, claiming "this big array (haystack) contains the small array (needle)" is very expensive in zk.

Normally, all you can do is bruteforcing O(M\*N) and checking if at least one of them are equal. This is the proper solution for known haystack and needle sizes, that are small.

Mina Attestations library provides DynamicArray implementations, which allow dynamically sized payloads with upper bounds. It exposes an assertSubarray method which does this for dynamic sized haystacks.

However, our usecase needed to find the public key in DER format, inside the local certificate, which is quite big. It did not fit in a single circuit.

We used the same State Machine trick, the same Poseidon commitment scheme as DynamicSHA, and implemented it such:

We have dynamically sized huge haystack, and known sized needle. Public key size is almost known for each variation, only problem is padding (the leading byte is 0, it is 64 bytes instead of 65).

We pieced the haystack into chunks such that:

```
[skip][skip][sk][OVERLAP][ski]
                [OVERLAP]
```

For each chunk, we continued Poseidon hashing the same carried state.

For finalization, we poseidon hashed the whole local cert (we do that anyway for signature validation digest), and checked if it matches the rolling state.

Consumes O(M) gates

## RSA implementation

Having [o1js-rsa](https://github.com/Shigoto-dev19/o1js-rsa) at hand made us realized not all math is created equal in o1js. There is `Gadgets`, which provides more efficient computation for 116bit numbers.

We needed to modify its algorithm to support different key sizes, with our own BigInt implementation that used 116bit limbs.

We also needed to support different exponents than the very efficient 65537 (0b10000000000000001), we implemented one that takes arbitrary exponents as bit arrays and do RSA verification across multiple invocations with, you guessed it, the State Machine approach.

Having our BigInt cover all key sizes, with implementation accepting all exponents, we were able to use a single RSA implementation for all variants, sparing us from building separate circuits for separate RSA configurations.

## Hiding Master Public Key

To verify a passport up until the Master Certificate Public Key, you need to know the masterlist, at least the master certificate you are interested in, filtered by their "Subject Key Id"s.

But this immediately exposes your nationality to a verifier, which is not a good limitation. Therefore, we use merkle trees for verifying "I have a passport with Master Authority Key Id that is in this list", and we publish merkle roots for masterlist versions. A passport is verified with one of these public roots, without leaking nationality information.
