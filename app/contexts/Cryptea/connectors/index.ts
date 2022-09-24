import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chains } from "./chains";

export const supported = [1, 80001, 137];

const connectors = [
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "Cryptea",
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: "Cryptea",
      shimDisconnect: true,
    },
  }),
];

export default connectors;
