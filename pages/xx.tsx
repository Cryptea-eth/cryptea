import { useEffect } from "react";
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';
import web3 from 'web3';

const Xx = () => {

  useEffect(() => {
    
    const e = new web3("https://evm-t3.cronos.org");

    console.log(e, 'here');
    

  }, [])

  return (<>
  
  </>)
}

export default Xx;