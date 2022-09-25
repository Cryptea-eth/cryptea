import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chains } from "./chains";

export const supported = [
  80001, 137, 43114, 43113, 10, 69, 1313161554, 1313161555, 42262, 42261, 25, 338
];

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
