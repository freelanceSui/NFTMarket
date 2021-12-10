import "../index.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useForm } from "react-form";
import { Button } from "@blueprintjs/core";

import { NFTCreationPanel } from "../components/NFTCreationPanel";
import { getSignedContracts } from "../utils/getSignedContracts";
import { useWalletContext } from "../hooks/useWalletContext";
import { NFTCard } from "../components/NFTCard";
import { NFTPriceInput } from "../components/NFTPriceInput";

export const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <NFTCreationPanel />
      <h2 className="my-nft-grid__title">My NFTs</h2>
      <MyNftGrid />
    </div>
  );
};

export const MyNftGrid = () => {
  const { signer } = useWalletContext();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [myNFTs, setMyNFTs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    setIsFetching(true);
    const { nftContract, marketContract } = await getSignedContracts();
    const data = await marketContract.fetchMyNFTs();

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

    setMyNFTs(items);
    setTimeout(() => {
      setIsFetching(false);
    }, 1000);
  }

  const relistNFT = async (nft, price) => {
    const { marketContract, marketAddress, nftContract } =
      await getSignedContracts();

    const signerAddress = await signer.getAddress();
    const resellPrice = ethers.utils.parseUnits(price.toString(), "ether");

    await nftContract.transferToken(signerAddress, marketAddress, nft.tokenId);
    let transaction = await marketContract.relistItem(resellPrice, nft.tokenId);

    let tx = await transaction.wait();

    let event = tx.events[0];

    if (event) {
      alert(
        "NFT Relisted! It should disappear from you dashboard, and reappear in the marketplace soon."
      );
    }
  };

  const NFTRelistForm = useForm({
    onSubmit: async (values) => {
      relistNFT(selectedNFT, values.nft_price);
    },
    // debugForm: true,
  });

  if (isFetching) {
    return (
      <div className="dashboard-grid__row-empty">
        <h1>Fetching NFTs from blockchain network...</h1>
      </div>
    );
  }

  if (myNFTs.length === 0) {
    return (
      <div className="dashboard-grid__row-empty">
        <h1>You haven't purchased any NFTs yet!</h1>
        <h3>Browse available NFTs in the marketplace.</h3>
      </div>
    );
  }

  return (
    <div className="dashboard-grid__row-bottom">
      {myNFTs.map((item) => {
        return (
          <NFTCard item={item}>
            <NFTRelistForm.Form>
              <div className="price">
                <NFTPriceInput />
                <Button type="submit" onClick={() => setSelectedNFT(item)}>
                  relist
                </Button>
              </div>
            </NFTRelistForm.Form>
          </NFTCard>
        );
      })}
    </div>
  );
};
