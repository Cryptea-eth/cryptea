import dynamic from "next/dynamic";
import Head from "next/head";
import Origin from "../../app/templates/origin";
import { Suspense, useEffect } from 'react';
import { useMoralis } from "react-moralis";
import Loader from "../../app/components/elements/loader";
const User = () => {
  
   const {
     Moralis,
     isWeb3Enabled,
     enableWeb3,
     authenticate,
     chainId,
     isAuthenticated
   } = useMoralis();
   

   const ee = "../../app/templates/origin";

  const Template = dynamic(() => import(`../../app/templates/origin`),{
    suspense: true
  });

  

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
      <Suspense fallback={<Loader />}>
        <Origin />
      </Suspense>
      </>
  )
}

export default User;