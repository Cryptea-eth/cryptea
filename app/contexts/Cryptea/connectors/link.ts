import { createConnector } from "wagmi";
import { ethers } from "ethers";
import { Chain, mainnet } from "wagmi/chains";

export const LinkConnector = createConnector((config) => ({
  id: "mail",
  name: "Email link",
  type: "email",
  async connect(parameters) {
    return {
      accounts: ["0x0000000000000000000000000000000000000000"],
      chainId: 1,
    };
  },
  async getAccounts(): Promise<readonly `0x${string}`[]> {
    return ["0x0000000000000000000000000000000000000000"];
  },
  async getChainId(): Promise<number> {
    return 1;
  },
  async getProvider(): Promise<any> {
    return new ethers.providers.Web3Provider(window.ethereum as any);
  },
  async isAuthorized(): Promise<boolean> {
    return false;
  },
  async switchChain(parameters) {
    return mainnet;
  },
  async disconnect() {
    // No-op
  },
  onAccountsChanged(accounts) {
    // No-op
  },
  onChainChanged(chain) {
    // No-op
  },
  onDisconnect(error) {
    // No-op
  },
})); 