import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers'
import { decryptData, encryptData } from "../app/functions/crypto-data";
const bs58 = require('bs58');

const Xx = () => {

 const router = useRouter();

 useEffect(() => {

  (async () => {

     const ee = bs58.decode(
       decryptData(
         { iv: "69f0008d6f8ce20abc7228beaf6b964b", content: "3c76a7a5" },
         "Joell"
       )
     );
     
     console.log(ee);

  })()

 }, []);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;