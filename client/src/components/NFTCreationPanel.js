import "../index.css";
import { useForm } from "react-form";
import { Button } from "@blueprintjs/core";
import { FileInputCard } from "./FileInputCard";
import { FileMetaCard } from "./FileMetaCard";
import { createNft } from "../utils/createNft";
import { createMarketItem } from "../utils/createMarketItem";
import { getSignedContracts } from "../utils/getSignedContracts";
import { useWalletContext } from "../hooks/useWalletContext";

export const NFTCreationPanel = () => {
  const { signer } = useWalletContext();
  const NFTCreationForm = useForm({
    onSubmit: async (values) => {
      const { marketContract, nftContract, nftAddress } =
        await getSignedContracts(signer);
      let data = new FormData();

      data.append("nft.asset", values.nft_asset);
      data.append("nft.description", values.nft_description);
      data.append("nft.price", values.nft_price);
      data.append("nft.title", values.nft_title);

      let mintedNft = await createNft(data, nftContract, values.nft_price);
      const txEvent = await createMarketItem(
        marketContract,
        nftAddress,
        mintedNft
      );
      if (txEvent) {
        alert("NFT Created! It should appear in the marketplace soon");
      }
    },
    // debugForm: true,
  });

  return (
    <NFTCreationForm.Form className="dashboard-grid__row-middle">
      <h2>Create your NFT</h2>
      <div className="dashboard-grid__row-middle-content-area">
        <FileInputCard />
        <FileMetaCard />
      </div>
      <Button intent="primary" type="submit" text="Generate NFT" />
    </NFTCreationForm.Form>
  );
};
