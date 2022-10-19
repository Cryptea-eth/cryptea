import React, { createContext, useState, useEffect } from "react";
import { useCryptea } from "./Cryptea";
import { useRouter } from "next/router";
import { post_request, get_request } from "./Cryptea/requests";
import * as ethers from 'ethers';
import bigimg from "../../public/images/logobig.png";
import PAYMENT from "../../artifacts/contracts/payment.sol/Payment.json";
import SUBSCRIPTION from "../../artifacts/contracts/subscription.sol/Subscription.json";
import { initD } from "../components/elements/dashboard/link/data";
import { makeNFTClient } from "../functions/clients";
import { useSwitchNetwork } from "wagmi";
import { PaymentContext as PaymentCont } from "./Cryptea/types";
import AuthModal from "../components/elements/modal";

 export const PaymentContext = createContext<PaymentCont>({});

export const PaymentProvider = ({ children, editMode }: { children: JSX.Element, editMode: boolean }) => {

      const router = useRouter();

      let username = router.query["slug"];

      const [is500, setIs500] = useState<boolean>(false);

      const [interval, setTinterval] = useState<string>("daily");

      const contractAddress: {
        subscribe: string;
        onetime: { [index: string]: string };
      } = {
        // subscribe: "0xFBdB47e6A5D87E36A9adA55b2eD47DC1A7138457",
        subscribe: "0xd328f64974b319b046cf36E41c945bb773Fed1d8",
        // subscribe:"0x66e8a76240677A8fDd3a8318675446166685C940", //polygon
        onetime: {
          "80001": "0xBE6A162578e17D02F9c5F6b2167a62c6C01070ae",
          "420": "0x672cc5A511bB9E6EFCbeb11Fa3DdbABc31671776",
          "338": "0x672cc5A511bB9E6EFCbeb11Fa3DdbABc31671776",
          "1313161555": "0x380FE6B54A035fC8EBF44fF7Ffc1d1F8fCE89533",
          "42261": "0x672cc5A511bB9E6EFCbeb11Fa3DdbABc31671776",
        },
      };

      useEffect(() => {}, [username, router.isReady]);

      const [paymentData, setPaymentData] = useState<
        { price: number; type: "onetime" | "subscription"}>();

      const [token, setToken] = useState<any>({
        value: 80001,
        label: "Matic (Testnet)",
      });

      const { connected, authenticate, chainId, signer: nullSigner, account, validator } = useCryptea();

      const [signer, setSigner] = useState(nullSigner);

      const [data, setData] = useState({});

      const [isLoading, setIsLoading] = useState<boolean>(true);

      const [userD, setUserD] = useState<{ [index: string]: any }>({});

      const [pemail, setPemail] = useState<string[]>([]);

      const [loadingText, setLoadingText] = useState<any>("");
      const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
      const [transferFail, setTransferFail] = useState<boolean>(false);
      const [failMessage, setFailMessage] = useState<string>("");
      const [hash, setHash] = useState<string>("");

      const [options, setOptions] = useState<{value: string | number, label: string}[]>([
          { value: 80001, label: "Matic (Testnet)" },
          { value: 338, label: "Cronos (Test Cronos)" },
          { value: 1313161555, label: "Aurora Testnet" },
          { value: 420, label: "Optimism testnet" },
          { value: 42261, label: "Rose Testnet" },
        ]);
        

       const getPrice = async (
         price: number,
         chain: string | number | undefined = 80001
       ) => {
         let final:number = 0;
         setLoadingText("Loading Price data...");

        const prices: { [index: string]: () => Promise<number> } = {
          "80001": async () => {
            const response = await post_request("/token/price", {
              currency: 'usd',
              token: 'matic-network'
            });

            const e = response.data as { [index: string]: any };

            const priceCurrency = Number(e["matic-network"]["usd"]);

            return price / priceCurrency;
          },

          "42261": async () => {
            const response = await post_request("/token/price", {
              currency: "usd",
              token: "oasis-network",
            });

            const e = response.data as { [index: string]: any };

            const priceCurrency = Number(e["oasis-network"]["usd"]);

            return price / priceCurrency;
          },

          "1313161555": async () => {

            const response = await post_request("/token/price", {
              currency: "usd",
              token: "auroratoken",
            });

            const e = response.data as { [index: string]: any };

            const priceCurrency = Number(e["auroratoken"]["usd"]);

            return price / priceCurrency;
          },

          "338": async () => {
              const response = await post_request("/token/price", {
                currency: "usd",
                token: "crypto-com-chain",
              });

            const e = response.data as { [index: string]: any };

            const priceCurrency = Number(e["crypto-com-chain"]["usd"]);

            return price / priceCurrency;
          },
          "420": async () => {
              const response = await post_request("/token/price", {
              currency: "usd",
              token: "optimism",
            });


              const e = response as { [index: string]: any };

              const priceCurrency = Number(e["optimism"]["usd"]);

              return price / priceCurrency; 
          }
        };

        
         final = await prices[chain]();

         return final.toFixed(6);

      };
       
  const initMain = async (
    price: number,
    type: "subscription" | "onetime" = "onetime"
  ) => {
    setAuth(false);
    setLoadingText("Initializing Payment");
    try {
      if (Number(price)) {
        await beginPayment(price, type);
      } else {
        setTransferFail(true);
        setFailMessage("Your amount is invalid");
      }
    } catch (x) {
      console.log(x);
      setTransferFail(true);
      setFailMessage("Something went wrong, Please try again");
    }
  };

  const [amount, setAmount] = useState<string | number>("");

  useEffect(() => {
    const init = async () => {
      try {
        const { link: lQ, user: userl } = await initD(
          String(username).toLowerCase()
        );

        if (lQ !== undefined) {
          if(lQ.template_data !== undefined){
            const { name, data: udata } = JSON.parse(lQ.template_data);

          if (!editMode) {

            setData(udata);
          }else{
              const { data: mdata } = await import(`../templates/${name}/data`);

              setData(mdata);

          }
        }

          let linkAmount: string | object | undefined | number;

          if (lQ.amount !== undefined) {
            linkAmount =
              lQ.amount === "variable" ? "variable" : JSON.parse(lQ.amount);

            if (typeof linkAmount == "number") {
              setAmount(linkAmount);
            }
          }

          // Custom inputs
          const rdata = JSON.parse(lQ.rdata);

          if (rdata['sub'] !== undefined && rdata['sub'].indexOf('Email') == -1) {
              rdata['sub'].push('Email')
          }

          setUserD({
            description: lQ.desc,
            username: lQ.title !== undefined ? lQ.title : userl.username,
            email: userl.email,
            ethAddress: lQ.address,
            img: userl.img !== undefined ? userl.img : undefined,
            id: lQ.id,
            linktype: lQ.type,
            amountMultiple: Boolean(lQ.accountMulti)
              ? JSON.parse(lQ.accountMulti)
              : [],
            linkAmount,
            rdata,
          });

          if (setIsLoading !== undefined) setIsLoading(false);
        } else {
          router.push("/404");
        }
      } catch (err) {
        const error = err as Error;
        console.log(error);
        setIs500(true);
      }
    };

    if (router.isReady) {
      init();
    }
  }, [router, username, router.isReady, editMode]);

  const {
    username: usern,
    description,
    img,
    ethAddress,
    id: linkId,
  }: {
    username?: string;
    description?: string;
    img?: string | null;
    ethAddress?: string;
    id?: string;
  } = userD;

   let nft: any = "";

    if (!userD) {
      router.push('/404');
    }

    const [subCheck, setSubCheck] = useState<boolean>(true);

   const generateNftData = async (
     name: string,
     owner: string,
     duration: number,
     desc?: string
   ) => {
     const nfx = makeNFTClient(await get_request("/nftkey"));

     const date = new Date();

     const exdate = new Date(date.getTime() + duration * 1000);

     const load: string = img?.length ? img : bigimg.src;

     await fetch(load).then(async (x) => {
       const blb = await x.blob();
       nft = await nfx.store({
         image: new File([blb], `${usern}`, {
           type: blb.type,
         }),
         name,
         description: `${
           desc === undefined
             ? `Subscription to ${name}${
                 name.indexOf("'s") == -1 ? "'s" : ""
               } link`
             : desc
         }`,
         attributes: [
           {
             owner,
             id: linkId,
             created: date.toDateString(),
           },
           {
             expiry: exdate.toDateString(),
             expirySeconds: exdate.getTime(),
           },
         ],
       });
     });
     return nft.url;
   };

   const beginSubscription = async (
     tokenURI: string,
     receiver: string,
     to: string,
     value: ethers.BigNumber,
   ) => {
     const signed: any = signer;

     const nftContract = new ethers.Contract(
       contractAddress["subscribe"],
       SUBSCRIPTION.abi,
       signed
     );

     try {
       const tx = {
         from: receiver,
         value,
       };

       setLoadingText("Transferring Tokens...");

       const trx = await nftContract.mintTokens(
         receiver,
         to,
         value,
         tokenURI,
         tx
       );

       setHash(trx["transactionHash"]);
       setSubCheck(true);
     } catch (err) {
       console.log(err);
       setTransferFail(true);
       setLoadingText("");
     }
   };

   const message: { [index: string]: string } = {
     subscription: `Subscription To ${usern}`,
     onetime: `Tipping ${usern} with crypto`,
   };

   const [eSubscription, setESubscription] = useState<string[]>([]);

   const mainIx = (inter: string) => {
     const date = new Date();

     if (inter == "monthly") {
       const datex: number = new Date(
         date.getFullYear(),
         date.getMonth() + 1,
         0
       ).getDate();

       return datex * 86400;
     } else if (inter == "yearly") {
       const year = date.getFullYear();

       return year % 4 ? 31536000 : 31622400;
     } else if (inter == "daily") {
       return 86400;
     } else if (inter == "weekly") {
       return 604800;
     }

     return 0;
   };

   const reset = () => {
     setTransferSuccess(false);
     setFailMessage("");
     setHash("");
     setLoadingText("");
     setTransferFail(false);
     setPemail([]);
     setTinterval("");

     if (typeof userD.linkAmount != "number") {
       setAmount("");
     }
   };

   const support = ["name", "email", "phone"];

   const validForm = (value: string, valid: string) => {
     if (valid == "email" && !validator.isEmail(value)) {
       return false;
     }

     if (valid == "name" && !validator.isAlphanumeric(value)) {
       return false;
     }

     if (support.indexOf(valid) == -1) {
       return false;
     }

     return true;
   };


   const { chains, error, pendingChainId, switchNetworkAsync } =
     useSwitchNetwork();



   const beginPayment = async (
     price: number,
     type: "subscription" | "onetime" = "onetime"
   ) => {
     let from = "";

     if (!connected || chainId != token.value) {
       setLoadingText("");

       if (chainId != token.value) {
         await switchNetworkAsync?.(token.value);

         authenticate(true);
       } else if (!connected) {
         authenticate(true);
       }

       setPaymentData({ price, type});

     } else {
       from = account || "";

       setLoadingText("Pending...");

       const ether = await getPrice(price, chainId);

       if (type == "subscription") {
         if (!subCheck) {
           setLoadingText("Checking Wallet...");

           const subdata = await fetch(
             `https://api.covalenthq.com/v1/${Number(
               chainId
             )}/address/${from}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_d8fd93851d6a4d57bdcf14a337d`
           );

           const mainx = await subdata.json();

           const main = mainx.data.items;

           let eSubs: string[] = [];

           for (let i = 0; i < main.length; i++) {
             if (
               contractAddress["subscribe"].toLowerCase() ==
               main[i].contract_address
             ) {
               const { nft_data } = main[i];
               if (nft_data.length) {
                 nft_data.forEach((add: any) => {
                   const { attributes } = add["external_data"];

                   if (attributes[0].id == linkId) {
                     const { expiry, expirySeconds } = attributes[1];

                     const date = new Date();
                     const expDate = new Date(expirySeconds);

                     const extSecs = Date.parse(
                       `${expDate.getFullYear()}-${
                         expDate.getMonth() + 1
                       }-${expDate.getDate()}`
                     );

                     const curSecs = Date.parse(
                       `${date.getFullYear()}-${
                         date.getMonth() + 1
                       }-${date.getDate()}`
                     );

                     if (
                       date.getTime() <= expirySeconds &&
                       extSecs != curSecs
                     ) {
                       eSubs.push(expiry);
                     }
                   }
                 });
               }
             }
           }

           if (eSubs.length) {
             setESubscription(eSubs);

             return;
           }
         }

         setLoadingText("Awaiting payment confirmation");

         const suser: string =
           typeof username == "string"
             ? username
             : usern === undefined
             ? ""
             : usern;

         const seth: string = ethAddress === undefined ? "" : ethAddress;

         setLoadingText("Initializing Subscription...");

         const nft = await generateNftData(
           suser,
           seth,
           mainIx(interval),
           description
             ? description.length
               ? description
               : undefined
             : undefined
         );
         try {
           await beginSubscription(
             nft,
             from,
             ethAddress || "", //receiver
             ethers.utils.parseEther(ether)
           );

           const date = new Date().getTime();

           const rx: { [index: string]: string | number } = {};

           pemail.forEach((val: undefined | string, i: number) => {
             if (val !== undefined && val.length) {
               if (userD.rdata["sub"][i] !== undefined) {
                 rx[userD.rdata["sub"][i].toLowerCase()] = val;
               }
             }
           });

           await post_request(`/link/payments/${linkId}`, {
             ...rx,
             date,
             remind: date + mainIx(interval) * 1000,
             address: from,
             amount: price,
             hash,
             amountCrypto: ether,
             token: "matic",
             type: "sub",
             renewal: interval,
           });

           setTransferSuccess(true);

           setTimeout(reset, 10000);

         } catch (err) {
           console.log(err);
           setTransferFail(true);
           setLoadingText("");
         }
       } else if (type == "onetime") {
         const signed: any = signer;

         const initContract = new ethers.Contract(
           contractAddress["onetime"][chainId ?? 80001],
           PAYMENT.abi,
           signed
         );

         setLoadingText("Awaiting payment confirmation");

         initContract
           .transferToken(ethAddress || "", {
             value: ethers.utils.parseEther(ether),
           }) //receiver
           .then(async (init: any) => {
             console.log(init);

             setHash(init.hash);

             const rx: { [index: string]: string | number } = {};

             pemail.forEach((val: undefined | string, i: number) => {
               if (val !== undefined && val.length) {
                 if (userD.rdata["onetime"][i] !== undefined) {
                   rx[userD.rdata["onetime"][i].toLowerCase()] = val;
                 }
               }
             });

             await post_request(`/link/payments/${linkId}`, {
               ...rx,
               date: new Date().getTime(),
               address: from,
               type: "onetime",
               amount: price,
               hash: init.hash,
               amountCrypto: ether,
               token: "matic",
             });

             setTransferSuccess(true);

             setTimeout(reset, 3500);
           })
           .catch((err: any) => {
             const error = err as Error;
             if (error.message.length) {
               setTransferFail(true);
               console.log(err);
               setLoadingText("");
             }
           });
       }
     }
   };

   useEffect(() => {
     if (connected && paymentData !== undefined) {

       if (chainId == token.value) {
          if(Boolean(signer)){
           beginPayment(paymentData.price, paymentData.type);
           setPaymentData(undefined);
          }
       }
     }
   }, [connected, chainId, token, signer]);


   const [auth, setAuth] = useState<boolean>(true);

   const beginSub = (signer?: import("@wagmi/core").FetchSignerResult<import("@wagmi/core").Signer>
     ) => {
     setFailMessage("");
     setTransferFail(false);
     setHash("");

     if (Number(amount)) {
       if (pemail.length) {
         let proceed = true;

         pemail.forEach((val: undefined | string, i: number) => {
           if (val !== undefined && val.length) {
             if (userD.rdata["sub"][i] !== undefined) {
               if (!validForm(val, userD.rdata["sub"][i].toLowerCase())) {
                 proceed = false;
               }
             }
           }
         });

         if (proceed) {
           setESubscription([]);
           initMain(Number(amount), "subscription");
         } else {
           setFailMessage(
             "Please enter the correct details required in available fields"
           );
         }
       } else {
         setFailMessage("Your email is required");
       }
     } else {
       setFailMessage("The amount set is invalid");
     }
   };

   const beginOne = () => {
     setFailMessage("");
     setTransferFail(false);
     setHash("");
     if (Number(amount)) {
       let proceed = true;

       pemail.forEach((val: undefined | string, i: number) => {
         if (val !== undefined && val.length) {
           if (userD.rdata["onetime"][i] !== undefined) {
             if (!validForm(val, userD.rdata["onetime"][i].toLowerCase())) {
               proceed = false;
             }
           }
         }
       });
       if (proceed) initMain(Number(amount), undefined);
       else
         setFailMessage(
           "Please enter the correct details required in available fields"
         );
     } else {
       setFailMessage("The amount set is invalid");
     }
   };

  return (
    <PaymentContext.Provider
      value={{
        userD,
        setUserD,
        token,
        setToken,
        paymentData,
        setPaymentData,
        data,
        setData,
        isLoading,
        setIsLoading,
        pemail,
        setPemail,
        loadingText,
        setLoadingText,
        transferSuccess,
        setTransferSuccess,
        transferFail,
        setTransferFail,
        failMessage,
        setFailMessage,
        hash,
        setHash,
        interval,
        setTinterval,
        is500,
        setIs500,
        reset,
        initMain,
        amount,
        setAmount,
        beginSub,
        subCheck,
        setSubCheck,
        beginOne,
        eSubscription,
        options,
        setESubscription,
        setSigner,
      }}
    >
      <AuthModal userAuth={false} />
      {children}
    </PaymentContext.Provider>
  );
};
