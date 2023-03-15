import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers'
import { decryptData, encryptData } from "../app/functions/crypto-data";
const bs58 = require('bs58');

const Xx = () => {

 useEffect(() => {

    console.log('come here')  

 }, []);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;