/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ksPBosZH23xkhJJUVEBjZu1u-C13YIE4",
      accounts: [
        "4dc6696d954a905eca17a6218b162cfe6344a512b5df3c379516380bc0630045",
      ],
    },
  },
};
