const { expect } = require("chai");
const { ethers } = require("hardhat");
const currentTime = require("../utils/currentTime");
const duration = require("../utils/duration");
const ether = require("../utils/ether");
const increaseTimeTo = require("../utils/increaseTimeTo")

const should = require("chai").should();

const chai = require("chai");
chai.use(require("chai-as-promised"));

describe("Timelock", function () {
  before(async function () {
    const Timelock = await ethers.getContractFactory("Timelock");
    this.timelock = await Timelock.deploy();

    await this.timelock.deployed();

    this.now = await currentTime();

    this.startingTime = this.now + duration.days(1);
    this.closingTime = this.startingTime + duration.days(3);

    this.users = await ethers.getSigners();
    this.user1 = this.users[0];
    this.user2 = this.users[1];
    this.user3 = this.users[2];
  });

  it("should set closing time and the ending time", async function () {
    const tx = await this.timelock.setTimeStamp(
      this.startingTime,
      this.closingTime
    );

    await this.timelock
      .setTimeStamp(this.startingTime, this.closingTime)
      .should.be.rejectedWith("revert");
  });

  it("should store some amount of eth in the timelock", async function () {
    await this.timelock.store({ value: ether(2) });

    const user1Balance = await this.timelock.balance(this.user1.address);

    expect(user1Balance.toString()).to.equal(ether(2).toString());

    await this.timelock.connect(this.user2).store({ value: ether(4) });
    const user2Balance = await this.timelock.balance(this.user2.address);

    expect(user2Balance.toString()).to.equal(ether(4).toString());
  });

 it("should lock the timelock when current time gets to starting time", async function () {
  await this.timelock.withdraw(ether(1)).should.be.fulfilled
  
  const user1Balance = await this.timelock.balance(this.user1.address);

  expect(user1Balance.toString()).to.equal(ether(1).toString());

  await increaseTimeTo(this.startingTime + 1)

  await this.timelock.withdraw(ether(1)).should.be.rejectedWith("revert")

  await increaseTimeTo(this.closingTime + 1)

  await this.timelock.withdraw(ether(1)).should.be.fulfilled;

  const newUser1Balance = await this.timelock.balance(this.user1.address);
  const newUser2Balance = await this.timelock.balance(this.user2.address);

  expect(newUser1Balance.toString()).to.equal("0")
  expect(newUser2Balance.toString()).to.equal(ether(4))




  });
});
