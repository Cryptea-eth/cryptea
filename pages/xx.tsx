import { useEffect, useState } from "react";
import { get_request, post_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers';
import web3 from 'web3';
import axios from 'axios';


const Xx = () => {

 const [ss, setSs] = useState("");

 useEffect(() => {
   axios.get(`http://localhost:3000/api/cryptoimg/matic`).then((e) => {
     setSs(e.data);
     console.log(e)
   });
 }, []);


  return (
    <>
      <img src={"http://localhost:3000/api/cryptoimg/matic"} alt={"11"} />
    </>
  );
}

export default Xx;