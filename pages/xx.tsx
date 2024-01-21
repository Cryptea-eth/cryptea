import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { useEffect } from "react";
// <reference types="@types/tronweb" />
const TronWeb = require("tronweb");

const Xx = () => {


  // useEffect(() => {
    
  //   const echo = new Echo({
  //     broadcaster: "pusher",
      
  //     client: new Pusher(`live`, {
  //       cluster: "mt1",
  //       forceTLS: false,
  //       wsHost: "127.0.0.1",
  //       wsPort: 6001,
  //       enabledTransports: ["ws", "wss"],
  //     }),
  //   });

  //   const channel = echo.channel("public.dummy.1")
  
  //   channel.subscribed((data: any) => {
  //     console.log(data, 'subscribed!!!')
  //   }).listen('.dummy-event', (data: any) => {
  //     console.log(data, 'data!!!')
  //   })


  // }, [])

  useEffect(() => {

    // "A42E6E713D6F1D4309A7400B120B89E011155DFA4D5891915429DDDDEF30E018";


    // create tron account
    const tron = new TronWeb({
      // fullNode: "https://api.nileex.io",
      // solidityNode: "https://api.nileex.io",

      fullNode: "https://api.trongrid.io",
      solidityNode: "https://api.trongrid.io",


      // privateKey:
      //   "A42E6E713D6F1D4309A7400B120B89E011155DFA4D5891915429DDDDEF30E018",
    });



    // create tron account
    const account = tron.createAccount();

    console.log(account, 'account!!!')
  
    // tron.trx
    //   .getBalance("TWopXbP19YfotdSmrUaSaCGXHnj8pZ9rXD")
    //   .then((balance) => {
    //     console.log(TronWeb.fromSun(balance), "balance!!!");
    //   });



    // tron.trx
    //   .sendTransaction(
    //     "TVjDhbjA9JZSsKrZfXkhPjxDxVGCQDeBaG",
    //     TronWeb.toSun("5"),
    //     "A42E6E713D6F1D4309A7400B120B89E011155DFA4D5891915429DDDDEF30E018"
    //   )
    //   .then((res) => {
    //     console.log(res, "res!!!");
    //   });

  }, [])

  
  
  return <>Welcome, we have been expecting you</>;
};

export default Xx;
