import soonImg from "../../../public/images/coming-soon.svg";
import * as ethers from "ethers";
import NumberFormat from "react-number-format";
import Page from "../../../app/components/elements/dashboard";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Head from "next/head";
import empty from "../../../public/images/empty2.png";
import Select, { createFilter } from "react-select";
import {
  Tooltip,
  Button,
  CircularProgress,
  Modal,
  Box,
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
  Alert,
  ClickAwayListener,
} from "@mui/material";
import {
  MdInfo,
  MdOutlineVisibility,
  MdPayment,
  MdOutlineVisibilityOff,
  MdSubscriptions,
  MdClose,
  MdOutlinePermContactCalendar,
} from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaCoins, FaCopy } from "react-icons/fa";
import CustomImg from "../../../app/components/elements/customImg";
import { BiChevronRight, BiCopy } from "react-icons/bi";
import copy from "copy-to-clipboard";
import { BsCoin } from "react-icons/bs";
import { HiCurrencyDollar } from "react-icons/hi";
import { RiCoinFill } from "react-icons/ri";
import Link from "next/link";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { PinField } from "react-pin-field";
import axios, { AxiosError } from "axios";
import { CryptoList } from "../../../app/contexts/Cryptea/connectors/chains";
import { get_request } from "../../../app/contexts/Cryptea/requests";
import Image from "next/image";
import Loader from "../../../app/components/elements/loader";
import { months } from "../../../app/components/elements/dashboard/linkOverview/generateData";
import TabPanel from "../../../app/components/elements/dashboard/link/TabPanel";
import { token } from "../../../app/contexts/Cryptea/types";
import { ValueContainer } from "react-select/dist/declarations/src/components/containers";
import { blockchains } from "../../../app/contexts/Cryptea/blockchains";
import { TbPoint, TbPointOff } from "react-icons/tb";
import { SolanaCryptoList } from "../../../app/contexts/Cryptea/connectors/solana";
import { TronCryptoList } from "../../../app/contexts/Cryptea/connectors/tron";
import http from "../../../utils/http";

