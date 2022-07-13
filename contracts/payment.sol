// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;
import 'hardhat/console.sol';

contract Payment{

        event TransferReceived(address _to, address _from, uint _amount);
        event TransferSent(address _from, address _desAddr , uint _amount, uint _balance);

        address public owner;
        uint public balance;

        address public contractAddress = address(this);

        uint256 public contractBalance;

        mapping(address => uint256) public wallet;  

        constructor () {
              owner = msg.sender;
              wallet[owner] = 0;
        }

        function sendToken (address to) external payable {
            wallet[to] = msg.value;
            contractBalance = address(this).balance;
            emit TransferReceived(to, msg.sender, msg.value);
        }

        receive () external payable {

        }

        function transferToken (address payable to) external {
            require(wallet[to] > 0, "balance is insufficient");
            
            uint256 percent = (wallet[to] * 5) / 100;

            uint256 amount = wallet[to] - percent;

            wallet[to] = 0;

            to.transfer(amount);

            contractBalance = address(this).balance;

            wallet[owner] += percent;

            emit TransferSent(msg.sender, to, amount, balance);
        }

        function withdraw () public {
            require(owner == msg.sender, "Only owners please");
            
            payable(owner).transfer(wallet[owner]);
        }
}