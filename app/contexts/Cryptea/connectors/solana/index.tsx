import { chains } from "../chains";
import { explorer, token } from "../../types";
import CustomImg from "../../../../components/elements/customImg";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { PhantomConnector } from "./connectors";

const phantom = new PhantomWalletAdapter();

export const PhantomWallet = ({ chains }: { chains: any }) => ({
  id: "phantom",
  name: phantom.name,
  iconUrl: phantom.icon,
  iconBackground: "#5345ba",
  createConnector: () => {
    const connector = new PhantomConnector({ chains, options: {} });

    return {
      connector,
    };
  },
});

export const SolanaCryptoList: token[] = [
  {
    value: 1122112211223,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol={"solana"}
            name="Solana"
            size={20}
            key={12}
            alt={"Solana (mainnet)"}
          />
        </div>
        <span className="text-[#121212]">Solana</span>
      </div>
    ),
    name: "Solana",
    symbol: "SOL",
    contractAddr: "",
    network: "Solana Mainnet",
    blocktype: "sol",
    tokenAddr: "",
    rpc: process.env.SOLANA_MAINNET as string,
    testnet: false,
    type: "native",
    payment: {
      manual: true,
      auto: false,
    },
  },
  {
    value: 1122112211224,
    label: (
      <div className="items-center flex">
        <div className="h-[20px] mr-2 relative w-[20px]">
          <CustomImg
            symbol={"solana"}
            name="Solana"
            size={20}
            key={13}
            alt={"Solana (devnet)"}
          />
        </div>
        <span className="text-[#121212]">Solana (Devnet)</span>
      </div>
    ),
    name: "Solana (Devnet)",
    symbol: "SOL",
    contractAddr: "",
    network: "Solana Devnet",
    tokenAddr: "",
    rpc: process.env.SOLANA_DEVNET as string,
    testnet: true,
    blocktype: "sol",
    type: "native",
    payment: {
      manual: true,
      auto: false,
    },
  },
];

export const solanatokenTrackers: explorer = {
  1122112211223: {
    name: "Solana Explorer",
    link: (hash: string) => "https://solscan.io/tx/" + hash,
  },

  1122112211224: {
    name: "Solana Devnet Explorer",
    link: (hash: string) => `https://solscan.io/tx/${hash}?cluster=devnet`,
  },
};
