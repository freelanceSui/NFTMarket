const createMarketItem = async (marketContract, nftAddress, mintedNft) => {
  // // Post item to marketplace
  let transaction = await marketContract.createMarketItem(
    nftAddress,
    mintedNft.tokenId,
    mintedNft.price
  );
  let tx = await transaction.wait();
  let event = tx.events[0];
  return event;
};

export { createMarketItem };
