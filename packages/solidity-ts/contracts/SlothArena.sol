// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./SlothNFT.sol";
import "./MetadataStorage.sol";
import "./SlothNFTStaking.sol";
import "./MetadataFactory.sol";
import "hardhat/console.sol";

contract SlothArena is SlothNFTStaking {
  MetadataStorage public metadataStorage;

  uint256[] private waitingQueue;

  event EnteredArena(uint256 indexed tokenId);
  event LeftArena(uint256 indexed tokenId);
  event BattleResult(uint256 indexed tokenId1, uint256 indexed tokenId2, uint256 winnerTokenId);

  constructor(address _slothNFT, address _metadataStorage) SlothNFTStaking(_slothNFT) {
    metadataStorage = MetadataStorage(_metadataStorage);
  }

  function enterArena(uint256 tokenId) public {
    _stake(tokenId);
    waitingQueue.push(tokenId);
    emit EnteredArena(tokenId);
  }

  function leaveArena(uint256 tokenId) public {
    require(isInQueue(tokenId), "Token must be in the arena");
    _removeFromArena(tokenId);
  }

  function isInQueue(uint256 tokenId) public view returns (bool) {
    for (uint256 i = 0; i < waitingQueue.length; i++) {
      if (waitingQueue[i] == tokenId) {
        return true;
      }
    }
    return false;
  }

  function _removeFromArena(uint256 tokenId) private {
    uint256 index;
    for (uint256 i = 0; i < waitingQueue.length; i++) {
      if (waitingQueue[i] == tokenId) {
        index = i;
        break;
      }
    }
    waitingQueue[index] = waitingQueue[waitingQueue.length - 1];
    waitingQueue.pop();
    _unstake(tokenId);
    emit LeftArena(tokenId);
  }

  function enterBattle(uint256 tokenId) external {
    // Check if there's an opponent waiting in the queue
    if (waitingQueue.length > 0) {
      uint256 opponentTokenId = waitingQueue[0];

      _setCustomSender(address(this));

      // Remove the opponent from the queue
      _removeFromArena(opponentTokenId);

      // Reset the custom sender
      _setCustomSender(address(0));

      // Start the battle
      _battle(tokenId, opponentTokenId);
    } else {
      // Add the user's NFT to the waiting queue
      enterArena(tokenId);
    }
  }

  function _battle(uint256 tokenId1, uint256 tokenId2) private {
    Stats memory stats1 = metadataStorage.getTokenStats(tokenId1);
    Stats memory stats2 = metadataStorage.getTokenStats(tokenId2);

    uint256 power1 = calculatePower(stats1);
    uint256 power2 = calculatePower(stats2);

    uint256 winnerTokenId = (power1 > power2) ? tokenId1 : tokenId2;
    uint256 loserTokenId = (power1 > power2) ? tokenId2 : tokenId1;
    emit BattleResult(tokenId1, tokenId2, winnerTokenId);

    // Update battle stats
    metadataStorage.incrementWins(winnerTokenId);
    metadataStorage.incrementLosses(loserTokenId);

    // Randomly increase one stat of the winner by 1 point
    uint256 randomStat = _random(tokenId1, tokenId2) % 3;

    TokenMetadata memory metadata = metadataStorage.getTokenMetadata(winnerTokenId);

    if (randomStat == 0) {
      metadata.stats.strength += 1;
    } else if (randomStat == 1) {
      metadata.stats.intelligence += 1;
    } else {
      metadata.stats.agility += 1;
    }
    metadataStorage.setTokenMetadata(winnerTokenId, metadata);
  }

  function calculatePower(Stats memory stats) internal pure returns (uint256) {
    return (stats.strength * 2) + stats.intelligence + stats.agility;
  }

  function _random(uint256 tokenId1, uint256 tokenId2) private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), tokenId1, tokenId2)));
  }
}
