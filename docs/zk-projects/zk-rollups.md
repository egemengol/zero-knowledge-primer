
# ZK-Rollup Reading List

[Zero-Knowledge Blockchain Scalability](https://ethworks.io/assets/download/zero-knowledge-blockchain-scaling-ethworks.pdf) by EthWorks discusses the zk-Rollup approach ***exceptionally well***. Definitely a must-read.

[Evaluating Ethereum L2 Scaling Solutions: A Comparison Framework](https://blog.matter-labs.io/evaluating-ethereum-l2-scaling-solutions-a-comparison-framework-b6b2f410f955) by MatterLabs compares different scalability approaches to scale Ethereum

[Understanding rollup economics from first principles](https://barnabe.substack.com/p/understanding-rollup-economics-from?s=r) breaks down the cost structure. The main culprits are L1 publication costs and L2 operator costs.

[zkRollup Directory](https://www.zkrollups.xyz/) curates a list of active zk-rollup projects.

[L2 Fees](https://l2fees.info/) compares the costs between L2 solutions.


## Short Comparison with Optimistic Rollups
In optimistic rollups, the aggregators publish minimal information, assuming the aggregators generally behave. Proofs are generated once there is a claim about some fraud.

This property generally allows them to operate with lower cost, however the withdrawal process takes quite a bit of time since the protocol needs to give the objectors some time to prepare their case with proofs.
