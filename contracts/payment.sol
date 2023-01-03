// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./main.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Payment {

        event TransferReceived(address indexed _to, address indexed _from, uint indexed _amount);

        event TransferSent(address indexed _from, address indexed _desAddr , uint indexed _amount);

        Main parentContract = Main(0xB5450b0A11F5cb94B4bFc0aed63f8b75AF96891f);

        address public owner = parentContract.owner();
        address public contractAddress = address(this);
        uint256 public contractBalance;
        uint256 public wallet;  
        uint256 public percent = parentContract.cut();

        constructor () {
             
        }


        receive () external payable {

            emit TransferReceived(contractAddress, msg.sender, msg.value);

        }

        function transferNative (address payable to) payable external {
            require(msg.value > 0, "balance is insufficient");

            uint256 cut = (msg.value * percent) / 100;

            uint256 amount = msg.value - cut;

            to.transfer(amount);

            contractBalance = address(this).balance;

            payable(owner).transfer(cut);

            emit TransferSent(msg.sender, to, amount);
            
        }

        function transferToken (address payable to, uint256 value, bytes32 symbol) external {

            require (owner == msg.sender, "unauthorized");

             uint256 balance = IERC20(parentContract.whitelist(symbol)).balanceOf(contractAddress);

             require (balance > 0, "Balance low");

            uint256 cut = (value * percent) / 100;

            uint256 amount = value - cut;

            IERC20(parentContract.whitelist(symbol)).transfer(to, amount);

            IERC20(parentContract.whitelist(symbol)).transfer(owner, cut);
             
        }
}