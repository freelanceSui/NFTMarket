import { ethers } from "ethers";

// intantiates function with JsonRPCProvider
// these contracts will not need to be signed
const getMarketContracts = async () => {
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

  // create a generic provider and query for unsold market items
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_PROVIDER_ENDPOINT
  );

  const nftContract = new ethers.Contract(
    nftMintAddress,
    nftMintContract.abi,
    provider
  );
  const marketContract = new ethers.Contract(
    nftMarketAddress,
    nftMarketContract.abi,
    provider
  );

  return {
    nftContract,
    marketContract,
    marketAddress: nftMarketAddress,
    nftAddress: nftMintAddress,
  };
};

export { getMarketContracts };
