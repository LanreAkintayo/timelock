function ether(value) {
 return ethers.utils.parseUnits(value.toString(), "ether")
}

module.exports = ether