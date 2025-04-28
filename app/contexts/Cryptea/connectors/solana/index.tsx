import { Wallet } from '@rainbow-me/rainbowkit';
import { chains } from "../chains";
import { explorer, token } from "../../types";
import CustomImg from "../../../../components/elements/customImg";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { getPhantomConnector } from "./connectors";

const phantom = new PhantomWalletAdapter();

export const PhantomWallet = ({ chains }: { chains: any }): Wallet => ({
  id: "phantom",
  name: phantom.name,
  iconUrl: phantom.icon,
  iconBackground: "#5345ba",
  downloadUrls: {
    chrome: "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
    ios: "https://apps.apple.com/app/phantom-solana-wallet/id1598432977",
    android: "https://play.google.com/store/apps/details?id=app.phantom",
    qrCode: "https://phantom.app/download",
  },
  mobile: {
    getUri: (uri: string) => uri,
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: "https://phantom.app",
      steps: [
        {
          description: "We recommend putting Phantom on your home screen for faster access to your wallet.",
          step: "install",
          title: "Open the Phantom app",
        },
        {
          description: "After you scan, a connection prompt will appear for you to connect your wallet.",
          step: "scan",
          title: "Tap the scan button",
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: "https://phantom.app",
      steps: [
        {
          description: "We recommend pinning Phantom to your taskbar for quicker access to your wallet.",
          step: "install",
          title: "Install the Phantom extension",
        },
        {
          description: "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          step: "create",
          title: "Create or Import a Wallet",
        },
        {
          description: "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          step: "refresh",
          title: "Refresh your browser",
        },
      ],
    },
  },
  createConnector: () => () => getPhantomConnector({ chains }),
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
