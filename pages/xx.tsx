import { useEffect, useState } from "react";
import { get_request, post_request, del_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';
import web3 from 'web3';
import axios from 'axios';
import { useRouter } from 'next/router'
import validator from 'validator'

const Xx = () => {

 const router = useRouter();


 useEffect(() => {

 }, [router.isReady, router]);


  return (
    <>
    <span className="variable font-bold">Welcome, we have been expecting you.</span>  
    </>
  );
}

export default Xx;