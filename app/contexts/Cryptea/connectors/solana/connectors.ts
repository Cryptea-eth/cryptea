import * as web3 from "@solana/web3.js";
import { Chain } from "wagmi/chains";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ethers } from "ethers";
import { AuthAddress, message } from "../../Auth";
import analytics from "../../../../../analytics";
import { Connector } from "wagmi";
const bs58 = require("bs58");

const phantom = new PhantomWalletAdapter();

export const getPhantomConnector = ({ chains }: { chains?: Chain[] }) => {
  return {
    id: "phantom",
    name: phantom.name,
    type: "phantom",
    connect: async () => {
      if (!phantom.connected) {
        await phantom.connect();
      }

      const account = phantom.publicKey?.toBase58() || "";
      const signature = await phantom.signMessage(Buffer.from(message));
      const encodeSign = bs58.encode(signature);

      const main = await AuthAddress({
        address: account,
        signature: encodeSign,
        message,
        blocktype: "sol",
      });

      if (Boolean(main)) {
        analytics.track("Auth");
        const email = await "user".get("email");
        if (!Boolean(email)) {
          location.href = "/signup";
        } else {
          if (String(email).length) {
            location.href = "/dashboard";
          } else {
            location.href = "/signup";
          }
        }
      }

      return {
        accounts: [`${account}`] as readonly `0x${string}`[],
        chainId: 1,
      };
    },
    disconnect: async () => {
      await phantom.disconnect();
    },
    getAccounts: async () => {
      const account = phantom.publicKey?.toBase58() || "";
      return [`${account}`] as readonly `0x${string}`[];
    },
    getChainId: async () => 1,
    getProvider: async () => ethers.getDefaultProvider(),
    isAuthorized: async () => true,
    onAccountsChanged: (accounts: string[]) => {},
    onChainChanged: (chain: number | string) => {},
    onDisconnect: (error: Error) => {},
  } as const;
};
