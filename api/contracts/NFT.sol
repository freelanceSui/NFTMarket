// contracts/NFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title A factory for minting and transfering ownership of NFTs
/// @author Nicholas Gambino
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    /// @notice Pair the marketplace address with the NFT
    /// @param marketplaceAddress: address of marketplace contract
    constructor(address marketplaceAddress) ERC721("Consensys Tokens", "CONS") {
        contractAddress = marketplaceAddress;
    }

    /// @param tokenURI: uri of NFT metadata on IPFS
    /// @return tokenId of NFT
    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    /// @param from: owner of NFT
    /// @param to: buyer of NFT
    /// @param tokenId: token of NFT
    function transferToken(
        address from,
        address to,
        uint256 tokenId
    ) external {
        require(ownerOf(tokenId) == from, "From address must be token owner");
        _transfer(from, to, tokenId);
    }
}
