// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./IMetadataStorage.sol";

interface IMetadataFactory {
  function createTokenMetadata(uint256 tokenId) external view returns (string memory, TokenMetadata memory metadata);
}
