import { useContext } from "react";
import { Cryptea } from './provider';
import {authenticateUserDefault, usAuth, useAuthData, userData} from './Auth';
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";


export interface mainAppManager {
  providers: (
    | Promise<any>
    | ethers.ethers.providers.Web3Provider
    | undefined
  )[];
  chainId: string | undefined | number;
  isAuthenticated: boolean;
  authenticate: (obj: authenticateUserDefault) => Promise<userData>;
}

export function useCryptea(): mainAppManager {
  const main = useContext(Cryptea);

  const { connector, activate, account } = useWeb3React();

  const { isAuthenticated, chainId, ethersProvider, web3Provider } =
  useAuthData();

  return {
    ...main,
    authenticate: ({
      message,
      type = "injected",
    }: authenticateUserDefault) => usAuth({activate, type, connector, message, account}),
    isAuthenticated,
    chainId,
    providers: [ethersProvider, web3Provider],
  };
};
