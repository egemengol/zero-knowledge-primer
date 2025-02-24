# Links & Dependencies

## Links

Repos containing o1js/circuit code

- [https://github.com/piconbello/zk-passport-circuits](https://github.com/piconbello/zk-passport-circuits)
- [https://github.com/piconbello/zk-passport-o1js-lib](https://github.com/piconbello/zk-passport-o1js-lib)

Our mobile application for reading a passport via NFC reader on the phone, written in React Native, for both iOS and Android:  
[https://github.com/piconbello/zk-passport-o1js-mobile](https://github.com/piconbello/zk-passport-o1js-mobile)

Our masterlist and raw passport data parsing implementation:  
[https://github.com/piconbello/zk-passport-emrtd-lib](https://github.com/piconbello/zk-passport-emrtd-lib)

Our textual documentation so far:

- [Notion docs](https://bitter-brazil-46a.notion.site/ZkPassport-O1JS-for-Mina-10f52e8389b0800d8600f94b79f4d971)
- A couple early documentation pages  
  [https://zkpassportdocs.netlify.app/](https://zkpassportdocs.netlify.app/)

Our [grant application](https://github.com/MinaFoundation/Core-Grants/issues/18#issuecomment-2273654418)

## Dependencies

First of all, the one library apart from o1js itself, that enabled us to implement this passport verification, is [Mina Attestations](https://github.com/zksecurity/mina-attestations). Big thanks to [@mitschabaude](https://github.com/mitschabaude) and ZkSecurity team.

We also closely followed [o1js-rsa](https://github.com/Shigoto-dev19/o1js-rsa) implementation of RSA algorithm, but supporting different sizes and exponents.
