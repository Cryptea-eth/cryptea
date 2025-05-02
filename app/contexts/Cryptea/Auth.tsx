import { createContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  AuthAddressType,
  AuthContext,
  authenticateUserExtended,
  userData
} from "./types";
import "./DB";
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
  coinbaseWallet,
  ledgerWallet,
  argentWallet,
  phantomWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { PhantomWallet } from "./connectors/solana";
import http from "../../../utils/http";
import { createConfig, WagmiProvider, http as wagmiHttp } from "wagmi";
import {
  mainnet,
  sepolia,
  aurora,
  auroraTestnet,
  avalancheFuji,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  polygon,
  polygonMumbai,
  optimismGoerli,
  cronosTestnet,
  cronos,
  filecoin,
  filecoinHyperspace,
} from "wagmi/chains";

import { chains } from "./connectors/chains";
import { CreateWalletFn, Wallet } from "@rainbow-me/rainbowkit/dist/wallets/Wallet";
import mimg from "../../../public/images/mglink.svg";
let user: userData | undefined;

export let message = "Welcome to Breew";

let isAuth = false;

export const AuthAddress = async ({
  address,
  signature,
  message,
  blocktype = "evm",
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


  const mail = (): Wallet => ({
    id: "mail",
    name: "Email link",
    iconUrl: mimg.src,
    iconBackground: "#8036de",
    downloadUrls: {
      chrome: "https://cryptea.app",
      ios: "https://cryptea.app",
      android: "https://cryptea.app",
      qrCode: "https://cryptea.app",
    },
    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: "https://cryptea.app",
        steps: [
          {
            description: "We recommend using your email for a seamless experience.",
            step: "install",
            title: "Enter your email",
          },
          {
            description: "After you enter your email, a magic link will be sent to you.",
            step: "scan",
            title: "Check your inbox",
          },
        ],
      },
    },
    extension: {
      instructions: {
        learnMoreUrl: "https://cryptea.app",
        steps: [
          {
            description: "We recommend using your email for a seamless experience.",
            step: "install",
            title: "Enter your email",
          },
          {
            description: "After you enter your email, a magic link will be sent to you.",
            step: "create",
            title: "Check your inbox",
          },
          {
            description: "Click the magic link in your email to sign in.",
            step: "refresh",
            title: "Click the magic link",
          },
        ],
      },
    },
    createConnector: () => () => ({
      id: "mail",
      name: "Email link",
      type: "email",
      connect: async () => ({ accounts: [], chainId: 1 }),
      disconnect: async () => {},
      getAccounts: async () => [],
      getChainId: async () => 1,
      isAuthorized: async () => false,
      switchChain: async () => mainnet,
      onAccountsChanged: () => {},
      onChainChanged: () => {},
      onDisconnect: () => {},
      getProvider: async () => null,
    }),
  });
  

  const connectors = (connectorsForWallets([
      {
        groupName: "Recommended",
        wallets:
          router.pathname.indexOf("/pay/[slug]") != -1
            ? [
                metaMaskWallet,
                walletConnectWallet,
                coinbaseWallet,
                PhantomWallet,
                injectedWallet,
              ]
            : [
                metaMaskWallet,
                mail,
                walletConnectWallet,
                PhantomWallet,
                coinbaseWallet,
              ],
      },
      {
        groupName: "Other",
        wallets: [
          rainbowWallet,
          ledgerWallet,
          injectedWallet,
          argentWallet,
          injectedWallet,
        ],
      },
    ], {
    projectId: process.env.WALLETCONNECT_PROJECT_ID || "",
    appName: "Breew",
  }))


  
   const config = createConfig({
    ssr: true,
    chains: [
      mainnet,
      sepolia,
      avalancheFuji,
      optimism,
      optimismSepolia,
      filecoin,
      filecoinHyperspace,
      base,
      baseSepolia,
      arbitrum,
      arbitrumSepolia,
      polygon,
      polygonMumbai,
      optimismGoerli,
      baseSepolia,
      arbitrumSepolia,
      cronos,
      cronosTestnet,
      polygonMumbai,
      aurora,
      auroraTestnet,
    ],
    transports: {
      [mainnet.id]: wagmiHttp(),
      [sepolia.id]: wagmiHttp(),
      [avalancheFuji.id]: wagmiHttp(),
      [optimism.id]: wagmiHttp(),
      [optimismSepolia.id]: wagmiHttp(),
      [base.id]: wagmiHttp(),
      [baseSepolia.id]: wagmiHttp(),
      [arbitrum.id]: wagmiHttp(),
      [arbitrumSepolia.id]: wagmiHttp(),
      [polygon.id]: wagmiHttp(),
      [polygonMumbai.id]: wagmiHttp(),
      [optimismGoerli.id]: wagmiHttp(),
      [aurora.id]: wagmiHttp(),
      [auroraTestnet.id]: wagmiHttp(),
      [cronos.id]: wagmiHttp(),
      [cronosTestnet.id]: wagmiHttp(),
      [filecoin.id]: wagmiHttp(),
      [filecoinHyperspace.id]: wagmiHttp(),
    },
    connectors,
  });


  const length = 7;

  const solana = () => {
    const supported = ["phantom"];
    const store: any[] = [];
    const allConnectors = [...config.connectors];
    
    for (let i = 0; i < length; i++) {
      const conn = allConnectors.pop();
      if (conn !== undefined) {
        if (supported.indexOf(conn.id) !== -1) {
          store.push(conn);
        }
      }
    }

  };

  const evm = () => {
    const unsupported = ["phantom"];
    const store: any[] = [];
    const allConnectors = [...config.connectors];
    
    for (let i = 0; i < length; i++) {
      const conn = allConnectors.pop();
      if (conn !== undefined) {
        if (unsupported.indexOf(conn.id) === -1) {
          store.push(conn);
        }
      }
    }
  };

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: "#8036de",
        })}
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
    </WagmiProvider>
  );
};
