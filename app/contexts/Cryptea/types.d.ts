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

export type configType = import("@wagmi/core").ConnectResult<
  import("@wagmi/core").Provider
>;

export interface authenticateUserExtended extends authenticateUserDefault {
  isConnected: boolean;
  isSuccess: boolean;
  address: string | undefined;
  mainx: boolean;
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

export interface AuthAddressType {
  address: string;
  signature: string;
  message: string | number;
}


export interface mainAppManager extends AuthContext {
  signer:
    | import("@wagmi/core").FetchSignerResult<import("@wagmi/core").Signer>
    | undefined;
  account: string | null | undefined;
  chainId: number | undefined;
  logout: () => Promise<void>;
  isAuthenticating: boolean;
  isTokenAuthenticated: boolean | undefined;
  connectors: import("@wagmi/core").Connector<any, any, any>[];
  connectWall: (
    type: import("@wagmi/core").Connector<any, any, any>
  ) => Promise<
    import("@wagmi/core").ConnectResult<import("@wagmi/core").Provider>
  >;
  connected: boolean;
  AuthAddress: (data: AuthAddressType) => Promise<userData | undefined>;
  validator: typeof validator;
  authenticateUser: (
    obj: authenticateUserDefault
  ) => Promise<userData | undefined>;
  authenticate: (e?: boolean) => void;
}

type token = { value: string | number; label: string };

type pdata = {
  price: number;
  type: "onetime" | "sub";
};


export interface PaymentContext {
  userD?: { [index: string]: any };
  setUserD?: React.Dispatch<
    React.SetStateAction<{
      [index: string]: any;
    }>
  >;
  token?: token;
  setToken?: React.Dispatch<React.SetStateAction<token>>;
  paymentData?: pdata;
  setPaymentData?: React.Dispatch<React.SetStateAction<pdata | undefined>>;
  data?: any;
  setData?: React.Dispatch<any>;
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  beginSub?: () => void;
  beginOne?: () => void;
  reset?: () => void;
  pemail?: string[];
  setPemail?: React.Dispatch<React.SetStateAction<string[]>>;
  loadingText?: string;
  setLoadingText?: React.Dispatch<React.SetStateAction<string>>;
  transferSuccess?: boolean;
  setTransferSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  transferFail?: boolean;
  setTransferFail?: React.Dispatch<React.SetStateAction<boolean>>;
  failMessage?: string;
  setFailMessage?: React.Dispatch<React.SetStateAction<string>>;
  hash?: string;
  setHash?: React.Dispatch<React.SetStateAction<string>>;
  interval?: string;
  options?: { value: string | number; label: string }[];
  setTinterval?: React.Dispatch<React.SetStateAction<string>>;
  is500?: boolean;
  setIs500?: React.Dispatch<React.SetStateAction<boolean>>;
  initMain?: (
    price: number,
    type?: "sub" | "onetime"
  ) => Promise<void>;
  amount?: string | number;
  setAmount?: React.Dispatch<React.SetStateAction<string | number>>;
  subCheck?: boolean;
  setSubCheck?: React.Dispatch<React.SetStateAction<boolean>>;
  eSubscription?: string[];
  setESubscription?: React.Dispatch<React.SetStateAction<string[]>>;
  setSigner?: React.Dispatch<React.SetStateAction<any>>;
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
