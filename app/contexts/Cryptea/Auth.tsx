import { Web3ReactProvider } from "@web3-react/core";
import { createContext, useContext, useEffect, useState } from "react";
import web3 from "web3";
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
import Loader from "../../components/elements/loader";
import { crypteaCon } from "./icon";

const getLibrary = (provider: any) => {
  return new web3(provider);
};

let user:userData | undefined;

let message = 'Welcome to Cryptea';

let isAuth = false;


export const AuthAddress = async ({address, signature, message }: AuthAddressType) => {

  try {
    
      const userx = await post_request(`/login/walletAuth`, {
        address,
        signature,
        message,
        tz: window.jstz.determine().name(),
      });

      
      if(!userx.data.error){

        const { email, img, accounts, username, id, email_verified_at }: { username: string, img: string,email : string, accounts: string[], id: number|string, email_verified_at: any } = userx.data.data;

         user = {
           id,
           email,
           username,
           accounts,
           img,
           email_verified_at,
         };

         localStorage.setItem('user', JSON.stringify(user));

         localStorage.setItem("userToken", userx.data.token);

         isAuth = true;

      }else{
          throw "Invalid Login Details";
      }
      
  }catch (err) {
      const error = err as AxiosError;
      console.log(err);
      if (error.response) {
        throw "Invalid Login Details";
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
      
    }
  }
};

export const AuthContextMain = createContext<AuthContext>({});

export const CrypteaProvider = ({children}: {children: JSX.Element}) => {
  const [isAuthenticated, setAuth] = useState<boolean | undefined>();

  const [context, setContext] = useState<userData | undefined>(user);

  const [genLoader, setGenLoader] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (
      localStorage.getItem("userToken") !== null &&
      router.pathname.indexOf("/settings") == -1 &&
      router.pathname.indexOf("/verify/email") == -1
    ) {
      "user".get("*", true).then((cacheUser: any) => {

        if (
          !Boolean(cacheUser?.email_verified_at) &&
          Boolean(cacheUser?.email)
        ) {
          router.push("/verify/email");

          setGenLoader(false);
        } else {
          setGenLoader(false);
        }
      });
    } else {
      setGenLoader(false);
    }
  }, [router])


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
          {genLoader ? <Loader /> : children}
        </AuthContextMain.Provider>
      </WagmiConfig>
    </Web3ReactProvider>
  );
}

