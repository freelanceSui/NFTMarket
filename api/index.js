require("dotenv").config();
const { create } = require("ipfs-http-client");
const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());
app.use(formidableMiddleware());

const nftMarketABI = require("./artifacts/contracts/Market.sol/NFTMarket.json");
const nftMintABI = require("./artifacts/contracts/NFT.sol/NFT.json");

const port = process.env.PORT;
const ipfs = create("https://ipfs.infura.io:5001/api/v0");

app.get("/", (req, res) => {
  res.send("Welcome to TitleX api!");
});

app.get("/get-market-contract", (req, res) => {
  return res.status(200).json({
    nftMarketAddress: process.env.NFT_MARKET_ADDRESS,
    nftMarketContract: nftMarketABI,
    nftMintAddress: process.env.NFT_MINT_ADDRESS,
    nftMintContract: nftMintABI,
  });
});

// upload file to ipfs, then create nft on blockchain
app.post("/create-nft", async (req, res) => {
  const file = req.files["nft.asset"];
  let testFile = fs.readFileSync(file.path);
  let testBuffer = new Buffer.from(testFile);

  let ipfsUpload = await ipfs.add(testBuffer);

  if (!ipfsUpload) {
    return res
      .status(500)
      .json({ error: "There was a problem uploading the asset to ipfs" });
  }

  const payload = {
    asset_url: `${process.env.IPFS_HOST}${ipfsUpload.path}`,
    metadata: {
      title: req.fields["nft.title"],
      price: req.fields["nft.price"],
      description: req.fields["nft.description"],
    },
  };
  let ipfsMetadata = await ipfs.add(JSON.stringify(payload));
  return res.status(201).json(ipfsMetadata);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
