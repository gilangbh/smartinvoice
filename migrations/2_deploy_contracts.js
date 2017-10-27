var SmartInvoice = artifacts.require("./SmartInvoice/SmartInvoice.sol");
var SmartInvoice2 = artifacts.require("./SmartInvoice/SmartInvoice2.sol");

module.exports = function(deployer) {
  deployer.deploy(SmartInvoice);
  deployer.deploy(SmartInvoice2);
};