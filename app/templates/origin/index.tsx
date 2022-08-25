import PropTypes from "prop-types";
import { Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Image from 'next/image';
import Head from 'next/head';
import Nav from "../../components/elements/Nav";
import web3 from 'web3';
import bigimg from '../../../public/images/logobig.png';
import PAYMENT from '../../../artifacts/contracts/payment.sol/Payment.json';
import SUBSCRIPTION from "../../../artifacts/contracts/subscription.sol/Subscription.json";
import * as temp_x from "./data"; 
import TabPanel from "../../components/elements/dashboard/link/TabPanel";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedinIn, FaLink } from 'react-icons/fa';
import Link from 'next/link'
import {
  OutlinedInput,
  Box,
  MenuItem,
  Avatar,
  Tabs,
  Tab,
  ToggleButton,
  FormControl,
  Select,
  ToggleButtonGroup,
  TextField,
  Button
} from "@mui/material";

import { useMoralis } from "react-moralis";
import Loader from "../../components/elements/loader";
import { useState, useEffect, SetStateAction, useContext } from "react";
import { makeNFTClient } from "../../functions/clients";
import axios from "axios";
import { initD } from "../../components/elements/dashboard/linkOverview/linkData";
import { DashContext } from "../../contexts/GenContext";

const contractAddress: { subscribe: string; onetime: string } = {
  // subscribe: "0xFBdB47e6A5D87E36A9adA55b2eD47DC1A7138457", //rink
  subscribe: "0xd328f64974b319b046cf36E41c945bb773Fed1d8",
  // subscribe:"0x66e8a76240677A8fDd3a8318675446166685C940", //polygon
  onetime: "0xBE6A162578e17D02F9c5F6b2167a62c6C01070ae",
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ["Polygon", "Avalanche", "Ethereum", "Binance Smart Chain"];

function getStyles(name: string, blockchainName: string | any[], theme: Theme) {
  return {
    fontWeight:
      blockchainName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Origin = ({ className, editMode = false }: {className?: string, editMode: boolean}) => {

  const router = useRouter();

  let username = router.query['slug'];

  useEffect(() => {

  }, [username, router.isReady])

  const [alignment, setAlignment] = useState();

  const changeAlignMent = (event: any, newAlignment: SetStateAction<undefined>) => {
    setAlignment(newAlignment);
  };

  const {
    Moralis,
    isWeb3Enabled,
    enableWeb3,
    authenticate,
    chainId,
    isAuthenticated,
  } = useMoralis();

  const [data, setData] = useState(temp_x.data);


  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [userD, setUserD] = useState<{[index: string]: any}>({});
  const [pemail, setPemail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [ loadingText, setLoadingText ] = useState<any>('')
  const [ transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [transferFail, setTransferFail] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [interval, setTinterval] = useState<string>("daily");
  const [is500, setIs500] = useState<boolean>(false);

    const getPrice = async (price: number) => {
      setLoadingText("Loading Price data...");

      const e = await Moralis.Web3API.token.getTokenPrice({
        address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", //matic public address
      });
 
      const priceCurrency = Number(e.usdPrice.toFixed(2));

      const final = price / priceCurrency;

      return (final).toFixed(6);
  };


  const initMain = async (price: number, type: 'subscription' | 'onetime' = 'onetime') => {
    setAuth(false);
    setLoadingText("Initializing Payment")
    try {
        await beginPayment(price, type);
    } catch (x) {
        console.log(x)
    }
  } 

  const [amount, setAmount] = useState<string | number>("");

  const [linkHook, setLinkHook] = useState<any>();

  
  useEffect(() => {

    const init = async () => {
        
      try{
        
        const lQ = await initD(String(username).toLowerCase());

        if (lQ !== undefined) {

          setLinkHook(lQ);

          if(lQ.get('template_data') !== undefined && !editMode){
            
              const { data:udata } = JSON.parse(lQ.get('template_data'));

              setData(udata);

          }

          Moralis.Cloud.run("getUser", { obj: lQ.get("user").id }).then(
            (ex: any) => {
              let linkAmount: string | object | undefined | number;

              if (lQ.get("amount") !== undefined) {
                linkAmount =
                  lQ.get("amount") === "variable"
                    ? "variable"
                    : JSON.parse(lQ.get("amount"));

                if (typeof linkAmount == "number") {
                  setAmount(linkAmount);
                }
              }

              setUserD({
                description:
                  lQ.get("desc") !== undefined
                    ? lQ.get("desc")
                    : ex[0]?.get("desc"),
                username:
                  lQ.get("title") !== undefined
                    ? lQ.get("title")
                    : ex[0]?.get("username"),
                email: ex[0]?.get("email"),
                ethAddress: ex[0]?.get("ethAddress"),
                img:
                  lQ.get("img") !== undefined
                    ? lQ.get("img")
                    : ex[0]?.get("img") === undefined
                    ? ""
                    : ex[0]?.get("img"),
                id: lQ.id,
                onetime: lQ.get("onetime"),
                subscribers: lQ.get("subscribers"),
                linktype: lQ.get("type"),
                amountMultiple: Boolean(lQ.get("amountMulti"))
                  ? JSON.parse(lQ.get("amountMulti"))
                  : [],
                linkAmount,
              });

              if(setIsLoading !== undefined)
                    setIsLoading(false);
            }
          );
        } else {
          router.push("/404");
        }
      }catch(err){
        const error = err as Error;
        console.log(error)
        setIs500(true)
    }
  }
  
  if(router.isReady){
    init();
  }

  }, [Moralis.Cloud, router, username, router.isReady, editMode]);



  const { username: usern, description, email, img, ethAddress, id: linkId, onetime, subscribers }: { username?: string, description?: string, email?: string, img?: string | null, ethAddress?: string, id?: string, onetime?: string, subscribers ?: string} = userD;


   const [subCheck, setSubCheck] = useState<boolean>(true);
  if (!userD) {
    window.location.href = "/404";
  }

  const provider: any = Moralis.provider;

  let nft: any = "";

  const generateNftData = async (
    name: string,
    owner: string,
    duration: number,
    desc?: string,
  ) => {
    const nfx = makeNFTClient(await Moralis.Cloud.run("getNFTStorageKey"));

    const date = new Date();
    
    const exdate = new Date(date.getTime() + (duration * 1000));

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

  const beginSubscription = async (tokenURI: string, receiver: string, to: string, value:string | number) => {
    const web3x = new web3(provider);
    const abi:any = SUBSCRIPTION.abi;
    const nftContract = new web3x.eth.Contract(abi, contractAddress['subscribe']);
    
    try {
      const gasPrice = await web3x.eth.getGasPrice();
      
      const tx = {
        from: receiver,
        value,
        gasPrice
      };

     setLoadingText("Transferring Tokens...");

     const trx = await nftContract.methods
       .mintTokens(receiver, to, value, tokenURI)
       .send(tx);

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


  const mainIx = (inter:string) => {
      const date = new Date();

      if(inter == 'monthly'){

        const datex:number = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); 

        return datex * 86400;

      }else if(inter == 'yearly'){
  
        const year = date.getFullYear();

        return year % 4 ? 31536000 : 31622400; 

      }else if(inter == 'daily'){ 

        return 86400;

      }else if (inter == 'weekly') {
          return 604800;
      }

      return 0
  }

  const reset = () => {
    
    setTransferSuccess(false);
    setFailMessage("");
    setHash("");
    setLoadingText("");
    setTransferFail(false);
    setPemail('');
    setTinterval('')

    if (typeof userD.linkAmount != "number") {
        setAmount('');
    }
}

  const beginPayment = async (
    price: number,
    type: "subscription" | "onetime" = "onetime"
  ) => {
    setLoadingText("Connecting to wallet/Awaiting signature");
    let from = "";
    
    try {
      
      const senx = await authenticate({ signingMessage: message[type] });
      from = senx?.get("ethAddress");

    } catch (e) {
      setTransferFail(true);
      setLoadingText("");
      return;
    }
    
    setLoadingText("Pending...");
    
    const initWeb3 = new web3(provider);

    const ether = await getPrice(price);

    const gasPx = await initWeb3.eth.getGasPrice();

    const gasPrice = parseFloat(gasPx);

    if(type == "subscription"){
      if (!subCheck) {
         setLoadingText("Checking Wallet...");
        const subdata = await axios.get(
          `https://api.covalenthq.com/v1/${Number(
            chainId
          )}/address/${from}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_d8fd93851d6a4d57bdcf14a337d`
        );

        const main = subdata.data.data.items;
        let eSubs: string[] = [];
        if (!subdata.data.error) {
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
                    
                    const extSecs = Date.parse(`${expDate.getFullYear()}-${expDate.getMonth() + 1}-${expDate.getDate()}`);

                    const curSecs = Date.parse(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

                    if ((date.getTime() <= expirySeconds && extSecs != curSecs)) {
                      eSubs.push(expiry);
                    }
                  }
                });
              }
            }
          }
        }

        if (eSubs.length) {
          setESubscription(eSubs);

          return;
        }
      }

      setLoadingText("Awaiting payment confirmation");
  

      const suser: string = typeof username == 'string' ? username : (usern === undefined ? "" : usern);

      const seth: string = ethAddress === undefined ? "" : ethAddress;

      setLoadingText("Initializing Subscription...");

      const nft = await generateNftData(
        suser,
        seth,
        mainIx(interval),
        description ? (description.length ?  description : undefined) : undefined
      );
      try{

      await beginSubscription(
        nft,
        from,
        ethAddress || '', //receiver
        initWeb3.utils.toWei(ether, "ether")
      );

      const remind = subscribers === undefined ? [] : JSON.parse(subscribers);
      const date = new Date().getTime();
       if (linkHook !== undefined) {

          remind.push({
            mail: pemail,
            date,
            remind: date + (mainIx(interval) * 1000),
            address: from,
            amount: price,
            renewal: interval,
          })
         
         linkHook.set("subscribers", JSON.stringify(remind));
         await linkHook.save();
         console.log("done");
       } 

      setTransferSuccess(true);

      setTimeout(reset, 3500)

      }catch(err){
        console.log(err)
         setTransferFail(true); 
        setLoadingText("");
      }

    }else if (type == "onetime") {
      const abi: any = PAYMENT.abi;

      const initContract = new initWeb3.eth.Contract(
        abi,
        contractAddress['onetime']
      );

      setLoadingText("Awaiting payment confirmation")
      
      
      initContract.methods
        .transferToken(ethAddress || '') //receiver
        .send({
          from,
          value: initWeb3.utils.toWei(ether, "ether"),
          gasPrice
        })
        .then(async (init: any) => {
          console.log(init);

          setHash(init.transactionHash);

          const payers = onetime === undefined ? [] : JSON.parse(onetime);

          if (linkHook !== undefined) {
            payers.push({
              date: new Date().getTime(),
              address: from,
              amount: price,
            });

            linkHook.set("onetime", JSON.stringify(payers));

            await linkHook.save();

          }

          setTransferSuccess(true);

          setTimeout(reset, 3500);

        })
        .catch((err: any) => {
          const error = err as Error;
          if (error.message.length) {
            setTransferFail(true);
            console.log(err)
            setLoadingText("");
          }
        });
    }
  };

  const [value, setValue] = useState<number>(0);

  const [auth, setAuth] = useState<boolean>(true)


  const beginSub = () => {
    setFailMessage("");
    setTransferFail(false);
    setHash("");
    
    if (Number(amount)) {
      if (pemail.length) {
        if (
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(
            pemail
          )
        ) {
          setESubscription([]);
          initMain(Number(amount), "subscription");
        } else {
          setFailMessage(
            "Your email is incorrect, please check it and try again"
          );
        }
      } else {
        setFailMessage("Your email is required");
      }
    } else {
      setFailMessage("The amount set is invalid");
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !auth) {
      if (!isWeb3Enabled) {
        enableWeb3()
      }
    } else {
      if (!isWeb3Enabled) {
        enableWeb3()
      }
    }

  }, [
    enableWeb3,
    isWeb3Enabled,
    isAuthenticated,
    auth,
    Moralis
  ]);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSelectChange = (event: { target: { value: any; }; }) => {
    const {
      target: { value },
    } = event;
    setBlockchainName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const theme = useTheme();
  const [blockchainName, setBlockchainName] = useState([]);

  return (
    <div className={`origin ${className}`}>
      {isLoading ? (
        <Loader fixed={false}/>
      ) : (
        <>
          {is500 ? (
            <>
              <div className="h-screen">
                <Head>
                  <title>Cryptea - 500</title>
                  <meta
                    name="description"
                    content="Cryptea - 500 Internal Server Error"
                  />

                  <link rel="icon" href="/favicon.ico" />
                </Head>

                <Nav />

                <div className="w-full h-fit flex flex-col justify-items-center my-8">
                  <div className="text-black font-bold text-4xl mx-auto mt-24">
                    500 Internal Server Error
                  </div>
                  <div
                    style={{
                      color: data.colorScheme,
                    }}
                    className="font-semibold text-lg mx-auto mt-12"
                  >
                    Opps... Refresh this page, if error persist contact support
                    or check your internet access
                  </div>

                  <Link href={window.location.href}>
                    <a className="text-center mt-3">
                      <Button
                        sx={{
                          backgroundColor: `${data.colorScheme} !important`,
                          color: `${data.white} !important`,
                          ":hover": {
                            backgroundColor: `${data.hoverColorScheme} !important`,
                          },
                        }}
                        className="!ml-2 !transition-all !delay-500 !text-sm !capitalize !rounded-lg !font-semibold !py-4 !px-4 !mx-auto"
                      >
                        Refresh Page
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <Head>
                <title>{usern} | Cryptea</title>
                <meta
                  name="description"
                  content={`Send tips to ${usern} quick and easy`}
                />
                <link rel="icon" href="/favicon.ico" />
              </Head>

              <div className="w-full h-full bg-white">
                {/* Board */}
                <div
                  style={data.board0}
                  className="img board relative h-[150px]"
                >
                  <div style={data.board} className="board1"></div>

                  {/* link image */}
                  <div
                    style={data.linkImage}
                    className="absolute border-solid linkimg p-1 m-auto w-fit"
                  >
                    {/* Image */}

                    <Avatar
                      className="imgx_page !font-bold !text-[35px]"
                      src={data.image.src.length ? data.image.src : img}
                      sx={data.image}
                      alt={usern}
                    >
                      {usern?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </div>
                <div className="flex flex-row usm:flex-col">
                  <div className="w-3/5 usm:mb-4 usm:w-full px-8">
                    {/* Header */}

                    <div style={data.header} className="mt-8 header_page">
                      {Boolean(data.header.text.length)
                        ? data.header.text
                        : `${usern}`}
                    </div>

                    {/* socials */}
                    <div className="flex socials justify-evenly text-[#838383] 3sm:px-16 4sm:px-16 mt-6">
                      {!data.socials.instagram.hidden &&
                        Boolean(data.socials.instagram.link.length) && (
                          <Link href={data.socials.instagram.link}>
                            <a>
                              <FaInstagram
                                size={30}
                                className="cursor-pointer"
                                color={data.socials.backgroundColor}
                              />
                            </a>
                          </Link>
                        )}

                      {!data.socials.twitter.hidden &&
                        Boolean(data.socials.twitter.link.length) && (
                          <Link href={data.socials.twitter.link}>
                            <a>
                              <FaTwitter
                                color={data.socials.backgroundColor}
                                size={30}
                                className="cursor-pointer"
                              />
                            </a>
                          </Link>
                        )}

                      {!data.socials.facebook.hidden &&
                        Boolean(data.socials.facebook.link.length) && (
                          <Link href={data.socials.facebook.link}>
                            <a>
                              <FaFacebook
                                size={30}
                                className="cursor-pointer"
                                color={data.socials.backgroundColor}
                              />
                            </a>
                          </Link>
                        )}

                      {!data.socials.linkedin.hidden &&
                        Boolean(data.socials.linkedin.link.length) && (
                          <Link href={data.socials.linkedin.link}>
                            <a>
                              <FaLinkedinIn
                                size={30}
                                className="cursor-pointer"
                                color={data.socials.backgroundColor}
                              />
                            </a>
                          </Link>
                        )}
                    </div>

                    {/* intro text */}
                    <div
                      style={data.introText}
                      className="mt-8 intro_text_page"
                    >
                      {Boolean(data.introText.text.length)
                        ? data.introText.text
                        : `${description}`}
                    </div>

                    {/* work statement */}
                    <div className="links mt-5 work_state_page">
                      <div style={data.workState}>
                        {Boolean(data.workState.text.length)
                          ? data.workState.text
                          : `Support ${usern}'s Work`}
                      </div>
                    </div>
                  </div>

                  <div className="w-2/5 2usm:w-full relative usm:w-[85%] usm:m-auto min-w-[340px] px-6 my-8 justify-items-center">
                    {Boolean(loadingText) && !transferFail && !transferSuccess && (
                      <Loader
                        sx={{
                          backgroundColor: "rgba(255,255,255,.6)",
                          backdropFilter: "blur(5px)",
                        }}
                        fixed={false}
                        text={loadingText}
                        incLogo={false}
                      />
                    )}
                    {/* paymentbox */}
                    <div className="rounded-lg bg-white shadow-lg shadow-[#cccccc]">
                      <div className="border-b py-[14px] px-[17px] text-xl font-bold">
                        Send Payment
                      </div>
                      <div className="form relative pt-[10px]">
                        <Box sx={{ width: "100%" }}>
                          {userD?.linktype == "both" && (
                            <Box
                              sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                              }}
                            >
                              {/* body */}
                              <Tabs
                                value={value}
                                onChange={handleChange}
                                sx={{
                                  "& .MuiTabs-flexContainer": {
                                    width: "100%",
                                    justifyContent: "space-around",
                                  },
                                  "& .MuiTab-root.MuiButtonBase-root.Mui-selected":
                                    {
                                      fontWeight: "bold",
                                      borderRadius: "4px",
                                      color: data.colorScheme,
                                      backgroundColor: `${
                                        data.colorScheme.length > 7
                                          ? data.colorScheme.substring(0, 7) +
                                            "23"
                                          : data.colorScheme + "23"
                                      } !important`,
                                      textTransform: "capitalize",
                                    },
                                  "& .MuiButtonBase-root.MuiTab-root": {
                                    fontWeight: "bold",
                                    borderRadius: "4px",
                                    textTransform: "capitalize",
                                  },
                                  "& .MuiTabs-indicator": {
                                    backgroundColor: `${data.colorScheme} !important`,
                                    opacity: "0.14",
                                  },
                                }}
                                aria-label="payment tabs"
                              >
                                <Tab
                                  className="!font-bold !rounded-[4px] !capitalize"
                                  label="Onetime😇"
                                  {...a11yProps(0)}
                                />

                                <Tab
                                  className="!font-bold !rounded-[4px] !capitalize"
                                  label="Subscription😍"
                                  {...a11yProps(1)}
                                />
                              </Tabs>
                            </Box>
                          )}

                          {/* error */}
                          {(transferFail || Boolean(failMessage)) && (
                            <div
                              style={data.error}
                              className="rounded-md w-[95%] font-bold mt-2 mx-auto p-3"
                            >
                              {failMessage.length
                                ? failMessage
                                : "Something went wrong with the transaction, please try again"}
                            </div>
                          )}

                          {Boolean(eSubscription.length) && (
                            <div className="h-full left-0 bg-white top-0 z-[100] flex flex-col px-9 justify-center items-center w-full absolute">
                              <div className="text-black font-bold text-3xl mx-auto mt-24">
                                Hmm... a little conflict
                              </div>

                              {/* body */}
                              <div
                                style={{
                                  color: data.colorScheme,
                                }}
                                className="font-semibold text-lg text-center mx-auto mt-12"
                              >
                                we found you have an existing unexpired
                                subscription, do you want to go on with
                                subscribing again?🤔
                              </div>

                              <div className="mt-11 flex justify-center items-center">
                                <Button
                                  onClick={() => {
                                    setFailMessage(
                                      "Transaction cancelled by user"
                                    );
                                  }}
                                  sx={{
                                    transition: "all .5s",
                                    textTransform: "capitalize",
                                    marginRight: "12px",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    backgroundColor: `${data.colorScheme} !important`,
                                    padding: "16px",
                                    color: data.white,
                                    borderRadius: "8px",
                                    fontWeight: "semibold",
                                    ":hover": {
                                      backgroundColor: `${data.hoverColorScheme} !important`,
                                    },
                                  }}
                                >
                                  No, Cancel
                                </Button>

                                <Button
                                  onClick={() => {
                                    setTransferSuccess(false);
                                    setFailMessage("");
                                    setHash("");
                                    setLoadingText("");
                                    setTransferFail(false);
                                    setSubCheck(false);
                                    beginSub();
                                  }}
                                  sx={{
                                    transition: "all .5s",
                                    textTransform: "capitalize",
                                    marginRight: "12px",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    backgroundColor: `${data.colorScheme} !important`,
                                    padding: "16px",
                                    color: data.white,
                                    borderRadius: "8px",
                                    fontWeight: "semibold",
                                    ":hover": {
                                      backgroundColor: `${data.hoverColorScheme} !important`,
                                    },
                                  }}
                                >
                                  Yes, Continue
                                </Button>
                              </div>
                            </div>
                          )}
                          {/* success */}
                          {transferSuccess && (
                            <div className="h-full backdrop-blur-[3px] absolute left-0 bg-[rgba(255,255,255,.6)] top-0 z-[100] flex flex-col justify-evenly items-center w-full">
                              <div className="animation-ctn">
                                <div className="icon icon--order-success svg">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="154px"
                                    height="154px"
                                  >
                                    <g
                                      fill="none"
                                      stroke={data.colorScheme}
                                      strokeWidth="2"
                                    >
                                      <circle
                                        cx="77"
                                        cy="77"
                                        r="72"
                                        style={{
                                          strokeDasharray: "480px, 480px",
                                          strokeDashoffset: "960px",
                                        }}
                                      ></circle>
                                      <circle
                                        id="colored"
                                        fill={data.colorScheme}
                                        cx="77"
                                        cy="77"
                                        r="72"
                                        style={{
                                          strokeDasharray: "480px, 480px",
                                          strokeDashoffset: "960px",
                                        }}
                                      ></circle>
                                      <polyline
                                        className="st0"
                                        stroke={data.white}
                                        strokeWidth="10"
                                        points="43.5,77.8 63.7,97.9 112.2,49.4 "
                                        style={{
                                          strokeDasharray: "100px, 100px",
                                          strokeDashoffset: "200px",
                                        }}
                                      />
                                    </g>
                                  </svg>
                                </div>
                              </div>

                              <h2
                                style={{
                                  color: data.colorScheme,
                                }}
                                className="mb-2 text-[15px] font-bold"
                              >
                                {!value
                                  ? `Payment was successful`
                                  : `Subscription was successful`}
                              </h2>

                              <Link
                                href={`https://mumbai.polygonscan.com/tx/${hash}`}
                              >
                                <a
                                  target={"_blank"}
                                  className="text-[#5a5a5a] cursor-pointer mb-1 font-normal"
                                >
                                  View transaction on polygonscan
                                </a>
                              </Link>

                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: `${data.colorScheme} !important`,
                                }}
                                className=" !mt-4 !py-[5px] !font-medium !capitalize !mx-auto"
                                style={{
                                  fontFamily: "inherit",
                                }}
                                onClick={reset}
                              >
                                Done
                              </Button>
                            </div>
                          )}

                          <TabPanel value={value} index={0}>
                            {(userD?.linktype == "both" ||
                              userD?.linktype == "onetime") && (
                              <FormControl fullWidth>
                                {/* <Select
                          disabled
                          displayEmpty
                          value={blockchainName}
                          onChange={handleSelectChange}
                          input={<OutlinedInput />}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <span>Select Blockchain</span>;
                            }

                            return selected.join(", ");
                          }}
                          MenuProps={MenuProps}
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="">Select Blockchain</MenuItem>
                          {names.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              style={getStyles(name, blockchainName, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select> */}

                                <div className="py-3 font-bold">
                                  Amount (USD)
                                  {typeof userD?.linkAmount == "number"
                                    ? ` - $${userD?.linkAmount}`
                                    : ""}
                                </div>

                                {Boolean(userD?.amountMultiple.length) &&
                                  typeof userD?.linkAmount != "number" && (
                                    <ToggleButtonGroup
                                      value={amount}
                                      sx={{
                                        justifyContent: "space-between",
                                        width: "100%",
                                        "& .Mui-selected": {
                                          backgroundColor: `${data.colorScheme} !important`,
                                          color: `${data.white} !important`,
                                        },
                                        "& .MuiButtonBase-root:first-of-type": {
                                          marginRight: "0px !important",
                                          marginLeft: "0px !important",
                                        },
                                        "& .MuiButtonBase-root": {
                                          marginRight: "15px !important",
                                        },
                                        "& .MuiToggleButtonGroup-grouped": {
                                          borderRadius: "4px !important",
                                          minWidth: 55,
                                          marginLeft: 3,
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.12) !important",
                                        },
                                      }}
                                      exclusive
                                      className="w-full cusscroller overflow-y-hidden justify-between mb-2 pb-1"
                                      onChange={(e: any) => {
                                        setTransferFail(false);
                                        setLoadingText("");
                                        const val = e.target.value;
                                        setAmount(val.replace(/[^\d.]/g, ""));
                                      }}
                                    >
                                      {userD?.amountMultiple.map(
                                        (amount: number, i: number) => (
                                          <ToggleButton
                                            key={i}
                                            sx={{
                                              textTransform: "capitalize",
                                              fontWeight: "bold",
                                            }}
                                            value={`${amount}`}
                                          >
                                            {amount}
                                          </ToggleButton>
                                        )
                                      )}
                                    </ToggleButtonGroup>
                                  )}

                                {Boolean(userD?.amountMultiple.length) &&
                                  typeof userD?.linkAmount != "number" && (
                                    <div className="py-3 font-bold">
                                      Or input Amount manually
                                    </div>
                                  )}

                                {typeof userD?.linkAmount != "number" && (
                                  <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    variant="outlined"
                                    sx={{
                                      "& .Mui-focused.MuiFormLabel-root": {
                                        color: data.colorScheme,
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: `${data.colorScheme} !important`,
                                        },
                                    }}
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(
                                      e: React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                      >
                                    ) => {
                                      setTransferFail(false);
                                      setLoadingText("");
                                      const val = e.target.value;
                                      setAmount(val.replace(/[^\d.]/g, ""));
                                    }}
                                  />
                                )}

                                <Button
                                  sx={{
                                    backgroundColor: `${data.colorScheme} !important`,
                                  }}
                                  variant="contained"
                                  className="!mt-4 !py-[13px] !font-medium !capitalize"
                                  style={{
                                    fontFamily: "inherit",
                                  }}
                                  onClick={() => {
                                    setFailMessage("");
                                    setTransferFail(false);
                                    setHash("");
                                    if (Number(amount)) {
                                      initMain(Number(amount));
                                    } else {
                                      setFailMessage(
                                        "The amount set is invalid"
                                      );
                                    }
                                  }}
                                  fullWidth
                                >
                                  Send
                                </Button>
                              </FormControl>
                            )}
                          </TabPanel>
                          <TabPanel value={value} index={1}>
                            {(userD?.linktype == "sub" ||
                              userD?.linktype == "both") && (
                              <FormControl fullWidth>
                                <div className="py-3 font-bold">
                                  Subscription Duration
                                </div>
                                <ToggleButtonGroup
                                  value={interval}
                                  exclusive
                                  sx={{
                                    justifyContent: "space-between",
                                    width: "100%",
                                    "& .Mui-selected": {
                                      backgroundColor: `${data.colorScheme} !important`,
                                      color: `${data.white} !important`,
                                    },
                                    "& .MuiToggleButtonGroup-grouped": {
                                      borderRadius: "4px !important",
                                      minWidth: 55,
                                      border:
                                        "1px solid rgba(0, 0, 0, 0.12) !important",
                                    },
                                  }}
                                  onChange={(e: any) => {
                                    setTransferFail(false);
                                    setLoadingText("");
                                    const val = e.target.value;
                                    setTinterval(val);
                                  }}
                                >
                                  <ToggleButton
                                    className="capitalize font-bold"
                                    value="daily"
                                  >
                                    Daily
                                  </ToggleButton>

                                  <ToggleButton
                                    className="capitalize font-bold"
                                    value="weekly"
                                  >
                                    Weekly
                                  </ToggleButton>
                                  <ToggleButton
                                    className="capitalize font-bold"
                                    value="monthly"
                                  >
                                    Monthly
                                  </ToggleButton>

                                  <ToggleButton
                                    className="capitalize font-bold"
                                    value="yearly"
                                  >
                                    Yearly
                                  </ToggleButton>
                                </ToggleButtonGroup>

                                <div className="py-3 font-bold">Email</div>

                                <TextField
                                  fullWidth
                                  id="outlined-basic"
                                  placeholder={"example@cryptea.me"}
                                  variant="outlined"
                                  sx={{
                                    "& .Mui-focused.MuiFormLabel-root": {
                                      color: data.colorScheme,
                                    },
                                    "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: `${data.colorScheme} !important`,
                                      },
                                  }}
                                  helperText="This is just to send a reminder when your subscription expires"
                                  value={pemail}
                                  onChange={(
                                    e: React.ChangeEvent<
                                      HTMLInputElement | HTMLTextAreaElement
                                    >
                                  ) => {
                                    setTransferFail(false);
                                    setLoadingText("");
                                    const val = e.target.value;
                                    setPemail(val);
                                  }}
                                />

                                <div className="my-2">
                                  <div className="py-3 font-bold">
                                    Amount (USD)
                                    {typeof userD?.linkAmount == "number"
                                      ? ` - $${userD?.linkAmount}`
                                      : ""}
                                  </div>

                                  {Boolean(userD?.amountMultiple.length) &&
                                    typeof userD?.linkAmount != "number" && (
                                      <ToggleButtonGroup
                                        value={amount}
                                        sx={{
                                          justifyContent: "space-between",
                                          width: "100%",
                                          "& .Mui-selected": {
                                            backgroundColor: `${data.colorScheme} !important`,
                                            color: `${data.white} !important`,
                                          },
                                          "& .MuiButtonBase-root:first-of-type":
                                            {
                                              marginRight: "0px !important",
                                              marginLeft: "0px !important",
                                            },
                                          "& .MuiButtonBase-root": {
                                            marginRight: "15px !important",
                                          },
                                          "& .MuiToggleButtonGroup-grouped": {
                                            borderRadius: "4px !important",
                                            minWidth: 55,
                                            marginLeft: 3,
                                            border:
                                              "1px solid rgba(0, 0, 0, 0.12) !important",
                                          },
                                        }}
                                        exclusive
                                        className="w-full cusscroller overflow-y-hidden justify-between mb-2 pb-1"
                                        onChange={(e: any) => {
                                          setTransferFail(false);
                                          setLoadingText("");
                                          const val = e.target.value;

                                          setAmount(val.replace(/[^\d.]/g, ""));
                                        }}
                                      >
                                        {userD?.amountMultiple.map(
                                          (amount: number, i: number) => (
                                            <ToggleButton
                                              key={i}
                                              sx={{
                                                textTransform: "capitalize",
                                                fontWeight: "bold",
                                              }}
                                              value={`${amount}`}
                                            >
                                              {amount}
                                            </ToggleButton>
                                          )
                                        )}
                                      </ToggleButtonGroup>
                                    )}
                                </div>

                                {Boolean(userD?.amountMultiple.length) &&
                                  typeof userD?.linkAmount != "number" && (
                                    <div className="py-3 font-bold">
                                      Or input Amount manually
                                    </div>
                                  )}

                                {typeof userD.linkAmount != "number" && (
                                  <TextField
                                    fullWidth
                                    id="outlined-basic"
                                    variant="outlined"
                                    sx={{
                                      "& .Mui-focused.MuiFormLabel-root": {
                                        color: data.colorScheme,
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: `${data.colorScheme} !important`,
                                        },
                                    }}
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(
                                      e: React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                      >
                                    ) => {
                                      setTransferFail(false);
                                      setLoadingText("");
                                      const val = e.target.value;
                                      setAmount(val.replace(/[^\d.]/g, ""));
                                    }}
                                  />
                                )}

                                <Button
                                  variant="contained"
                                  sx={{
                                    backgroundColor: `${data.colorScheme} !important`,
                                  }}
                                  className="!mt-4 !py-[13px] !font-medium !capitalize"
                                  style={{
                                    fontFamily: "inherit",
                                  }}
                                  onClick={beginSub}
                                  fullWidth
                                >
                                  Subscribe
                                </Button>
                              </FormControl>
                            )}
                          </TabPanel>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Origin;
