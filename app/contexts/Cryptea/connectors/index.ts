import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const support = [1, 80001, 137];

export const injected = new InjectedConnector({
  supportedChainIds: support,
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: support,
});
