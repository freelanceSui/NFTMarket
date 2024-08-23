# BootstrapNFT - A Full-stack NFT factory [React, Express, Solidity]

### Quick Links:

1. [Getting Started](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/DOCS.md)
2. [Logic](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/README.md#logic)
3. [Design Pattern Decisions](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/design_pattern_decisions.md)
4. [Avoiding Common Attacks](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/avoiding_common_attacks.md)
5. [Demo Walkthrough](https://github.com/gambinish/blockchain-developer-bootcamp-final-project#demo-recordings)
6. [Running Tests](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/DOCS.md#running-tests)

Worked as the Blockchain Developer on this project.

This project scaffolds a full stack Web2/Web3 integration.

I wanted to show one way that my team at work can extend our existing tech-stack (Node.js/React) into the Web3 space. I am still trying to improve and iterate on this.

Hosted on Heroku: https://gentle-citadel-30423.herokuapp.com/

Feed me NFT 😄: `0x6bbf5CB9ab2c1Ff248Aaa48Fdd10DC1732d7b1Cc`

This spins up a "marketplace", that works as a distributed CRUD application on the [Ropsten](https://ropsten.etherscan.io/) Ethereum testnet. It allows `wallets` to browse (read) and buy/sell (write) digital items with Ropsten ETH in a similar way to how an NFT marketplace works. To me, in many ways this feels like a traditional API, only that it's monetized, doesn't have a database, and instead writes directly to the blockchain.

Solidity instead of SQL.

In order for this to work in the "real world" (whatever that is) these NFTs should represent something valuable in order for the dApp to function properly. You'll notice some naming conventions that are car-related, but those are simply artifacts from the build, and could easily be collectibles, or information that should be exclusive (fashion, gaming pre-releases, concert tickets). Each token will be a minted NFT, while the associated metadata will be deployed to [IPFS](https://ipfs.io/), a distributed file hosting service. They can then be bought and sold via the marketplace, which is a smart contract that handles the transfer of funds between wallets.

For the purposes of testing this dApp, there are no restrictions to what kind of asset you upload and create an NFT out of. However, I would eventually like to create some guardrails in the form of Oracles that could help mitigate things like NSFW assets or some other form of image recognition. My front-end form handling can also be improved. A DAO voting mechanism in a multisig wallet could also be an option.

_File Structure_

Users will interact with a Web2 client (React), that will display the metadata for all available NFTs for sale. These metadata are associated to an NFT on the blockchain. The client server is located in the `client` directory.

Web client will interact with a Web2 API (Express) that will in turn protect secrets, as well as handle smart contract deployments, compilation, and tests. Ideally this can be further secured. This API server might be useful for handling things that blockchains aren't suited for (push notifications, email, etc). The API server is located in the `api` directory.

Smart contracts will handle business logic associated with escrow funds and transfering ownership of NFTs. There is no database! 🎉

See [design_pattern_decisions.md](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/design_pattern_decisions.md#design-pattern-decisions) for more details on why certain architecutre and design pattern decisions were made.

## Logic

Wallets (ie "users") can upload items they want to sell. Each item will be an NFT. NFTs are minted via `NFT.sol`, and published the to the blockchain. These NFTs will have a starting `price`, a boolean representing the item being `sold`, a `wallet_public_key` and `token`. They will be made available for other wallets to purchase on the network via `Market.sol`. NFTs can be purchased from the marketplace. Purchased NFTs can have their price modified by their owner, and relisted back into the marketplace. This flow can generate profits (or losses) as funds from purchases are transfered between wallets via `Market.sol`.

- User uploads an asset on the `/dashboard`, and can "Generate NFT", minting a unique NFT in the process.
- NFT metadata will be queried from the blockchain to render out the sales listing on the `/marketplace`
- On a successful purchase, funds will be held in escrow until the contract is cleared and approved before being transferred between wallets.

> *NOTE:* Creating and buying NFTs require the user to sign *two* transactions in their wallet. This is something I really want to find a way around. It would be much better if it only required a single sig for each user flow.
>
> The issue I ran into was not being able to delegate the `tranferFrom` function of the extended OpenZeppelin `NFT.sol`, to the `Market.sol` contract. That is, if a user purchased an NFT, and they became the owner, they couldn't call `transferFrom` from within the marketplace contract in order to sell their newly purchased NFT...as they were no longer `msg.sender`.
>
> I worked around this by adding an internal `_transfer` function in `NFT.sol` and linking the contracts via their `constructor` and token `Counters`. Anyway... that's why the two wallet signatures are required on the UI. Improving the responsiveness of the UI would also help (toast messages etc.)

## Smart Contracts

The dApp will be backed by 2 smart contracts

1. [Market.sol](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/api/contracts/Market.sol) - NFT representing the ownership of an item on the blockchain, linking to metadata on IPFS
2. [NFT.sol](https://github.com/gambinish/blockchain-developer-bootcamp-final-project/blob/main/api/contracts/NFT.sol) - Smart contract where users can interact to buy/sell an NFT. Contract will hold the funds in escrow until NFT `transferToken` method is called, and it's transaction is approved via MetaMask.

## Tech Stack:

- Web Client: [React](https://reactjs.org/)
- Web API: [Express](https://expressjs.com/)
- Blockchain SDK: [Hardhat](https://hardhat.org/)
- NFT Contract Library: [Open Zeppelin](https://openzeppelin.com/)
- NFT metadata distro: [IPFS](https://ipfs.io/)

Wallet Support:

- MetaMask

Chain Support:

- Ropsten

_Next Steps that have not been implemented for this final project [TODO]_

- Refactor to use the Graph
- Schedule an air-drop of `registration_notice` to each of the wallets that purchased and owns an NFT. Imagine if this were a shopify marketplace code, or tickets to a festival.
- Oracle to validate that assets are of a certain type. Potentially calling a computer vision api.
- DAO members vote on whether or not an asset should be uploaded via multi-sig smart contract.
- Chainlink Oracle + Chromata api to enable randomized generative art for the NFTs.

## Demo Recordings

### `CreateMarketItem`

https://user-images.githubusercontent.com/35090461/144199671-d4d8944c-740f-4cad-80e9-20139bfba129.mp4

### `BuyNFT`

https://user-images.githubusercontent.com/35090461/144199714-29bdedc0-668d-4c4a-bbd9-8e89e55e4ceb.mp4

### `Relist`

https://user-images.githubusercontent.com/35090461/144199778-6721997f-e287-4295-8613-88db1be301b4.mp4





