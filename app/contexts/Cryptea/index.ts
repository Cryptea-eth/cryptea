import { useContext, useEffect, useRef } from "react";
import { AuthContextMain, AuthAddress, AuthUser } from "./Auth";
import { authenticateUserDefault, mainAppManager, userData } from "./types";
import { HomeContext } from "../HomeContext";
import validator from "validator";
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage, useSigner } from "wagmi";
import { get_request } from "./requests";
import { DashContext, dash } from "../GenContext";
import { uauth_connector } from "./connectors";

export function useCryptea(): mainAppManager {

  const { user, isAuthenticated, update } = useContext(AuthContextMain);

  const { open, close, show } = useContext(HomeContext);
 
  const { logout: { update: updateLogout } }: dash = useContext(DashContext);

  const { chain: chainId , chains } = useNetwork();

  const { address, isConnected } = useAccount();

  const { connectors, isLoading, connectAsync } = useConnect();

  const { isSuccess, signMessageAsync } = useSignMessage()

  const { data: signer } = useSigner();

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
    account: isAuthenticated ? altAddress.current : (address || altAddress.current),
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
    isAuthenticated,
    isTokenAuthenticated: isAuthenticated && isConnected,
    AuthAddress,
    logout: async () => {
      updateLogout?.(true);
      await get_request("/logout", {}, undefined, false);
      const uaux = localStorage.getItem('username');

      if (!Boolean(uaux)) {
        disconnect();
      } else {

        const userx = JSON.parse(uaux as string);

        await uauth_connector.logout({
          username: userx.value,
        });
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
    signer,
  };
};

