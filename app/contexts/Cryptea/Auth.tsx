import { Chain } from 'wagmi';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { LinkConnector, UDConnector } from "./connectors";
import mimg from "../../../public/images/mglink.svg";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import unstop from "../../../public/images/unstoppable.svg";
import { webSocketProvider, chains, provider } from "./connectors/chains";
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
import "./DB";
import { post_request } from "./requests";
import { createClient, useAccount, WagmiConfig } from "wagmi";
import { useRouter } from "next/router";
import Loader from "../../components/elements/loader";
import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
  injectedWallet,
  braveWallet,
  coinbaseWallet,
  ledgerWallet,
  trustWallet,
  argentWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { PhantomWallet } from "./connectors/solana";
import http from '../../../utils/http';

let user: userData | undefined;

export let message = "Welcome to Breew";

let isAuth = false;

export const AuthAddress = async ({
  address,
  signature,
  message,
  blocktype = 'evm'
}: AuthAddressType) => {
  try {
    // const userx = await post_request(`/login/walletAuth`, {
    //   address,
    //   signature,
    //   message,
    //   tz: window.jstz.determine().name(),
    // });

    const userx = await http.post(
      "/api/walletAuth",
      {
        blocktype,
        address,
        signature,
        message,
        tz: window?.jstz?.determine?.()?.name?.(),
      },
      { baseURL: window.origin }
    );

    if (!userx.data.error) {
      const {
        email,
        img,
        accounts,
        username,
        id,
        isEmailVerified,
      }: {
        username: string;
        img: string;
        email: string;
        accounts: string[];
        id: number | string;
        isEmailVerified: boolean;
      } = userx.data.data;

      user = {
        id,
        email,
        username,
        accounts,
        img,
        isEmailVerified,
      };

      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("userToken", userx.data.token);

      isAuth = true;
    } else {
      throw "Invalid Login Details";
    }
  } catch (err) {
    const error = err as AxiosError;
    // console.log(err);
    if (error.response) {

      throw "Invalid Login Details";
      
    }
  }
  return user;
};

let config: undefined | configType;

export const AuthUser = async ({
  signMessage,
  isConnected,
  address,
  signMessageAsync,
  isSuccess,
  connectAsync,
  mainx,
}: authenticateUserExtended): Promise<userData | undefined> => {
  if (signMessage !== undefined) message = signMessage;

  // if (!isConnected) {
  //   config = await connectAsync({ connector: type });
  // }

  if (!mainx && typeof address == "string") {
    const data = await signMessageAsync({ message });

    if (data.length) {
      try {
        const main = await AuthAddress({
          signature: data,
          message,
          address: address as string,
        });

        return main;
      } catch (err) {
        console.log(err);
        throw "Something went wrong, please try again";
      }
    } else {
      console.log(data);

      throw "Something went wrong, please try again";
    }
  }
};

export const AuthContextMain = createContext<AuthContext>({});

export const CrypteaProvider = ({ children }: { children: React.ReactElement }) => {
  const [isAuthenticated, setAuth] = useState<boolean | undefined>();

  const [context, setContext] = useState<userData | undefined>(user);

  const [mobile, setMobile] = useState<boolean>(false);

  const [genLoader, setGenLoader] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (
      localStorage.getItem("userToken") !== null &&
      router.pathname.indexOf("/settings") == -1 &&
      router.pathname.indexOf("/verify/email") == -1
    ) {
      "user".get("*").then((cacheUser: any) => {
        if (
          !Boolean(cacheUser?.isEmailVerified) &&
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

    setMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, [router]);

  useEffect(() => {
    if (localStorage.getItem("userToken") !== null) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  const mail = ({ chains }: { chains: any }) => ({
    id: "mail",
    name: "Email link",
    iconUrl: mimg.src,
    iconBackground: "#8036de",
    createConnector: () => {
      const connector = new LinkConnector({ chains, options: {} });

      return {
        connector,
      };
    },
  });

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets:
        router.pathname.indexOf("/pay/[slug]") != -1
          ? [
              metaMaskWallet({ chains }),

              walletConnectWallet({ chains }),

              coinbaseWallet({ chains, appName: "Breew" }),

              PhantomWallet({ chains }),
            ]
          : [
              metaMaskWallet({ chains }),
              mail({ chains }),
              walletConnectWallet({ chains }),
              PhantomWallet({ chains }),
              coinbaseWallet({ chains, appName: "Breew" }),
            ],
    },
    {
      groupName: "Other",
      wallets: [
        rainbowWallet({ chains }),
        ledgerWallet({ chains }),
        injectedWallet({ chains }),
        argentWallet({ chains }),
      ],
    },
  ]);

  const client = createClient({
    autoConnect: false,
    connectors,
    webSocketProvider,
    provider,
  });

  const length = 7;

  const solana =  () => {

        const supported = ["phantom"];

        const store: any[] = [];

        for (let i = 0; i < length; i++) {
          const conn = client.connectors.pop();

          if (conn !== undefined) {
            if (supported.indexOf(conn.id) !== -1) {
              store.push(conn);
            }
          }
        }

        store.forEach((v) => {
          client.connectors.push(v);
        });
    };

    const evm = () => {
      const unsupported = ["phantom"];

      const store: any[] = [];

      for (let i = 0; i < length; i++) {
        const conn = client.connectors.pop();

        if (conn !== undefined) {
          if (unsupported.indexOf(conn.id) === -1) {
            store.push(conn);
          }
        }
      }

      store.forEach((v) => {
        client.connectors.push(v);
      });
    };


    
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        coolMode
        theme={lightTheme({
          accentColor: "#8036de",
        })}
        chains={chains}
      >
        <AuthContextMain.Provider
          value={{
            mobile,
            user: context,
            isAuthenticated,
            solana,
            evm,
            update: (e: userData | undefined) => setContext(e),
          }}
        >

          {/* <button style={{ position: 'fixed', zIndex: 100000000000 }} onClick={solana}> Click me</button> */}

          {genLoader ? <Loader head={false} /> : children}
        </AuthContextMain.Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
