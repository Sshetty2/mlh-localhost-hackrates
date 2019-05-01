/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 */
require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

var rpc_endpoint = process.env.RPC_ENDPOINT || "http://ethirgqw4-dns-reg1.eastus.cloudapp.azure.com:8540";
var mnemonic = process.env.MNEMONIC || "oval copper access play kidney pact drop club proof foil census photo"

module.exports = {
  networks: {
    // development: {
    //   host: "localhost",
    //   port: 8545,
    //   network_id: "*" // Match any network id
    // },
    poa: {
      provider: () => new HDWalletProvider(mnemonic, rpc_endpoint),
      network_id: '10101010',
      gasPrice : 0 // gas is not required in POA
    }
  },
  compilers: {
    solc: {
      version: "0.4.11",
    }
  }
};