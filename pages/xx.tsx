import { useEffect } from "react";
import { get_request, post_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';
import web3 from 'web3';
import { cryptoSymbol } from 'crypto-symbol';
import lxl from "crypto-icons-plus-32/src/polygon.png";
import map from "crypto-icons-plus/map.min.json";

const Xx = () => {

  useEffect(() => {
    

    get_request(
      "/testt"
    ).then((e) => {
      console.log(e);
    }).catch((ex) => {
      console.log(ex);
      
    });


  }, [])



  return (
    <>
      <img src={lxl.src} alt={"11"} />
    </>
  );
}

export default Xx;