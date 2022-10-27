// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract Main {

    address public owner;
    uint public cut = 3;
    uint public qrcut = 2;

    mapping(bytes32 => address) public whitelist;

    bytes32[] public whiteSymbol;

    constructor (){
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owners allowed");
        _;
    }

    function whiteSymbols() public view returns(bytes32[] memory) {
        return whiteSymbol;
    }

    function updateCut (uint ncut) external onlyOwner {
        require(ncut > 0, "Cut too small");
        cut = ncut;
    }

    function addWhitelist (bytes32 symbol, address _address) external onlyOwner {

        whitelist[symbol] = _address;

        whiteSymbol.push(symbol);

    }

    function removeWhitelist (bytes32 symbol) external onlyOwner {

        delete whitelist[symbol];

    }


    function updateQrCut (uint ncut) external onlyOwner {
        require(ncut > 0, "Cut too small");
        qrcut = ncut;
    }

}