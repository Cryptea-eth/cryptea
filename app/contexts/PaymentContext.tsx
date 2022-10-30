import React, { createContext, useState, useEffect } from "react";
import { useCryptea } from "./Cryptea";
import { useRouter } from "next/router";
import { post_request, get_request } from "./Cryptea/requests";
import * as ethers from "ethers";
import PAYMENT from "../../artifacts/contracts/payment.sol/Payment.json";
import { initD } from "../components/elements/dashboard/link/data";
import { useSwitchNetwork } from "wagmi";
import { PaymentContext as PaymentCont, subValueType } from "./Cryptea/types";
import AuthModal from "../components/elements/modal";

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

  const [is500, setIs500] = useState<boolean>(false);

  const [interval, setTinterval] = useState<string>("daily");

  const contractAddress: string = "0x60da5f4B583F6fa7c36511e59fdB49E016eCCc43";

  useEffect(() => {}, [username, router.isReady]);

  const [paymentData, setPaymentData] = useState<{
    price: number;
    type: "onetime" | "sub";
  }>();

  const [token, setToken] = useState<any>({
    value: 80001,
    label: "Matic (Testnet)",
  });

  const {
    connected,
    authenticate,
    chainId,
    signer: nullSigner,
    account,
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

  const tokenTrackers: { [index: string]: { name: string; link: string } } = {
    80001: {
      name: "polygonscan",
      link: "https://mumbai.polygonscan.com/tx/",
    },
    338: {
      name: "Cronos Explorer",
      link: "https://cronos.org/explorer/testnet3/tx/",
    },
    1313161555: {
      name: "Aurora Explorer",
      link: "https://explorer.testnet.aurora.dev/tx/",
    },
    420: {
      name: "Optimism Explorer",
      link: "https://goerli-optimistic.etherscan.io/tx/",
    },
    42261: {
      name: "Oasis Explorer",
      link: "https://testnet.explorer.emerald.oasis.dev/tx/",
    },
  };

  const [options, setOptions] = useState<
    { value: string | number; label: string }[]
  >([
    { value: 80001, label: "Matic (Testnet)" },
    { value: 338, label: "Cronos (Testnet)" },
    { value: 1313161555, label: "Aurora (Testnet)" },
    { value: 420, label: "Optimism (Testnet)" },
    { value: 42261, label: "Rose (Testnet)" },
  ]);

  const getPrice = async (
    price: number,
    chain: string | number | undefined = 80001
  ) => {
    let final: number = 0;
    setLoadingText("Loading Price data...");

    const prices: { [index: string]: () => Promise<number> } = {
      "80001": async () => {
        const response = await post_request("/token/price", {
          currency: "usd",
          token: "matic-network",
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
            }
          }

          // Custom inputs
          const rdata = JSON.parse(lQ.rdata);

          if (
            rdata["sub"] !== undefined &&
            rdata["sub"].indexOf("Email") == -1
          ) {
            rdata["sub"].push("Email");
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
    setPemail([]);
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

    if (!connected || chainId != token.value) {
      setLoadingText("");

      if (chainId != token.value) {
        await switchNetworkAsync?.(token.value);

        authenticate(true);
      } else if (!connected) {
        authenticate(true);
      }

      setPaymentData({ price, type });
    } else {
      from = account || "";

      setLoadingText("Pending...");

      const ether = await getPrice(price, chainId);

      const signed: any = signer;

      const initContract = new ethers.Contract(
        contractAddress,
        PAYMENT.abi,
        signed
      );

      setLoadingText("Awaiting payment confirmation");

      initContract
        .transferNative(ethAddress || "", {
          value: ethers.utils.parseEther(ether),
        }) //receiver
        .then(async (init: any) => {
          console.log(init);

          setHash(init.hash);

          const rx: { [index: string]: string | number } = {};

          pemail.forEach((val: undefined | string, i: number) => {
            if (val !== undefined && val.length) {
              if (userD.rdata[type][i] !== undefined) {
                rx[userD.rdata[type][i].toLowerCase()] = val;
              }
            }
          });

          let post: any = {
            ...rx,
            date: new Date().getTime(),
            address: from,
            type,
            amount: price,
            hash: init.hash,
            amountCrypto: ether,
            token: token.label,
          };

          if (type == "sub") {
            post = {
              ...rx,
              date: new Date().getTime(),
              remind: new Date().getTime() + mainIx(interval) * 1000,
              address: from,
              amount: price,
              hash,
              amountCrypto: ether,
              token: token.label,
              type,
              renewal: interval,
            };
          }

          await post_request(`/link/payments/${linkId}`, post);

          setTransferSuccess(true);

          if (type == "sub") setSubCheck(true);

          setTimeout(reset, 12000);
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
  };

  useEffect(() => {
    if (connected && paymentData !== undefined) {
      if (chainId == token.value) {
        if (Boolean(signer)) {
          beginPayment(paymentData.price, paymentData.type);
          setPaymentData(undefined);
        }
      }
    }
  }, [connected, chainId, token, signer]);

  const [auth, setAuth] = useState<boolean>(true);

  const beginManual = (type: "onetime" | "sub") => {

    

  }

  const begin = (type: "onetime" | "sub") => {
    setFailMessage("");
    setTransferFail(false);
    setHash("");

    if (userD.rdata[type].length > 1 && !subValue[type]) {
      let proceed = true;

      userD.rdata[type].forEach((val: string, i: number) => {
        if (!validForm(Boolean(pemail[i]) ? pemail[i] : "", val.toLowerCase()))
          proceed = false;
      });


      if (proceed) {
         subValue[type] = 1;
        setSubValue({ ...subValue });
      } else {
        return;
      }

    } else if (Number(amount) || subValue[type] == 1) {
      if (
        !validForm(pemail[0], userD.rdata[type][0].toLowerCase()) &&
        userD.rdata[type].length == 1
      ) {
        return;
      }

      initMain(Number(amount), type);
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
        subValue,
        setSubValue,
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
