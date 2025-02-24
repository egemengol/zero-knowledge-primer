# Combining Pieces Together

After implementing every step of the pipeline, we needed to bring them together to produce a single proof from MRZ to a Masterlist MerkleRoot per passport, even if they are produced by different circuits from each other due to cryptographic algorithm variances.

We tried two schemes for this. Unfortunately, neither of them worked for us.

### Tree Approach

This feels quite natural, a nested structure like calling functions from functions. However, the limitation of `maxProofsVerified` - "at most two different types proofs can be verified by a single circuit" soiled these plans. We intended to use Mina Attestations for proving selective properties on top of MRZ, that consumed one of these proofs right there. Even if that is not the case, only three layers of proofs is not sufficient for our usecase, since a good chunk of the gates is spent for verifying the leaf nodes, around 15k each. So if a node has two leaves, half of the budget is gone already.

### State Machine Approach

This one is way more verbose, way more error prone since you need to constantly validate application-specific constraints between steps, but it was promising. However, even when all of the methods are correct and each of them are under the gate limitation of 65k, when the method count increases, the compilation fails with obscure wasm errors. We could not figure a way out of that.
