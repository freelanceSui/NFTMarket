# Getting Started

## Local Setup

In order to run this project locally, these are the steps to take. This doc will walkthrough how to compile and test contracts, as well as spin up the project for local interaction and development. This will require a working knowledge of [MetaMask](https://docs.metamask.io/guide/) and [HardHat](https://hardhat.org/getting-started/).

I suggest opening up four terminal windows at minimum for ease of use, although you may find it helpful to have more.

Before we begin, you will need to have MetaMask installed and enabled on your browser of choice (cough, cough...Brave). I suggest installing a burner wallet for development.


## Development Environment

#### Terminal One:

This will be where we will spin up our api server.

```
cd api && npm install
cp .env.example .env
```

Keep this terminal open for later.

#### Terminal Two:

```
cd api && npm run local-node
```

Keep this terminal open for later.

> Do not close this window. This spins up a development chain with several provisioned accounts. You should now connect your Metamask wallet to this local blockchain network, and then import at least two of these accounts into your MetaMask development/"burner" wallet (Primary wallet strongly not advised). Use these accounts to interact with the dApp. You can learn how to connect and import the development network & accounts from Hardhat into Metmask [here](https://hardhat.org/getting-started/#connecting-a-wallet-or-dapp-to-hardhat-network)

Copy one of these account's private keys, and add it to the .env file `NETWORK_PRIVATE_KEY=private-key-here`

#### Terminal Three:

`cd api && npm run local-deploy`

Copy these addresses into the `.env` file of the `api` directory. For example:

> nftMarket deployed to: 0xc5a5C42992dECbae36851359345FE25997F5C42d

Replace `NFT_MARKET_ADDRESS`'s `address-goes-here` with `0xc5a5C42992dECbae36851359345FE25997F5C42d`

> nft deployed to: 0x67d269191c92Caf3cD7723F116c85e6E9bf55933

Replace `NFT_MINT_ADDRESS`'s `address-goes-here` with `0x67d269191c92Caf3cD7723F116c85e6E9bf55933`

In terminal one, you should now be able to run `npm start` to spin up the api server.

#### Terminal Four:

`cd client && npm install`
`cp .env.example .env`
`npm start`

You should now be able to access the frontend on `http://localhost:3000/`


## Running Tests

Install dependencies:

`cd api && npm install`

#### In one terminal:

Run the local blockchain node:

`npm run local-node`

#### In a second terminal:

With the local blockchain node still running in the first terminal,

Copy one of these account's private keys, and add it to the .env file `NETWORK_PRIVATE_KEY=private-key-here`

Compile contracts:

`npm run compile-contracts`

Run tests:

`npx hardhat test --network localhost`


## Production dApp interaction

As this project is deployed on the Ropsten testnet, you will need a burner MetaMask wallet on the Ropsten network, with some Ropsten ETH to interact with the dApp.

You can get Ropsten ETH on a faucet: https://faucet.ropsten.be/

Note that there is a daily cap per IP/Wallet combo, so you might need a new burner and VPN to bypass to work around this if you run out of funds.
