# Starknet & Cairo

According to [starknet.io](https://starknet.io/what-is-starknet/):
> StarkNet is a permissionless decentralized Validity-Rollup (also known as a “ZK-Rollup”). It operates as an L2 network over Ethereum, enabling any dApp to achieve unlimited scale for its computation – without compromising Ethereum’s composability and security.

> StarkNet Contracts and the StarkNet OS are written in Cairo.

## Data Availability
StarkNet [supports two data avaliability modes](https://docs.starkware.co/starkex-v4/starkex-deep-dive/data-availability-modes). 

In ZK-Rollup mode, the new balances are published on the L1 chain for every batch. This mode is trustless, every user can withdraw their balance without any input from the L2. The catch is, much of the transaction cost is spent on publishing this data on L1.

In Validium mode, the data only lives on a L2 network called Data Availability Commitee. Cost is lower and state changes are invisible from L1. However, withdrawing funds requires cooperation from that network.

## Components
Taken from [StarkWare docs](https://docs.starkware.co/starkex-v4/overview)

![StarkNet components](/images/starknet-components.png)

StarkEx Service runs all the transactions with given inputs and remembers the state.

SHARP (shared prover) batches these valid transactions together and creates a single proof that gets published to the L1. Just the valid state after all the transactions per block is published to a dedicated fact registry, reducing size and cost.

## Cairo
According to [Cairo docs](https://cairo-lang.org/docs/index.html):
> Cairo is a programming language for writing provable programs, where one party can prove to another that a certain computation was executed correctly.

It is an interesting Turing-complete language, where asserting and assigning mean the same thing, which means there is no state mutability. Cairo programs do not compute results, just specify the constraints for a given set of inputs must adhere to. 

StarkNet contracts do not have off-chain state.

The language feels quite close to Solidity after applying some syntactic sugar. This is the first example given in the docs:
```cairo:no-line-numbers
# Declare this file as a StarkNet contract.
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

# Define a storage variable.
@storage_var
func balance() -> (res : felt):
end

# Increases the balance by the given amount.
@external
func increase_balance{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}(amount : felt):
    let (res) = balance.read()
    balance.write(res + amount)
    return ()
end

# Returns the current balance.
@view
func get_balance{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*,
        range_check_ptr}() -> (res : felt):
    let (res) = balance.read()
    return (res)
end
```
- `felt` is the prime integer field type
- `pedersen_ptr` allows the Pederson hash function
- `range_check_ptr` allows to compare integers
- `syscall_ptr` allows to invoke system calls, which is required for on-chain storage variables.

## Learning Resources
[Cairo Playground](https://www.cairo-lang.org/playground/) is quite a nice tool to get familiar with the language without any local setup.

Openzeppelin has a port of much of their contracts to Cairo, definitely a must-check to see some well-written Cairo/StarkNet code [here](https://github.com/OpenZeppelin/cairo-contracts). They make use of [Nile](https://github.com/OpenZeppelin/nile), their in-house build and deploy tool.
