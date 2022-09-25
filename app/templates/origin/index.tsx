import PropTypes from "prop-types";
import { Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Nav from "../../components/elements/Nav";
import web3 from "web3";
import bigimg from "../../../public/images/logobig.png";
import PAYMENT from "../../../artifacts/contracts/payment.sol/Payment.json";
import SUBSCRIPTION from "../../../artifacts/contracts/subscription.sol/Subscription.json";
import validator from "validator";
import * as temp_x from "./data";
import TabPanel from "../../components/elements/dashboard/link/TabPanel";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedinIn,
  FaLink,
} from "react-icons/fa";
import Link from "next/link";
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
  Button,
  InputLabel,
} from "@mui/material";

import { useMoralis } from "react-moralis";
import Loader from "../../components/elements/loader";
import { useState, useEffect, SetStateAction, useContext } from "react";
import { makeNFTClient } from "../../functions/clients";
import { initD } from "../../components/elements/dashboard/link/data";
import { useCryptea } from "../../contexts/Cryptea";
import { get_request, post_request } from "../../contexts/Cryptea/requests";
import AuthModal from "../../components/elements/modal";
import * as ethers from 'ethers';
import { provider } from "../../contexts/Cryptea/connectors/chains";
import { useSwitchNetwork } from "wagmi";

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
    "42261": "0x672cc5A511bB9E6EFCbeb11Fa3DdbABc31671776"
  },
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

 

