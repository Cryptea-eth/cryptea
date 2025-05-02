import * as web3 from "@solana/web3.js";
import { Chain } from "wagmi/chains";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ethers } from "ethers";
import { coinbaseWallet as coinbaseWagmiWallet } from 'wagmi/connectors';
import { AuthAddress, message } from "../../Auth";
import analytics from "../../../../../analytics";
import { Connector, CreateConnectorFn } from "wagmi";
const bs58 = require("bs58");

const phantom = new PhantomWalletAdapter();

export const getPhantomConnector = (): CreateConnectorFn => {
  return (config) => {
    let disconnectListener: (() => void) | undefined;
    let accountChangeListener: ((publicKey: web3.PublicKey | null) => void) | undefined;

    return {
      id: "phantom",
      name: phantom.name,
      type: "phantom",
      connect: async (parameters: { chainId?: number } = {}) => {
        console.log('connect, in phantom', config.emitter)

        config.emitter.emit("message", {
          type: "connecting",
        });

        if (!phantom.connected) {
          config.emitter.emit('connect', { accounts: [], chainId: 1 })
          await phantom.connect();
        }

        config.emitter.emit('message', { type: 'display_uri', data: 'https://solana.com' })

        phantom.on('connect', (publicKey: web3.PublicKey) => {
          console.log('connect', publicKey)
        })

        phantom.on('error', (error: Error) => {
          console.log('error', error)
        })

        // Set up event listeners
        disconnectListener = () => {
          config.emitter.emit('disconnect');
        };
        accountChangeListener = (publicKey: web3.PublicKey | null) => {
          if (publicKey) {
            config.emitter.emit('change', { accounts: [`0x${publicKey.toBase58()}`] as readonly `0x${string}`[] });
          } else {
            config.emitter.emit('disconnect');
          }
        };

       
        config.emitter.on('disconnect', disconnectListener);
        
        // @ts-ignore - Phantom wallet adapter events are not properly typed
        config.emitter.on('accountChanged', accountChangeListener);

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
          accounts: [`0x${account}`] as readonly `0x${string}`[],
          chainId: 1,
        };
      },
      disconnect: async () => {
        if (disconnectListener) {
          config.emitter.off('disconnect', disconnectListener);
        }
        if (accountChangeListener) {
          // @ts-ignore - Phantom wallet adapter events are not properly typed
          config.emitter.off('accountChanged', accountChangeListener);
        }
        
        await phantom.disconnect();
        config.emitter.emit('disconnect');
      },
      getAccounts: async () => {
        const account = phantom.publicKey?.toBase58() || "";
        return [`0x${account}`] as readonly `0x${string}`[];
      },
      getChainId: async () => 1,
      getProvider: async () => ethers.getDefaultProvider(),
      isAuthorized: async () => true,
      onAccountsChanged: (accounts: string[]) => {
        // This will be called when the account changes
        console.log('Accounts changed:', accounts);
      },
      onChainChanged: (chain: number | string) => {
        // This will be called when the chain changes
        console.log('Chain changed:', chain);
      },
      onDisconnect: (error: Error) => {
        // This will be called when the wallet disconnects
        console.log('Disconnected:', error);
      },
    };
  };
};
