
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

export const blockchains = {
  sol: {
  
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
   
    balance: async (addr: string, rpc: string) => {

      if (!ethers.utils.isAddress(addr)) {
        return 0;
      }

      const provider = new ethers.providers.JsonRpcProvider(rpc);

      return Number(ethers.utils.formatEther(await provider.getBalance(addr)));
    },
  },
};