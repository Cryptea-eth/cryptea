import PropTypes from "prop-types";
import { Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Image from 'next/image';
import Head from 'next/head';
import Nav from "../../app/components/elements/Nav";
import web3 from 'web3';
import bigimg from '../../public/images/logobig.png';
import PAYMENT from '../../artifacts/contracts/payment.sol/Payment.json';
import SUBSCRIPTION from "../../artifacts/contracts/subscription.sol/Subscription.json";
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

import Loader from "../../app/components/elements/loader";

import { useState, useEffect, SetStateAction } from "react";
import { makeNFTClient } from "../../app/components/functions/clients";
import Moralis from "moralis/types";
import axios from "axios";

const contractAddress: { subscribe: string; onetime: string } = {
  subscribe: "0xfaf92e3AFcC7cA3C3a6ec35A16122eb1d7ab678d",
  // subscribe:"0x66e8a76240677A8fDd3a8318675446166685C940",
  onetime: "0xa6aE0280a3eE37975586211d18578D232A1B98c5",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
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

function User() {

  const router = useRouter();


  let username = router.query['slug'];


  useEffect(() => {

  }, [username, router.isReady])

  const [alignment, setAlignment] = useState();

  const changeAlignMent = (event: any, newAlignment: SetStateAction<undefined>) => {
    setAlignment(newAlignment);
  };


  const { Moralis, isWeb3Enabled, enableWeb3, authenticate, chainId, isAuthenticated } = useMoralis();

  const [userD, setUserD] = useState({});
  const [pemail, setPemail] = useState<string>("");
  const [name, setName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true);
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
 
      const priceCurrency = parseFloat(e.usdPrice.toFixed(2));

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


  const [linkHook, setLinkHook] = useState<Moralis.Object<Moralis.Attributes>[]>(); 

  useEffect(() => {
    if (router.isReady) {
      const Link = Moralis.Object.extend('link')
      const lQ = new Moralis.Query(Link);
      lQ.equalTo('link', String(username).toLowerCase())
      
      lQ.find().then((er) => {
        if (er !== undefined) {
          setLinkHook(er);
          Moralis.Cloud.run("getUser", { obj: er[0]?.get("user").id }).then(
            (ex) => {
              setUserD({
                description: ex[0]?.get("desc"),
                username: ex[0]?.get("username"),
                email: ex[0]?.get("email"),
                ethAddress: ex[0]?.get("ethAddress"),
                img: er[0]?.get('img') !== undefined ? er[0]?.get('img') : (ex[0]?.get("img") === undefined ? "" : ex[0]?.get("img")),
                id: er[0].id,
                onetime: er[0].get('onetime'),
                subscribers: er[0].get('subscribers') 
              });

            setIsLoading(false);
          }
        );
      } else {
        window.location.href = "/404";
      }
    }).catch(err => {
        console.log(err);
        setIs500(true)
    })
  }
  }, [Moralis.Cloud, Moralis.Object, Moralis.Query, router.isReady, username]);

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
        gasPrice,
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
    }
  };



  const message: { [index: string]: string } = {
    subscription: `Subscription To ${usern} content`,
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

      return;

    }
    setLoadingText("Pending...");

    const initWeb3 = new web3(provider);

    const ether = await getPrice(price);

    const gasPx = await initWeb3.eth.getGasPrice();

    const gasPrice = parseFloat(gasPx);
    if(type == "subscription"){
      if (subCheck) {
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
        "0x88BA009d29e28378A0542832Da35aABf262045c9", //receiver
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
         
         linkHook[0].set("subscribers", JSON.stringify(remind));
         await linkHook[0].save();
         console.log("done");
       } 

      
      setTransferSuccess(true);

      }catch(err){
        console.log(err)
      }

    }else if (type == "onetime") {
      const abi: any = PAYMENT.abi;

      const initContract = new initWeb3.eth.Contract(
        abi,
        contractAddress['onetime']
      );

      setLoadingText("Awaiting payment confirmation");

      initContract.methods
        .sendToken("0xc07e4542B10D1a8a5261780a47CfE69F9fFc38A4") //receiver
        .send({
          from,
          value: initWeb3.utils.toWei(ether, "ether"),
          gasPrice,
          gas: null,
          gasLimit: null,
          maxGasPrice: null,
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

            linkHook[0].set("onetime", JSON.stringify(payers));

            await linkHook[0].save();

          }

          setTransferSuccess(true);
        })
        .catch((err: any) => {
          const error = err as Error;
          if (error.message.length) {
            setTransferFail(true);
          }
        });
    }
  };

  const [value, setValue] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');

  const [auth, setAuth] = useState<boolean>(true)


  const beginSub = () => {
    setFailMessage("");
    setTransferFail(false);
    setHash("");
    
    if (parseFloat(amount)) {
      if (pemail.length) {
        if (
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(
            pemail
          )
        ) {
          setESubscription([]);
          initMain(parseFloat(amount), "subscription");
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
          enableWeb3();
        }
    }else{
      if(!isWeb3Enabled){
          enableWeb3();   
      }
    }

  }, [enableWeb3, isWeb3Enabled, isAuthenticated, auth]);


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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {is500 ? (
            <>
              <div className="h-screen">
                <Head>
                  <title>Cryptea - 505</title>
                  <meta
                    name="description"
                    content="Cryptea - 505 Internal Server Error"
                  />
                  <link rel="icon" href="/favicon.ico" />
                </Head>

                <Nav />

                <div className="w-full h-fit flex flex-col justify-items-center my-8">
                  <div className="text-black font-bold text-4xl mx-auto mt-24">
                    500 Internal Server Error
                  </div>
                  <div className="text-[#F57059] font-semibold text-lg mx-auto mt-12">
                    Opps... Refresh this page, if error persist contact support
                    or check your internet access
                  </div>

                  <Link href={window.location.href}>
                    <a className="text-center mt-3">
                      <Button className="ml-2 hover:bg-[#ff320e] transition-all delay-500 text-sm !capitalize rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4 mx-auto">
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
                <div className="img relative h-[150px] bg-[#dfcdb3]">
                  <div
                    className="bg-repeat h-[135px] bg-[#FFEBCD] bg-pattern"
                    style={{
                      backgroundSize: 90,
                      backgroundBlendMode: "multiply",
                    }}
                  ></div>
                  <div className="absolute border-solid border-[4px] p-1 border-[#f57059] rounded-[50%] left-0 right-0 m-auto bottom-[-29px] w-fit">
                    {!img?.length ? (
                      <Avatar
                        sx={{
                          bgcolor: "#F57059",
                          width: 140,
                          height: 140,
                        }}
                        className="!font-bold !text-[35px]"
                        alt={usern}
                      >
                        {usern?.charAt(0).toUpperCase()}
                      </Avatar>
                    ) : (
                      <Avatar
                        src={img}
                        sx={{ width: 140, height: 140 }}
                        alt={usern}
                      ></Avatar>
                    )}
                  </div>
                </div>
                <div className="flex flex-row usm:flex-col">
                  <div className="w-3/5 usm:mb-4 usm:w-full px-8">
                    <div className="text-4xl font-semibold mt-8">
                      {usern} is {description}
                    </div>
                    <div className="text-[#838383] text-lg mt-8">
                      {description}
                    </div>
                    <div className="flex justify-between text-[#838383] 3sm:px-16 4sm:px-16 mt-6">
                      <Link href="#">
                        <FaInstagram size={30} color="#F57059" />
                      </Link>
                      <Link href="#">
                        <FaTwitter color="#F57059" size={30} className="" />
                      </Link>
                      <Link href="#">
                        <FaFacebook size={30} color="#F57059" />
                      </Link>
                      <Link href="#">
                        <FaLinkedinIn size={30} color="#F57059" />
                      </Link>
                    </div>

                    <div className="links mt-5">
                      <div className="bg-[#f5705924] text-[#F57059] font-bold rounded-full p-4">
                        Support {usern}&#39;s Work
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

                    <div className="rounded-lg bg-white shadow-lg shadow-[#cccccc]">
                      <div className="border-b py-[14px] px-[17px] text-xl font-bold">
                        Send Payment
                      </div>
                      <div className="form relative pt-4">
                        <Box sx={{ width: "100%" }}>
                          <Box
                            sx={{
                              borderBottom: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Tabs
                              value={value}
                              onChange={handleChange}
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
                          {(transferFail || Boolean(failMessage)) && (
                            <div className="rounded-md w-[95%] font-bold mt-2 mx-auto p-3 bg-[#ff8f33] text-white">
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
                              <div className="text-[#F57059] font-semibold text-lg text-center mx-auto mt-12">
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
                                  className="hover:bg-[#ff320e] transition-all delay-500 text-sm !capitalize rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4 mr-3"
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
                                  className="ml-3 hover:bg-[#ff320e] transition-all delay-500 text-sm !capitalize rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4"
                                >
                                  Yes, Continue
                                </Button>
                              </div>
                            </div>
                          )}

                          {transferSuccess && (
                            <div className="h-full backdrop-blur-[3px] absolute left-0 bg-[rgba(255,255,255,.6)] top-0 z-[100] flex flex-col justify-center items-center w-full">
                              <div className="animation-ctn">
                                <div className="icon icon--order-success svg">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="154px"
                                    height="154px"
                                  >
                                    <g
                                      fill="none"
                                      stroke="#F57059"
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
                                        fill="#F57059"
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
                                        stroke="#fff"
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

                              <h2 className="text-[#f57059] mb-2 text-[15px] font-bold">
                                {usern} has been tipped successfully
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
                                className="!bg-[#F57059] !mt-4 !py-[5px] !font-medium !capitalize mx-auto"
                                style={{
                                  fontFamily: "inherit",
                                }}
                                onClick={() => {
                                  setTransferSuccess(false);
                                  setFailMessage("");
                                  setHash("");
                                  setLoadingText("");
                                  setTransferFail(false);
                                }}
                              >
                                Done
                              </Button>
                            </div>
                          )}

                          <TabPanel value={value} index={0}>
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

                              <div className="py-3 font-bold">Amount (USD)</div>

                              <ToggleButtonGroup
                                value={amount}
                                exclusive
                                className="w-full justify-between"
                                onChange={(e: any) => {
                                  setTransferFail(false);
                                  const val = e.target.value;
                                  setAmount(val.replace(/[^\d.]/g, ""));
                                }}
                              >
                                <ToggleButton value="0.1">0.1</ToggleButton>
                                <ToggleButton value="1">1</ToggleButton>
                                <ToggleButton value="10">10</ToggleButton>
                                <ToggleButton value="50">50</ToggleButton>
                                <ToggleButton value="100">100</ToggleButton>
                              </ToggleButtonGroup>

                              <div className="py-3 font-bold">
                                Or input Amount manually
                              </div>
                              <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                placeholder="USD"
                                value={amount}
                                onChange={(
                                  e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                  >
                                ) => {
                                  setTransferFail(false);
                                  const val = e.target.value;
                                  setAmount(val.replace(/[^\d.]/g, ""));
                                }}
                              />

                              <Button
                                variant="contained"
                                className="!bg-[#F57059] !mt-4 !py-[13px] !font-medium !capitalize"
                                style={{
                                  fontFamily: "inherit",
                                }}
                                onClick={() => {
                                  setFailMessage("");
                                  setTransferFail(false);
                                  setHash("");
                                  if (parseFloat(amount)) {
                                    initMain(parseFloat(amount));
                                  } else {
                                    setFailMessage("The amount set is invalid");
                                  }
                                }}
                                fullWidth
                              >
                                Send
                              </Button>
                            </FormControl>
                          </TabPanel>
                          <TabPanel value={value} index={1}>
                            <FormControl fullWidth>
                              <div className="py-3 font-bold">
                                Subscription Duration
                              </div>
                              <ToggleButtonGroup
                                value={interval}
                                exclusive
                                className="w-full justify-between"
                                onChange={(e: any) => {
                                  setTransferFail(false);
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
                                placeholder={"Email"}
                                variant="outlined"
                                helperText="This is just to send a reminder when your subscription expires"
                                value={pemail}
                                onChange={(
                                  e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                  >
                                ) => {
                                  setTransferFail(false);
                                  const val = e.target.value;
                                  setPemail(val);
                                    
                                }}
                              />

                              <div className="my-2">
                                <div className="py-3 font-bold">
                                  Amount (USD)
                                </div>

                                <ToggleButtonGroup
                                  value={amount}
                                  exclusive
                                  className="w-full justify-between"
                                  onChange={(e: any) => {
                                    setTransferFail(false);
                                    const val = e.target.value;

                                    setAmount(val.replace(/[^\d.]/g, ""));
                                  }}
                                >
                                  <ToggleButton value="0.1">0.1</ToggleButton>
                                  <ToggleButton value="1">1</ToggleButton>
                                  <ToggleButton value="10">10</ToggleButton>
                                  <ToggleButton value="50">50</ToggleButton>
                                  <ToggleButton value="100">100</ToggleButton>
                                </ToggleButtonGroup>
                              </div>

                              <div className="py-3 font-bold">
                                Or input Amount manually
                              </div>
                              <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                placeholder="USD"
                                value={amount}
                                onChange={(
                                  e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                  >
                                ) => {
                                  setTransferFail(false);
                                  const val = e.target.value;
                                  setAmount(val.replace(/[^\d.]/g, ""));
                                }}
                              />

                              <Button
                                variant="contained"
                                className="!bg-[#F57059] !mt-4 !py-[13px] !font-medium !capitalize"
                                style={{
                                  fontFamily: "inherit",
                                }}
                                onClick={beginSub}
                                fullWidth
                              >
                                Subscribe
                              </Button>

                            </FormControl>
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
    </>
  );
}

export default User;
