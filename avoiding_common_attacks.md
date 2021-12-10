# Avoiding Common Attacks

### Protecting against Re-entrancy

A key concern with blockchains, especially considering programs that require inter-contract execution is that a smart-contract can potentially take over the control flow of another. It can write unexpected data to the blockchain that can pollute the data that another dependant contract is expecting.

A very well known re-entrant attack on Ethereum sometimes referred to as [The DAO](https://www.gemini.com/cryptopedia/the-dao-hack-makerdao) hack, and resulted in a hard fork of the Ethereum network in 2016.

Inheriting the [ReentrancyGuard.sol](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard) helps to prevent these kinds of attacks. It prevents functions marked with `nonReentrant` from calling eachother, although this can lead to some additional complexity to smart contract implementations.

More Information:

- Consensys documentation: https://consensys.github.io/smart-contract-best-practices/known_attacks/
- Open Zeppelin docs: https://www.gemini.com/cryptopedia/the-dao-hack-makerdao

### Access Control Design Patterns

A standard practice for smart contract development is to ensure that certain criteria are met before executing a contract's function. This can be done by adding modifiers to your contract's code. This is particularly necessary for checking things like whether or not a wallet has enough funds, or if it is the owner of an `NFT`.

There are several modifiers that we are using here in this application, some of which are inheritied from the [OpenZeppelin interfaces]() and some that are written [directly into the smart contract itself]()
