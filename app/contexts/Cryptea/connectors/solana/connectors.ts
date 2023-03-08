import * as web3 from "@solana/web3.js";
import {
  Connector,
  Chain,
} from "wagmi";
import { chains } from "../chains";
import { token } from "../../types";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ethers } from "ethers";
import { AuthAddress, message } from "../../Auth";
import analytics from "../../../../../analytics";
const bs58 = require("bs58");

const phantom = new PhantomWalletAdapter();

export class PhantomConnector extends Connector<any, any, any> {
  readonly id = "phantom";
  readonly name = phantom.name;

  readonly ready = true;

  constructor(config: { chains?: Chain[]; options: any }) {
    super(config);
  }

  async getProvider() {
    return ethers.getDefaultProvider();
  }

  async connect(config?: { chainId?: number | undefined } | undefined) {
    this.emit("message", {
      type: "connecting",
    });

    if (!phantom.connected) {
      await phantom.connect();
    }

    const account = phantom.publicKey?.toBase58() || "";

    const signature = await phantom.signMessage(Buffer.from(message));

    const encodeSign = bs58.encode(signature);

    const main = await AuthAddress({
      address: account,
      signature: encodeSign,
      message,
      blocktype: "sol",
    });

    if (Boolean(main)) {
      analytics.track("Auth");

      const email = await "user".get("email");

      if (!Boolean(email)) {
        location.href = "/signup";
      } else {
        if (String(email).length) {
          location.href = "/dashboard";
        } else {
          location.href = "/signup";
        }
      }
    }

    return {
      account,
      chain: { id: 0, unsupported: false },
      provider: undefined,
    };
  }

  onChainChanged(chain: number | string) {}

  onDisconnect(error: Error) {}

  getBlockExplorerUrls(chain: Chain) {
    return [];
  }

  isChainUnsupported(chainId: number) {
    return false;
  }

  onAccountsChanged(accounts: string[]) {}

  async isAuthorized() {
    return true;
  }

  async getSigner(config?: { chainId?: number }) {
    return "";
  }

  async getAccount() {
    const account = phantom.publicKey?.toBase58() || "";

    return account;
  }

  async getChainId() {
    return 0;
  }

  async disconnect() {
    await phantom.disconnect();
  }
}
