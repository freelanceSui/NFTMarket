/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { ALCHEMY_NETWORK_URL, NETWORK_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.3",
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {},
    ropsten: {
      url: ALCHEMY_NETWORK_URL,
      accounts: [`0x${NETWORK_PRIVATE_KEY}`],
    },
  },
};
