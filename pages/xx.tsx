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

  let link = String('https://www.joel.com/').split("?");

  if (Boolean(link[1])) {
    if (!link[1].length) {
      link[0] += `?trx=${'apiCode'}`;
    } else {
      link[1] += `&trx=${'apiCode'}`;

      link[0] += "?";
    }
  } else {
    link[0] += `?trx=${'apiCode'}`;
  }

  const mLink = link.join("");

  console.log(mLink)

 }, [router.isReady, router]);


  return <>Welcome, we&apos;ve been expecting you</>;
}

export default Xx;