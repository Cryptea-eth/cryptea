require("@nomiclabs/hardhat-waffle");
require('dotenv').config()
const web3 = require('web3');

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

task("account", "returns nonce and balance for specified address on multiple networks")
  .addParam("address")
  .setAction(async address => {
    const web3cronos = new web3('https://evm-t3.cronos.org');
    const web3poly = new web3(process.env.MATIC_LINK);
    const web3aurora = new web3(process.env.AURORA_LINK);
    const web3oasis = new web3('https://testnet.emerald.oasis.dev');
    const web3Opt = new web3('https://goerli.optimism.io');

    const networkIDArr = ["Cronos:", "Polygon:", "Aurora:", "Oasis:", "Optimism:"]
    const providerArr = [web3cronos, web3poly, web3aurora, web3oasis, web3Opt];
    const resultArr = [];

    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(address.address, "latest");
      const balance = await providerArr[i].eth.getBalance(address.address)
      resultArr.push([networkIDArr[i], nonce, parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) + "ETH"]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "])
    console.log(resultArr);
  });

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
      accounts: [process.env.PRIVATE_KEY]
    },  
    rinkeby: {
        url: process.env.RINK_LINK,
        accounts: [process.env.RINKEBY_KEY]
    },
    optimism_test: {
      url: "https://goerli.optimism.io",
      accounts: [process.env.PRIVATE_KEY]
    },
    cronos_test: {
      url: "https://evm-t3.cronos.org",
      accounts: [process.env.PRIVATE_KEY]
    },
    aurora_test: {
      url: process.env.AURORA_LINK,
      accounts: [process.env.PRIVATE_KEY]
    },
    oasis_test: {
      url: "https://testnet.emerald.oasis.dev",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
