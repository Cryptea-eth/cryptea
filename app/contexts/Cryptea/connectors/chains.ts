import { configureChains, defaultChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

export const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai, chain.mainnet],
  [
    publicProvider()
  ]
);