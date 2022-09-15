import { Web3ReactProvider } from "@web3-react/core";
import { createContext } from "react";
import web3 from "web3";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';
import { injected, walletconnect } from "./connectors";
import * as ethers from "ethers";

export type authenticable = "injected" | "walletconnect" | "mail";

export type userDataTypes  = string | null | undefined | number | boolean;

export interface userData {
    email: userDataTypes,
    username: userDataTypes,
    accounts: userDataTypes[],
    img: userDataTypes
}

export interface authData {
  chainId: Promise<string | number> | undefined;
  web3Provider: Promise<any> | undefined;
  ethersProvider: ethers.ethers.providers.Web3Provider | undefined;
  isAuthenticated: boolean;
}

export interface authenticateUserDefault {
  type: authenticable;
  message?: string;
}

export interface authenticateUserExtended extends authenticateUserDefault {
  activate: (
    connector: AbstractConnector,
    onError?: ((error: Error) => void) | undefined,
    throwErrors?: boolean | undefined
  ) => Promise<void>;
  connector: AbstractConnector | undefined;
  account: string | null | undefined;
}

export interface AuthContext {
  usAuth?: ({
    type,
    message,
    activate,
    account,
    connector,
  }: authenticateUserExtended) => Promise<userData>;
  useAuthData?: () => authData;
  api_base?: string;
  user?: userData | undefined;
}

const getLibrary = (provider: any) => {
  return new web3(provider);
};

const API:string = 'https://ap.cryptea.me';

let user:userData | undefined;

const AuthAddress = async (address: string) => {
   const userx = await axios.post(`${API}/login/walletAuth`, {
        data: {
            address
        }
    });

    if (userx.data.error) {
        const { email, img, accounts, username }: { username: string, img: string,email : string, accounts: string[] } = userx.data.data;

        localStorage.setItem('userToken', userx.data.token);

        user = {
          email,
          username,
          accounts,
          img,
        };

        return user;

    }else{
        throw 'Something Went Wrong Error 01'
    }
};

export const useAuthData = (): authData => {
  const { connector, active } = useWeb3React();

  let web3Provider:any;
 let chainId:Promise<string | number> | undefined 
 let ethersProvider: undefined | ethers.ethers.providers.Web3Provider; 

  if(connector){

  connector.getProvider().then((ww) => {
     web3Provider = ww
     ethersProvider = new ethers.providers.Web3Provider(web3Provider);
  });

  chainId = connector?.getChainId();
 }

  return {
    chainId,
    web3Provider,
    ethersProvider,
    isAuthenticated: active,
  };
};


export const usAuth = async ({
  type = "injected",
  message,
  activate,
  account,
  connector,
}: authenticateUserExtended): Promise<userData> => {
  switch (type) {
    case "injected":
      await activate(injected);
      break;
    case "walletconnect":
      await activate(walletconnect);
      break;
  }

  const web3Provider = await (
    connector ?? { getProvider: () => undefined }
  ).getProvider();

  return await AuthAddress(String(account));
};


export const Auth = createContext<AuthContext>({
    
});

export const CrypteaAuth = ({children}: {children: JSX.Element}) => {

    const context: AuthContext = {
      usAuth,
      useAuthData,
      api_base: API,
      user
    };

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Auth.Provider value={context}>
                {children}
            </Auth.Provider>
        </Web3ReactProvider>
    )
}