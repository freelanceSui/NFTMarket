import { ethers } from "ethers";

const createNft = async (data, nftContract, startingPrice) => {
  const ipfsResponse = await fetch(
    `${process.env.REACT_APP_SERVER_ENDPOINT}/create-nft`,
    {
      method: "POST",
      body: data,
    }
  );
  const ipfsJsonResponse = await ipfsResponse.json();

  let transaction = await nftContract.createToken(
    `https://ipfs.infura.io/ipfs/${ipfsJsonResponse.path}`
  );

  let tx = await transaction.wait();
  let event = tx.events[0];
  let value = event.args[2];
  let tokenId = value.toNumber(); // a new NFT has been created!
  const price = ethers.utils.parseUnits(startingPrice.toString(), "ether");
  return { tokenId, price };
};

export { createNft };