const Origin = ({
  className,
  editMode = false,
}: {
  className?: string;
  editMode: boolean;
}) => {
  const router = useRouter();

  let username = router.query["slug"];

  useEffect(() => {}, [username, router.isReady]);

  const [paymentData, setPaymentData] = useState<
    { price: number; type: "onetime" | "subscription" } | undefined
  >();

  
  const [token, setToken] = useState<any>('80001')

  const [alignment, setAlignment] = useState();

  const changeAlignMent = (
    event: any,
    newAlignment: SetStateAction<undefined>
  ) => {
    setAlignment(newAlignment);
  };

  const {
    Moralis,
  } = useMoralis();

  const { isAuthenticated, connected, authenticate, signer, chainId, account } = useCryptea();

  const [data, setData] = useState(temp_x.data);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [userD, setUserD] = useState<{ [index: string]: any }>({});

  const [pemail, setPemail] = useState<string[]>([]);

  const [name, setName] = useState<string>("");

  const [loadingText, setLoadingText] = useState<any>("");
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [transferFail, setTransferFail] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [interval, setTinterval] = useState<string>("daily");
  const [is500, setIs500] = useState<boolean>(false);

  const getPrice = async (price: number, chain: string | number | undefined = 80001) => {
    let final = 0
    setLoadingText("Loading Price data...");

    if(chain == 80001){
    const e = await Moralis.Web3API.token.getTokenPrice({
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", //matic public address
    });

    const priceCurrency = Number(e.usdPrice.toFixed(2));

    final = price / priceCurrency;

  }else if (chain == 42261) {
      // oasis
      final = price / 0.0608;

  }else if (chain == 1313161555) {

      final = price / 1.15;
  }else if (chain == 338) {

    final = price / 0.116;
  }else if (chain == 420) {

    final = price / 0.93;
  }


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
        setFailMessage("Your amount is invalid");
      }
    } catch (x) {
      console.log(x);
      setFailMessage("Something went wrong, Please try again");
    }
  };

  const [amount, setAmount] = useState<string | number>("");

  const [linkHook, setLinkHook] = useState<any>();

  const text = {
    "& .Mui-focused.MuiFormLabel-root": {
      color: data.colorScheme,
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: `${data.colorScheme} !important`,
    },
  };

  useEffect(() => {

    const init = async () => {
      try {
        const { link: lQ, user: userl } = await initD(String(username).toLowerCase());

        if (lQ !== undefined) {
          setLinkHook(lQ);

          if (lQ.template_data !== undefined && !editMode) {
            const { data: udata } = JSON.parse(lQ.template_data);

            setData(udata);

          }

        let linkAmount: string | object | undefined | number;

        if (lQ.amount !== undefined) {
          linkAmount =
            lQ.amount === "variable"
              ? "variable"
              : JSON.parse(lQ.amount);

          if (typeof linkAmount == "number") {
            setAmount(linkAmount);
          }
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
          rdata: JSON.parse(lQ.rdata),
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

  const [subCheck, setSubCheck] = useState<boolean>(true);
  if (!userD) {
    window.location.href = "/404";
  }


  let nft: any = "";


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
    value: ethers.BigNumber
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
        value
      };

      setLoadingText("Transferring Tokens...");

      const trx = await nftContract
        .mintTokens(receiver, to, value, tokenURI, tx)

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

    const { chains, error, pendingChainId, switchNetwork, switchNetworkAsync } =
      useSwitchNetwork();

  console.log(token, signer)

  const beginPayment = async (
    price: number,
    type: "subscription" | "onetime" = "onetime"
  ) => {

    let from = "";

    if(!connected || chainId != token) {
      if(chainId != token){
        await switchNetworkAsync?.(token);

         authenticate(true);

      }else if (!connected) {
           authenticate(true);
      }    

      setPaymentData({ price, type });
     
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

        const mainx = await subdata.json()

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

                    if (date.getTime() <= expirySeconds && extSecs != curSecs) {
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
        description ? (description.length ? description : undefined) : undefined
      );
      try {

        await beginSubscription(
          nft,
          from,
          ethAddress || "", //receiver
          ethers.utils.parseEther(ether)
        );
        
          const date = new Date().getTime();

          const rx:{[index:string]: string | number} = {};

          pemail.forEach((val: undefined | string, i: number) => {
            if (val !== undefined && val.length) {
              if (userD.rdata["sub"][i] !== undefined) {
                     rx[(userD.rdata["sub"][i]).toLowerCase()] = val;
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

          console.log("done");
        

        setTransferSuccess(true);

        setTimeout(reset, 3500);
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
      
    if (chainId == token) {
      if(Boolean(signer)){
      beginPayment(paymentData.price, paymentData.type);
      setPaymentData(undefined);
      }
    }
  }
  }, [connected, chainId, token, signer]);

  const [value, setValue] = useState<number>(0);

  const [auth, setAuth] = useState<boolean>(true);

  const beginSub = () => {

    setFailMessage("");
    setTransferFail(false);
    setHash("");

    if (Number(amount)) {
      if (pemail.length) {
        let proceed = true;

        pemail.forEach((val: undefined | string, i: number) => {
          if (val !== undefined && val.length) {
            if (userD.rdata["sub"][i] !== undefined) {
              if (!validForm(val, (userD.rdata["sub"][i]).toLowerCase())) {
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


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSelectChange = (event: { target: { value: any } }) => {
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
      <AuthModal userAuth={false} />
      {isLoading ? (
        <Loader fixed={false} />
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
                    <div className="flex socials justify-evenly text-[#838383] 3sm:px-16 4sm:px-16 mt-3">
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
                                <div className="py-3 font-bold">Token</div>

                                <Select
                                  id="token"
                                  sx={{
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                      borderColor: data.colorScheme,
                                    },
                                    width: "100%",
                                  }}
                                  value={token}
                                  onChange={(e) => setToken(e.target.value)}
                                >
                                  <MenuItem
                                    sx={{
                                      "&.Mui-selected": {
                                        backgroundColor: `${data.colorScheme}14  !important`,
                                      },
                                    }}
                                    value={80001}
                                  >
                                    Matic (Testnet)
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      "&.Mui-selected": {
                                        backgroundColor: `${data.colorScheme}14  !important`,
                                      },
                                    }}
                                    value={338}
                                  >
                                    Cronos (Test Cronos)
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      "&.Mui-selected": {
                                        backgroundColor: `${data.colorScheme}14  !important`,
                                      },
                                    }}
                                    value={1313161555}
                                  >
                                    Aurora Testnet
                                  </MenuItem>
                                  <MenuItem
                                    sx={{
                                      "&.Mui-selected": {
                                        backgroundColor: `${data.colorScheme}14  !important`,
                                      },
                                    }}
                                    value={42261}
                                  >
                                    Rose Testnet
                                  </MenuItem>
                                </Select>

                                {userD.rdata["onetime"].map(
                                  (ixn: string, i: number) => {
                                    return (
                                      <>
                                        <div className="py-3 font-bold">
                                          {ixn}
                                        </div>

                                        <TextField
                                          fullWidth
                                          id="outlined-basic"
                                          placeholder={`Your ${ixn}`}
                                          variant="outlined"
                                          sx={text}
                                          value={
                                            pemail[i] !== undefined
                                              ? pemail[i]
                                              : ""
                                          }
                                          onChange={(
                                            e: React.ChangeEvent<
                                              | HTMLInputElement
                                              | HTMLTextAreaElement
                                            >
                                          ) => {
                                            setTransferFail(false);
                                            setLoadingText("");
                                            const val = e.target.value;
                                            pemail[i] = val;

                                            setPemail([...pemail]);
                                          }}
                                        />
                                      </>
                                    );
                                  }
                                )}

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
                                      let proceed = true;

                                      pemail.forEach(
                                        (
                                          val: undefined | string,
                                          i: number
                                        ) => {
                                          if (val !== undefined && val.length) {
                                            if (
                                              userD.rdata["onetime"][i] !==
                                              undefined
                                            ) {
                                              if (
                                                !validForm(
                                                  val,
                                                  userD.rdata["onetime"][
                                                    i
                                                  ].toLowerCase()
                                                )
                                              ) {
                                                proceed = false;
                                              }
                                            }
                                          }
                                        }
                                      );
                                      if (proceed) initMain(Number(amount));
                                      else
                                        setFailMessage(
                                          "Please enter the correct details required in available fields"
                                        );
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

                                {userD.rdata["sub"].map(
                                  (ixn: string, i: number) => {
                                    let help: string = "";

                                    if (ixn == "Email") {
                                      help =
                                        "Required to send reminders when your subscription expires";
                                    }

                                    return (
                                      <>
                                        <div className="py-3 font-bold">
                                          {ixn}
                                        </div>

                                        <TextField
                                          fullWidth
                                          id="outlined-basic"
                                          placeholder={`Your ${ixn}`}
                                          variant="outlined"
                                          sx={text}
                                          helperText={help}
                                          value={
                                            pemail[i] !== undefined
                                              ? pemail[i]
                                              : ""
                                          }
                                          onChange={(
                                            e: React.ChangeEvent<
                                              | HTMLInputElement
                                              | HTMLTextAreaElement
                                            >
                                          ) => {
                                            setTransferFail(false);
                                            setLoadingText("");
                                            const val = e.target.value;
                                            pemail[i] = val;

                                            setPemail([...pemail]);
                                          }}
                                        />
                                      </>
                                    );
                                  }
                                )}

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
};

export default Origin;
