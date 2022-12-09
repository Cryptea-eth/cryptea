import { useEffect, useState } from "react";
import { get_request, post_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';
import web3 from 'web3';
import axios from 'axios';
import { useRouter } from 'next/router'
import validator from 'validator'

const Xx = () => {

 const router = useRouter();

 

 useEffect(() => {

  get_request("/pay/idiaghe/payments/both").then((e) => {
    console.log(e.data);
  }).catch(ee => {
    console.log(ee, 'xx')
  });

 }, [router.isReady, router]);


  return <>Welcome, we&apos;ve been expecting you</>;
}

export default Xx;