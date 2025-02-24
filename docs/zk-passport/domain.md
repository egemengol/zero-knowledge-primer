# Domain Knowledge

## Core Components

These elements are read directly from the passport chip:

- **MRZ (Machine Readable Zone)**  
  Contains personal data in fixed format:
  ```
  P<GBRBAGGINS<<FRODO<<<<<<<<<<<<<<<<<<<<<<<<<
  P231458901GBR6709224M2209151ZE184226B<<<<<18
  ```
- **DG1 (Data Group 1)**  
  ASN.1 DER encoded version of MRZ with header.

- **LDS (Logical Data Structure)**  
  ASN.1 DER structure containing hashes of all data groups. DG1 hash always appears first.

- **SignedAttributes**  
  ASN.1 DER structure containing LDS digest and metadata.

- **Local Certificate & Signatures**  
  Contains public key for SignedAttributes signature verification, and its own signature from a higher authority.

**Masterlist**  
 A separate, versioned list of master certificates published by ICAO PKD (Public Key Directory). A unique Merkle root is generated for each version, which serves as a trusted anchor for verification.

---

## Verification Pipeline

### 1. MRZ-to-DG1 Validation

- Serialize MRZ into DG1 format.
- Verify DG1 hash matches the first entry in LDS.

### 2. LDS Digest Check

- Calculate the digest of the entire LDS structure.
- Confirm the digest matches the value in SignedAttributes.

### 3. Local Signature Verification

- Hash the SignedAttributes payload.
- Validate the signature using the public key from the passport's local certificate.

### 4. Certificate Chain Validation

- Extract the Authority Key Identifier from the local certificate.
- Verify the local certificate's signature using the corresponding master certificate from the masterlist.

### 5. Masterlist Membership Proof

- Prove that the master certificate used in step 4 is part of the trusted masterlist version.
- This is done by verifying a Merkle proof against the published Merkle root of the masterlist version.

---

## Why This Matters

Successful verification proves:

- The passport was issued by a trusted authority.
- The MRZ data hasn't been altered.
- All cryptographic links are intact, from the raw MRZ to the Merkle root of the masterlist version.
- The passport's master certificate is part of a trusted masterlist version, without revealing which specific certificate was used (protecting nationality information).

---

## Glossary

**eMRTD**  
Electronic Machine Readable Travel Document - Chip-enabled passport.

**ASN.1 DER**  
Structured data encoding format used in digital certificates.

**ICAO PKD**  
International Civil Aviation Organization Public Key Directory - Global registry of master certificates.

**Merkle Root**  
A cryptographic commitment to a set of data (e.g., masterlist certificates), enabling efficient and private membership proofs.
