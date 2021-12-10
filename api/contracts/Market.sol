// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

/// @title A marketplace for buying and selling NFT's
/// @author Nicholas Gambino
contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    /// @notice Represent the data structure for a market item
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    /// @dev The id of the market item
    mapping(uint256 => MarketItem) private idToMarketItem;

    /// @notice Emit an event after a market item is created
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    /// @notice Emit an event after a market item is created
    event MarketItemSold(uint256 indexed tokenId);

    /// @notice Emit an event after a market item is created
    event MarketItemRelisted(uint256 indexed tokenId);

    /// @return number of items listed in marketplace
    function fetchMarketItemCount() public view returns (uint256) {
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        return unsoldItemCount;
    }

    /// @return number of items listed owned by wallet
    function fetchOwnedNFTCount() public view returns (uint256) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        return itemCount;
    }

    /// @param nftContract: address of the NFT contract
    /// @param tokenId: tokenID of the NFT
    /// @param price: price of the NFT
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // transfer ownership from nft creator to the marketplace. "escrow", so to speak.
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        // let dapp know that the item was created
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    /// @param itemId of NFT
    function createMarketSale(uint256 itemId) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[tokenId].seller.transfer(msg.value);
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        _itemsSold.increment();

        emit MarketItemSold(tokenId);
    }

    /// @return an array of unsold market items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                console.log(idToMarketItem[currentId].price);
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @return an array of market items purchased by wallet
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @param price: the relist price of NFT
    /// @param tokenId: the tokenId of the NFT
    function relistItem(uint256 price, uint256 tokenId)
        public
        payable
        nonReentrant
    {
        require(price > 0, "Price must be at least 1 wei");

        console.log("PRICE: ", price);

        idToMarketItem[tokenId].owner = payable(address(0));
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].seller = payable(msg.sender);

        _itemsSold.decrement();
        emit MarketItemRelisted(tokenId);
    }
}
