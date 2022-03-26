---
sidebarDepth: 3
mathjax:
  presets: \def\lr#1#2#3{\left#1#2\right#3}
---
# Zokrates

According to the [ZoKrates docs](https://zokrates.github.io/introduction.html):
> ZoKrates is a toolbox for zkSNARKs on Ethereum. It helps you use verifiable computation in your DApp, from the specification of your program in a high level language to generating proofs of computation to verifying those proofs in Solidity.

It allows us to deploy a Verifier contract to an EVM chain, and the means for generating a Witness<a name="1src" href="#1">[1]</a> as Provers to interact with it.

Normally, one does not need a blockchain for being either a Prover or a Verifier. However, by having the Verifier as a contract on blockchain, other contracts can verify the witnesses they have by calling the `verifyTx` function, completely abstracting away all the zero knowledge parts. 

### Deployment Flow
1. Write the Verifier program in ZoKrates' own DSL, it gets compiled into a Solidity contract.
2. Prepare the Trusted Setup. This will get used by both the Verifier contract and Provers. ZoKrates disposes the Toxic Waste for us.
3. Export and deploy the contract.

### Verification Flow
1. Using the Program and the output of the Trusted Setup, prepare the Witness by providing the public and private variables.
2. Initiate a function call to the contract, receiving a boolean result indicating the validity of the given Witness.

### A Sample Program
Let us go through [one of the examples](https://zokrates.github.io/examples/sha256example.html) in the ZoKrates docs.

```:no-line-numbers
import "hashes/sha256/512bitPacked" as sha256packed

def main(private field a, private field b, private field c, private field d):
    field[2] h = sha256packed([a, b, c, d])
    assert(h[0] == 263561599766550617289250058199814760685)
    assert(h[1] == 65303172752238645975888084098459749904)
    return

```

A field is a integer in the range [0, `p`) where `p` is a large prime. 

Private variables are the secrets that you are trying to prove that you posess, they are not communicated to the Verifier.

The two values are the two halves of the hash of a value that we are set to verify the posession of.

The Prover prepares the Witness by running the `main` function locally with the secret in the form of four field variables. The correct 4-tuple which will satify the Verifier in this case is `(0,0,0,5)`.

After receiving the Witness, the Verifier is convinced that at the time of the creation of the proof, there was a 4-tuple which results in the known value when hashed, while not learning the actual value itself.

### Important Considerations
::: tip Caution
Division between field variables is performed according to [Fermat's Little Theorem](https://en.wikipedia.org/wiki/Fermat%27s_little_theorem).
:::

::: tip Caution
The verifier can only be sure of the validity of the proof, there is no authentication mechanism here, no public/private keys as well. It is possible to somehow obtaining a valid Witness and trick the Verifier while not knowing the secret yourself. This is not specific to the ZoKrates itsef, rather a more general zero-knowledge proving systems problem.
:::

::: tip Caution
After exporting the Solidity contract from the ZoKrates Program file but before deploying it onto the blockchain, it is open to modification. Since the creation of the proofs also requires the Program file, it is the Prover's responsibility checking the integrity of the Verifier. However, this allows the verification contract to have complete access to the on-chain data. Use it with caution!
:::

#### Footnotes
> <a name="1" href="#1src">[1]</a> A Proof is called a Witness by the zero knowledge community.
> 