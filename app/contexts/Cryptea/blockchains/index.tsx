import * as ethers from "ethers";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
const TronWeb = require("tronweb");

export const validateSol = (addr: string) => {
  try {
    new PublicKey(addr);

    return true;
  } catch (e) {
    return false;
  }
};

export const blockchains: { [index: string]: any } = {
  sol: {
    validateAddr: (addr: string) => validateSol(addr),
    balance: async (addr: string, rpc: string) => {
      if (!validateSol(addr)) {
        return 0;
      }

      const connection = new Connection(rpc);

      const balance = await connection.getBalance(new PublicKey(addr));

      return Number(balance / LAMPORTS_PER_SOL);
    },
  },
  trx: {
    validateAddr: (addr: string) => {
      try {
        return TronWeb.isAddress(addr);
      } catch (e) {
        return false;
      }
    },
    balance: async (
      addr: string,
      rpc: {
        solidity: string;
        main: string;
      }
    ) => {
      if (!TronWeb.isAddress(addr)) {
        return 0;
      }

      const tron = new TronWeb({
        fullNode: rpc.main,
        solidityNode: rpc.solidity,
      });

      const balance = await tron.trx.getBalance(addr);

      return Number(TronWeb.fromSun(balance));
    },
  },
  evm: {
    validateAddr: (addr: string) => ethers.utils.isAddress(addr),
    balance: async (addr: string, rpc: string) => {
      if (!ethers.utils.isAddress(addr)) {
        return 0;
      }

      const provider = new ethers.providers.JsonRpcProvider(rpc);

      return Number(ethers.utils.formatEther(await provider.getBalance(addr)));
    },
  },
};
