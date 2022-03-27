# Mina
According to the [Mina homepage](https://minaprotocol.com/):
> We are the world’s lightest blockchain, powered by participants. Using zero knowledge technology, Mina is creating the infrastructure for the secure, democratic future we all deserve.

## Verifiable with 22KB
For traditional blockchains like Bitcoin or Ethereum, anyone that wants to verify the correctness of the blockchain needs to verify every block starting from the genesis, by hashing the blocks themselves and check the hashes.

Please do not misunderstand, this ability as-is still quite useful. The drawback is, anyone who wishes to verify the chain must have ***ALL THE DATA PRODUCED EVER***, including Matt ordering a coffee in 2009 summer, even if we live in two centuries later.

:::tip Point
Zero-knowledge systems exist for being able to convince somebody about the validity of some data, according to some constraints, without requiring them to know the underlying data itself.
:::

Mina, by constructing the blocks as recursive proofs, separates the verification of correctness process from the historical data. This allows anyone to download 22KB data for the blockchain and have the ability to verify any piece of data that they know on the blockchain.

:::tip Beware
This implies that when you want to validate not the correctness of the whole chain but a piece of data inside it (like a wallet balance), you still need to know the data you are validating with some metadata alongside. Think Merkle trees, on steroids.
:::

:::tip Point
The nodes that are participating to the operation of the Mina Protocol itself still remember the historical data. They still respond to users' read requests like Ethereum. The difference is, the users can verify the correctness of the data immediately.
:::

## zkApps
Mina is on the way of supporting a very interesting type of smart contracts.

Every contract is a Verifier program, and every transaction with them must be correct Proofs. Since Proofs are created locally, every smart contract transaction is essentially the same from the network's perspective since it always performs a verification which takes constant time, irregardless of the complexity of the contract. No gas fees or limits.

SnarkyJS, which is the zkApp development library is written in TypeScript, allowing the users to compute their proofs right in the browser. 

There is a distinction between on-chain and off-chain state. zkApps have the option of 8 fields of 32 bytes each of arbitrary public storage on-chain. 

Because of proofs being computed locally, as long as it works, there is no constraint about where will the off-chain data which is used for creating the proof live. This even allows other chains, making inter-operability a breeze.

Sudoku and TicTacToe examples can be found [here](https://github.com/o1-labs/zkapp-cli/tree/main/examples).