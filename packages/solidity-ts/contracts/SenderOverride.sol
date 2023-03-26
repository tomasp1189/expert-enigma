// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

abstract contract SenderOverride {
  address internal _customSender;

  function _msgSender() internal view virtual returns (address) {
    if (_customSender != address(0)) {
      return _customSender;
    }
    return msg.sender;
  }

  function _setCustomSender(address newCustomSender) internal {
    _customSender = newCustomSender;
  }
}
