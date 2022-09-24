import { configureChains, defaultChains, chain, Chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const avalancheChain: Chain = {
  id: 43_114,
  name: "Avalanche",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};

const Cronos: Chain = {
  id: 25,
  name: "Cronos",
  network: "cronos mainnet",
  nativeCurrency: {
    name: "cronos",
    decimals: 18,
    symbol: "CRO",
  },
  rpcUrls: {
    default: "https://evm.cronos.org",
  },
  blockExplorers: {
    default: { name: "cronos", url: "https://cronos.org/explorer" },
  },
  testnet: false,
};

const CronosTest: Chain = {
  id: 338,
  name: "Cronos Testnet",
  network: "cronos",
  nativeCurrency: {
    name: "cronos",
    decimals: 18,
    symbol: "TCRO",
  },
  rpcUrls: {
    default: "https://evm-t3.cronos.org",
    wss: "wss://cronos-testnet-3.crypto.org:8546",
  },
  blockExplorers: {
    default: {name: "cronos-test", url: ""},
  },
  testnet: true
};

export const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai, avalancheChain, CronosTest, Cronos],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== avalancheChain.id || chain.id !== CronosTest.id || chain.id !== Cronos.id) return null

        return { http: chain.rpcUrls.default }
      }
    }),
    publicProvider()
  ]
);