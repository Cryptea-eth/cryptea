import { useContext, useEffect, useRef } from "react";
import { AuthContextMain, AuthAddress, AuthUser } from "./Auth";
import { authenticateUserDefault, mainAppManager, userData } from "./types";
import { HomeContext } from "../HomeContext";
import validator from "validator";
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage, useSigner } from "wagmi";
import { get_request } from "./requests";
import { DashContext, dash } from "../GenContext";

export function useCryptea(): mainAppManager {

  const { isAuthenticated, user, update } = useContext(AuthContextMain);

  const { open, close, show } = useContext(HomeContext);
 
  const { logout: { update: updateLogout } }: dash = useContext(DashContext);

  const { chain: chainId , chains } = useNetwork();

  const eee = useAccount();

  const { address, isConnected, connector: activeConnector } = eee;

  const { connectors, isLoading, connectAsync, connect } = useConnect();

  const { isSuccess, signMessageAsync } = useSignMessage()

  const { data: signer } = useSigner({ onError: (error) => {
    console.log(error)
  } });

  let cache = useRef<null | string | undefined>();

  useEffect(() => {
    cache.current = localStorage.getItem('userToken');
  }, [])

  const { disconnect } = useDisconnect();

  return {
    account: address,
    user,
    connected: isConnected,
    connectors,
    update,
    authenticate: (e?: boolean) => {
      if (e === undefined) {
        if (show !== undefined && close !== undefined && open !== undefined) {
          if (show) close();
          else open();
        }
      } else if (e && open !== undefined) open();
      else if (!e && close !== undefined) close();
    },
    authenticateUser: ({ signMessage, type }: authenticateUserDefault) => {
      updateLogout?.(false)
      return AuthUser({
        connectAsync,
        address,
        isConnected,
        signMessageAsync,
        type,
        signMessage,
        isSuccess,
        mainx: Boolean(cache.current),
      });
    },
    connectWall: async (type) => await connectAsync({ connector: type }),
    chainId: chainId !== undefined ? chainId.id : undefined,
    isAuthenticating: isLoading,
    validator,
    isAuthenticated: isAuthenticated && isConnected,
    AuthAddress,
    logout: async () => {
      updateLogout?.(true);
      await get_request("/logout");
      disconnect();
      const remove = [
        "user",
        "links",
        "templates",
        "views",
        "payments",
        "userToken",
      ];
      for (let i: number = 0; i < remove.length; i++) {
        localStorage.removeItem(remove[i]);
      }
    },
    signer,
  };
};

