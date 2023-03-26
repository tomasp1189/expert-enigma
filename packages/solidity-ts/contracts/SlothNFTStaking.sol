// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

import "./SenderOverride.sol";

contract SlothNFTStaking is SenderOverride {
  IERC721 public slothNFT;

  mapping(uint256 => address) public stakers;
  mapping(uint256 => uint256) public stakeTimestamps;

  event Staked(uint256 indexed tokenId, address indexed staker);
  event Unstaked(uint256 indexed tokenId, address indexed staker);

  constructor(address _slothNFT) {
    slothNFT = IERC721(_slothNFT);
  }

  function stake(uint256 tokenId) external {
    _stake(tokenId);
  }

  function unstake(uint256 tokenId) external {
    _unstake(tokenId);
  }

  function _stake(uint256 tokenId) internal {
    require(slothNFT.ownerOf(tokenId) == _msgSender(), "Only the owner can stake the NFT");
    require(stakers[tokenId] == address(0), "NFT is already staked");

    slothNFT.transferFrom(msg.sender, address(this), tokenId);

    stakers[tokenId] = msg.sender;
    stakeTimestamps[tokenId] = block.timestamp;

    emit Staked(tokenId, msg.sender);
  }

  function _unstake(uint256 tokenId) internal {
    console.log("msg.sender", _msgSender());
    console.log("stakers[tokenId]", stakers[tokenId]);
    if (_msgSender() != address(this)) {
      require(stakers[tokenId] == _msgSender(), "Only the owner can unstake the NFT");
    }
    slothNFT.transferFrom(address(this), stakers[tokenId], tokenId);

    delete stakers[tokenId];
    delete stakeTimestamps[tokenId];

    emit Unstaked(tokenId, stakers[tokenId]);
  }

  function isStaked(uint256 tokenId) external view returns (bool) {
    return _isStaked(tokenId);
  }

  function _isStaked(uint256 tokenId) internal view returns (bool) {
    return stakers[tokenId] != address(0);
  }
}
