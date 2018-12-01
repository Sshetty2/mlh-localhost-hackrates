var HackRates = artifacts.require("./HackRates.sol");

module.exports = function(deployer) {
  deployer.deploy(HackRates);
};
