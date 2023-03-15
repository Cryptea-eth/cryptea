
import * as ethers from 'ethers';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const validateSol = (addr: string) => {
      try {

        new PublicKey(addr);

        return true;
      } catch (e) {
        return false;
      }
}

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