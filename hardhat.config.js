require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.7", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    polygon: {
      url: process.env.MATIC_LINK,
      accounts: [process.env.MATIC_PRIVATE_KEY]
    },  
    rinkeby: {
        url: process.env.RINK_LINK,
        accounts: [process.env.RINKEBY_KEY]
    },
    optimism_test: {
      url: process.env.OPTIMISM_TEST,
      accounts: [process.env.MATIC_PRIVATE_KEY]
    },
    cronos_test: {
      url: process.env.CRONOS_TEST,
      accounts: [process.env.MATIC_PRIVATE_KEY]
    },
    aurora_test: {
      url: process.env.AURORA_TEST,
      accounts: [process.env.MATIC_PRIVATE_KEY]
    },
    oasis_test: {
      url: process.env.OASISEMARALD,
      accounts: [process.env.MATIC_PRIVATE_KEY]
    }
  }
};
