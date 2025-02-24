# Cryptographic Algorithm Variation

We managed to implement at least one variation of every step, separately, that is needed for passport verification.

What we mean by variation is, while the logic is the same, the digest and signature algorithm selection is varied from passport to passport.

The first half of the verification, from MRZ to SignedAttrs, uses a single digest algorithm, picking one from SHA2 family of four sizes (224, 256, 384, 512).

The second half of the verification that consists of two layers of signature verification, choosed a digest algorithm from the same SHA2 family, as well as a signature algorithm from the following list, parsed from the masterlist, where:

- [x] RSA (608)
- [x] secp256r1 (19)
- [ ] secp384r1 (34)
- [ ] secp521r1 (18)
- [ ] brainpoolP256r1 (51)
- [ ] brainpoolP384r1 (54)
- [ ] brainpoolP512r1 (12)

secp256r1 is provided by o1js, and we modified [o1js-rsa](https://github.com/Shigoto-dev19/o1js-rsa) for our purposes.

Where RSA public key analysis returns:

RSA Key Sizes (bits):

- 2048 bits (8 instances)
- 3072 bits (81 instances)
- 4104 bits (509 instances)
- 6144 bits (10 instances)

RSA Public Exponents:

- 65537 - 578 instances
- 3 - 20 instances
- 148241 - 2 instances
- 221251 - 2 instances
- 65533 - 1 instance
- 197833 - 1 instance
- 106921 - 1 instance
- 226241 - 1 instance
- 105631 - 1 instance
- 169923 - 1 instance

For example, a passport may choose the following configuration:

1. Sha2-256 for digest
2. Sha2-512 for signature digest
3. secp521r1 for signature

We observed that the two layers of signature both used the same algorithm variants, it is unclear if this is mandatory.

Since the underlying implementations are completely different, the verifying circuit for such a passport must be different from another passports with different configurations.
