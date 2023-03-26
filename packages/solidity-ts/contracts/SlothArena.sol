// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./SlothNFT.sol";
import "./MetadataStorage.sol";
import "./SlothNFTStaking.sol";

contract SlothArena is SlothNFTStaking {
  MetadataStorage public metadataStorage;

  mapping(uint256 => bool) public isInArena;

  event EnteredArena(uint256 indexed tokenId);
  event LeftArena(uint256 indexed tokenId);
  event BattleResult(uint256 indexed tokenId1, uint256 indexed tokenId2, uint256 winnerTokenId);

  constructor(address _slothNFT, address _metadataStorage) SlothNFTStaking(_slothNFT) {
    metadataStorage = MetadataStorage(_metadataStorage);
  }

  function enterArena(uint256 tokenId) external {
    _stake(tokenId);
    isInArena[tokenId] = true;
    emit EnteredArena(tokenId);
  }

  function leaveArena(uint256 tokenId) public {
    require(isInArena[tokenId], "Token must be in the arena");
    _unstake(tokenId);
    isInArena[tokenId] = false;
    emit LeftArena(tokenId);
  }

  function battle(uint256 tokenId1, uint256 tokenId2) external {
    require(isInArena[tokenId1], "Token 1 must be in the arena to participate");
    require(isInArena[tokenId2], "Token 2 must be in the arena to participate");

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

    // Temporarily set the custom sender to address(this)
    _setCustomSender(address(this));

    // Unstake NFTs after the battle
    _leaveArena(tokenId1);
    _leaveArena(tokenId2);

    // Reset the custom sender
    _setCustomSender(address(0));
  }

  function calculatePower(Stats memory stats) internal pure returns (uint256) {
    return (stats.strength * 2) + stats.intelligence + stats.agility;
  }

  function _leaveArena(uint256 tokenId) internal {
    require(isInArena[tokenId], "Token must be in the arena");

    _unstake(tokenId);
    isInArena[tokenId] = false;
    emit LeftArena(tokenId);
  }
}
