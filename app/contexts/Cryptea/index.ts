import { useContext, useEffect, useRef } from "react";
import { AuthContextMain, AuthAddress, AuthUser } from "./Auth";
import { authenticateUserDefault, mainAppManager, userData } from "./types";
import { HomeContext } from "../HomeContext";
import validator from "validator";
import { useAccount, useConnect, useDisconnect, useChainId, useSignMessage, useWalletClient } from "wagmi";
import { get_request } from "./requests";
import { DashContext, dash } from "../GenContext";

export function useCryptea(): mainAppManager {

  const { user, isAuthenticated, update } = useContext(AuthContextMain);

  const { open, close, show } = useContext(HomeContext);
 
  const { logout: { update: updateLogout } }: dash = useContext(DashContext);

  const { address, isConnected } = useAccount();

  const { connectors, status, connectAsync } = useConnect();

  const { isSuccess, signMessageAsync } = useSignMessage()

  const chainId = useChainId();
  const { data: signer } = useWalletClient();

  let cache = useRef<null | string | undefined>();
  let altAddress = useRef<string | undefined>()

  useEffect(() => {
    cache.current = localStorage.getItem('userToken');

    if (localStorage.getItem('userToken') !== null) {
        ('user').get('accounts').then((e: any) => {
          if(e !== undefined){
          const acct = JSON.parse(e)
            altAddress.current = acct[0];
          }
        });
    }
  })

  const { disconnect } = useDisconnect();

  return {
    disconnect,
    account: isAuthenticated ? altAddress.current : (address || altAddress.current),
    user,
    connected: isConnected,
    connectors: connectors as any,
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
    chainId: chainId || undefined,
    isAuthenticating: status === 'pending',
    validator,
    isAuthenticated,
    isTokenAuthenticated: isAuthenticated && isConnected,
    AuthAddress,
    logout: async () => {
      updateLogout?.(true);
      await get_request("/logout", {}, undefined, false);
      const uaux = localStorage.getItem('username');

      if (!Boolean(uaux)) {
        disconnect();
      }

      const remove = [
        "user",
        "links",
        "templates",
        "views",
        "payments",
        "userToken"
      ];

      for (let i: number = 0; i < remove.length; i++) {
        localStorage.removeItem(remove[i]);
      }
    },
    signer: signer || undefined,
  };
};

