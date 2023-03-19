// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./IMetadataStorage.sol";

interface IMetadataFactory {
  function createTokenMetadata(uint256 tokenId, address recipient) external view returns (string memory, TokenMetadata memory metadata);
}
