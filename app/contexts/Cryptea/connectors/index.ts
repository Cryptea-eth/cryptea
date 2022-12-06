import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chains } from "./chains";
import UAuth from "@uauth/js";

export const supported = [
  80001, 137, 43114, 43113, 10, 31415, 69, 1313161554, 1313161555, 42262, 42261, 25, 338
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

export const uauth_connector = new UAuth({
  clientID: "76943570-6aaa-43d2-b826-e6bb87736e09",
  redirectUri: "http://localhost:3000",
  scope: "openid wallet",
});


export default connectors;
