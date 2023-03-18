// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IMetadataFactory.sol";

contract MetadataFactory is IMetadataFactory {
  using Strings for uint256;
  uint256[101] private cdf = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100
  ];
  string[] private colors = ["Green", "Blue", "Purple", "Orange", "Red", "Yellow"];
  string[] private patterns = ["Stripes", "Spots", "Swirls", "Patches", "Solid", "Zigzag"];
  string[] private eyeColors = ["Brown", "Blue", "Green", "Amber", "Hazel", "Gray"];
  string[] private accessories = ["Sunglasses", "Scarf", "Hat", "Necklace", "Bowtie", "Earrings"];
  string[] private energyLevels = ["Low", "Medium", "High", "Hyper"];

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

  function generateRandomNumber(uint256 tokenId, uint256 modulus) internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, tokenId))) % modulus;
  }

  function inverseCDF(uint256 randomNumber) internal view returns (uint256) {
    for (uint256 i = 0; i < cdf.length; i++) {
      if (randomNumber < cdf[i]) {
        return i;
      }
    }
    return cdf.length - 1;
  }

  function generateAttribute(string[] storage attributeList, uint256 mean, uint256 stddev, uint256 tokenId) internal view returns (string memory) {
    uint256 randomNumber = generateRandomNumber(tokenId, 100);
    uint256 index = ((inverseCDF(randomNumber) * stddev) / 100) + mean;
    index = index % attributeList.length;
    return attributeList[index];
  }

  function _encode3bytes(bytes memory source, bytes memory result, uint256 i, uint256 j) internal pure returns (uint256) {
    bytes memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    uint256 a = uint8(source[i]);
    uint256 b = uint8(source[i + 1]);
    uint256 c = uint8(source[i + 2]);

    result[j++] = bytes1(uint8(table[(a >> 2) & 0x3F]));
    result[j++] = bytes1(uint8(table[((a & 0x03) << 4) | ((b >> 4) & 0x0F)]));
    result[j++] = bytes1(uint8(table[((b & 0x0F) << 2) | ((c >> 6) & 0x03)]));
    result[j++] = bytes1(uint8(table[c & 0x3F]));

    return j;
  }

  function _encode2bytes(bytes memory source, bytes memory result, uint256 i, uint256 j) internal pure returns (uint256) {
    bytes memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    uint256 a = uint8(source[i]);
    uint256 b = i + 1 < source.length ? uint8(source[i + 1]) : 0;
    uint256 c = 0;

    result[j++] = bytes1(uint8(table[(a >> 2) & 0x3F]));
    result[j++] = bytes1(uint8(table[((a & 0x03) << 4) | ((b >> 4) & 0x0F)]));
    result[j++] = bytes1(uint8(table[((b & 0x0F) << 2) | (c & 0x03)]));
    if (i + 1 < source.length) {
      result[j++] = bytes1(uint8(table[c & 0x3F]));
    } else {
      result[j++] = bytes1(uint8(61)); // padding character '='
    }

    return j;
  }

  function base64Encode(string memory data) internal pure returns (string memory) {
    bytes memory source = bytes(data);
    uint256 len = source.length;

    if (len == 0) {
      return "";
    }

    uint256 encodedLen = 4 * ((len + 2) / 3);
    bytes memory result = new bytes(encodedLen + 1);
    result[encodedLen] = 0x00;

    uint256 j = 0;
    for (uint256 i = 0; i + 2 < len; i += 3) {
      j = _encode3bytes(source, result, i, j);
    }

    if (len % 3 != 0) {
      j = _encode2bytes(source, result, len - (len % 3), j);
    }

    return string(result);
  }

  function getAttributes(uint256 tokenId) internal view returns (Attributes memory) {
    Attributes memory attributes = Attributes(
      generateAttribute(colors, 2, 1, tokenId),
      generateAttribute(patterns, 1, 1, tokenId),
      generateAttribute(eyeColors, 2, 1, tokenId),
      generateAttribute(accessories, 1, 1, tokenId),
      generateAttribute(energyLevels, 1, 1, tokenId)
    );

    return attributes;
  }

  function getStats(uint256 tokenId) internal view returns (Stats memory) {
    Stats memory stats = Stats(
      (generateRandomNumber(tokenId, 100) % 21) + 40,
      (generateRandomNumber(tokenId, 100) % 21) + 40,
      (generateRandomNumber(tokenId, 100) % 21) + 40
    );

    return stats;
  }

  function createTokenURI(uint256 tokenId) external view returns (string memory) {
    Attributes memory attributes = getAttributes(tokenId);
    Stats memory stats = getStats(tokenId);

    string memory _tokenURI = _createTokenURI(attributes, stats);

    return _tokenURI;
  }

  function _composeJson(Attributes memory attributes, Stats memory stats) internal pure returns (string memory) {
      return string(
          abi.encodePacked(
              "{\"name\": \"Sloth NFT\", \"description\": \"A cute sloth NFT with unique attributes\", \"attributes\": [",
              _attributeJson("Color", attributes.color),
              _attributeJson("Pattern", attributes.pattern),
              _attributeJson("Eye Color", attributes.eyeColor),
              _attributeJson("Accessory", attributes.accessory),
              _attributeJson("Energy Level", attributes.energyLevel),
              _statJson("Strength", stats.strength),
              _statJson("Agility", stats.agility),
              _statJson("Intelligence", stats.intelligence),
              "]}")
      );
  }

    function _attributeJson(string memory traitType, string memory value) internal pure returns (string memory) {
      return string(abi.encodePacked("{\"trait_type\": \"", traitType, "\", \"value\": \"", value, "\"}, "));
  }

  function _statJson(string memory traitType, uint256 value) internal pure returns (string memory) {
      return string(abi.encodePacked("{\"trait_type\": \"", traitType, "\", \"value\": ", value.toString(), "}, "));
  }

  function _createTokenURI(Attributes memory attributes, Stats memory stats) internal pure returns (string memory) {
    string memory json = _composeJson(attributes, stats);
    string memory base64Json = base64Encode(json);
    string memory _tokenURI = string(abi.encodePacked("data:application/json;base64,", base64Json));
    return _tokenURI;
  }

  // Add the base64Encode function here
}
