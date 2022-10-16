import { Web3ReactProvider } from "@web3-react/core";
import { createContext, useContext, useEffect, useState } from "react";
import web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { AxiosError } from 'axios';
import connectors from "./connectors";
import { webSocketProvider } from './connectors/chains';
import * as ethers from "ethers";
import {
  AuthAddressType,
  AuthContext,
  authData,
  authenticateUserDefault,
  authenticateUserExtended,
  configType,
  userData,
} from "./types";
import './DB';
import { post_request } from "./requests";
import { createClient, useAccount, WagmiConfig } from "wagmi";
import { useRouter } from "next/router";

const getLibrary = (provider: any) => {
  return new web3(provider);
};

let user:userData | undefined;

let message = 'Welcome to Cryptea';

let isAuth = false;


export const AuthAddress = async ({address, signature, message }: AuthAddressType) => {

  try {
    
      const userx = await post_request(`/login/walletAuth`, {
            address, signature, message 
      });

      
      if(!userx.data.error){

        const { email, img, accounts, username, id }: { username: string, img: string,email : string, accounts: string[], id: number|string } = userx.data.data;


         user = {
           id,
           email,
           username,
           accounts,
           img,
         };

         localStorage.setItem('user', JSON.stringify(user));

         localStorage.setItem("userToken", userx.data.token);

         isAuth = true;

      }else{
          throw "Invalid Login Dextails";
      }
      
  }catch (err) {
      const error = err as AxiosError;
      console.log(err);
      if (error.response) {
        throw "Invalid Logxin Details";
      }
    }
  return user;
};

let config: undefined | configType;

export const AuthUser = async ({
  type,
  signMessage,
  isConnected,
  address,
  signMessageAsync,
  isSuccess,
  connectAsync,
  mainx,
}: authenticateUserExtended): Promise<userData | undefined> => {
  if (signMessage !== undefined) message = signMessage;

  if (!isConnected) {
    config = await connectAsync({ connector: type });
  }

  if (!mainx) {

    const data = await signMessageAsync({ message });

    if (data.length) {

      try {
        const main = await AuthAddress({
          signature: data,
          message,
          address: (address || config?.account) as string,
        });
        return main;
      } catch (err) {
        console.log(err);
        throw "Something went wrong, please try again";
      }
    } else {
      console.log(isConnected, data.length);
    }
  }
};

export const AuthContextMain = createContext<AuthContext>({});

export const CrypteaProvider = ({children}: {children: JSX.Element}) => {
  const [isAuthenticated, setAuth] = useState<boolean | undefined>();

  const [context, setContext] = useState<userData | undefined>(user);


  useEffect(() => {
    if (localStorage.getItem('userToken') !== null) {
        setAuth(true);
    }else{
       setAuth(false)
    }
  })

  const client = createClient({
    autoConnect: true,
    connectors,
    webSocketProvider,
    provider: ethers.getDefaultProvider(),
  });

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WagmiConfig client={client}>
        <AuthContextMain.Provider
          value={{
            user: context,
            isAuthenticated,
            update: (e: userData | undefined) => setContext(e),
          }}
        >
          {children}
        </AuthContextMain.Provider>
      </WagmiConfig>
    </Web3ReactProvider>
  );
}

