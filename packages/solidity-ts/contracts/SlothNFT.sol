pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IMetadataFactory.sol";
import "./interfaces/IMetadataStorage.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract SlothNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  using Strings for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  IMetadataFactory public metadataFactory;
  IMetadataStorage public metadataStorage;

  constructor(address metadataFactoryAddress, address metadataStorageAddress) ERC721("Sloth NFT", "SLNFT") {
    metadataFactory = IMetadataFactory(metadataFactoryAddress);
    metadataStorage = IMetadataStorage(metadataStorageAddress);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return "";
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    require(_exists(tokenId), "URI query for nonexistent token");

    // DO SOMETHING
    return super.tokenURI(tokenId);
  }

  function tokenMetadata(uint256 tokenId) public view returns (TokenMetadata memory) {
    // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    // DO SOMETHING
    return metadataStorage.getTokenMetadata(tokenId);
  }

  function mintItem(address to, string memory _tokenURI) public returns (uint256) {
    _tokenIds.increment();

    uint256 id = _tokenIds.current();
    _mint(to, id);
    _setTokenURI(id, _tokenURI);

    return id;
  }

  function mintRandomSloth(address to) public {
    _tokenIds.increment();
    uint256 tokenId = _tokenIds.current();

    // You'll need to implement a function to create the tokenURI based on the attributes
    string memory _tokenURI;
    TokenMetadata memory _tokenMetadata;
    (_tokenURI, _tokenMetadata) = metadataFactory.createTokenMetadata(tokenId, to);

    _safeMint(to, tokenId);
    metadataStorage.setTokenMetadata(tokenId, _tokenMetadata);
    _setTokenURI(tokenId, _tokenURI);
  }
}
