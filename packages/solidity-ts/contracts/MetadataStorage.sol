// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./MetadataFactory.sol";
import "./interfaces/IMetadataStorage.sol";

contract MetadataStorage is IMetadataStorage, AccessControl, Ownable {
  bytes32 public constant LEADERBOARD_ROLE = keccak256("LEADERBOARD_ROLE");

  mapping(uint256 => TokenMetadata) private _tokenMetadata;
  mapping(uint256 => uint256) public wins;
  mapping(uint256 => uint256) public losses;

  constructor() Ownable() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function setLeaderBoardRole(address account) external onlyOwner {
    grantRole(LEADERBOARD_ROLE, account);
  }

  function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory) {
    require(keccak256(bytes(_tokenMetadata[tokenId].name)) != keccak256(bytes("")), "Metadata not found for tokenId");
    return _tokenMetadata[tokenId];
  }

  function getTokenAttributes(uint256 tokenId) external view returns (Attributes memory) {
    require(keccak256(bytes(_tokenMetadata[tokenId].name)) != keccak256(bytes("")), "Metadata not found for tokenId");
    return _tokenMetadata[tokenId].attributes;
  }

  function getTokenStats(uint256 tokenId) external view returns (Stats memory) {
    require(keccak256(bytes(_tokenMetadata[tokenId].name)) != keccak256(bytes("")), "Metadata not found for tokenId");
    return _tokenMetadata[tokenId].stats;
  }

  function setTokenMetadata(uint256 tokenId, TokenMetadata memory metadata) external returns (bool) {
    require(bytes(metadata.name).length > 0, "Name should not be empty");
    _tokenMetadata[tokenId] = metadata;
    return true;
  }

  function getWins(uint256 tokenId) external view returns (uint256) {
    return wins[tokenId];
  }

  function getLosses(uint256 tokenId) external view returns (uint256) {
    return losses[tokenId];
  }

  function incrementWins(uint256 tokenId) external onlyRole(LEADERBOARD_ROLE) {
    // You might want to add access control here to allow only SlothArena to call this function
    wins[tokenId]++;
  }

  function incrementLosses(uint256 tokenId) external onlyRole(LEADERBOARD_ROLE) {
    // You might want to add access control here to allow only SlothArena to call this function
    losses[tokenId]++;
  }
}
