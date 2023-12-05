// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Relatinonships3 is ERC721, Ownable {
    uint256 private _nextTokenId = 1; // Start token IDs at 1
    uint256 private relationshipCount;
    
    uint256 public constant MIN_PRICE = 1 * 10 ** 17; // 0.1 ETH
    uint256 public constant MAX_PRICE = 1 * 10 ** 19; // 10 ETH
    
    struct Relationship {
        uint256 relationshipId;
        string relationshipText;
        uint256[] priceHistory;
        address[] owners;
        uint256 totalPrice;
        uint256 averagePrice;
    }

    Relationship[] public relationships;
    mapping (uint256 => uint256) tokenIdToRelationshipId;

    constructor() ERC721("Relationships", "RSHP") {}
    
    function addRelationship(string memory _relationshipText) public onlyOwner {
        relationships.push(
            Relationship(
                ++relationshipCount,
                _relationshipText,
                new uint256[](0),
                new address[](0),
                0,
                0
            )
        );
    }

    function safeMint(
        uint256 _relationshipId
    ) public payable {
        uint256 tokenId = _nextTokenId++;

        // require amount is between min and max price
        require(msg.value >= MIN_PRICE && msg.value <= MAX_PRICE, "Amount should be between 0.1 and 10 ETH");

        address owner = owner();
        owner = payable(owner);

        // send the amount to the contract
        
        (bool sent, bytes memory data) = owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        _safeMint(msg.sender, tokenId);

        // 500000000000000000
        // 10000000000000000000

        // update the mapping to associate this tokenId with the current relationshipId
        tokenIdToRelationshipId[tokenId] = _relationshipId;

        // push the amount into the priceHistory array for the current relationship
        Relationship storage relationship = relationships[_relationshipId - 1];
        relationship.priceHistory.push(msg.value);
        relationship.totalPrice += msg.value;
        relationship.owners.push(msg.sender);
       
        // update the average price for the current relationship
        relationship.averagePrice = relationship.totalPrice / relationship.priceHistory.length;
    }

    // function transfer(address from, address to, uint256 tokenId) public {
    //     uint256 relationshipId = tokenIdToRelationshipId[tokenId];
    //     Relationship storage relationship = relationships[relationshipId - 1];
    //     relationship.owners.push(to);
    //     relationship.owners
    //     safeTransferFrom(from, to, tokenId, "");
    // }

    function getAveragePrice(uint256 _relationshipId) public view returns (uint256) {
        require(_relationshipId > 0 && _relationshipId <= relationshipCount, "Invalid relationship ID");
        Relationship storage relationship = relationships[_relationshipId - 1];
        return relationship.averagePrice;
    }

    function getPriceHistory(uint256 _relationshipId) public view returns (uint256[] memory) {
        require(_relationshipId > 0 && _relationshipId <= relationshipCount, "Invalid relationship ID");
        Relationship storage relationship = relationships[_relationshipId - 1];
        return relationship.priceHistory;
    }

    function getOwners(uint256 _relationshipId) public view returns (address[] memory) {
        require(_relationshipId > 0 && _relationshipId <= relationshipCount, "Invalid relationship ID");
        Relationship storage relationship = relationships[_relationshipId - 1];
        return relationship.owners;
    }

}

