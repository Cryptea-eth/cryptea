import { Web3ReactProvider } from "@web3-react/core";
import { createContext, useContext, useEffect, useState } from "react";
import web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { AxiosError } from 'axios';
import connectors from "./connectors";
import { webSocketProvider } from './connectors/chains';
import * as ethers from "ethers";
import { AuthContext, authData, authenticateUserDefault, authenticateUserExtended, userData } from "./types";
import './DB';
import { post_request } from "./requests";
import router  from "next/router";
import { createClient, useAccount, WagmiConfig } from "wagmi";

const getLibrary = (provider: any) => {
  return new web3(provider);
};

let user:userData | undefined;

let message = 'Welcome to Cryptea';

let isAuth = false;

export const AuthAddress = async (address: string, signature: string) => {

  try {
    
      const userx = await post_request(`/login/walletAuth`, {
                address, signature
      });


      console.log(userx, 'Here')

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

export const AuthUser = async ({
  type,
  signMessage,
  isConnected,
  address,
  signMessageAsync,
  isSuccess,
  connectAsync
}: authenticateUserExtended): Promise<userData | undefined> => {
  

  if (signMessage !== undefined) message = signMessage;

  if(!isConnected){
     await connectAsync({ connector: type });
     console.log(isConnected)
  }

  const data = await signMessageAsync({ message });

  console.log(isConnected)

  if (data.length && isConnected) {
    try {

      const main = await AuthAddress(String(address), data);


      return main;

    } catch (err) {
      console.log(err)
      throw "Something went wrong, please try again";
    }
  }else { 
      console.log(isConnected, data.length)
   }
};

export const AuthContextMain = createContext<AuthContext>({});

export const CrypteaProvider = ({children}: {children: JSX.Element}) => {

    const [ isAuthenticated, setAuth ] = useState<boolean | undefined>();

    const [context, setContext] = useState<userData | undefined>(user);

    useEffect(() => {

        const cache:string | null = localStorage.getItem("userToken");

        setAuth(cache !== null);

    }, [context])


    const client = createClient({
      autoConnect: true,
      connectors,
      webSocketProvider,
      provider: ethers.getDefaultProvider()
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


export const AuthGlob = ({ children }: { children: JSX.Element }) => {
  
  const { active } = useWeb3React();

  const { isAuthenticated } = useContext(AuthContextMain);

  
  return <>{children}</>
};
