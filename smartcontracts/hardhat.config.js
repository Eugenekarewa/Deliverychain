require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Sepolia RPC URL from .env
      accounts: [process.env.PRIVATE_KEY], // Deployer private key from .env
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Etherscan API key from .env
  },
  sourcify: {
    enabled: false, // Enable Sourcify verification
  },
};