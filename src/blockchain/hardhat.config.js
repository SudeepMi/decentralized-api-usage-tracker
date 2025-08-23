require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const RPC_URL = process.env.RPC_URL || "";
const PRIVATE_KEY = process.env.DEPLOYER_KEY || "";

module.exports = {
  solidity: "0.8.20",
  networks: {
    testnet: {
      url: RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 