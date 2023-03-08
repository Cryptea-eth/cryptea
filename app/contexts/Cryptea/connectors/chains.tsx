import { configureChains, chain, Chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import CustomImg from "../../../components/elements/customImg";
import { BiEnvelope, BiPhoneCall, BiUserCircle } from "react-icons/bi";
import { token } from "../types";

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

export const fantom: Chain = {
  id: 250,
  name: "Fantom",
  network: "fantom",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    default: "https://rpc3.fantom.network",
  },
  blockExplorers: {
    default: { name: "Fantom", url: "https://ftmscan.com" },
  },
  testnet: false,
};

export const fantomTestnet: Chain = {
  id: 4002,
  name: "Fantom Testnet",
  network: "fantom",
  nativeCurrency: {
    decimals: 18,
    name: "Fantom",
    symbol: "FTM",
  },
  rpcUrls: {
    default: "https://rpc.ankr.com/fantom_testnet",
  },
  blockExplorers: {
    default: { name: "Fantom", url: "https://testnet.ftmscan.com" },
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

export const FileCoinHyperspace: Chain = {
  id: 3141,
  name: "Filecoin Hyperspace",
  network: "Hyperspace",
  nativeCurrency: {
    name: "Filecoin",
    decimals: 18,
    symbol: "tFIL",
  },
  rpcUrls: {
    default: "https://api.hyperspace.node.glif.io/rpc/v1"
  },
  blockExplorers: {
    default: {
      name: "hyperspace",
      url: "https://hyperspace.filfox.info/en",
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
    FileCoinHyperspace,
    fantom,
    fantomTestnet,
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain: Chain) => {

        const chainIds: number[] = [
          avalancheChain.id,
          CronosTest.id,
          avalancheTestnet.id,
          Aurora.id,
          AuroraTestnet.id,
          Optimism.id,
          fantom.id,
          fantomTestnet.id,
          OptimismGoerli.id,
          OasisEmerald.id,
          OasisEmeraldTestnet.id,
          FileCoinHyperspace.id,
        ];

        if (!chainIds.includes(chain.id)) return null;

        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

export const tokenTrackers: {
  [index: string]: { name: string; link: string };
} = {
  137: {
    name: "polygonscan",
    link: "https://polygonscan.com/tx/",
  },
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
  3141: {
    name: "Hyperspace Explorer",
    link: "https://hyperspace.filfox.info/en/tx/",
  },
  250: {
    name: "Fantom Explorer",
    link: "https://ftmscan.com/tx/",
  },
  4002: {
    name: "Fantom Explorer",
    link: "https://testnet.fantom.com/tx/",
  }
};

export const inputsList = [
  {
    label: (
      <div key={0} className="flex items-center">
        <BiUserCircle className="mr-[6px]" size={20} /> <span>Name</span>
      </div>
    ),
    value: "name",
  },
  {
    label: (
      <div key={1} className="flex items-center">
        <BiEnvelope className="mr-[6px]" size={20} /> <span>Email</span>
      </div>
    ),
    value: "email",
  },
  {
    label: (
      <div key={2} className="flex items-center">
        <BiPhoneCall className="mr-[6px]" size={20} /> <span>Phone</span>
      </div>
    ),
    value: "phone",
  },
];

export const CryptoList: token[] = [
  {
    value: 137,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol={"matic"}
            name="polygon"
            size={20}
            alt={"Polygon (mainnet)"}
          />
        </div>
        <span className="text-[#121212]">Polygon (Mainnet)</span>
      </div>
    ),
    name: "Polygon (Mainnet)",
    symbol: "matic",
    contractAddr: "0xf1BC5925641159a0d1388B17e3AB32D9416B3f09",
    network: "polygon",
    tokenAddr: "",
    rpc: process.env.POLYGONMATIC as string,
    testnet: false,
    type: "native",
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 80001,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
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
    tokenAddr: "",
    rpc: process.env.MATIC_LINK as string,
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 250,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            name="fantom"
            symbol="FTM"
            size={20}
            alt={"Fantom (mainnet)"}
          />
        </div>
        <span className="text-[#121212]">Fantom (Mainnet)</span>
      </div>
    ),
    name: "Fantom (Mainnet)",
    symbol: "FTM",
    contractAddr: "0xf1BC5925641159a0d1388B17e3AB32D9416B3f09",
    network: "fantom",
    tokenAddr: "",
    rpc: fantom.rpcUrls.default,
    testnet: false,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 4002,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            name="fantom"
            symbol="FTM"
            size={20}
            alt={"Fantom (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Fantom (Testnet)</span>
      </div>
    ),
    name: "Fantom (Testnet)",
    symbol: "FTM",
    contractAddr: "0xf1BC5925641159a0d1388B17e3AB32D9416B3f09",
    network: "fantom",
    tokenAddr: "",
    rpc: fantomTestnet.rpcUrls.default,
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 31415,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            name="filecoin"
            symbol="FIL"
            size={20}
            alt={"Filecoin (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Filecoin Hyperspace (Testnet)</span>
      </div>
    ),
    name: "Filecoin Hyperspace (Testnet)",
    symbol: "TFIL",
    network: FileCoinHyperspace.network as string,
    tokenAddr: "",
    contractAddr: "0x5038557875a36b60371123bD8E725272e1905843",
    rpc: FileCoinHyperspace.rpcUrls.default,
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 338,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
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
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 1313161555,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
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
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
    rpc: AuroraTestnet.rpcUrls.default,
  },
  {
    value: 420,
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    testnet: true,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
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
    payment: {
      manual: true,
      auto: true,
    },
    rpc: OptimismGoerli.rpcUrls.default,
  },
  {
    value: 42261,
    type: "native",
    contractAddr: "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43",
    testnet: true,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
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
    payment: {
      manual: true,
      auto: true,
    },
    rpc: OasisEmeraldTestnet.rpcUrls.default,
  },
];
