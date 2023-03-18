// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

struct Attributes {
  string color;
  string pattern;
  string eyeColor;
  string accessory;
  string energyLevel;
}

struct Stats {
  uint256 strength;
  uint256 agility;
  uint256 intelligence;
}
struct TokenMetadata {
  string name;
  string description;
  Attributes attributes;
  Stats stats;
}

interface IMetadataStorage {
  function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory);

  function setTokenMetadata(uint256 tokenId, TokenMetadata memory metadata) external returns (bool);
}
