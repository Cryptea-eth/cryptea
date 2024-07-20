// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Subscription is ERC721URIStorage{
         using Counters for Counters.Counter;
         Counters.Counter private tokenCounter;
         uint256 public totalSupply = 100000000;
         uint256 wallet;
         uint256 public percent = 3;
         address owner;

        event TransferReceived(address indexed _to, address indexed _from, uint indexed _amount);
        event TransferSent(address indexed _from, address indexed _desAddr , uint indexed _amount);

         constructor() ERC721("Breew Subscription", "CPS") { 
            owner = msg.sender;
            wallet = 0;
         }

         modifier onlyOwner{
            require(msg.sender == owner, 'Only owner');
            _;
         }
        
        function addSupply(uint256 add) public onlyOwner {
            totalSupply = totalSupply + add;
        }

        function changeCut(uint256 _percent) public onlyOwner {
            percent = _percent;
        }

        receive() external payable{
            wallet += msg.value;

            emit TransferReceived(address(this), msg.sender, msg.value);
        }

        function mintTokens(address forUser, address payable toUser, uint256 price, string memory tokenURI) public payable returns(uint256) {
                require(totalSupply >= tokenCounter.current(), 'Total Limit Reached');
                require(price == msg.value, "Amount Not Valid");
                
                uint256 newItemId = tokenCounter.current();
                _mint(forUser, newItemId);
                _setTokenURI(newItemId, tokenURI);

                uint256 cut =  (msg.value * percent) / 100; 

                uint256 amount = msg.value - cut;

                wallet += cut;
                
                toUser.transfer(amount);
                tokenCounter.increment();
                
                emit TransferSent(forUser, toUser, msg.value);

                return newItemId;
         }

        function withdraw () public onlyOwner {   
            payable(owner).transfer(wallet);
            wallet = 0;
        }

}