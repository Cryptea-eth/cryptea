import CustomImg from "../../../../components/elements/customImg";
import { explorer, token } from "../../types";

export const TronCryptoList: token<{
  solidity: string;
  main: string;
}>[] = [
  {
    value: 1131,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol={"tron"}
            name="Tron"
            size={20}
            key={12}
            alt={"Tron (mainnet)"}
          />
        </div>
        <span className="text-[#121212]">Tron</span>
      </div>
    ),
    name: "Tron",
    symbol: "TRX",
    contractAddr: "",
    network: "Tron Mainnet",
    blocktype: "trx",
    tokenAddr: "",
    rpc: {
      solidity: "https://api.trongrid.io",
      main: "https://api.trongrid.io",
    },
    testnet: false,
    type: "native",
    payment: {
      manual: false,
      auto: false,
    },
  },
  {
    value: 1130,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol={"tron"}
            name="Tron"
            size={20}
            key={12}
            alt={"Tron (testnet)"}
          />
        </div>
        <span className="text-[#121212]">Tron</span>
      </div>
    ),
    name: "Tron",
    symbol: "TRX",
    contractAddr: "",
    network: "Tron Testnet",
    blocktype: "trx",
    tokenAddr: "",
    rpc: {
      solidity: "https://api.nileex.io",
      main: "https://api.nileex.io",
    },
    testnet: true,
    type: "native",
    payment: {
      manual: false,
      auto: false,
    },
  },
  {
    value: 1132,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol={"usdt"}
            name="USDT"
            size={20}
            key={12}
            alt={"USDT (TRC20)"}
          />
        </div>
        <span className="text-[#121212]">USDT (TRC20)</span>
      </div>
    ),
    name: "USDT",
    symbol: "USDT",
    contractAddr: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    network: "trc20",
    blocktype: "trx",
    tokenAddr: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    rpc: {
      solidity: process.env.TRON || "https://api.trongrid.io",
      main: process.env.TRON || "https://api.trongrid.io",
    },
    testnet: false,
    type: "non-native",
    payment: {
      manual: false,
      auto: false,
    },
  },
];

export const tronTokenTrackers: explorer = {
  1130: {
    name: "Tron Nile Explorer",
    link: (hash: string) => "https://nile.tronscan.org/#/transaction/" + hash,
  },

  1131: {
    name: "Tron Mainnet Explorer",
    link: (hash: string) => `https://tronscan.org/#/transaction/${hash}`,
  },

  1132: {
    name: "Tron Mainnet Explorer",
    link: (hash: string) => `https://tronscan.org/#/transaction/${hash}`,
  },
};