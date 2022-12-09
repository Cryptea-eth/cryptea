import React, { createContext, useState, useEffect, useRef } from "react";
import { useCryptea } from "./Cryptea";
import { useRouter } from "next/router";
import { post_request } from "./Cryptea/requests";
import * as ethers from "ethers";
import PAYMENT from "../../artifacts/contracts/payment.sol/Payment.json";
import { initD } from "../components/elements/dashboard/link/data";
import { useSwitchNetwork } from "wagmi";
import { GrConnect } from "react-icons/gr";
import {
  PaymentContext as PaymentCont,
  subValueType,
  token,
} from "./Cryptea/types";
import AuthModal from "../components/elements/modal";
import { balanceABI } from "../functions/abi";
import {
  Modal,
  Box,
  IconButton,
  ClickAwayListener,
  Tooltip,
  Button,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import copy from "copy-to-clipboard";
import LogoSpace from "../components/elements/logo";
import QrCode from "../components/elements/qrcode";
import { FaRegClone } from "react-icons/fa";
import { RiCloseCircleLine } from "react-icons/ri";
import {
  CryptoList,
  inputsList,
  tokenTrackers,
} from "./Cryptea/connectors/chains";
import Loader from "../components/elements/loader";
import axios, { AxiosError } from "axios";
import { TbPlugConnected } from "react-icons/tb";

export const PaymentContext = createContext<PaymentCont>({});

export const PaymentProvider = ({
  children,
  editMode,
}: {
  children: JSX.Element;
  editMode: boolean;
}) => {
  const router = useRouter();

  let username = router.query["slug"];

  const apiCode = router.query["trx"] as string | undefined;

  const [is500, setIs500] = useState<boolean>(false);

  const [interval, setTinterval] = useState<string>("daily");

  useEffect(() => {}, [username, router.isReady]);

  const [paymentData, setPaymentData] = useState<{
    price: number;
    type: "onetime" | "sub";
  }>();

  const [nullSwitch, setNullSwitch] = useState<boolean>(false);

  const [switching, setSwitching] = useState<boolean>(false);

  const closeSwitch = () => setNullSwitch(false);

  const validSwitch = () => {
    setNullSwitch(false);

    authenticate(true);
  };

  const [copied, mainCopy] = useState<boolean>(false);

  const style = {
    minWidth: 300,
    width: "70%",
    maxWidth: 600,
    borderRadius: 6,
    outline: "none",
    p: 4,
    position: "relative",
    margin: "auto",
  };

  const [isOpened, openModal] = useState<boolean>(false);

  const closeModal = () => openModal(!isOpened);

  const {
    connected,
    authenticate,
    chainId,
    signer: nullSigner,
    account,
    disconnect,
    validator,
  } = useCryptea();

  const [signer, setSigner] = useState(nullSigner);

  const [data, setData] = useState({});

  const [subValue, setSubValue] = useState<subValueType>({
    onetime: 0,
    sub: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [userD, setUserD] = useState<{ [index: string]: any }>({});

  const [pemail, setPemail] = useState<string[]>([]);

  const [loadingText, setLoadingText] = useState<any>("");
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [transferFail, setTransferFail] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [hash, setHash] = useState<string>("");

  const [options, setOptions] = useState<
    {
      value: number;
      label: string | JSX.Element;
      symbol: string;
      network: string;
      contractAddr: string;
      name: string;
      rpc: string;
      tokenAddr: string;
    }[]
  >(CryptoList);

  const [token, setToken] = useState<any>(options[0]);

  const [amountMn, setAmountMn] = useState<number>(0);

  const validAmt = (amt: any) => {
    if (userD.linkAmount == "variable" || !Boolean(userD.linkAmount)) {
      if (amt < 0 || amt == 0) {
        return "Amount cannot be zero";
      } else {
        return true;
      }
    } else if (typeof userD.linkAmount == "object") {
      const json = userD.linkAmount;

      if (json[0] !== undefined) {
        if (amt < json[0]) {
          return `Amount cannot be less than ${json[0]}`;
        } else {
          return true;
        }
      }

      if (json[1] !== undefined) {
        if (amt > json[1]) {
          return `Amount cannot be greater than ${json[0]}`;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  };

  const getPrice = async (
    price: number,
    chain: string | number | undefined = 80001
  ) => {
    let final: number = 0;
    setLoadingText("Loading price data...");

    const prices: { [index: string]: () => Promise<number> } = {
      "80001": async () => {
        const response = await axios.get("/simple/price", {
          params: {
            ids: "matic-network",
            vs_currencies: "usd",
          },
          baseURL: "https://api.coingecko.com/api/v3",
          withCredentials: false,
        });

        const e = response.data as { [index: string]: any };

        const priceCurrency = Number(e["matic-network"]["usd"]);

        return price / priceCurrency;
      },
      "31415": async () => {
        const response = await axios.get("/simple/price", {
          params: {
            ids: "filecoin",
            vs_currencies: "usd",
          },
          baseURL: "https://api.coingecko.com/api/v3",
        });

        const e = response.data as { [index: string]: any };

        const priceCurrency = Number(e["filecoin"]["usd"]);

        return price / priceCurrency;
      },
      "42261": async () => {
        const response = await axios.get("/simple/price", {
          params: {
            ids: "oasis-network",
            vs_currencies: "usd",
          },
          baseURL: "https://api.coingecko.com/api/v3",
        });

        const e = response.data as { [index: string]: any };

        const priceCurrency = Number(e["oasis-network"]["usd"]);

        return price / priceCurrency;
      },

      "1313161555": async () => {
        const response = await axios.get("/simple/price", {
          params: {
            ids: "auroratoken",
            vs_currencies: "usd",
          },
          baseURL: "https://api.coingecko.com/api/v3",
        });

        const e = response.data as { [index: string]: any };

        const priceCurrency = Number(e["auroratoken"]["usd"]);

        return price / priceCurrency;
      },

      "338": async () => {
        const response = await axios.get("/simple/price", {
          params: {
            ids: "crypto-com-chain",
            vs_currencies: "usd",
          },
          baseURL: "https://api.coingecko.com/api/v3",
        });

        const e = response.data as { [index: string]: any };

        const priceCurrency = Number(e["crypto-com-chain"]["usd"]);

        return price / priceCurrency;
      },
      "420": async () => {
        const response = await axios.get("/simple/price", {
          params: {
            ids: "optimism",
            vs_currencies: "usd",
          },
          baseURL: "https://api.coingecko.com/api/v3",
        });

        const e = response as { [index: string]: any };

        const priceCurrency = Number(e["optimism"]["usd"]);

        return price / priceCurrency;
      },
    };

    final = await prices[chain]();

    return final.toFixed(6);
  };

  const initMain = async (
    price: number,
    type: "sub" | "onetime" = "onetime"
  ) => {
    setAuth(false);
    setLoadingText("Initializing payment");
    try {
      if (Number(price)) {
        const validA = validAmt(Number(price));

        if (typeof validA == "boolean") {
          await beginPayment(price, type);
        } else {
          setTransferFail(true);
          setFailMessage(validA || "Something went wrong, please try again");
        }
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

  const [apiState, setApiState] = useState<boolean>(false);

  const [apiData, setApiData] = useState<any>({});

  const [amountFixed, setAmountFixed] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          link: lQ,
          user: userl,
          api,
        } = await initD(String(username).toLowerCase(), apiCode);

        if (lQ !== undefined) {
          if (lQ.template_data !== undefined) {
            const { name, data: udata } = JSON.parse(lQ.template_data);

            if (!editMode) {
              setData(udata);
            } else {
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
              setAmountFixed(true);
            }
          }

          // Custom inputs
          const rdata = JSON.parse(lQ.rdata);

          const cryptoData = JSON.parse(lQ.data || "[]");

          if (cryptoData.length) {
            const sOptions = [...options].filter(
              (v: token) => cryptoData.indexOf(v.value) != -1
            );

            setOptions(sOptions);

            if (sOptions[0] !== undefined) {
              setToken(sOptions[0]);
            }
          }

          if (
            rdata["sub"] !== undefined &&
            rdata["sub"].indexOf("Email") == -1 &&
            rdata["sub"].indexOf("email") == -1
          ) {
            rdata["sub"].push("email");
          }

          let redirect = lQ.redirect;

          if (Boolean(api)) {
            if (Boolean(api.payid)) {
              router.push("/timeout/reference");
            }

            redirect = Boolean(api.redirect) ? api.redirect : redirect;

            if (Boolean(api.amount)) {
              setAmount(api.amount);
              setAmountFixed(true);
            }

            if (api.data !== null) {
              const data = JSON.parse(api.data);

              if (data["email"] !== undefined && data["name"] !== undefined) {
                if (validator.isEmail(data["email"]) && data["name"].length) {
                  setApiState(true);
                  setApiData(data);
                }
              }
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
            amountMultiple: Boolean(lQ.amountMulti)
              ? JSON.parse(lQ.amountMulti)
              : [],
            linkAmount,
            rdata,
            redirect,
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

  if (!userD) {
    router.push("/404");
  }

  const [subCheck, setSubCheck] = useState<boolean>(true);

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
    setTinterval("");

    if (typeof userD.linkAmount != "number") {
      setAmount("");
    }
  };

  const support = ["name", "email", "phone"];

  const validForm = (value: string, valid: string) => {
    if (valid == "email" && !validator.isEmail(value)) {
      if (!failMessage.length)
        setFailMessage("A valid email address is required");

      return false;
    }

    if (valid == "name" && !validator.isAlphanumeric(value)) {
      if (!failMessage.length) setFailMessage("A valid name is required");

      return false;
    }

    if (support.indexOf(valid) == -1) {
      if (!failMessage.length)
        setFailMessage(
          "Please enter the correct details required in available fields"
        );

      return false;
    }

    return true;
  };

  const { chains, error, pendingChainId, switchNetworkAsync } =
    useSwitchNetwork();

  const beginPayment = async (
    price: number,
    type: "sub" | "onetime" = "onetime"
  ) => {
    let from = "";

    console.log(signer, "sign");

    if (!connected || chainId != token.value || !signer) {
      setLoadingText("");

      if (chainId != token.value) {
        const switchNet = await switchNetworkAsync?.(token.value);

        console.log(switchNet, "hehe");

        if (connected) {
          disconnect();
        }

        if (switchNet === undefined) {
          setNullSwitch(true);
        } else {
          authenticate(true);
        }
      } else if (!connected || !signer) {
        if (!signer) {
          disconnect();
        }

        authenticate(true);
      }

      setPaymentData({ price, type });
    } else {
      from = account || "";

      setLoadingText("Pending...");

      const feesPrice = price + (price * 1) / 100;

      const ether = await getPrice(feesPrice, chainId);

      const signed: any = signer;

      const initContract = new ethers.Contract(
        token.contractAddr,
        PAYMENT.abi,
        signed
      );

      setLoadingText("Processing payment");

      // const estimation = await initContract.estimateGas.transferNative(
      //   ethAddress || "",
      //   {
      //     value: ethers.utils.parseEther(ether),
      //     nonce: await signer.getTransactionCount(),
      //   }
      // );

      const feeData = await signer.getFeeData();

      initContract
        .transferNative(ethAddress || "", {
          value: ethers.utils.parseEther(ether),
          gasPrice: feeData.gasPrice,
        }) //receiver
        .then(async (init: any) => {
          console.log(init);

          setHash(init.hash);

          const rx: { [index: string]: string | number | undefined } = {};

          if (!apiState) {
            pemail.forEach((val: undefined | string, i: number) => {
              if (val !== undefined && val.length) {
                if (userD.rdata[type][i] !== undefined) {
                  rx[userD.rdata[type][i].toLowerCase()] = val;
                }
              }
            });
          } else {
            inputsList.forEach((val) => {
              const index = val.value.toLowerCase();

              rx[index] = apiData[index] || undefined;
            });
          }

          let post: any = {
            ...rx,
            date: new Date().getTime(),
            address: from,
            api: apiCode,
            type,
            amount: price,
            hash: init.hash,
            explorer: tokenTrackers[token.value].link,
            amountCrypto: ether,
            token: token.name,
            contractAddr: token.contractAddr,
            paytype: "auto",
            linkId,
            chain: token.value,
          };

          if (type == "sub") {
            post = {
              ...post,
              remind: new Date().getTime() + mainIx(interval) * 1000,
              renewal: interval,
            };
          }

          await axios.post(`/api/payments/validate`, post, {
            baseURL: window.origin,
          });

          setTransferSuccess(true);

          if (type == "sub") setSubCheck(true);

          if (Boolean(userD.redirect) && validator.isURL(userD.redirect)) {
            let link = String(userD.redirect).split("?");

            if (apiCode !== undefined) {
              if (Boolean(link[1])) {
                if (!link[1].length) {
                  link[0] += `?trx=${apiCode}`;
                } else {
                  link[1] += `&trx=${apiCode}`;

                  link[0] += "?";
                }
              } else {
                link[0] += `?trx=${apiCode}`;
              }
            }

            const mLink = link.join("");

            router.push(mLink);
          }

          setTimeout(reset, 12000);
        })
        .catch((err: any) => {
          const error = err as Error;

          if (error.message.length) {
            setTransferFail(true);
            if (err.data) {
              if (err.data.message.indexOf("insufficient funds") != -1) {
                setFailMessage("Insufficient funds for transaction");
              } else if (
                err.data.message.indexOf("transaction underpriced") != -1
              ) {
                setFailMessage("Transaction Underpriced, please try again");
              } else if (
                err.data.message.indexOf("user rejected transaction") != -1
              ) {
                setFailMessage("Transaction cancelled");
              }
            }
            if (err.message.indexOf("user rejected transaction") != -1) {
              setFailMessage("Transaction cancelled");
            } else if (err.message.indexOf("transaction underpriced") != -1) {
              setFailMessage("Transaction underpriced, please try again");
            }

            console.log(err);
            setLoadingText("");
          }
        });
    }
  };

  useEffect(() => {
    if (connected && paymentData !== undefined) {
      if (chainId == token.value) {
        console.log("ee");
        if (Boolean(signer)) {
          console.log("kekr");
          beginPayment(paymentData.price, paymentData.type);
          setPaymentData(undefined);
        }
      }
    }
  }, [connected, chainId, token, signer]);

  const [auth, setAuth] = useState<boolean>(true);

  const [genAddr, setGenAddr] = useState<string | undefined>();

  const timer: any = useRef();

  const [timeCounted, setTimeCounted] = useState<number>(0);

  const [manLoader, setManLoader] = useState<boolean>(false);

  let timerTimeout: any = null;

  const checkWallet = async ({
    initialBalance,
    price,
    type,
    wallet,
  }: {
    initialBalance: any;
    price: string;
    type: "onetime" | "sub";
    wallet: string;
  }) => {
    if (timeCounted <= 720) {
      const base = {
        initial: initialBalance,
        rpc: token.rpc,
        tokenAddr: token.tokenAddr,
        price,
        account: wallet,
      };

      try {
        const queryBalance = await axios.post("/api/payments", base, {
          baseURL: window.origin,
        });

        console.log(queryBalance);

        if (queryBalance.data.proceed) {
          clearInterval(timer.current);

          setManLoader(true);

          try {
            const rx: { [index: string]: string | number } = {};
            pemail.forEach((val: undefined | string, i: number) => {
              if (val !== undefined && val.length) {
                if (userD.rdata[type][i] !== undefined) {
                  rx[userD.rdata[type][i].toLowerCase()] = val;
                }
              }
            });

            let post: any = {
              rx,
              type,
              amount,
              amountCrypto: price,
              label: token.label,
            };

            if (type == "sub") {
              post = {
                ...post,
                interval,
              };
            }

            const trxx = await post_request(
              "/api/payments/begin",
              { ...base, ...post, linkId, ethAddress },
              {
                baseURL: window.origin,
                timeout: 600000,
              }
            );

            console.log(trxx);

            if (trxx.data.success) {
              const trx = trxx.data;

              setHash(trx.message);

              setTransferSuccess(true);

              openModal(false);

              setManLoader(false);
              setTimeCounted(0);
              if (type == "sub") setSubCheck(true);

              clearTimeout(timerTimeout);

              setTimeout(reset, 12000);
            } else {
              setManLoader(false);
              openModal(false);
              console.log(trxx.data.message);
              clearInterval(timer.current);
              setTransferFail(true);
              setTimeCounted(0);
              setFailMessage(trxx.data.message);
            }
          } catch (err) {
            setManLoader(false);
            openModal(false);
            console.log(err);
            setTransferFail(true);
            clearInterval(timer.current);
            setTimeCounted(0);
            setFailMessage("Something went wrong, Please try again");
          }
        } else {
          timerTimeout = setTimeout(
            () =>
              checkWallet({
                initialBalance,
                price,
                type,
                wallet,
              }),
            2000
          );
        }
      } catch (err) {
        console.log(err);
        timerTimeout = setTimeout(
          () =>
            checkWallet({
              initialBalance,
              price,
              type,
              wallet,
            }),
          2000
        );
      }
    } else {
      clearTimeout(timerTimeout);
      openModal(false);
      setTransferFail(true);
      clearInterval(timer.current);
      setTimeCounted(0);
      setFailMessage("No crypto received, please try again");
    }
  };

  useEffect(() => {
    if (timeCounted >= 720) {
      clearInterval(timer.current);
      setTimeCounted(0);
      openModal(false);
      setTransferFail(true);
      setFailMessage("No crypto received, please try again");
    }
  }, [timeCounted, timer]);

  const beginManual = async (amount: number, type: "onetime" | "sub") => {
    setLoadingText("Just a sec...");

    axios
      .get("/api/payments/accounts", {
        params: {
          type: "evm",
        },
        baseURL: window.origin,
      })
      .then(async (address) => {
        console.log(address, "here");

        let wallet: string = address!.data.data;

        setGenAddr(wallet);

        const price = await getPrice(
          amount + (Number(amount) * 1) / 100,
          token.chain
        );

        setAmountMn(Number(price));

        const provider = new ethers.providers.JsonRpcProvider(token.rpc);

        const balance = new ethers.Contract(
          token.tokenAddr,
          balanceABI,
          provider
        );

        const initialBalance = Number(
          ethers.utils.formatEther(await balance.balanceOf(wallet))
        );

        openModal(true);

        setLoadingText("");

        timer.current = setInterval(() => {
          setTimeCounted((timeCounted) => timeCounted + 1);
        }, 1000);

        await checkWallet({ initialBalance, type, price, wallet });
      })
      .catch((err) => {
        const error = err as Error | AxiosError;

        console.log(error);

        beginManual(amount, type);
      });
  };

  const begin = (type: "onetime" | "sub", auto: boolean) => {
    setFailMessage("");
    setTransferFail(false);
    setHash("");

    if (!subValue[type]) {
      let proceed = true;

      if (!apiState) {
        userD.rdata[type].forEach((val: string, i: number) => {
          if (
            !validForm(Boolean(pemail[i]) ? pemail[i] : "", val.toLowerCase())
          )
            proceed = false;
        });
      }

      if (proceed) {
        subValue[type] = 1;
        setSubValue({ ...subValue });
      } else {
        return;
      }
    } else if (Number(amount) || subValue[type] == 1) {
      if (!apiState) {
        if (
          !validForm(pemail[0], userD.rdata[type][0].toLowerCase()) &&
          userD.rdata[type].length == 1
        ) {
          return;
        }
      }

      if (auto) initMain(Number(amount), type);
      else beginManual(Number(amount), type);
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
        explorer: tokenTrackers[token.value],
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
        subCheck,
        setSubCheck,
        begin,
        apiState,
        subValue,
        setSubValue,
        eSubscription,
        options,
        amountFixed,
        setESubscription,
        setSigner,
      }}
    >
      <AuthModal userAuth={false} />

      {nullSwitch && (
        <>
          <Modal
            open={nullSwitch}
            sx={{
              "&& .MuiBackdrop-root": {
                backdropFilter: "blur(5px)",
              },
            }}
            onClose={closeSwitch}
            className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
            aria-labelledby="Generate New Api Key"
            aria-describedby="Generate Api"
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
                      Switch Network
                    </h2>
                    <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                      You have to switch networks to continue
                    </span>
                  </div>

                  <IconButton size={"medium"} onClick={closeSwitch}>
                    <MdClose
                      size={20}
                      color={"rgb(32,33,36)"}
                      className="cursor-pointer"
                    />
                  </IconButton>
                </div>

                <span className="text-[#7c7c7c] mt-3 block font-[500] text-[15px]">
                  {/* Content here */}
                </span>
              </div>

              <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                <div className="flex items-center">
                  <Button
                    onClick={validSwitch}
                    className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !fill-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                  >
                    <TbPlugConnected
                      color={"inherit"}
                      className={"mr-2 !fill-white"}
                      size={23}
                    />{" "}
                    Reconnect
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </>
      )}

      <Modal
        open={isOpened}
        sx={{
          zIndex: 100000000,
          "&& .MuiBackdrop-root": {
            backdropFilter: "blur(5px)",
            width: "calc(100% - 8px)",
          },
        }}
        onClose={closeModal}
        className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
        aria-labelledby="Begin Manual Payment"
        aria-describedby="Make quick manual payment"
      >
        <Box className="sm:w-full h-fit 3mdd:px-[2px]" sx={style}>
          <div className="py-4 px-6 bg-white -mb-[1px] rounded-[.9rem]">
            <div className="mb-5 flex items-center relative justify-between">
              <LogoSpace />

              <span className="font-[500] text-[rgb(32,33,36)] text-[1.05rem]">
                ${amount} ( ${(Number(amount) * 1) / 100} fee )
              </span>

              <IconButton
                size={"medium"}
                className="-top-full -right-[30px] !absolute !bg-[#fff]"
                onClick={closeModal}
              >
                <MdClose
                  size={20}
                  color={"rgb(32,33,36)"}
                  className="cursor-pointer"
                />
              </IconButton>
            </div>

            <div className="py-3 mb-2">
              <span className="text-[rgb(113,114,116)] text-center block font-[500] text-[14px]">
                Scan the qr code below or copy the address, Send the exact
                amount required for this transaction to complete the
                transaction.
              </span>
            </div>

            <div className="flex items-center justify-center mb-2">
              <span className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                {amountMn} {token.symbol.toUpperCase()}
              </span>
            </div>

            <div className="flex relative items-center flex-col justify-center mb-5">
              {manLoader && (
                <Loader
                  head={false}
                  sx={{
                    backgroundColor: "#ffffffeb",
                    width: 210,
                    height: 210,
                    margin: "auto",
                    right: "0px",
                    left: "0px",
                  }}
                  incLogo={false}
                  fixed={false}
                />
              )}
              <QrCode
                style={{
                  marginBottom: "16px",
                }}
                data={genAddr || ""}
              />

              <span className="text-[rgb(80,80,82)] font-bold text-center block text-[15px]">
                Send Payment Within{" "}
                <span className="text-[17px]">
                  {String((720 - timeCounted) / 60).split(".")[0] +
                    ":" +
                    `${(720 - timeCounted) % 60 <= 9 ? 0 : ""}${
                      (720 - timeCounted) % 60
                    }`}
                </span>
              </span>
            </div>

            <div className="w-full items-center my-3 rounded-md flex justify-between bg-[#2e2e2e0e] py-1 px-3">
              <div className="mr-2">
                <span className="font-bold text-[#919191] text-[13px]">
                  Address
                </span>
                <span className="text-[#919191] truncate block h-fit">
                  {genAddr}
                </span>
              </div>
              <ClickAwayListener onClickAway={() => mainCopy(false)}>
                <Tooltip
                  placement="top"
                  onClose={() => mainCopy(false)}
                  open={copied}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  PopperProps={{
                    disablePortal: true,
                  }}
                  arrow
                  title="Copied"
                >
                  <IconButton
                    size={"large"}
                    onClick={() => {
                      mainCopy(true);
                      copy(genAddr as string);
                    }}
                  >
                    <FaRegClone
                      color={"#919191"}
                      className="cursor-pointer"
                      size={16}
                    />
                  </IconButton>
                </Tooltip>
              </ClickAwayListener>
            </div>

            <div className="w-full items-center mt-3 mb-5 rounded-md flex flex-col">
              <div className="bg-[#2e2e2e0e] w-full mb-1 py-1 px-3">
                <span className="font-bold text-[#919191] text-[13px]">
                  Network
                </span>
                <span className="text-[#919191] truncate block h-fit">
                  {token.network}
                </span>
              </div>
              <span className="text-[rgb(113,114,116)] block font-[500] text-[14px]">
                Note that sending tokens from the wrong network could result in
                loss of tokens
              </span>
            </div>

            <Button
              onClick={closeModal}
              className="!py-2 !font-bold !px-5 !mx-auto !capitalize !flex !items-center !text-white !bg-[#aaaaaa] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
            >
              <RiCloseCircleLine size={22} className="mr-2" /> Dismiss
            </Button>
          </div>
        </Box>
      </Modal>

      {children}
    </PaymentContext.Provider>
  );
};
