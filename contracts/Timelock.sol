//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// store: This allows users to store some ETH inside the timelock contract
// withdraw: This allows users to withdraw the stored ETH in the timelock contract
// setTimestamp: This gives users the power to specify the opening and the closing time of the timelock.

// payable allows a function to send ether to the contract. 


contract Timelock is ReentrancyGuard {

 struct User{
  uint startingTime;
  uint closingTime;
 }

 mapping(address => User) users;
 mapping(address => uint) public balance;

 event TimeStampSet(uint startingTime, uint closingTime);

 function setTimeStamp(uint startingTime, uint closingTime) external  {
   User storage user = users[msg.sender];
   require(user.startingTime == 0 && user.closingTime == 0, "Time has already been set");
   
   users[msg.sender] = User(startingTime, closingTime);
   
   emit TimeStampSet(startingTime, closingTime);
 }

// 2 ETH => 2 * 10**18
 function store() external payable nonReentrant{ 
   require(msg.value > 0, "Amount should be greater than zero");
   balance[msg.sender] = balance[msg.sender] + msg.value;
  }

 function withdraw(uint amount) public nonReentrant{
  User storage user = users[msg.sender];
  require(block.timestamp < user.startingTime || block.timestamp > user.closingTime, "Contract is still locked. You can't withdraw");

  require(amount <= balance[msg.sender], "You don't have up to that amount");

  payable(msg.sender).transfer(amount);


  balance[msg.sender] = balance[msg.sender] - amount;

 }



}