const Settlements = () => {

  const router = useRouter();

  const [blur, setBlur] = useState<boolean>(true);

  const [blurModal, setBlurModal] = useState<boolean>(true);

  const sAddresses = useRef<any>({});

  const [dashData, setDashData] = useState<any>({
    payments: [],
    fees: {},
    finalBalance: {},
    pending: 0,
    settlement_acct: [],
    breakDownObj: [],
    balance: 0,
    breakdown: [],
  });

  const [settlementsTrx, setSettlementsTrx] = useState<any>({});

  const [withdrawToken, setWithdrawToken] = useState<any>();

  const [ref, setRef] = useState<any>({
    link: '',
    name: ''
  });

  const [addressTo, setAddressTo] = useState<string>("");

  const [cryptoRate, setCryptoRate] = useState<string | number>(0);

  const [amount, setAmount] = useState<{
    fiat: string;
    crypto: string;
  }>({
    fiat: "",
    crypto: "",
  });

  const once = useRef<boolean>(true);

  const onceBal = useRef<boolean>(false);

  const [pins, setPin] = useState<{ [index: string]: string }>({
    newpin: "",
    renewpin: "",
  });

  type bal = {
    [index: string]: {
      amount: number;
      name: string;
      test: boolean;
      blocktype: "evm" | "sol" | "trx";
      symbol: string;
    };
  };

  type balVal = {
    amount: number;
    amtFiat: number;
    token: string;
    test: boolean;
    blocktype: 'evm' | 'sol' | 'trx';
    symbol: string;
  };

  type bal2 = {
    [index: string]: balVal;
  };

  const [openPast, setOpenPast] = useState(false);

  const [balToken, setBalToken] = useState<string | number>();

  const [addresses, setAddresses] = useState<any>({});

  const effectAddress = useRef<any>({});

  const [pinsVisibility, setPinVisibility] = useState<{
    [index: string]: boolean;
  }>({
    newpin: true,
    renewpin: true,
  });

  const [pinLoading, setPinLoading] = useState<boolean>(false);

  const [settlePin, setSettlePin] = useState<boolean>(false);

  const closeSettleModal = () => setSettlePin(false);

  const [genSetError, setGenSetError] = useState<string>("");

  const [data, setData] = useState<any>({});

  const [soon, setSoon] = useState<boolean>(false);

  const [copied, mainCopy] = useState<boolean[]>([]);

  const [pageCheck, setPageCheck] = useState<any>({});

  const [withdrawError, setWithdrawError] = useState<string>("");

  const [cryptoWithdrawStage, setCryptoStage] = useState<number>(0);

  const [refresh, setRefresh] = useState<boolean>(false);

  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);

  const [openCryptoW, setCryptoW] = useState<boolean>(false);

  const [altPageData, setAltPageData] = useState<any[]>([]);

  const [pageLoading, setPageLoad] = useState<boolean>(false);

  const switchCopy = (val: boolean, index: number) => {
    mainCopy((copied) => {

       const copx = [...copied];
       copx[index] = val;

       return copx;
    });

  };

  const withdrawCrypto = async () => {
    if (withdrawLoading) {
      return;
    }

    setWithdrawError("");

    setWithdrawLoading(true);

    if (!cryptoWithdrawStage) {
      
      if (!addressTo.length || !blockchains[withdrawToken?.blocktype || 'evm'].validateAddr(addressTo)) {
        document.querySelector(".witherror")?.scrollIntoView();

        setWithdrawError("A valid address is required");

        setWithdrawLoading(false);

        return;
      }

      if (!Boolean(amount["fiat"]) && !Boolean(amount["crypto"])) {
        document.querySelector(".witherror")?.scrollIntoView();

        setWithdrawError("Amount is required");

        setWithdrawLoading(false);

        return;
      }

      setWithdrawError("");

      setWithdrawLoading(false);

      setCryptoStage(1);
    } else {
      try {
        let amountCrypto: number = Number(amount["crypto"]);

        if (!Boolean(amount["crypto"])) {

          const { fiat } = amount;

          const name = withdrawToken.name.split(" ")[0];

          const res = await get_request(
            `/token/price/${name.toLowerCase()}`,
            {},
            undefined,
            false
          );

          const price = res?.data.price;

          amountCrypto = Number(fiat) / Number(price);
        
        }

        const [ settlement ]: [ any ] = data.settlement.filter((v: token) => v.type == withdrawToken.blocktype)        

        const payload = {
          addressTo,
          username: data.username,
          amountCrypto,
          token: withdrawToken,
          settlement,
          fee:
            dashData["fees"][withdrawToken.value] !== undefined
              ? dashData["fees"][withdrawToken.value]
              : 0,
          pin: pins["newpin"],
        };

        const token = localStorage.getItem("userToken");

        const { data: reqData } = await http.post(
          `/api/settlement/withdrawal/crypto/${withdrawToken.blocktype}`,
          payload,
          {
            baseURL: window.origin,
            timeout: 300_000,
          }
        );

        setGenSetError("");

        setRef(reqData.ref);

        onceBal.current = false;

        setRefresh(!refresh);

        setCryptoStage(2);
        
        setWithdrawLoading(false);

      } catch (err) {
        const error =
          (err as any).response !== undefined
            ? (err as any).response.data
            : (err as any);

        // console.log(error);

        if (error.message.indexOf("timeout of") != -1) {
          setWithdrawError("Something went wrong, please try again");
        }else if (error.message == "invalid password") {
          setWithdrawError("Pin entered is incorrect");
        } else {
          setWithdrawError(
            (err as any).response !== undefined
              ? error.message
              : "Something went wrong, please try again"
          );
        }

        document.querySelector(".witherror")?.scrollIntoView();

        setWithdrawLoading(false);

        if (error.errorType !== undefined) {
          const x = ["address", "amount"];

          if (x.includes(error.errorType)) {
            setCryptoStage(0);
          }
        }
      }
    }
  };

  const trx = (val: any, key: number) => {
    const date = new Date(val.created_at);

    const settData = JSON.parse(val.data);

    const hrx = date.getHours() % 12 || 12;

    return (
      <div key={key} className="mx-4 flex items-start py-4">
        <div className="text-[#8036de] mt-2 flex-shrink-0">
          {val.type == "fiat" && <MdPayment size={18} />}
          {val.type == "crypto" && <FaCoins size={18} />}
          {val.type == "swap" && <RiCoinFill size={18} />}
        </div>

        <span className="font-body text-gray-800 px-4 flex flex-col flex-1">
          {val.type == "fiat" && (
            <span className="text-[14px] text-[#747474] font-[500]">
              {val.desc}
            </span>
          )}

          {(val.type == "crypto" || val.type == "swap") && (
            <Link href={settData["explorer"]} className="cursor-pointer">
              <a
                className="text-[14px] text-[#747474] font-[500]"
                target={"_blank"}
              >
                {val.desc}
              </a>
            </Link>
          )}

          <span className="text-xs text-gray-600">
            {months[date.getMonth()]}{" "}
            {String(date.getDate()).length == 1
              ? "0" + date.getDate()
              : date.getDate()}{" "}
            {date.getFullYear()} {hrx}:
            {String(date.getMinutes()).length < 2
              ? `0${date.getMinutes()}`
              : date.getMinutes()}{" "}
            {hrx > 12 ? "am" : "pm"}
          </span>
        </span>

        <span className="font-body text-gray-800 flex flex-col">
          <NumberFormat
            value={
              val.type == "fiat" ? val["amount"].toFixed(2) : val["amount"]
            }
            className="text-sm"
            thousandSeparator={val.type == "fiat"}
            displayType={"text"}
            prefix={val.type == "fiat" ? "$" : ""}
          />
        </span>
      </div>
    );
  };

  const savePin = async () => {
    setGenSetError("");

    if (pinLoading) {
      return;
    }

    let more = true;

    setPinLoading(true);

    Object.values(pins).forEach((e) => {
      if (!Boolean(e) || e.length != 5) {
        document.querySelector(".pinerror")?.scrollIntoView();

        setGenSetError(
          "Data Incomplete, Please required fields should be field"
        );
        setPinLoading(false);

        more = false;
      }
    });

    if (pins["newpin"] != pins["renewpin"]) {
      document.querySelector(".pinerror")?.scrollIntoView();

      setGenSetError("Re-entered pin does not match new pin");
      setPinLoading(false);

      more = false;
    }

    if (more) {
      try {
        const newData: { [index: string]: string } = {
          newpin: pins["newpin"],
        };

        await http.post(`/api/settlement/new`, newData, {
          baseURL: window.origin,
        });

        setPinLoading(false);

        closeSettleModal();

        window.scroll(0, 0);

      } catch (err) {

        const erro = err as AxiosError;

        if (erro.response) {
          const errorx: any = erro.response.data;

          setGenSetError(errorx.message);
        } else {
          // console.log(erro.message)
          setGenSetError("Something went wrong, please try again");
        }

        document.querySelector(".pinerror")?.scrollIntoView();

        setPinLoading(false);
      }
    }
  };


   const saveData = ({ breakdown, total, pending }: any) => ({
     ...dashData,
     pending: pending || dashData?.pending || 0,
     balance: total,
     breakDownObj: breakdown,
     breakdown: Object.values(breakdown)
       .sort((a: any, b: any) => Number(a.test) - Number(b.test))
       .sort((a: any, b: any) => b.amount - a.amount),
   });
   
   

  useEffect(() => {

  const init = async () => {
    // cache
    const cache = JSON.parse(localStorage.getItem("cryptoCache") || "{}");

    let totlCache = 0;

    let breakdown: any = {};

    if (cache && Object.keys(cache).length) {
      
      Object.values(sAddresses.current).forEach((e: any) => {
        breakdown = { ...breakdown, ...cache[e] };

        if (cache[e]) {

        Object.values(cache[e]).forEach((value: any) => {
          totlCache += value.amtFiat;
        });
      }
    });

      const maxAmt = Object.keys(breakdown).sort(
        (a, b) => breakdown[b].amount - breakdown[a].amount
      );

      [...CryptoList, ...SolanaCryptoList, ...TronCryptoList].forEach((a) => {
        if (a.value == Number(maxAmt[0])) {
          setWithdrawToken(a);
        }
      });

      setBlurModal(false);

     
    }

    const dashmain = await get_request(
      "/dashboard/settlement",
      {},
      undefined,
      false
    );

    let { payments, allTrx, user, pending } = dashmain?.data;


    let finalBalance: { [index: string]: number } = {};

    const fees: { [index: string]: number } = {};

    const settlement_acct: string[] = [];

    if (allTrx.length) {
      allTrx.forEach((v: any) => {
        const data = JSON.parse(v.data);

        if (v.type == "crypto" || v.type == "swap") {
          const add = data.receiver;

          if (!settlement_acct.includes(add)) {
            settlement_acct.push(add);
          }
        }
      });
    }

    const userAddresses = JSON.parse(user.accounts || "[]");

    if (Boolean(userAddresses[0]) && userAddresses[0] != "null") {
      if (!settlement_acct.includes(userAddresses[0])) {
        settlement_acct.push(userAddresses[0]);
      }
    }

    payments.forEach((value: any) => {
      if (value.meta !== null) {
        const metadata = JSON.parse(value.meta);

        fees[metadata["chain"]] = Number(metadata["discount"]);
      }
    });

    const { data: settlements } = (await get_request(
      `/settlements/transactions`,
      {},
      undefined,
      false
    )) || { data: { trx: {} } };

    if (settlements.trx.current_page !== undefined) {
      const { current_page, last_page } = settlements.trx.current_page;

      setPageCheck({ current_page, last_page });
    }

    // console.log(breakdown, 'sxs')

    setSettlementsTrx(settlements.trx);

    setDashData({
      payments,
      fees: fees,
      settlement_acct: settlement_acct.map((e: string) => ({
        label: e,
        value: e,
      })),
      pending: 0,
      balance: totlCache || dashData?.balance || 0,
      breakDownObj: breakdown,
      breakdown: Object.values(breakdown)
       .sort((a: any, b: any) => Number(a.test) - Number(b.test))
       .sort((a: any, b: any) => b.amount - a.amount),

    });

    if (blur) setBlur(false);

    setRefresh(!refresh);
  };


     const initBalances = async () => {

       if (onceBal.current) {
         return;
       }

       onceBal.current = true;

       const authToken = localStorage.getItem("userToken");

       const { data: balances } = await http.get(`/api/settlement/balance`, {
         baseURL: window.origin,
         timeout: 300_000,
       });

       const { breakdown, total, prices, pending, addresses } = balances;

       const valCache = JSON.parse(localStorage.getItem("tokenVal") || "{}");

       const cacheNew: any = {};

       Object.keys(breakdown).forEach((index: any) => {
         const dax = breakdown[index];

         const { blocktype, token } = dax;

         const account = sAddresses.current[blocktype];

         cacheNew[account] = {
           ...(cacheNew[account] || {}),
           [index]: dax,
         };

         const price = prices[index] || 0;

         valCache[token.toLowerCase()] = price;
       });

       localStorage.setItem("cryptoCache", JSON.stringify(cacheNew));

       localStorage.setItem("tokenVal", JSON.stringify(valCache));

       const maxAmt = Object.keys(breakdown).sort(
         (a, b) => breakdown[b].amount - breakdown[a].amount
       );

       [...CryptoList, ...SolanaCryptoList, ...TronCryptoList].forEach((a) => {
         if (a.value == Number(maxAmt[0])) {
           setWithdrawToken(a);
         }
       });
      
      

       setDashData({
         ...dashData,
         pending: pending || 0,
         balance: total,
         breakDownObj: breakdown,
         breakdown: Object.values(breakdown)
           .sort((a: any, b: any) => Number(a.test) - Number(b.test))
           .sort((a: any, b: any) => b.amount - a.amount),
       });

       setBlurModal(false);

       // setTimeout(initBalances, 12000);
     };



    if (once.current) {

      once.current = false;

      "user".get("*", true).then((e: any) => {

        setData(e);


        setSettlePin(!Boolean(e.settlement ? e.settlement.length : 0));

        if (!Boolean(e.settlement ? e.settlement.length : 0)) {
          return;
        }

        e.settlement.forEach((vv: any) => {

            mainCopy(prev => [...prev, false]);

            sAddresses.current = {
              ...sAddresses.current,
              [vv.type]: vv.address,
            };

        });

        init();

        initBalances();

      });
    }


  }, [refresh]);

  const getBalance = async (e: token, address: string) => {
    setBalToken(0);

    if (e.type == "native") {
      try {

        const res = await get_request(
          `/token/price/${e.name.split(" ")[0].toLowerCase()}`,
          {},
          undefined,
          false
        );

        setCryptoRate(res?.data.price);

        const reqBal = Number(await blockchains[e.blocktype].balance(address, e.rpc));

        setBalToken(
          reqBal -
            (dashData["fees"][e.value] !== undefined && dashData["fees"][e.value] > reqBal
              ? dashData["fees"][e.value]
              : 0)
        );
      } catch (err) {

        setCryptoRate(0);

        setBalToken(0);
      }
    } else if (e.type == "non-native") {
      // do stuff here
    }
  };

  return (
    <Page>
      <Head>
        <title>Settlements | Dashboard | Breew</title>
        <meta
          name="description"
          content={`Distribute and receive all your funds in crypto and fiat`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="pt-[75px] px-5 relative z-[1]">
        {!blur && !blurModal && (
          <Modal
            open={openCryptoW}
            sx={{
              "&& .MuiBackdrop-root": {
                backdropFilter: "blur(5px)",
                width: "calc(100% - 8px)",
              },
            }}
            onClose={() => setCryptoW(false)}
            className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
            aria-labelledby="add new link"
            aria-describedby="New Link Short Cut"
          >
            <Box
              className="sm:w-full h-fit 3mdd:px-[2px]"
              sx={{
                minWidth: 300,
                width: "70%",
                maxWidth: 800,
                borderRadius: 6,
                outline: "none",
                p: 4,
                position: "relative",
                margin: "auto",
              }}
            >
              <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                      Crypto Withdraw
                    </h2>
                    <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                      Withdraw your received crypto easily
                    </span>
                  </div>

                  <IconButton size={"medium"} onClick={() => setCryptoW(false)}>
                    <MdClose
                      size={20}
                      color={"rgb(32,33,36)"}
                      className="cursor-pointer"
                    />
                  </IconButton>
                </div>

                {Boolean(withdrawError) && (
                  <div className="bg-[#ff8f33] text-white rounded-md w-full font-bold mt-2 witherror mx-auto p-3">
                    {withdrawError}
                  </div>
                )}

                <TabPanel index={0} value={cryptoWithdrawStage}>
                  <form
                    encType="multipart/form-data"
                    onSubmit={(f) => {
                      f.preventDefault();
                    }}
                    action="#"
                  >
                    <div className="flex mb-5 bg-white items-center">
                      <div className="bg-[#ebebeb] px-2 font-[600] truncate mr-3 rounded py-2 w-full text-[#7a7a7a]">
                        {Boolean(data.username) ? data.username : ""}{" "}
                        {"Breew Wallets"}
                      </div>

                      <div className="bg-[#ebebeb] px-2 rounded py-2 min-w-fit font-[600] text-[#7a7a7a]">
                        {sAddresses.current[
                          withdrawToken?.blocktype || "evm"
                        ] !== undefined
                          ? `${sAddresses.current[
                              withdrawToken?.blocktype || "evm"
                            ].substring(0, 6)}...${sAddresses.current[
                              withdrawToken?.blocktype || "evm"
                            ].substring(38, 42)}`
                          : ""}
                      </div>
                    </div>

                    <div className="my-3">
                      <label className="text-[#565656] block mb-2 font-[600]">
                        Token
                      </label>

                      <Select
                        isClearable={false}
                        name="Tokens"
                        filterOption={createFilter({
                          stringify: (option) =>
                            `${option.value} ${option.data.name}`,
                        })}
                        placeholder={"Tokens..."}
                        options={Object.keys(dashData["breakDownObj"])
                          .filter(
                            (a: any) => dashData["breakDownObj"][a].amtFiat > 0
                          )
                          .map((e: any) => ({
                            ...[...CryptoList, ...SolanaCryptoList, ...TronCryptoList].find(
                              (a) => a.value == Number(e)
                            ),
                          }))}
                        styles={{
                          option: (provided, state) => {
                            return {
                              ...provided,
                              backgroundColor: state.isSelected
                                ? "#dfdfdf"
                                : "transparent",
                              cursor: "pointer",
                              "&:active": {
                                backgroundColor: "#dfdfdf",
                                color: "#121212 !important",
                              },
                              "&:hover": {
                                backgroundColor: state.isSelected
                                  ? undefined
                                  : `#dfdfdff2`,
                              },
                            };
                          },
                          container: (provided, state) => ({
                            ...provided,
                            "& .select__control": {
                              borderWidth: "0px",
                              borderRadius: "0px",
                              backgroundColor: "transparent",
                              borderBottomWidth: "1px",
                            },
                            "& .select__value-container": {
                              paddingLeft: "0px",
                            },
                            "& .select__control:hover": {
                              borderBottomWidth: "2px",
                              borderBottomColor: "#121212",
                            },
                            "& .select__control--is-focused": {
                              borderWidth: "0px",
                              borderBottomWidth: "2px",
                              borderBottomColor: `#8036de !important`,
                              boxShadow: "none",
                            },
                          }),
                        }}
                        value={withdrawToken}
                        onChange={async (e) => {
                          setWithdrawToken(e);

                          getBalance(e, sAddresses.current[e.blocktype]);
                        }}
                        classNamePrefix="select"
                      />
                    </div>

                    <div className="my-3">
                      <div className="flex text-[#565656] items-center justify-between">
                        <label className="block mb-2 font-[600]">To</label>

                        <div className="relative">
                          <IconButton
                            style={{
                              backgroundColor: openPast ? "#ececec" : undefined,
                            }}
                            size={"large"}
                            onClick={() => {
                              setOpenPast(!openPast);
                            }}
                          >
                            <MdOutlinePermContactCalendar size={20} />
                          </IconButton>

                          <div
                            style={{
                              display: openPast ? "flex" : "none",
                            }}
                            className="w-[270px] border border-[#f0f0f0] z-[1000000] bg-white flex-col max-h-[300px] top-[45px] right-0 shadow-md absolute"
                          >
                            <Tooltip
                              placement="bottom"
                              arrow
                              title={
                                "Previous Addresses used for Crypto Withdrawals"
                              }
                            >
                              <div className="flex pt-1 mb-2 items-center w-fit cursor-pointer px-1">
                                <label className="block font-[500] text-[14px]">
                                  Addresses
                                </label>
                                <MdInfo size={14} className="ml-1" />
                              </div>
                            </Tooltip>

                            <Select
                              isClearable={false}
                              name="Address"
                              placeholder={"Address..."}
                              options={dashData["settlement_acct"]}
                              styles={{
                                option: (provided, state) => {
                                  return {
                                    ...provided,
                                    backgroundColor: state.isSelected
                                      ? "#dfdfdf"
                                      : "transparent",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    "&:active": {
                                      backgroundColor: "#dfdfdf",
                                      color: "#121212 !important",
                                    },
                                    "&:hover": {
                                      backgroundColor: state.isSelected
                                        ? undefined
                                        : `#dfdfdff2`,
                                    },
                                  };
                                },
                                container: (provided, state) => ({
                                  ...provided,
                                  "& .select__control": {
                                    borderWidth: "1px",
                                    borderRadius: "0px",
                                    backgroundColor: "transparent",
                                  },

                                  "& .select__control--is-focused": {
                                    borderWidth: "2px",
                                    borderColor: `#8036de !important`,
                                    boxShadow: "none",
                                  },
                                }),
                              }}
                              value={addresses}
                              onChange={async (e) => {
                                setAddresses(e);

                                setAddressTo(e.label);

                                setOpenPast(false);
                              }}
                              classNamePrefix="select"
                            />
                          </div>
                        </div>
                      </div>

                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="standard"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              onClick={async () => {
                                const text =
                                  await navigator.clipboard.readText();

                                setAddressTo(text);
                              }}
                              className="cursor-pointer"
                              sx={{
                                "& p": {
                                  color: "#8036de",
                                },
                              }}
                              position="end"
                            >
                              <Button className="!py-0 !font-[600] !capitalize !flex !items-center !text-[#8036de] !bg-[#8036de04] !min-w-fit !border-none !transition-all !delay-500 !px-3 !text-[14px]">
                                paste
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .Mui-focused.MuiInputLabel-root": {
                            color: "#8036de",
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: "600",
                            color: "#121212",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
                            {
                              borderColor: `#8036de !important`,
                            },
                          "& .MuiFormHelperText-root": {
                            padding: "6px 3px",
                            backgroundColor: "#fff",
                            color: "#565656",
                            marginTop: "0px",
                          },
                          width: "100%",
                        }}
                        placeholder="Address"
                        value={addressTo}
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          const val = e.target.value;

                          setAddressTo(val);
                        }}
                      />

                      <Alert className="mt-1" severity="warning">
                        Ensure the address you are sending to supports{" "}
                        {withdrawToken.name} on the {withdrawToken.network}{" "}
                        network
                      </Alert>
                    </div>

                    <div className="my-3">
                      <label className="text-[#565656] block mb-2 font-[600]">
                        Amount
                      </label>

                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="standard"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={() => {
                                  const bal = Boolean(balToken) ? balToken : 0;

                                  setAmount({
                                    fiat: cryptoRate
                                      ? (
                                          Number(bal) / Number(cryptoRate)
                                        ).toFixed(2)
                                      : "",
                                    crypto: String(bal),
                                  });
                                }}
                                className="!py-0 !font-[600] !capitalize !flex !items-center !text-[#565656] !bg-[#8036de04] !cursor-pointer !min-w-fit !border-none !transition-all !delay-500 !px-3 !text-[14px]"
                              >
                                MAX
                              </Button>

                              <p className="text-[#565656] cursor-default uppercase text-[14px] font-[500] block">
                                {withdrawToken.symbol}
                              </p>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .Mui-focused.MuiInputLabel-root": {
                            color: "#8036de",
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: "600",
                            color: "#121212",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
                            {
                              borderColor: `#8036de !important`,
                            },
                          "& .MuiFormHelperText-root": {
                            padding: "6px 3px",
                            backgroundColor: "#fff",
                            color: "#565656",
                            marginTop: "0px",
                          },
                          width: "100%",
                        }}
                        placeholder="0.00"
                        value={amount["crypto"]}
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          const crypto = String(e.target.value).replace(
                            /[^\d.]/g,
                            ""
                          );

                          setAmount({
                            fiat:
                              cryptoRate && Number(crypto)
                                ? (Number(crypto) / Number(cryptoRate)).toFixed(
                                    2
                                  )
                                : "",
                            crypto,
                          });
                        }}
                      />

                      <TextField
                        fullWidth
                        id="outlined-basic"
                        variant="standard"
                        className="mt-4"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              className="cursor-pointer"
                              position="end"
                            >
                              <p className="text-[#565656] uppercase text-[14px] font-[500] block">
                                USD
                              </p>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .Mui-focused.MuiInputLabel-root": {
                            color: "#8036de",
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: "600",
                            color: "#121212",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
                            {
                              borderColor: `#8036de !important`,
                            },
                          "& .MuiFormHelperText-root": {
                            padding: "6px 3px",
                            backgroundColor: "#fff",
                            color: "#565656",
                            marginTop: "2px",
                          },
                          width: "100%",
                        }}
                        placeholder="0.00"
                        helperText={
                          Boolean(balToken)
                            ? ` Available Balance: ${balToken} ${withdrawToken.symbol.toUpperCase()}`
                            : ""
                        }
                        value={amount["fiat"]}
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          const fiat = String(e.target.value).replace(
                            /[^\d.]/g,
                            ""
                          );

                          setAmount({
                            crypto:
                              cryptoRate && Number(fiat)
                                ? String(Number(fiat) * Number(cryptoRate))
                                : "",
                            fiat,
                          });
                        }}
                      />
                    </div>
                  </form>
                </TabPanel>

                <TabPanel index={1} value={cryptoWithdrawStage}>
                  <form
                    action="#"
                    encType="multipart/form-data"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="py-3">
                      <div className="flex text-[#565656] items-center justify-between">
                        <label className="text-[#565656] mb-2 font-[600]">
                          Enter Settlement Pin
                        </label>

                        <IconButton
                          onClick={() =>
                            setPinVisibility({
                              ...pinsVisibility,
                              newpin: !pinsVisibility["newpin"],
                            })
                          }
                          size={"medium"}
                        >
                          {pinsVisibility["newpin"] ? (
                            <MdOutlineVisibility size={23} />
                          ) : (
                            <MdOutlineVisibilityOff size={23} />
                          )}
                        </IconButton>
                      </div>
                      <div className="flex justify-center item-center ">
                        <PinField
                          type={!pinsVisibility["newpin"] ? "text" : "password"}
                          length={5}
                          onComplete={(e) => setPin({ ...pins, newpin: e })}
                          className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
                          validate={/^[0-9]$/}
                        />
                      </div>
                    </div>

                    <span className="text-[#7c7c7c] mt-3 block font-[500] text-[15px]">
                      <b>Please Note: </b> A very small amount would be deducted
                      from your withdrawal amount to cover gas fees.
                    </span>
                  </form>
                </TabPanel>

                <TabPanel index={2} value={cryptoWithdrawStage}>
                  <div className="h-full z-[100] flex flex-col justify-evenly items-center w-full">
                    <div className="animation-ctn mt-3 mb-6">
                      <div className="icon icon--order-success svg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="154px"
                          height="154px"
                        >
                          <g fill="none" stroke={"#8036de"} strokeWidth="2">
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
                              fill={"#8036de"}
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
                              stroke={"#fff"}
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
                        color: "#8036de",
                      }}
                      className="mb-3 text-[19px] font-bold"
                    >
                      Transaction Successful
                    </h2>

                    <Link href={ref!.link}>
                      <a
                        target={"_blank"}
                        className="text-[#5a5a5a] cursor-pointer mb-1 font-normal"
                      >
                        View transaction on{" "}
                        <span className="font-[600] text-[#919191]">
                          {ref.name}
                        </span>
                      </a>
                    </Link>
                  </div>
                </TabPanel>
              </div>

              <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                <div className="flex items-center">
                  {cryptoWithdrawStage != 2 &&
                    Boolean(cryptoWithdrawStage) &&
                    !withdrawLoading && (
                      <Button
                        onClick={() => setCryptoStage(0)}
                        className="!w-fit !items-center !flex !rounded-md text-[#5f4f4f] font-[400] !px-0 !capitalize !border-none"
                      >
                        Back
                      </Button>
                    )}

                  {cryptoWithdrawStage == 2 && (
                    <Button
                      variant="contained"
                      className="!py-2 !font-bold !px-3 !capitalize min-w-[120px] !flex !items-center !text-white !bg-[#8036de] !border-solid !transition-all !delay-500 !rounded-lg"
                      style={{
                        fontFamily: "inherit",
                      }}
                      onClick={() => {
                        setCryptoStage(0);

                        setCryptoW(false);

                        setRef({
                          link: "",
                          name: "",
                        });
                      }}
                    >
                      Done
                    </Button>
                  )}

                  {cryptoWithdrawStage != 2 && (
                    <Button
                      onClick={withdrawCrypto}
                      className="!py-2 !font-bold !px-3 !capitalize min-w-[120px] !flex !items-center !text-white !bg-[#8036de] !transition-all !delay-500 !rounded-lg"
                    >
                      {withdrawLoading && (
                        <CircularProgress
                          className="mr-2"
                          color={"inherit"}
                          size={20}
                        />
                      )}

                      {withdrawLoading
                        ? "processing..."
                        : cryptoWithdrawStage
                        ? "Withdraw"
                        : "Next"}
                    </Button>
                  )}
                </div>
              </div>
            </Box>
          </Modal>
        )}

        <Modal
          open={soon}
          sx={{
            "&& .MuiBackdrop-root": {
              backdropFilter: "blur(5px)",
              width: "calc(100% - 8px)",
            },
          }}
          onClose={() => setSoon(false)}
          className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
          aria-labelledby="Change settlement pin, to approve transactions"
          aria-describedby="Change Pin"
        >
          <Box
            className="sm:w-full h-fit 3mdd:px-[2px]"
            sx={{
              minWidth: 300,
              width: "70%",
              maxWidth: 800,
              borderRadius: 6,
              outline: "none",
              p: 4,
              position: "relative",
              margin: "auto",
            }}
          >
            <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                    Coming Soon
                  </h2>
                  <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                    This feature is coming soon
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src={soonImg}
                  width={200}
                  height={200}
                  alt="coming soon"
                />
              </div>
              <span className="text-[#7c7c7c] mt-3 block font-[500] text-[16px]">
                We are working hard to ensure that this feature is released as
                soon as possible. You would receive a mail upon release. While
                you wait, you could check out our other cool features
              </span>
            </div>

            <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
              <div className="flex items-center">
                <Button
                  onClick={() => setSoon(false)}
                  className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !fill-white !bg-[#8036de] !border !border-solid !border-[rgb(200,200,220)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                >
                  Thank you
                </Button>
              </div>
            </div>
          </Box>
        </Modal>

        {settlePin && (
          <>
            <Modal
              open={settlePin}
              sx={{
                "&& .MuiBackdrop-root": {
                  backdropFilter: "blur(5px)",
                  width: "calc(100% - 8px)",
                },
              }}
              onClose={() => setSettlePin(true)}
              className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
              aria-labelledby="Change settlement pin, to approve transactions"
              aria-describedby="Change Pin"
            >
              <Box
                className="sm:w-full h-fit 3mdd:px-[2px]"
                sx={{
                  minWidth: 300,
                  width: "70%",
                  maxWidth: 800,
                  borderRadius: 6,
                  outline: "none",
                  p: 4,
                  position: "relative",
                  margin: "auto",
                }}
              >
                <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h2 className="font-[500] 3mdd:text-[1.25rem] text-[rgb(32,33,36)] text-[1.55rem]">
                        Create Settlement Pin
                      </h2>
                      <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                        Create pin to be able to approve settlement transactions
                      </span>
                    </div>
                  </div>

                  {Boolean(genSetError) && (
                    <div className="bg-[#ff8f33] text-white rounded-md w-[95%] font-bold mt-2 pinerror mx-auto p-3">
                      {genSetError}
                    </div>
                  )}

                  <div className="py-3">
                    <div className="flex text-[#565656] items-center justify-between">
                      <label className="text-[#565656] mb-2 font-[600]">
                        New Pin
                      </label>

                      <IconButton
                        onClick={() =>
                          setPinVisibility({
                            ...pinsVisibility,
                            newpin: !pinsVisibility["newpin"],
                          })
                        }
                        size={"medium"}
                      >
                        {pinsVisibility["newpin"] ? (
                          <MdOutlineVisibility size={23} />
                        ) : (
                          <MdOutlineVisibilityOff size={23} />
                        )}
                      </IconButton>
                    </div>
                    <div className="flex justify-center item-center ">
                      <PinField
                        type={!pinsVisibility["newpin"] ? "text" : "password"}
                        length={5}
                        onComplete={(e) => setPin({ ...pins, newpin: e })}
                        className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] 2usmm:!justify-start text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
                        validate={/^[0-9]$/}
                      />
                    </div>
                  </div>

                  <div className="py-3">
                    <div className="flex text-[#565656] items-center justify-between">
                      <label className="text-[#565656] mb-2 font-[600]">
                        Re Enter New Pin
                      </label>

                      <IconButton
                        onClick={() =>
                          setPinVisibility({
                            ...pinsVisibility,
                            renewpin: !pinsVisibility["renewpin"],
                          })
                        }
                        size={"medium"}
                      >
                        {pinsVisibility["renewpin"] ? (
                          <MdOutlineVisibility size={23} />
                        ) : (
                          <MdOutlineVisibilityOff size={23} />
                        )}
                      </IconButton>
                    </div>
                    <div className="flex justify-center item-center ">
                      <PinField
                        type={!pinsVisibility["renewpin"] ? "text" : "password"}
                        length={5}
                        onComplete={(e) => setPin({ ...pins, renewpin: e })}
                        className="font-[inherit] 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] 2usmm:!justify-start outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
                        validate={/^[0-9]$/}
                      />
                    </div>
                  </div>

                  <span className="text-[#7c7c7c] mt-3 block font-[500] text-[15px]">
                    <b>Please Note: </b> Forgetting your pin or your pin getting
                    into the wrong hands, could lead to loss of funds, please
                    keep it safe.
                  </span>
                </div>

                <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                  <div className="flex items-center">
                    <Button
                      onClick={savePin}
                      className="!py-2 !font-bold !min-w-[250px] !text-[16px] !px-3 !flex !items-center !text-white !fill-white !bg-[#8036de] !normal-case !border !border-solid !border-[rgb(200,200,220)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                    >
                      {pinLoading ? (
                        <>
                          <div className="mr-3 h-[20px] text-[#fff]">
                            <CircularProgress
                              color={"inherit"}
                              className="!w-[20px] !h-[20px]"
                            />
                          </div>{" "}
                          <span>Just a Sec...</span>
                        </>
                      ) : (
                        <>Create pin</>
                      )}
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </>
        )}

        {blur ? (
          <Skeleton
            className="mb-3 w-[200px] h-[70px]"
            sx={{ fontSize: "25px" }}
          />
        ) : (
          <h2 className="font-bold text-[25px] mt-[14px] mb-3">Settlements</h2>
        )}

        <div className="flex items-start relative z-10 3mdd:mt-7 py-3 flex-wrap gap-x-10 gap-y-3 mt-2 mb-1">
          <div className="min-w-[100px]">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              <Tooltip
                placement="bottom"
                arrow
                title={
                  "Cash Available for withdrawal. This balance is subject to change, based on loaded data and change in token price data from Coingecko"
                }
              >
                <span className="uppercase cursor-pointer text-[#818181] flex items-center font-bold text-[.64rem]">
                  Account Balance <MdInfo size={16} className="ml-1" />
                </span>
              </Tooltip>
            )}

            <div className="flex mb-1 cusscroller overflow-x-scroll overflow-y-hidden items-end w-full">
              {blur ? (
                <Skeleton sx={{ fontSize: "2.5rem", width: "156px" }} />
              ) : (
                <>
                  <NumberFormat
                    value={String(dashData["balance"]).split(".")[0]}
                    style={{
                      fontSize: "2.3rem",
                      color: "#121212",
                    }}
                    thousandSeparator={true}
                    displayType={"text"}
                    prefix={"$"}
                  />
                  <span className="leading-[2.7rem] text-[20px] text-[#898989]">
                    .{dashData["balance"]?.toFixed(2).split(".")[1]}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="min-w-[100px]">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              <Tooltip
                placement="bottom"
                arrow
                title={
                  "Pending amount which  would be added to account balance within 24hrs. This Balance is subject to change, based on the way it is calculated"
                }
              >
                <span className="uppercase cursor-pointer text-[#818181] flex items-center font-bold text-[.64rem]">
                  Pending Amount <MdInfo size={16} className="ml-1" />
                </span>
              </Tooltip>
            )}

            <div className="flex relative z-10 cusscroller overflow-x-scroll overflow-y-hidden items-end w-full">
              {blur ? (
                <Skeleton sx={{ fontSize: "2.5rem", width: "156px" }} />
              ) : (
                <>
                  <NumberFormat
                    value={String(dashData["pending"]).split(".")[0]}
                    style={{
                      fontSize: "2.3rem",
                      color: "#121212",
                    }}
                    thousandSeparator={true}
                    displayType={"text"}
                    prefix={"$"}
                  />
                  <span className="leading-[2.7rem] text-[20px] text-[#898989]">
                    .{dashData["pending"]?.toFixed(2).split(".")[1]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex cusscroller overflow-x-scroll overflow-y-hidden items-center mb-3 w-full pb-1">
          {blur ? (
            <Skeleton
              className="py-2 px-3 w-[120px] h-[60px] rounded-lg mr-1"
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Button
              onClick={() => {
                setCryptoW(true);

                getBalance(
                  withdrawToken,
                  sAddresses.current[withdrawToken.blocktype]
                );
              }}
              className="!py-2 !font-[600] !capitalize !flex !items-center !text-white !bg-[#8036de] !min-w-fit !border-none !transition-all !delay-500 !rounded-lg !px-3 !text-[14px] !mr-[2px]"
            >
              <FaCoins size={16} className="mr-1" /> Withdraw Crypto
            </Button>
          )}

          {/* {blur ? (
            <Skeleton
              className="py-2 px-3 w-[120px] h-[60px] rounded-lg mr-1"
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Button
              onClick={() => setSoon(true)}
              className="!py-2 !px-3 !font-[600] !capitalize !flex !items-center !text-white !bg-[#8036de] !border-none !min-w-fit !transition-all !delay-500 !rounded-lg !text-[14px] !mx-[2px]"
            >
              <MdPayment size={16} className="mr-1" /> Withdraw Fiat
            </Button>
          )} */}

          {blur ? (
            <Skeleton
              className="py-2 px-3 w-[120px] h-[60px] rounded-lg mr-1"
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Button
              onClick={() => setSoon(true)}
              className="!py-2 !px-3 !font-[600] !min-w-fit !capitalize !flex !items-center !text-[#8036de] !border-[#8036de] !border !border-solid !transition-all !bg-transparent !delay-500 !rounded-lg !text-[14px] !mx-[2px]"
            >
              <RiCoinFill size={16} className="mr-1" /> Swap USDT
            </Button>
          )}

          {blur ? (
            <Skeleton
              className="py-2 px-3 w-[120px] h-[60px] rounded-lg mr-1"
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Button
              onClick={() => setSoon(true)}
              className="!py-2 !px-3 !font-[600] !min-w-fit !capitalize !flex !items-center !text-[#8036de] !border-[#8036de] !border !border-solid !transition-all !bg-transparent !delay-500 !rounded-lg !text-[14px] !mx-[2px]"
            >
              <MdSubscriptions size={16} className="mr-1" /> Auto Withdrawals
            </Button>
          )}
        </div>

        {(Boolean(dashData["breakdown"]?.length) || blur) && (
          <div className="py-3">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              <span className="block uppercase mb-1 text-[#818181] font-bold text-[.64rem]">
                Cryptos
              </span>
            )}

            <div className="flex items-end cusscroller overflow-x-scroll overflow-y-hidden pb-1">
              {blur
                ? Array(1, 2, 3).map((v: any, i: number) => {
                    return (
                      <Skeleton
                        key={i}
                        variant={"rounded"}
                        className="w-[350px] h-[74px] text-[#6a6a6ab0] py-4 px-[15px] mr-2 rounded-[8px]"
                      />
                    );
                  })
                : dashData["breakdown"].map((val: balVal, key: number) => {



                    return (
                      <div key={key} className="flex flex-col items-start">
                        {Boolean(data.settlement[key]) && (
                          <Tooltip
                            placement="top"
                            open={copied[key]}
                            arrow
                            title={"Copied"}
                          >
                            <div
                              onClick={() => {
                                const acct = data.settlement[key];

                                copy(acct.address);

                                switchCopy(true, key);

                                setTimeout(() => switchCopy(false, key), 2000);
                              }}
                              className="cursor-pointer justify-between flex text-[#979797] items-center mb-2 w-[160px]"
                            >
                              <div className="flex items-center">
                                <BiChevronRight
                                  className="relative"
                                  size={14}
                                />
                                <span className="ml-1 text-[14px]">{`${data.settlement[
                                  key
                                ].address.substring(0, 6)}...${data.settlement[
                                  key
                                ].address.substring(38, 42)}`}</span>
                              </div>

                              <BiCopy size={16} />
                            </div>
                          </Tooltip>
                        )}

                        <div className="border-solid flex items-center w-[350px] justify-between text-[#6a6a6ab0] p-4 mr-2 bg-white border-[rgb(200,200,220)] rounded-[8px] border">
                          <div className="flex items-center">
                            <div className="h-[40px] w-[40px] rounded-[.4rem] relative flex items-center justify-center">
                              <CustomImg
                                alt={val["token"]}
                                name={val["token"]}
                                symbol={val["symbol"] as string}
                              />
                            </div>
                            <div className="ml-3 relative top-[2px]">
                              <p className="font-[600] capitalize truncate leading-[14px] text-[14px]">
                                {val["token"] + (val.test ? " (Testnet)" : "")}
                              </p>
                              <span className="font-[400] uppercase text-[11px]">
                                {val["symbol"]}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-end flex-col">
                            <NumberFormat
                              value={Number(val["amount"].toFixed(6))}
                              className="truncate text-[#414141b0] mb-[1px] block text-[1.5rem] leading-[24px]"
                              thousandSeparator={true}
                              displayType={"text"}
                            />

                            <NumberFormat
                              value={val["amtFiat"].toFixed(2)}
                              className="truncate text-[#6a6a6ab0] leading-[15px] block text-[0.9rem]"
                              thousandSeparator={true}
                              displayType={"text"}
                              prefix={"$"}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        )}

        <div className="py-2">
          {blur ? (
            <Skeleton
              className="mb-2"
              sx={{ fontSize: "1.04rem", width: "80px" }}
            />
          ) : (
            <span className="block uppercase mb-2 text-[#818181] font-bold text-[.64rem]">
              Past Settlements
            </span>
          )}

          {blur ? (
            <Skeleton
              variant={"rounded"}
              className="max-w-[650px] h-[400px]  text-[#6a6a6ab0] py-3 mr-2 rounded-lg w-full"
            />
          ) : Boolean(settlementsTrx.data) &&
            Boolean(settlementsTrx.data.length) ? (
            <>
              <div className="max-w-[650px] border border-solid border-[rgb(200,200,220)] rounded-lg py-3 flex flex-col w-full">
                {settlementsTrx.data.map((val: any, key: number) =>
                  trx(val, key)
                )}

                {Boolean(altPageData.length) &&
                  altPageData.map((val: any, key: number) => trx(val, key))}
              </div>

              {pageCheck.current_page !== undefined &&
                pageCheck.current_page != pageCheck.last_page && (
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={async () => {
                        if (pageLoading) return false;

                        setPageLoad(true);

                        const ndata = await get_request(
                          "/settlements/transactions",
                          {
                            params: {
                              page: pageCheck.current_page + 1,
                            },
                          },
                          undefined,
                          false
                        );

                        const { data, current_page, last_page } = ndata?.data;

                        setAltPageData([...altPageData, ...data]);

                        setPageCheck({ current_page, last_page });

                        setPageLoad(false);
                      }}
                      className="!py-2 !font-[600] !capitalize !flex !items-center !text-white !bg-[#8036de] !min-w-fit !border-none !transition-all !delay-500 !rounded-lg !px-3 !text-[14px] mr-[2px]"
                    >
                      {pageLoading ? (
                        <>
                          <div className="mr-3 h-[20px] text-[#fff]">
                            <CircularProgress
                              color={"inherit"}
                              className="!w-[20px] !h-[20px]"
                            />
                          </div>{" "}
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>Load More</>
                      )}
                    </Button>
                  </div>
                )}
            </>
          ) : (
            <div
              className="empty border border-solid border-[rgb(200,200,220)] rounded-lg py-3"
              style={{
                display: "flex",
                width: "100%",
                maxWidth: "650px",
                height: "fit-content",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="w-[240px]">
                <Image
                  src={empty}
                  className="mb-3 object-scale-down"
                  layout={"intrinsic"}
                  alt="Quite empty here"
                />
              </div>

              <div className="mt-2 mb-3">
                <h2 className="text-[20px] text-[#3e3e3e] capitalize text-center font-[400]">
                  No Settlement Made Yet
                </h2>
                <span className="mt-2 text-[17px] text-[#949494] block w-full text-center">
                  This place would be filled anytime soon😊
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Settlements;
