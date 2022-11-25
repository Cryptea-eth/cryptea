import { configureChains, defaultChains, chain, Chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export const avalancheChain: Chain = {
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

export const avalancheTestnet: Chain = {
  id: 43_113,
  name: "Avalanche Testnet",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://testnet.snowtrace.io" },
  },
  testnet: true,
};

export const Optimism: Chain = {
  id: 10,
  name: "Optimism",
  network: "optimism",
  nativeCurrency: {
    decimals: 18,
    name: "Optimism",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://mainnet.optimism.io",
  },
  blockExplorers: {
    default: { name: "Optimism", url: "https://optimistic.etherscan.io" },
  },
  testnet: false,
};

export const OptimismGoerli: Chain = {
  id: 420,
  name: "Optimism Goerli",
  network: "optimism",
  nativeCurrency: {
    decimals: 18,
    name: "Optimism",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://goerli.optimism.io",
  },
  blockExplorers: {
    default: { name: "Optimism", url: "https://goerli-optimistic.etherscan.io" },
  },
  testnet: true,
}

export const Aurora: Chain = {
  id: 1313161554,
  name: "Aurora",
  network: "aurora",
  nativeCurrency: {
    decimals: 18,
    name: "Aurora",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://mainnet.aurora.dev",
  },
  blockExplorers: {
    default: { name: "Aurora", url: "https://explorer.mainnet.aurora.dev" },
  },
  testnet: false,
};

export const AuroraTestnet: Chain = {
  id: 1313161555,
  name: "Aurora Testnet",
  network: "aurora",
  nativeCurrency: {
    decimals: 18,
    name: "Aurora",
    symbol: "ETH",
  },
  rpcUrls: {
    default: process.env.AURORA_LINK || "https://testnet.aurora.dev",
  },
  blockExplorers: {
    default: { name: "Aurora", url: "https://explorer.testnet.aurora.dev" },
  },
  testnet: true,
};

export const OasisEmerald: Chain = {
  id: 42262,
  name: "Oasis",
  network: "oasis",
  nativeCurrency: {
    name: "Oasis",
    decimals: 18,
    symbol: "ROSE",
  },
  rpcUrls: {
    default: "https://emerald.oasis.dev	",
  },
  blockExplorers: {
    default: { name: "Oasis", url: "https://explorer.emerald.oasis.dev" },
  },
  testnet: false,
};

export const OasisEmeraldTestnet: Chain = {
  id: 42261,
  name: "Oasis Testnet",
  network: "oasis",
  nativeCurrency: {
    name: "Oasis",
    decimals: 18,
    symbol: "ROSE",
  },
  rpcUrls: {
    default: "https://testnet.emerald.oasis.dev/",
  },
  blockExplorers: {
    default: {
      name: "Oasis",
      url: "https://testnet.explorer.emerald.oasis.dev",
    },
  },
  testnet: true,
};

export const Cronos: Chain = {
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

export const FileCoinWallaby: Chain = {
  id: 31415,
  name: "Filecoin Wallaby",
  network: "Wallaby",
  nativeCurrency: {
    name: "Filecoin",
    decimals: 18,
    symbol: "tFIL",
  },
  rpcUrls: {
    default: "https://wallaby.node.glif.io/rpc/v0",
  },
  blockExplorers: {
    default: {
      name: "wallaby",
      url: "https://explorer.glif.io/wallaby",
    },
  },
  testnet: true,
};

export const CronosTest: Chain = {
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
    default: { name: "cronos-test", url: "https://cronos.org/explorer/testnet3" },
  },
  testnet: true,
};

export const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygon,
    chain.polygonMumbai,
    avalancheChain,
    avalancheTestnet,
    CronosTest,
    Cronos,
    Aurora,
    AuroraTestnet,
    Optimism,
    OptimismGoerli,
    OasisEmerald,
    OasisEmeraldTestnet,
    FileCoinWallaby,
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain: Chain) => {
        if (
          chain.id !== avalancheChain.id ||
          chain.id !== CronosTest.id ||
          chain.id !== Cronos.id ||
          chain.id !== avalancheTestnet.id ||
          chain.id !== Aurora.id ||
          chain.id !== AuroraTestnet.id ||
          chain.id !== Optimism.id ||
          chain.id !== OptimismGoerli.id ||
          chain.id !== OasisEmerald.id ||
          chain.id !== OasisEmeraldTestnet.id ||
          chain.id !== FileCoinWallaby.id
        )
          return null;

        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);


