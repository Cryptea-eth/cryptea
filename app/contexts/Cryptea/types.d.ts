import { AbstractConnector } from "@web3-react/abstract-connector";
import * as ethers from "ethers";
import validator from 'validator';

type CrypteaDBUtil = string | number | boolean | object | undefined;

type CrypteaDBUtilNull = string | number | boolean | object | null;

export type CrypteaSub = {supports: string[], endpoint: string}

export interface CrypteaDBS {
  [index: string]: CrypteaSub;
  links: CrypteaSub;
  user: CrypteaSub;
  payments: CrypteaSub;
  views: CrypteaSub;
  templates: CrypteaSub;
}

type proto = {
  error: boolean;
  message: string;
} | unknown;

export type authenticable = "injected" | "walletconnect" | "mail" | '';

export type userDataTypes  = string | undefined | number | boolean;

export interface userData {
    id: userDataTypes,
    email: userDataTypes,
    username: userDataTypes,
    accounts: userDataTypes[],
    img: userDataTypes
}

export interface authData {
  web3Provider: Promise<any> | undefined;
  requestSignature: () => Promise<userData | undefined>;
  ethersProvider: ethers.ethers.providers.Web3Provider | undefined;
  isAuthenticating: Promise<boolean>;
}

export interface authenticateUserDefault {
  type: import("@wagmi/core").Connector<any, any, any> | undefined;
  signMessage?: string;
}

export interface authenticateUserExtended extends authenticateUserDefault {
  isConnected: boolean;
  isSuccess: boolean;
  address: string | undefined;
  signMessageAsync: (
    args?: import("@wagmi/core").SignMessageArgs | undefined
  ) => Promise<string>;
  connectAsync: (
    args?: Partial<import("@wagmi/core").ConnectArgs> | undefined
  ) => Promise<ConnectResult<Provider>>;
}

export interface AuthContext {
  user?: userData | undefined;
  isAuthenticated?: boolean;
  update?: (e: userData | undefined) => any;
}

export interface mainAppManager extends AuthContext {
  signer:
    | import("@wagmi/core").FetchSignerResult<import("@wagmi/core").Signer>
    | undefined;
  account: string | null | undefined;
  chainId: number | undefined;
  logout: () => Promise<void>;
  isAuthenticating: boolean;
  connectors: import("@wagmi/core").Connector<any, any, any>[];
  connectWall: (
    type: import("@wagmi/core").Connector<any, any, any>
  ) => Promise<
    import("@wagmi/core").ConnectResult<import("@wagmi/core").Provider>
  >;
  connected: boolean;
  AuthAddress: (
    address: string,
    signature: string
  ) => Promise<userData | undefined>;
  validator: typeof validator;
  authenticateUser: (
    obj: authenticateUserDefault
  ) => Promise<userData | undefined>;
  authenticate: (e?: boolean) => void;
}

declare global {
  interface Window {
    jstz: any
  }

  interface String {
    get(column: string, fresh?: boolean, id?: number | string): Promise<CrypteaDBUtilNull>;

    delete(id?: number): Promise<proto>;

    update(
      item: object,
      id?: number
    ): Promise<proto>;

    save(item: object): Promise<proto>;
  }
}

export {};
