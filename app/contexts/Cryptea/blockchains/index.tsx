
import * as ethers from 'ethers';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const blockchains = {
  sol: {
  
    balance: async (addr: string, rpc: string) => {
      const connection = new Connection(rpc);

      const balance = await connection.getBalance(new PublicKey(addr));

      return Number(balance / LAMPORTS_PER_SOL);
    },
  },
  evm: {
   
    balance: async (addr: string, rpc: string) => {
      const provider = new ethers.providers.JsonRpcProvider(rpc);

      return Number(ethers.utils.formatEther(await provider.getBalance(addr)));
    },
  },
};