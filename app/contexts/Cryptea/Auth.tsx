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
  getDefaultWallets,
  getWalletConnectConnector,
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

import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";
import { PhantomWallet } from "./connectors/solana";

let user: userData | undefined;

export let message = "Welcome to Cryptea";

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

    const userx = await axios.post(
      "/api/walletAuth",
      {
        blocktype,
        address,
        signature,
        message,
        tz: window.jstz.determine().name(),
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
        email_verified_at,
      }: {
        username: string;
        img: string;
        email: string;
        accounts: string[];
        id: number | string;
        email_verified_at: any;
      } = userx.data.data;

      user = {
        id,
        email,
        username,
        accounts,
        img,
        email_verified_at,
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

export const CrypteaProvider = ({ children }: { children: JSX.Element }) => {
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
    iconBackground: "#f57059",
    createConnector: () => {
      const connector = new LinkConnector({ chains, options: {} });

      return {
        connector,
      };
    },
  });

  const UD = ({ chains }: { chains: any }) => ({
    id: "unstoppable",
    name: "Login with unstoppable",
    iconUrl: unstop.src,
    iconBackground: "#0d67fe",
    createConnector: () => {
      const connector = new UDConnector({ chains, options: {} });
      return {
        connector,
      };
    },
  });


  const walletChains = chains as Chain[];

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets:
        router.pathname.indexOf("/pay/[slug]") != -1
          ? [
              metaMaskWallet({ chains }),

              walletConnectWallet({ chains }),

              coinbaseWallet({ chains, appName: "Cryptea" }),

              PhantomWallet({ chains }),
            ]
          : [
              metaMaskWallet({ chains }),
              mail({ chains }),
              walletConnectWallet({ chains }),
              PhantomWallet({ chains }),
              UD({ chains }),
              coinbaseWallet({ chains, appName: "Cryptea" }),
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
          accentColor: "#f57059",
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
