const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("CreateMarketItem should transfer ownership of NFT to marketplace address", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create an nft */
    await nft.createToken("https://www.mytestnft.com");

    /* put nft up for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);

    expect(await nft.ownerOf(1)).to.equal(marketAddress);
  });
});

describe("NFTMarket", function () {
  it("CreateMarketSale should transfer ownership of NFT to buyer address", async function () {
    /* deploy the marketplace contract */
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create an nft */
    await nft.createToken("https://www.mytestnft.com");

    /* put nft up for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);

    /* get buyer wallet, destructure buyer object */
    const [_, buyer] = await ethers.getSigners();

    /* execute sale of token to another user */
    await market.connect(buyer).createMarketSale(1, { value: auctionPrice });

    await nft.connect(buyer).transferToken(marketAddress, buyer.address, 1);

    expect(await nft.ownerOf(1)).to.equal(buyer.address);
  });
});

describe("NFTMarket", function () {
  it("Relist should transfer ownership of NFT to market address", async function () {
    /* deploy the marketplace contract */
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create an nft */
    await nft.createToken("https://www.mytestnft.com");

    /* put nft up for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);

    /* get buyer wallet, destructure buyer object */
    const [_, buyer] = await ethers.getSigners();

    /* execute sale of token to another user */
    await market.connect(buyer).createMarketSale(1, { value: auctionPrice });
    await nft.connect(buyer).transferToken(marketAddress, buyer.address, 1);

    /* relist token back to marketplace */
    await nft.connect(buyer).transferToken(buyer.address, marketAddress, 1);

    const resellPrice = ethers.utils.parseUnits("1.5", "ether");
    await market.connect(buyer).relistItem(resellPrice, 1);

    expect(await nft.ownerOf(1)).to.equal(marketAddress);
  });
});

describe("NFTMarket", function () {
  it("Relist should update price of nft", async function () {
    /* deploy the marketplace contract */
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create an nft */
    await nft.createToken("https://www.mytestnft.com");

    /* put nft up for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);

    /* get buyer wallet, destructure buyer object */
    const [_, buyer] = await ethers.getSigners();

    /* execute sale of token to another user */
    await market.connect(buyer).createMarketSale(1, { value: auctionPrice });
    await nft.connect(buyer).transferToken(marketAddress, buyer.address, 1);

    /* relist token back to marketplace */
    await nft.connect(buyer).transferToken(buyer.address, marketAddress, 1);

    const resellPrice = ethers.utils.parseUnits("1.5", "ether");
    await market.connect(buyer).relistItem(resellPrice, 1);

    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.filter(async (i) => {
        if (i.tokenId === 1) {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
          };
          return item;
        }
      })
    );

    const relistedItem = items[0];
    const verifyPrice = relistedItem.price.toString();
    const stringifiedResellPrice = resellPrice.toString();

    expect(await verifyPrice).to.equal(stringifiedResellPrice);
  });
});

describe("NFTMarket", function () {
  it("fetchMarketItemCount should return all marketplace items that are for sale", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await nft.createToken("https://www.mytestnft1.com");
    await nft.createToken("https://www.mytestnft2.com");

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice);

    /* query for and return the unsold items */
    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    let fetchedCount = await market.fetchMarketItemCount();
    expect(items.length).to.equal(fetchedCount.toNumber());
  });
});

describe("NFTMarket", function () {
  it("fetchOwnedNFTCount should return all marketplace items that were purshased by user address", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await nft.createToken("https://www.mytestnft1.com");
    await nft.createToken("https://www.mytestnft2.com");

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice);

    /* get buyer wallet, destructure buyer object */
    const [_, buyer] = await ethers.getSigners();

    /* execute sale of a token to buyer */
    await market.connect(buyer).createMarketSale(1, { value: auctionPrice });

    let fetchedCount = await market.connect(buyer).fetchOwnedNFTCount();
    expect(fetchedCount.toNumber()).to.equal(1);
  });
});
