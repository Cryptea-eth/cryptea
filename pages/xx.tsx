import { useEffect } from "react";
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';
import web3 from 'web3';
import { cryptoSymbol } from 'crypto-symbol';
import lxl from "crypto-icons-plus-32/src/polygon.png";
import map from "crypto-icons-plus/map.min.json";

const Xx = () => {



  const { symbolLookup } = cryptoSymbol({
    "Oasis": "ROSE" as const,
  });

  useEffect(() => {
    

    console.log(require("crypto-icons-plus-32/src/polygon.png"));
    


  }, [])



  return (
    <>
      <img src={lxl.src} alt={"11"} />
    </>
  );
}

export default Xx;