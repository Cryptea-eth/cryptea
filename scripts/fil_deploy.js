require("hardhat-deploy");
require("hardhat-deploy-ethers");

const mainAbi = require('../artifacts/contracts/main.sol/Main.json');

const ethers = require("ethers");
const fa = require("@glif/filecoin-address");
const util = require("util");
const request = util.promisify(require("request"));

const DEPLOYER_PRIVATE_KEY = process.env.PRIVATE_KEY;

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
}

async function callRpc(method, params) {
  var options = {
    method: "POST",
    url: "https://wallaby.node.glif.io/rpc/v0",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  };
  const res = await request(options);
  return JSON.parse(res.body).result;
}


const mainx = async () => {

  const provider = new ethers.providers.JsonRpcProvider(
    "https://wallaby.node.glif.io/rpc/v0"
  );

  const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);


  const factory = new ethers.ContractFactory(
    mainAbi.abi,
    mainAbi.bytecode,
    deployer
  );

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");
  const f4Address = fa.newDelegatedEthAddress(deployer.address).toString();
  const nonce = await callRpc("Filecoin.MpoolGetNonce", [f4Address]);

  console.log("Wallet Ethereum Address:", deployer.address);
  console.log("Wallet f4Address: ", f4Address)


  const deploy = await factory.deploy();

  console.log(deploy.address)
  
};

mainx().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});