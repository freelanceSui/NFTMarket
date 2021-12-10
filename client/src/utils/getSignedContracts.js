import { ethers } from "ethers";
import Web3Modal from "web3modal";

// intantiates function with Web3Provider
// these contracts will need to be signed
const getSignedContracts = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_ENDPOINT}/get-market-contract`
  );
  const jsonMarketContractResponse = await response.json();

  const {
    nftMarketAddress,
    nftMarketContract,
    nftMintAddress,
    nftMintContract,
  } = jsonMarketContractResponse;

  // /* create a generic provider and query for unsold market items */
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const nftContract = new ethers.Contract(
    nftMintAddress,
    nftMintContract.abi,
    signer
  );
  const marketContract = new ethers.Contract(
    nftMarketAddress,
    nftMarketContract.abi,
    signer
  );

  return {
    nftContract,
    marketContract,
    marketAddress: nftMarketAddress,
    nftAddress: nftMintAddress,
  };
};

export { getSignedContracts };
