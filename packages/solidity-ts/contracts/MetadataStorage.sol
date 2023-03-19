// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MetadataFactory.sol";
import "./interfaces/IMetadataStorage.sol";

contract MetadataStorage is IMetadataStorage {
  mapping(uint256 => TokenMetadata) private _tokenMetadata;

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
}
