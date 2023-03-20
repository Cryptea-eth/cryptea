import {
  configureChains,
  Chain,
} from "wagmi";
import {
  avalanche,
  polygonMumbai,
  avalancheFuji,
  gnosis,
  fantom,
  fantomTestnet,
  scrollTestnet,
  polygon,
  optimism,
  auroraTestnet,
  aurora,
  filecoinHyperspace,
  optimismGoerli,
  polygonZkEvmTestnet,
} from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import CustomImg from "../../../components/elements/customImg";
import { BiEnvelope, BiPhoneCall, BiUserCircle } from "react-icons/bi";
import { explorer, token } from "../types";
import { SolanaCryptoList, solanatokenTrackers } from "./solana";


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
    public: {
      http: ["https://emerald.oasis.dev"],
    },
    default: {
      http: ["https://emerald.oasis.dev"],
    },
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
    public: {
      http: ["https://testnet.emerald.oasis.dev/"],
    },
    default: {
      http: ["https://testnet.emerald.oasis.dev/"],
    },
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
    public: {
      http: ["https://evm.cronos.org"],
    },
    default: {
      http: ["https://evm.cronos.org"],
    },
  },
  blockExplorers: {
    default: { name: "cronos", url: "https://cronos.org/explorer" },
  },
  testnet: false,
};

export const TaikoTest: Chain = {
  id: 167002,
  name: "Taiko",
  network: "askja",
  nativeCurrency: {
    name: "Taiko Eth",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    public: {
      http: ["https://l2rpc.hackathon.taiko.xyz"],
    },
    default: {
      http: ["https://l2rpc.hackathon.taiko.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "L2 Explorer",
      url: "https://l2explorer.hackathon.taiko.xyz",
    },
  },
  testnet: true,
};

export const MantleTest: Chain = {
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle",
  nativeCurrency: {
    name: "mantle BIT",
    decimals: 18,
    symbol: "BIT",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "mantle testnet explorer",
      url: "https://explorer.testnet.mantle.xyz",
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
    public: {
      http: ["https://evm-t3.cronos.org"],
      webSocket: ["wss://cronos-testnet-3.crypto.org:8546"],
    },
    default: {
      http: ["https://evm-t3.cronos.org"],
      webSocket: ["wss://cronos-testnet-3.crypto.org:8546"],
    },
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
    polygon,
    polygonZkEvmTestnet,
    polygonMumbai,
    gnosis,
    scrollTestnet,
    avalanche,
    avalancheFuji,
    MantleTest,
    CronosTest,
    Cronos,
    aurora,
    auroraTestnet,
    optimism,
    optimismGoerli,
    TaikoTest,
    OasisEmerald,
    OasisEmeraldTestnet,
    filecoinHyperspace,
    fantom,
    fantomTestnet,
  ],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain: Chain) => {
        return { http: chain.rpcUrls.default.http[0] };
      },
    }),
    publicProvider(),
  ]
);

