import { useEffect } from "react";
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';

const Xx = () => {

  useEffect(() => {
    
    get_request("/api/payments/accounts", { baseURL: window.origin }).then((e) => {
      console.log(e);
    });

   

  }, [])

  return (<>
  
  </>)
}

export default Xx;