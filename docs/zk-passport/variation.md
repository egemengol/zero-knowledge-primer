# Handling Algorithm Variations

## Challenge Overview

Passport verification requires flexible support for multiple cryptographic configurations while maintaining ZKP efficiency. We implemented at least one working variant for every critical verification step, handling algorithm selection differences across passports.

### Pipeline Breakdown

1. **First Verification Half** (MRZ to SignedAttributes):  
   Supports four digest algorithm variants:

   - SHA2-224
   - SHA2-256
   - SHA2-384
   - SHA2-512

2. **Second Verification Half** (Signature Layers):

```
[Local Certificate]
  └── SHA-X Digest ➔ Alg-Y Signature
      └── [Master Certificate]
          └── SHA-X Digest ➔ Alg-Y Signature
```

Supported configurations per layer:

- **Digest Algorithms**: SHA2-224/256/384/512
- **Signature Algorithms**: RSA | ECDSA

3. **Merkle Root Verification**:  
   Prove that the master key is in the masterlist without leaking nationality info

### Signature Algorithm Support

Observeed masterkey algorithm distribution:

- **RSA** (608 instances) ✅  
  Modified [o1js-rsa](https://github.com/Shigoto-dev19/o1js-rsa)
- **ECDSA secp256r1** (19 instances) ✅  
  Native o1js implementation
- **Other Curves** ❌  
  secp384r1 (34), secp521r1 (18), brainpool variants (51/54/12) - Not yet implemented

### RSA Situation

We needed a RSA implementation to handle different key sizes and arbitrary exponent.

The data below is collected from a masterlist version, numbers in parantheses mean how many instances of master certificates are observed in the list.

**Key Size Distribution**

- 2048 bits (8)
- 3072 bits (81)
- 4104 bits (509)
- 6144 bits (10)

**Exponent Variations**

- 65537 (578 instances)
- 3 (20)
- 148241/221251 (2 each)
- 65533/197833/106921/226241/105631/169923 (1 each)

## Verification Pattern Observation

While specifications allow independent algorithm selection for each signature layer, we observed:

```
Layer 1 (Local Cert) --[SHA2-X + Alg-Y]--> Layer 2 (Master Cert)
                      └──[Same SHA2-X + Alg-Y]──┘
```

This matching configuration pattern appeared in all tested passports, though unclear if mandated by specification.

## Example Configuration

A typical passport might use:

1. **Data Digest**: SHA2-256
2. **Signature Digest**: SHA2-512
3. **Signature Algorithm**: secp256r1

## Implication

This configuration freedom demonstrates the need for reliably handling different variations of the same logical operations - digesting and signing.
