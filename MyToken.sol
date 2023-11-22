// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract AverageRelationToken is ERC721, ERC721Burnable {
    uint256 public constant MAX_OWNERSHIP_SHARE = 100;
    uint256 public constant FLOOR_PRICE = 0.1 ether;
    uint256 public constant CEILING_PRICE = 10 ether;

    struct NFTData {
        uint256 averagePrice;
        uint256 totalOwners;
    }

    mapping(uint256 => NFTData) public nftData;
    mapping(uint256 => mapping(address => bool)) public nftOwners;

    constructor() ERC721("Average Relation Token", "ART") {}

    function mintNFT(uint256 _tokenId) public {
        _mint(msg.sender, _tokenId);
        nftData[_tokenId] = NFTData(FLOOR_PRICE, 1);
        nftOwners[_tokenId][msg.sender] = true;
    }

    function updateValue(uint256 _tokenId, uint256 _newValue) public {
        require(_newValue >= FLOOR_PRICE && _newValue <= CEILING_PRICE, "Value out of range");
        require(nftOwners[_tokenId][msg.sender], "Not an owner");
        
        NFTData storage data = nftData[_tokenId];
        data.averagePrice = (data.averagePrice * data.totalOwners + _newValue) / (data.totalOwners + 1);
        data.totalOwners += 1;
    }

    function transferNFT(uint256 _tokenId, address _to) public {
        require(nftOwners[_tokenId][msg.sender], "Not an owner");
        require(nftData[_tokenId].totalOwners < MAX_OWNERSHIP_SHARE, "Max ownership reached");

        _transfer(msg.sender, _to, _tokenId);
        nftOwners[_tokenId][_to] = true;
    }
}

