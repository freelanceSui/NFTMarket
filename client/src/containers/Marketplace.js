import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@blueprintjs/core";
import "../index.css";

import { getMarketContracts } from "../utils/getMarketContracts";
import { NFTCard } from "../components/NFTCard";
import { getSignedContracts } from "../utils/getSignedContracts";
import { useWalletContext } from "../hooks/useWalletContext";

export const Marketplace = () => {
  const { signer } = useWalletContext();
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    setIsFetching(true);
    const { nftContract, marketContract } = await getMarketContracts();
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const meta = await fetch(tokenUri);
        const jsonMeta = await meta.json();
        let item = {
          url: jsonMeta.asset_url,
          tokenId: i.tokenId.toNumber(),
          title: jsonMeta.metadata.title,
          price: ethers.utils.formatEther(i.price.toString()),
          description: jsonMeta.metadata.description,
        };
        return item;
      })
    );

    setMarketplaceNFTs(items);
    setTimeout(() => {
      setIsFetching(false);
    }, 1000);
  }

  const buyNFT = async (nft) => {
    const { marketContract, marketAddress, nftContract } =
      await getSignedContracts();

    const signerAddress = await signer.getAddress();

    await nftContract.transferToken(marketAddress, signerAddress, nft.tokenId);

    const price = ethers.utils.parseUnits(nft.price, "ether");
    const transaction = await marketContract.createMarketSale(nft.tokenId, {
      value: price,
    });

    let tx = await transaction.wait();

    let event = tx.events[0];

    if (event) {
      alert("Purchased NFT! It should appear in your dashboard soon.");
    }
  };

  if (isFetching) {
    return (
      <div className="marketplace-grid__row-empty">
        <h1>Fetching NFTs from blockchain network...</h1>
      </div>
    );
  }

  if (marketplaceNFTs.length === 0) {
    return (
      <div className="marketplace-grid__row-empty">
        <h1>No NFTs have been listed yet!</h1>
        <h3>You can create NFTs in the dashboard.</h3>
      </div>
    );
  }

  return (
    <div className="grid">
      {marketplaceNFTs.map((item) => {
        return (
          <NFTCard item={item}>
            <div className="price">
              <Button onClick={() => buyNFT(item)}>buy</Button>
            </div>
          </NFTCard>
        );
      })}
    </div>
  );
};
