import { createConnector } from "wagmi";
import { Chain } from "wagmi/chains";
import { ethers } from "ethers";

export const supported = [
  80001, 137, 43114, 43113, 10, 31415, 69, 1313161554, 1313161555, 42262, 42261, 25, 338
];

export const LinkConnector = createConnector((config) => ({
  id: "mail",
  name: "email link",
  type: "LinkConnector",

  async connect() {
    location.href = '/magic';        

    return {
      accounts: ["0x0000000000000000000000000000000000000000"] as readonly `0x${string}`[],
      chainId: 0
    };
  },

  async getProvider() {
    return ethers.getDefaultProvider() as ethers.providers.Provider;
  },

  async getSigner() {
    const provider = await this.getProvider();
    return new ethers.Wallet("0x0000000000000000000000000000000000000000", provider);
  },

  async getAccount() {
    return "0x0000000000000000000000000000000000000000" as `0x${string}`;
  },

  async getAccounts() {
    return ["0x0000000000000000000000000000000000000000"] as readonly `0x${string}`[];
  },

  async getChainId() {
    return 0;
  },

  async isAuthorized() {
    return true;
  },

  onChainChanged(chain: number | string) {
    // No-op for this connector
  },

  onDisconnect() {
    // No-op for this connector
  },

  onAccountsChanged(accounts: string[]) {
    // No-op for this connector
  },

  async disconnect() {
    // No-op for this connector
  },

  getBlockExplorerUrls(chain: Chain) {
    return chain.blockExplorers?.default?.url ? [chain.blockExplorers.default.url] : [];
  },

  isChainUnsupported(chainId: number) {
    return false;
  }
}));



