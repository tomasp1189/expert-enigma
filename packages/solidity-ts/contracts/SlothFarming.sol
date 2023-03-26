// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/ISlothToken.sol";
import "./SlothNFT.sol";
import "./MetadataStorage.sol";
import "./SlothNFTStaking.sol";

import "hardhat/console.sol";

contract SlothFarming is SlothNFTStaking {
  using SafeMath for uint256;
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
    // limit the max farming rate
    if (timeSinceLastFarm > 1 days) {
      timeSinceLastFarm = 1 days;
    }

    uint256 resourceAmount = farmingRate.mul(timeSinceLastFarm);
    resourceToken.mint(msg.sender, resourceAmount);
    lastFarmed[tokenId] = block.timestamp;
  }

  function calculateFarmingRate(Stats memory stats) internal pure returns (uint256) {
    // Implement your custom farming rate calculation based on the NFT's attributes

    return stats.intelligence.add(stats.strength);
  }

  // Cap the max farming prize within a time window.abi ✅
  // Arena - keeps track of wins and losses. Wins give you higher stats. Losses might make you loose money.
  // Skill shop - nope
  // leaderboard
}
