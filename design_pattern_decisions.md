# Design Pattern Decisions

### dApp Architecture

While the web2 api server may seem unecessary (everything can simply live in the client), I feel like there is still some value in having a separation of concerns between the client and server, and would be beneficial long-term from a security and scalability perspective. I have always been a fan of distributed microservice architecture, and wanted to emulate that as much as possible in this project. I feel like a microservice system design pairs nicely with the tennets of distributed blockchain architecture. Should this scale, it's very possible that we may need to begin tacking on services that blockchains may not yet be ideally suited for, and I feel having this separation of concerns would help to make that process a bit more manageable.

Both the `client` and `api` directories have their own `.env` files. These are secured on the server, but can be replicated locally if spinning up a local chain for development. I would love to make this process a bit more automated, as it's currently a bit of a manual process (see [Getting Started](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/DOCS.md#getting-started) for local development setup).

### Smart Contract Design Patterns

_Inheritance and Interfaces_

We are inheriting and extended several, well audited smart contract interfaces from `openzeppelin` The notable ones are:

- [ERC721.sol](https://docs.openzeppelin.com/contracts/2.x/api/token/erc721): A standard NFT smart contract used to mint unique NFTs onto the blockchain.

- [ERC721URIStorage.sol](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721URIStorage): To allow for URI management for NFT metadata that is hosted on the distributed IPFS file system.

- [ReentrancyGuard.sol](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard): To protect against reetrant attack vectors. See [avoiding_common_attacks.md](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/avoiding_common_attacks.md#avoiding-common-attacks) for more details.

### Inter-Contract Execution

- The `NFT` smart contract accepts the `NFTMarket` contract's address in it's constructor, and approves it to handle transfers even though it is not the `NFT` owner. This allows the marketplace to act as an "escrow" that hold the NFT assets while they are for sale on the marketplace.

> Note: I ran into some blockers here that I needed to work around in order to meet the deadline. See TODOs for more details

- The `NFTMarket` contract can call function on `NFT` by inheriting it, and then executing one of it's methods, such as `transferFrom` which is inherited from the OpenZeppelin [ERC721 spec](https://docs.openzeppelin.com/contracts/2.x/api/token/erc721). See: [LINK HERE]()
