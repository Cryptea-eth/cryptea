import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chains } from "./chains";
import UAuth from "@uauth/js";
import { Connector, Chain, UserRejectedRequestError, ProviderRpcError } from "wagmi";
import * as ethers from "ethers";
import Router from 'next/router';
import analytics from "../../../../analytics";
import { AuthAddress, message } from "../Auth";


export const supported = [
  80001, 137, 43114, 43113, 10, 31415, 69, 1313161554, 1313161555, 42262, 42261, 25, 338
];

// const connectors = [
//   new CoinbaseWalletConnector({
//     chains,
//     options: {
//       appName: "Cryptea",
//     },
//   }),
//   new WalletConnectConnector({
//     chains,
//     options: {
//       qrcode: true,
//     },
//   }),
//   new InjectedConnector({
//     chains,
//     options: {
//       name: "Cryptea",
//       shimDisconnect: true,
//     },
//   }),
// ];

export const uauth_connector = new UAuth({
  clientID: process.env.UDCLIENT || '',
  redirectUri: process.env.UDREDIRECT || "http://localhost:3000",
  scope: "openid wallet",
})


export class UDConnector extends Connector<any, any, any> {
  readonly id = "UD";
  readonly name = "Unstoppable domains";
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

    try {
      const authorization = await uauth_connector.loginWithPopup();

      if (Boolean(authorization)) {

        const { signature, message } =
          authorization.idToken.verified_addresses[1].proof;

        const main = await AuthAddress({
          signature,
          message,
          address: authorization.idToken.wallet_address as string,
        });

        if (Boolean(main)) {

          analytics.track("UD Auth");

            const email = await "user".get("email");


              if (!Boolean(email)) {
                
                location.href = '/signup'

              } else {
                if (String(email).length) {

                  location.href = "/dashboard";

                } else {

                  location.href = "/signup";

                }
            }
        }
      } else {
        throw "Something went wrong please try again";
       
      }
    } catch (error) {
      // console.log(error);
      throw "Something went wrong please try again";
    }

    // await delay(4000);

    return {
      account: "" as `0x${string}`,
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
    return "" as `0x${string}`;
  }

  async getChainId() {
    return 0;
  }

  async disconnect() {}
}


export class LinkConnector extends Connector<any, any, any> {
  readonly id = "mail";
  readonly name = "email link";
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


    location.href = '/magic';        

    return {
      account: "" as `0x${string}`,
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
    return "" as `0x${string}`;
  }

  async getChainId() {
    return 0;
  }

  async disconnect() {}

}



