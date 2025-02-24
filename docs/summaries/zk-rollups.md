
# ZK-Rollup Reading List

[Zero-Knowledge Blockchain Scalability](https://ethworks.io/assets/download/zero-knowledge-blockchain-scaling-ethworks.pdf) by EthWorks discusses the zk-Rollup approach ***exceptionally well***. Definitely a must-read.

[Evaluating Ethereum L2 Scaling Solutions: A Comparison Framework](https://blog.matter-labs.io/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955) by MatterLabs compares different scalability approaches to scale Ethereum

[Understanding rollup economics from first principles](https://barnabe.substack.com/p/understanding-rollup-economics-from?s=r) breaks down the cost structure. The main culprits are L1 publication costs and L2 operator costs.

[zkPorter: a breakthrough in L2 scaling](https://blog.matter-labs.io/zkporter-a-breakthrough-in-l2-scaling-ed5e48842fbf) introduces the fractal scaling solution for the off-chain data availability of the zkSync project.

[L2 Interoperability: A Comparison Between StarkEx, Loopring, Hermez and Connext](https://medium.com/@sin7y/l2-interoperability-a-comparison-between-starkex-loopring-hermez-and-connext-33fa3e720c94) discusses the different interoperability methods between said projects, bypassing L1.

[zkRollup Directory](https://www.zkrollups.xyz/) curates a list of active zk-rollup projects.

[L2 Fees](https://l2fees.info/) compares the costs between L2 solutions.


## Short Comparison with Optimistic Rollups
In optimistic rollups, the aggregators publish minimal information, assuming the aggregators generally behave. Proofs are generated once there is a claim about some fraud.

This property generally allows them to operate with lower cost, however the withdrawal process takes quite a bit of time since the protocol needs to give the objectors some time to prepare their case with proofs.
