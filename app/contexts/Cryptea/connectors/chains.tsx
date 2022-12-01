import { configureChains, defaultChains, chain, Chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import CustomImg from "../../../components/elements/customImg";
import { BiEnvelope, BiPhoneCall, BiUserCircle } from "react-icons/bi";

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
    default: {
      name: "Optimism",
      url: "https://goerli-optimistic.etherscan.io",
    },
  },
  testnet: true,
};

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
    default: {
      name: "cronos-test",
      url: "https://cronos.org/explorer/testnet3",
    },
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

export const tokenTrackers: {
  [index: string]: { name: string; link: string };
} = {
  80001: {
    name: "polygonscan",
    link: "https://mumbai.polygonscan.com/tx/",
  },
  338: {
    name: "Cronos Explorer",
    link: "https://cronos.org/explorer/testnet3/tx/",
  },
  1313161555: {
    name: "Aurora Explorer",
    link: "https://explorer.testnet.aurora.dev/tx/",
  },
  420: {
    name: "Optimism Explorer",
    link: "https://goerli-optimistic.etherscan.io/tx/",
  },
  42261: {
    name: "Oasis Explorer",
    link: "https://testnet.explorer.emerald.oasis.dev/tx/",
  },
  31415: {
    name: "Wallaby Explorer",
    link: "https://explorer.glif.io/wallaby",
  },
};

export const inputsList = [
  {
    label: (
      <div className="flex items-center">
        <BiUserCircle className="mr-[6px]" size={20} /> <span>Name</span>
      </div>
    ),
    value: "Name",
  },
  {
    label: (
      <div className="flex items-center">
        <BiEnvelope className="mr-[6px]" size={20} /> <span>Email</span>
      </div>
    ),
    value: "Email",
  },
  {
    label: (
      <div className="flex items-center">
        <BiPhoneCall className="mr-[6px]" size={20} /> <span>Phone</span>
      </div>
    ),
    value: "Phone",
  },
];

export const CryptoList = [
  {
    value: 80001,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-1 relative w-[20px]">
          <CustomImg
            symbol={"matic"}
            name="polygon"
            size={20}
            alt={"Polygon (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Polygon (Testnet)</span>
      </div>
    ),
    name: "Polygon (Testnet)",
    symbol: "matic",
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    network: "polygon maticmum",
    tokenAddr: "0x0000000000000000000000000000000000001010",
    rpc: process.env.MATIC_LINK as string,
  },
  {
    value: 31415,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-1 relative w-[20px]">
          <CustomImg
            name="filecoin"
            symbol="FIL"
            size={20}
            alt={"Filecoin (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Filecoin (Testnet)</span>
      </div>
    ),
    name: "Filecoin (Testnet)",
    symbol: "TFIL",
    network: FileCoinWallaby.network as string,
    tokenAddr: "",
    contractAddr: "0x2d9E5Cd304A84DC15Bb28749Cf0769A0bdc2CD6F",
    rpc: FileCoinWallaby.rpcUrls.default,
  },
  {
    value: 338,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-1 relative w-[20px]">
          <CustomImg
            symbol="CRO"
            name="cronos"
            size={20}
            alt={"Cronos (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Cronos (Testnet)</span>
      </div>
    ),
    name: "Cronos (Testnet)",
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    symbol: "tcro",
    network: CronosTest.network as string,
    tokenAddr: "",
    rpc: CronosTest.rpcUrls.default,
  },
  {
    value: 1313161555,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-1 relative w-[20px]">
          <CustomImg
            symbol="aurora"
            name="aurora"
            size={20}
            alt={"Aurora (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Aurora (Testnet)</span>
      </div>
    ),
    name: "Aurora (Testnet)",
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    symbol: "aurora",
    network: AuroraTestnet.network as string,
    tokenAddr: "",
    rpc: AuroraTestnet.rpcUrls.default,
  },
  {
    value: 420,
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-1 relative w-[20px]">
          <CustomImg
            symbol="op"
            name="optimism"
            size={20}
            alt={"Optimism (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Optimism (Testnet)</span>
      </div>
    ),
    name: "Optimism (Testnet)",
    symbol: "op",
    network: OptimismGoerli.network as string,
    tokenAddr: "",
    rpc: OptimismGoerli.rpcUrls.default,
  },
  {
    value: 42261,
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-1 relative w-[20px]">
          <CustomImg
            symbol="rose"
            name="oasis"
            size={20}
            alt={"Oasis (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Oasis (Testnet)</span>
      </div>
    ),
    name: "Oasis (Testnet)",
    symbol: "rose",
    network: OasisEmeraldTestnet.network as string,
    tokenAddr: "",
    rpc: OasisEmeraldTestnet.rpcUrls.default,
  },
];