export const tokenTrackers: explorer = {
  137: {
    name: "polygonscan",
    link: (hash: string) => "https://polygonscan.com/tx/" + hash,
  },
  80001: {
    name: "polygonscan",
    link: (hash: string) => "https://mumbai.polygonscan.com/tx/" + hash,
  },
  338: {
    name: "Cronos Explorer",
    link: (hash: string) => "https://cronos.org/explorer/testnet3/tx/" + hash,
  },
  1313161555: {
    name: "Aurora Explorer",
    link: (hash: string) => "https://explorer.testnet.aurora.dev/tx/" + hash,
  },
  420: {
    name: "Optimism Explorer",
    link: (hash: string) => "https://goerli-optimistic.etherscan.io/tx/" + hash,
  },
  534353: {
    name: "Scroll Alpha Explorer",
    link: (hash: string) => "https://blockscout.scroll.io/tx/" + hash,
  },
  100: {
    name: "Gnosis Chain Explorer",
    link: (hash: string) => "https://gnosisscan.io/tx/" + hash,
  },
  42261: {
    name: "Oasis Explorer",
    link: (hash: string) =>
      "https://testnet.explorer.emerald.oasis.dev/tx/" + hash,
  },
  3141: {
    name: "Hyperspace Explorer",
    link: (hash: string) => "https://hyperspace.filfox.info/en/tx/" + hash,
  },
  250: {
    name: "Fantom Explorer",
    link: (hash: string) =>
      "https://explorer.testnet.fantom.network/tx/" + hash,
  },
  1442: {
    name: "Polygon zkEVM Explorer",
    link: (hash: string) => "https://explorer.public.zkevm-test.net/tx/" + hash,
  },
  167002: {
    name: "Taiko L2 Explorer",
    link: (hash: string) => "https://l2explorer.hackathon.taiko.xyz/" + hash,
  },
  4002: {
    name: "Fantom Explorer",
    link: (hash: string) => "https://testnet.fantom.com/tx/" + hash,
  },
  ...solanatokenTrackers,
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
    value: 100,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg symbol={"xDAI"} name="xdai" size={20} alt={"Gnosis"} />
        </div>
        <span className="text-[#121212]">Gnosis Chain (xDAI)</span>
      </div>
    ),
    name: "XDAI (Mainnet)",
    symbol: "xDAI",
    blocktype: "evm",
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    network: "Gnosis Chain",
    tokenAddr: "",
    rpc: gnosis.rpcUrls.default.http[0],
    testnet: false,
    type: "native",
    payment: {
      manual: true,
      auto: true,
    },
  },
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
        <span className="text-[#121212]">Polygon</span>
      </div>
    ),
    name: "Polygon (Mainnet)",
    symbol: "matic",
    blocktype: "evm",
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
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
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    network: "polygon maticmum",
    tokenAddr: "",
    blocktype: "evm",
    rpc: process.env.MATIC_LINK as string,
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },

  {
    value: 1442,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            name="Polygon"
            symbol="ETH"
            size={20}
            alt={"Polygon zkEvm"}
          />
        </div>
        <span className="text-[#121212]">Polygon ZkEvm</span>
      </div>
    ),
    name: "Polygon zkEVM (Testnet)",
    symbol: "ETH",
    useSymbol: true,
    network: polygonZkEvmTestnet.network as string,
    tokenAddr: "",
    blocktype: "evm",
    contractAddr: "0xf766074626299B335A8C9694faED139Dc51BbaD3",
    rpc: polygonZkEvmTestnet.rpcUrls.default.http[0],
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 534353,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            name="scroll"
            symbol="ETH"
            size={20}
            alt={"Scroll Alpha"}
          />
        </div>
        <span className="text-[#121212]">Scroll Alpha</span>
      </div>
    ),
    name: "Scroll Alpha (Testnet)",
    symbol: "ETH",
    network: scrollTestnet.network as string,
    tokenAddr: "",
    useSymbol: true,
    blocktype: "evm",
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    rpc: scrollTestnet.rpcUrls.default.http[0],
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 167002,
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            name="taiko"
            symbol="ETH"
            size={20}
            alt={"Taiko (testnet)"}
          />
        </div>
        <span className="text-[#121212]">Taiko</span>
      </div>
    ),
    name: "Taiko (Testnet)",
    symbol: "ETH",
    useSymbol: true,
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    network: "Taiko L2 testnet",
    tokenAddr: "",
    blocktype: "evm",
    rpc: TaikoTest.rpcUrls.default.http[0],
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  // {
  //   value: 5001,
  //   type: "native",
  //   label: (
  //     <div className="items-center flex">
  //       <div className="h-[20px] mr-2 relative w-[20px]">
  //         <CustomImg
  //           name="mantle"
  //           symbol="BIT"
  //           size={20}
  //           alt={"Mantle (testnet)"}
  //         />
  //       </div>
  //       <span className="text-[#121212]">Mantle</span>
  //     </div>
  //   ),
  //   name: "Mantle (Testnet)",
  //   symbol: "BIT",
  //   contractAddr: "",
  //   network: "Mantle testnet",
  //   tokenAddr: "",
  //   blocktype: "evm",
  //   rpc: MantleTest.rpcUrls.default.http[0],
  //   testnet: true,
  //   payment: {
  //     manual: true,
  //     auto: true,
  //   },
  // },
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
        <span className="text-[#121212]">Fantom Opera</span>
      </div>
    ),
    name: "Fantom (Mainnet)",
    symbol: "FTM",
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    network: "fantom",
    tokenAddr: "",
    blocktype: "evm",
    rpc: fantom.rpcUrls.default.http[0],
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
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    network: "fantom",
    tokenAddr: "",
    blocktype: "evm",
    rpc: fantomTestnet.rpcUrls.default.http[0],
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
    network: filecoinHyperspace.network as string,
    tokenAddr: "",
    blocktype: "evm",
    contractAddr: "0xcC23191FA4C294ca9E32702fB8eab6191d4E85f9",
    rpc: filecoinHyperspace.rpcUrls.default.http[0],
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
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    symbol: "tcro",
    blocktype: "evm",
    network: CronosTest.network as string,
    tokenAddr: "",
    rpc: CronosTest.rpcUrls.default.http[0],
    testnet: true,
    payment: {
      manual: true,
      auto: true,
    },
  },
  ...SolanaCryptoList,
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
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    symbol: "aurora",
    network: auroraTestnet.network as string,
    tokenAddr: "",
    testnet: true,
    blocktype: "evm",
    payment: {
      manual: true,
      auto: true,
    },
    rpc: auroraTestnet.rpcUrls.default.http[0],
  },
  {
    value: 420,
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    testnet: true,
    blocktype: "evm",
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
    network: optimismGoerli.network as string,
    tokenAddr: "",
    payment: {
      manual: true,
      auto: true,
    },
    rpc: optimismGoerli.rpcUrls.default.http[0],
  },
  {
    value: 42261,
    type: "native",
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
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
    blocktype: "evm",
    symbol: "rose",
    network: OasisEmeraldTestnet.network as string,
    tokenAddr: "",
    payment: {
      manual: true,
      auto: true,
    },
    rpc: OasisEmeraldTestnet.rpcUrls.default.http[0],
  },
];

export {
  avalanche,
  polygonMumbai,
  avalancheFuji,
  gnosis,
  fantom,
  fantomTestnet,
  scrollTestnet,
  polygon,
  optimism,
  auroraTestnet,
  aurora,
  filecoinHyperspace,
  optimismGoerli,
  polygonZkEvmTestnet,
};