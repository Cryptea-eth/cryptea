import Origin from "../../app/templates/origin";
import Head from "next/head";
import { useEffect } from 'react';
import { useMoralis } from "react-moralis";
const User = () => {
  
   const {
     Moralis,
     isWeb3Enabled,
     enableWeb3,
     authenticate,
     chainId,
     isAuthenticated
   } = useMoralis();


  useEffect(() => {
    if (!isAuthenticated) {
      if (!isWeb3Enabled) {
        enableWeb3();
      }
    } else {
      if (!isWeb3Enabled) {
        enableWeb3();
      }
    }
  }, [enableWeb3, isWeb3Enabled, isAuthenticated, Moralis]);

  return (
      <>
      <Origin />
      </>
  )
}

export default User;