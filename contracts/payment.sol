// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;
import 'hardhat/console.sol';

contract Payment{
        event TransferReceived(address indexed _to, address indexed _from, uint indexed _amount);
        event TransferSent(address indexed _from, address indexed _desAddr , uint indexed _amount);

        address public owner;
        address public contractAddress = address(this);
        uint256 public contractBalance;
        uint256 public wallet;  
        uint256 public percent = 5;
        constructor () {
              owner = msg.sender;
              wallet = 0;
        }

        modifier onlyOwners {
             require(owner == msg.sender, "Only owners please");
             _;
        }

        function changeCut(uint256 _percent) public onlyOwners {
            percent = _percent;
        }

        function sendToken (address to) external payable {
            wallet += msg.value;
            contractBalance = address(this).balance;
            
            emit TransferReceived(to, msg.sender, msg.value);
        }

        receive () external payable {
            wallet += msg.value;

            emit TransferReceived(contractAddress, msg.sender, msg.value);
        }

        function transferToken (address payable to) payable external {
            require(msg.value > 0, "balance is insufficient");
            
            uint256 cut = (msg.value * percent) / 100;

            uint256 amount = msg.value - cut;

            to.transfer(amount);

            contractBalance = address(this).balance;

            wallet += cut;

            emit TransferSent(msg.sender, to, amount);
        }

        function withdraw () public onlyOwners {   
            payable(owner).transfer(wallet);
            wallet = 0;
            contractBalance = address(this).balance;
        }
}