// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;
import 'hardhat/console.sol';

contract Payment{
        event TransferReceived(address indexed _to, address indexed _from, uint indexed _amount);
        event TransferSent(address indexed _from, address indexed _desAddr , uint indexed _amount);

        address public owner;
        uint256 public contractBalance;

        address public contractAddress = address(this);

        mapping(address => uint256) public wallet;  

        constructor () {
              owner = msg.sender;
              wallet[owner] = 0;
        }

        modifier onlyOwners {
             require(owner == msg.sender, "Only owners please");
             _;
        }

        function sendToken (address to) external payable {
            wallet[to] = msg.value;
            contractBalance = address(this).balance;
            
            emit TransferReceived(to, msg.sender, msg.value);
        }

        receive () external payable {
            wallet[owner] = msg.value;

            emit TransferReceived(contractAddress, msg.sender, msg.value);
        }

        function transferToken (address payable to) external {
            require(wallet[to] > 0, "balance is insufficient");
            
            uint256 percent = (wallet[to] * 5) / 100;

            uint256 amount = wallet[to] - percent;

            wallet[to] = 0;

            to.transfer(amount);

            contractBalance = address(this).balance;

            wallet[owner] += percent;

            emit TransferSent(msg.sender, to, amount);
        }

        function withdraw () public onlyOwners {   
            payable(owner).transfer(wallet[owner]);
        }
}