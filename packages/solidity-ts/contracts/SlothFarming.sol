// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./interfaces/ISlothToken.sol";
import "./SlothNFT.sol";
import "./MetadataStorage.sol";
import "./SlothNFTStaking.sol";

contract SlothFarming is SlothNFTStaking {
  ISlothToken public resourceToken;
  MetadataStorage public metadataStorage;

  mapping(uint256 => uint256) public lastFarmed;

  constructor(
    address _resourceToken,
    address _slothNFT,
    address _metadataStorage
  ) SlothNFTStaking(_slothNFT) {
    resourceToken = ISlothToken(_resourceToken);
    metadataStorage = MetadataStorage(_metadataStorage);
  }

  // Calculate the farming rate based on the stats of the NFT
  // include stat in the function signature to choose what to farm.
  function farm(uint256 tokenId) external {
    require(slothNFT.ownerOf(tokenId) == msg.sender, "Only the NFT owner can farm");

    // Ensure the NFT is not already farming
    require(lastFarmed[tokenId] == 0, "NFT is already farming");

    // Stake the NFT
    _stake(tokenId);

    // Set the lastFarmed timestamp to the current block timestamp
    lastFarmed[tokenId] = block.timestamp;
  }

  function collectFarmedResources(uint256 tokenId) external {
    require(stakers[tokenId] == msg.sender, "Only the staker can collect resources");

    Stats memory stats = metadataStorage.getTokenStats(tokenId);
    uint256 farmingRate = calculateFarmingRate(stats);
    uint256 timeSinceLastFarm = block.timestamp - lastFarmed[tokenId];

    uint256 resourceAmount = farmingRate * timeSinceLastFarm;
    resourceToken.mint(msg.sender, resourceAmount);
    lastFarmed[tokenId] = block.timestamp;
  }

  function calculateFarmingRate(Stats memory stats) internal pure returns (uint256) {
    // Implement your custom farming rate calculation based on the NFT's attributes
    return stats.intelligence + stats.strength;
  }
}
