import { 
  mainnet, 
  sepolia,
  aurora,
  auroraTestnet, 
  avalancheFuji, 
  optimism, 
  optimismSepolia, 
  base, 
  baseSepolia, 
  arbitrum, 
  arbitrumSepolia, 
  polygon, 
  polygonMumbai, 
  optimismGoerli, 
  cronosTestnet, 
  cronos, 
  filecoin, 
  filecoinHyperspace, 
  polygonZkEvmTestnet, 
  avalanche, 
  gnosis, 
  fantom, 
  fantomTestnet 
} from 'wagmi/chains';
import { BiEnvelope, BiPhoneCall, BiUserCircle } from "react-icons/bi";
import CustomImg from "../../../components/elements/customImg";
import { explorer, token } from "../types";

export const chains = [
  mainnet,
  sepolia,
  aurora,
  auroraTestnet,
  avalancheFuji,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  polygon,
  polygonMumbai,
  optimismGoerli,
  cronosTestnet,
  cronos,
  filecoin,
  filecoinHyperspace,
  polygonZkEvmTestnet,
  avalanche,
  gnosis,
  fantom,
  fantomTestnet
];

export const tokenTrackers: explorer = {
  137: {
    name: "polygonscan",
    link: (hash: string) => `https://polygonscan.com/tx/${hash}`,
  },
  80001: {
    name: "polygonscan",
    link: (hash: string) => `https://mumbai.polygonscan.com/tx/${hash}`,
  },
  338: {
    name: "Cronos Explorer",
    link: (hash: string) => `https://cronos.org/explorer/testnet3/tx/${hash}`,
  },
  1313161555: {
    name: "Aurora Explorer",
    link: (hash: string) => `https://explorer.testnet.aurora.dev/tx/${hash}`,
  },
  10: {
    name: "Optimism Explorer",
    link: (hash: string) => `https://optimistic.etherscan.io/tx/${hash}`,
  },
  420: {
    name: "Optimism Explorer",
    link: (hash: string) => `https://goerli-optimistic.etherscan.io/tx/${hash}`,
  },
  534353: {
    name: "Scroll Alpha Explorer",
    link: (hash: string) => `https://blockscout.scroll.io/tx/${hash}`,
  },
  100: {
    name: "Gnosis Chain Explorer",
    link: (hash: string) => `https://gnosisscan.io/tx/${hash}`,
  },
  42261: {
    name: "Oasis Explorer",
    link: (hash: string) => `https://testnet.explorer.emerald.oasis.dev/tx/${hash}`,
  },
  3141: {
    name: "Hyperspace Explorer",
    link: (hash: string) => `https://hyperspace.filfox.info/en/tx/${hash}`,
  },
  250: {
    name: "Fantom Explorer",
    link: (hash: string) => `https://explorer.testnet.fantom.network/tx/${hash}`,
  },
  1442: {
    name: "Polygon zkEVM Explorer",
    link: (hash: string) => `https://explorer.public.zkevm-test.net/tx/${hash}`,
  },
  167002: {
    name: "Taiko L2 Explorer",
    link: (hash: string) => `https://l2explorer.hackathon.taiko.xyz/tx/${hash}`,
  },
  4002: {
    name: "Fantom Explorer",
    link: (hash: string) => `https://testnet.fantom.com/tx/${hash}`,
  },
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
          <CustomImg
            key={0}
            symbol={"xDAI"}
            name="xdai"
            size={20}
            alt={"Gnosis"}
          />
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
            key={2}
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
            key={3}
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
            key={4}
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
    network: polygonZkEvmTestnet.nativeCurrency.name as string,
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
            key={9}
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
            key={10}
            alt={"Filecoin (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Filecoin Hyperspace (Testnet)</span>
      </div>
    ),
    name: "Filecoin Hyperspace (Testnet)",
    symbol: "TFIL",
    network: filecoinHyperspace.nativeCurrency.name as string,
    tokenAddr: "",
    contractAddr: "0x2d9E5Cd304A84DC15Bb28749Cf0769A0bdc2CD6F",
    rpc: filecoinHyperspace.rpcUrls.default.http[0],
    testnet: true,
    blocktype: "evm",
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
            key={11}
            alt={"Cronos (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Cronos (Testnet)</span>
      </div>
    ),
    name: "Cronos (Testnet)",
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    symbol: "tcro",
    network: cronosTestnet.nativeCurrency.name as string,
    tokenAddr: "",
    rpc: cronosTestnet.rpcUrls.default.http[0],
    testnet: true,
    blocktype: "evm",
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
            key={14}
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
    network: auroraTestnet.nativeCurrency.name as string,
    tokenAddr: "",
    rpc: auroraTestnet.rpcUrls.default.http[0],
    testnet: true,
    blocktype: "evm",
    payment: {
      manual: true,
      auto: true,
    },
  },
  {
    value: 10,
    contractAddr: "0xfABBC18bDA50D1CA3fC1c3343A0EF26C453eAf32",
    testnet: false,
    blocktype: "evm",
    type: "native",
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol="op"
            name="optimism"
            key={15}
            size={20}
            alt={"Optimism"}
          />
        </div>
        <span className="text-[#121212]">Optimism</span>
      </div>
    ),
    name: "Optimism",
    symbol: "op",
    network: optimism.nativeCurrency.name as string,
    tokenAddr: "",
    payment: {
      manual: true,
      auto: true,
    },
    rpc: optimism.rpcUrls.default.http[0],
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
            key={15}
            size={20}
            alt={"Optimism (Testnet)"}
          />
        </div>
        <span className="text-[#121212]">Optimism (Testnet)</span>
      </div>
    ),
    name: "Optimism (Testnet)",
    symbol: "op",
    network: optimismGoerli.nativeCurrency.name as string,
    tokenAddr: "",
    rpc: optimismGoerli.rpcUrls.default.http[0],
    payment: {
      manual: true,
      auto: true,
    },
  },
];

export {
  avalanche,
  polygonMumbai,
  avalancheFuji,
  gnosis,
  fantom,
  fantomTestnet,
  polygon,
  optimism,
  auroraTestnet,
  aurora,
  filecoinHyperspace,
  optimismGoerli,
  polygonZkEvmTestnet,
};
