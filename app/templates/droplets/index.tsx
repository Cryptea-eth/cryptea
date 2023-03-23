import { useEffect, useState, useContext, useRef } from "react";
import styles from "../../../styles/droplets.module.css";
import {
  Avatar,
  Modal,
  Box,
  IconButton,
  Button,
  Tabs,
  Tab,
  ToggleButton,
  FormControl,
  ToggleButtonGroup,
  TextField,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import Head from "next/head";
import Nav from "../../components/elements/Nav";
import TabPanel from "../../components/elements/dashboard/link/TabPanel";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import Link from "next/link";
import Select, { createFilter } from "react-select";
import { useRouter } from "next/router";
import Loader from "../../components/elements/loader";
import { PaymentContext } from "../../contexts/PaymentContext";
import { useCryptea } from "../../contexts/Cryptea";
import Secured from "../../components/elements/secured";
import { MdChevronLeft } from "react-icons/md";
import { subValueType } from "../../contexts/Cryptea/types";
import NumberFormat from "react-number-format";
import axios from "axios";

const Droplets = ({ className }: { className?: string }) => {
 
  const router = useRouter();
 
  const { slug } = router.query;


  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const onceCheck = useRef<boolean>(false);

  const timer = useRef<string>('');

  const [expired, setExpired] = useState<boolean>(false);

  const {
    userD,
    setUserD,
    token,
    setToken,
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
    rnData,
    begin,
    interval,
    apiState,
    amountFixed,
    setTinterval,
    explorer,
    is500,
    amount,
    reset,
    setAmount,
    setSubCheck,
    options,
    eSubscription,
    setSigner,
    subValue,
    setSubValue,
  } = useContext(PaymentContext);

  const [value, setValue] = useState<number>(Number(Boolean(rnData!.amount)));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setFailMessage?.("");
    const subV = { ...subValue };

    subV[newValue ? "onetime" : "sub"] = 0;

    setSubValue?.(subV as subValueType);
    setPemail?.([]);
  };

  console.log(data, "xx");

  const { signer } = useCryptea();


  let tx: any;

  const cal = async () => {

    const { expire } = data.config;

    const { data: { time: currentTime } } = await axios.get('/api/time', {
      baseURL: window.origin
    });

    const milliseconds = expire - currentTime;

    const seconds = Math.round((milliseconds / 1000) % 60);
    const minutes = Math.round((milliseconds / (1000 * 60)) % 60);
    const hours = Math.round((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.round(milliseconds / (1000 * 60 * 60 * 24));

    if (days > 0) {

      timer.current = `${days} day${days > 1 ? "s" : ""} left`;

      tx = setTimeout(cal, 60 * 60 * 24 * 1000);

    } else if (hours > 0) {

      timer.current = `${hours} hour${hours > 1 ? "s" : ""} left`;

      clearTimeout(tx);

      tx = setTimeout(cal, 60 * 60 * 1000);

    } else if (minutes > 0) {
      timer.current = `${minutes} minute${minutes > 1 ? "s" : ""} left`;

      clearTimeout(tx);

      tx = setTimeout(cal, 60_000);
    } else if (seconds > 0) {
      timer.current = `${seconds} second${seconds > 1 ? "s" : ""} left`;

      clearTimeout(tx);

      tx = setTimeout(cal, 3_000);
    }else{
      clearTimeout(tx);

      timer.current = `Time's up`;

      setExpired(true);

    }
  };



  useEffect(() => {
    setSigner?.(signer);
  }, [signer]);

  useEffect(() => {

    if (userD!.rdata !== undefined) {
      if (
        userD!.rdata[!value ? "onetime" : "sub"].length < 1 ||
        apiState ||
        rnData!.data
      ) {
        const nsVal = { ...subValue };

        nsVal[!value ? "onetime" : "sub"] = 1;

        setSubValue?.(nsVal as subValueType);
      }
    
      if (!onceCheck.current) {
        onceCheck.current = true;
        cal();
      }

    }

     

  }, [value, userD, rnData]);

  const once = useRef<boolean>(false);

  const [payModal, setPayModal] = useState<boolean>(false);

  const openModal = () => setPayModal(true);

  const config = useRef<any>({});

  const closeModal = () => setPayModal(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const button = document.querySelector(".actBtn");

      if (button !== null) {
        const { top } = button.getBoundingClientRect();

        if (top < -12) {
          (
            (document.querySelector(".bigHeader") as HTMLDivElement) || {
              style: { display: "" },
            }
          ).style.display = "flex";
        } else {
          (
            (document.querySelector(".bigHeader") as HTMLDivElement) || {
              style: { display: "" },
            }
          ).style.display = "none";
        }
      }
    });

  

    const configCheck = async () => {

      const { data: linkData } = await axios.get(`/link/${String(slug)}`, {
        baseURL: "https://ab.cryptea.me",
      });

      const { name, data: udata } = JSON.parse(
        linkData?.data?.link?.template_data || '{ "name": "", "data": "{}" }'
      );

      config.current = {
          ...(udata?.config || {})
      }

      setTimeout(configCheck, 4000);
    };

    if (!once.current && slug !== undefined) {
    
      once.current = true;

      configCheck();
    
    }
    

  }, [slug]);

  const {
    title: usern,
    description,
    img,
  }: {
    title?: string;
    description?: string;
    img?: string | null;
  } = userD ?? { title: "", description: "", img: "" };

  const text = {
    "& .Mui-focused.MuiFormLabel-root": {
      color: data.colorScheme,
    },
    "& .MuiInputLabel-root": {
      fontWeight: "600",
      color: "#121212",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
      {
        borderColor: `${data.colorScheme} !important`,
      },
  };

  const { pathname } = useRouter();

  useEffect(() => {
    const elem = document.querySelector(".droplets") as HTMLDivElement;

    if (pathname.indexOf("[slug]/edit") !== -1) {
      if (elem?.scrollHeight == document.body.scrollHeight) {
        elem.style.width = "calc(100% - 249px)";
      } else {
        elem.style.width = "calc(100% - 258px)";
      }
    }
  });

  const onSuccess = async (action?: { linkId: any, link: string }) => {
    if (action === undefined) {
      closeModal();
    } else {
      await axios.post('/api/droplets/payment', {
        date: data.config.start,
        ...action
      }, {
        baseURL: window.origin
      });
    }
  };

  return (
    <div className={`droplets ${styles.main} ${className}`}>
      {isLoading ? (
        <Loader color={data.colorScheme} fixed={false} />
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
                  <div className="text-black font-[500] text-4xl mx-auto mt-24">
                    500 Internal Server Error
                  </div>
                  <div
                    style={{
                      color: data.colorScheme,
                    }}
                    className="font-semibold text-lg mx-auto mt-12  px-[10px] text-center"
                  >
                    Opps... Refresh this page, if error persist contact support
                    or check your internet access
                  </div>

                  <Link href={window.location.href}>
                    <a className="text-center mt-3">
                      <Button
                        sx={{
                          backgroundColor: `${data.colorScheme} !important`,
                          color: `#FFF !important`,
                        }}
                        className="!ml-2 !transition-all !delay-500 !text-sm !capitalize !rounded-lg !font-semibold !py-3 !px-4 !mx-auto"
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
              <Modal
                open={payModal}
                sx={{
                  "&& .MuiBackdrop-root": {
                    backdropFilter: "blur(5px)",
                  },
                }}
                className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
                aria-labelledby="Payment Modal to fund"
                aria-describedby="Payment Modal"
              >
                <Box
                  className="sm:!w-full 3md:!p-1 h-fit 3mdd:px-[2px]"
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
                        <div className="flex items-center">
                          {userD!.rdata[!value ? "onetime" : "sub"].length >=
                            1 &&
                            !apiState &&
                            subValue![!value ? "onetime" : "sub"] == 1 && (
                              <IconButton
                                className="!mr-[5px]"
                                onClick={() => {
                                  const nsVal = { ...subValue };
                                  nsVal[!value ? "onetime" : "sub"] = 0;

                                  setFailMessage?.("");

                                  setSubValue?.(nsVal as subValueType);
                                }}
                              >
                                <MdChevronLeft color="#302f2f" size={24} />
                              </IconButton>
                            )}

                          <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem] 3md:text-[1.2rem]">
                            Send Payment
                          </h2>
                        </div>

                        <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                          Enter details to begin payment
                        </span>
                      </div>

                      <IconButton size={"medium"} onClick={closeModal}>
                        <MdClose
                          size={20}
                          color={"rgb(32,33,36)"}
                          className="cursor-pointer"
                        />
                      </IconButton>
                    </div>

                    {/* start */}

                    {Boolean(loadingText) &&
                      !transferFail &&
                      !transferSuccess && (
                        <Loader
                          head={false}
                          sx={{
                            backgroundColor: "rgba(255,255,255,.9)",
                            backdropFilter: "blur(5px)",
                          }}
                          fixed={false}
                          text={loadingText}
                          color={data.colorScheme}
                          incLogo={false}
                        />
                      )}

                    {userD?.linktype == "both" && Boolean(rnData!.amount) && (
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
                            "& .MuiTab-root.MuiButtonBase-root.Mui-selected": {
                              fontWeight: "bold",
                              borderRadius: "4px",
                              color: data.colorScheme,
                              backgroundColor: `${
                                data.colorScheme.length > 7
                                  ? data.colorScheme.substring(0, 7) + "23"
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
                        className="rounded-md w-full font-bold my-2 mx-auto p-3"
                      >
                        {failMessage?.length
                          ? failMessage
                          : "Something went wrong with the transaction, please try again"}
                      </div>
                    )}

                    {Boolean(eSubscription!.length) && (
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
                          we found you have an existing unexpired subscription,
                          do you want to go on with subscribing again?🤔
                        </div>

                        <div className="mt-11 flex justify-center items-center">
                          <Button
                            onClick={() => {
                              setFailMessage?.("Transaction cancelled by user");
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
                              setTransferSuccess?.(false);
                              setFailMessage?.("");
                              setHash?.("");
                              setLoadingText?.("");
                              setTransferFail?.(false);
                              setSubCheck?.(false);
                              begin?.("sub", true);
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
                      <div className="h-full backdrop-blur-[3px] absolute left-0 bg-[rgba(255,255,255,.9)] top-0 z-[100] flex flex-col justify-evenly items-center w-full">
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

                        <Link href={`${explorer!.link(hash || "")}`}>
                          <a
                            target={"_blank"}
                            className="text-[#5a5a5a] cursor-pointer mb-1 font-normal"
                          >
                            View transaction on{" "}
                            <span
                              className="font-bold"
                              style={{
                                color: data.colorScheme,
                              }}
                            >
                              {explorer!.name}
                            </span>
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

                    <TabPanel padding={0} value={value} index={0}>
                      {(userD?.linktype == "both" ||
                        userD?.linktype == "onetime") && (
                        <>
                          <TabPanel
                            value={subValue?.onetime as number}
                            index={0}
                            padding={0}
                          >
                            {userD!.rdata["onetime"].map(
                              (ixn: string, i: number) => (
                                <div className="my-6" key={i}>
                                  <div
                                    style={{
                                      paddingTop: (!i && 0.001) || undefined,
                                    }}
                                    className="py-3 capitalize font-bold"
                                  >
                                    {ixn}
                                  </div>

                                  <TextField
                                    fullWidth
                                    placeholder={`Your ${ixn}`}
                                    variant="standard"
                                    sx={text}
                                    value={
                                      pemail![i] !== undefined ? pemail![i] : ""
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                      >
                                    ) => {
                                      setTransferFail?.(false);
                                      setFailMessage?.("");
                                      setLoadingText?.("");
                                      const val = e.target.value;
                                      pemail![i] = val;
                                      setPemail?.([...pemail!]);
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </TabPanel>

                          <TabPanel
                            padding={0}
                            value={subValue?.onetime as number}
                            index={1}
                          >
                            {amountFixed && (
                              <div className="flex items-center flex-col justify-center text-[1.55rem] mb-5">
                                <span className="font-light block mb-1 text-[rgba(88,88,88,0.86)] text-[14px]">
                                  You&apos;ll Be Paying
                                </span>

                                <span className="font-[500] text-[rgb(32,33,36)] text-[1.21rem]">
                                  <NumberFormat
                                    value={amount}
                                    thousandSeparator={true}
                                    displayType={"text"}
                                    prefix={"USD "}
                                  />
                                </span>

                                <span className="font-normal text-[rgb(78,79,80)] text-[15px]">
                                  1% fee
                                </span>
                              </div>
                            )}

                            <FormControl fullWidth>
                              <div className="my-3">
                                <div className="pb-3 font-bold">Token</div>

                                <Select
                                  isClearable={false}
                                  name="Tokens"
                                  filterOption={createFilter({
                                    stringify: (option) =>
                                      `${option.value} ${option.data.name}`,
                                  })}
                                  placeholder={"Tokens..."}
                                  options={options!}
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
                                        borderBottomColor: `${data.colorScheme} !important`,
                                        boxShadow: "none",
                                      },
                                    }),
                                  }}
                                  value={token}
                                  onChange={(e) => {
                                    setToken?.(e!);
                                    setFailMessage?.("");
                                  }}
                                  classNamePrefix="select"
                                />
                              </div>

                              <div className="my-3">
                                {!amountFixed && (
                                  <div className="py-3 font-bold">
                                    Amount (USD) (1% fee)
                                  </div>
                                )}

                                {Boolean(userD?.amountMultiple.length) &&
                                  !amountFixed && (
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
                                        "&.MuiButtonBase-root": {
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
                                        setTransferFail?.(false);
                                        setFailMessage?.("");
                                        setLoadingText?.("");
                                        const val = e.target.value;
                                        setAmount?.(val.replace(/[^\d.]/g, ""));
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
                                  !amountFixed && (
                                    <div className="py-3 font-bold">
                                      Or input Amount
                                    </div>
                                  )}

                                {!amountFixed && (
                                  <TextField
                                    fullWidth
                                    variant="standard"
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
                                      setTransferFail?.(false);
                                      setFailMessage?.("");
                                      setLoadingText?.("");
                                      const val = e.target.value;
                                      setAmount?.(val.replace(/[^\d.]/g, ""));
                                    }}
                                  />
                                )}
                              </div>
                            </FormControl>
                          </TabPanel>
                        </>
                      )}
                    </TabPanel>
                    <TabPanel padding={0} value={value} index={1}>
                      {(userD?.linktype == "sub" ||
                        userD?.linktype == "both") && (
                        <>
                          <TabPanel
                            value={subValue?.sub as number}
                            index={0}
                            padding={0}
                          >
                            {userD!.rdata["sub"].map(
                              (ixn: string, i: number) => (
                                <div key={i}>
                                  <div
                                    style={{
                                      paddingTop: (!i && 0.001) || undefined,
                                    }}
                                    className="py-3 capitalize font-bold"
                                  >
                                    {ixn}
                                  </div>

                                  <TextField
                                    fullWidth
                                    placeholder={`Your ${ixn}`}
                                    variant="standard"
                                    className="w-[calc(100%-1.1px)]"
                                    sx={text}
                                    value={
                                      pemail![i] !== undefined ? pemail![i] : ""
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                      >
                                    ) => {
                                      setTransferFail?.(false);
                                      setFailMessage?.("");
                                      setLoadingText?.("");
                                      const val = e.target.value;
                                      pemail![i] = val;
                                      setPemail?.([...pemail!]);
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </TabPanel>

                          <TabPanel
                            value={subValue?.sub as number}
                            index={1}
                            padding={0}
                          >
                            {amountFixed && (
                              <div className="flex items-center flex-col justify-center text-[1.55rem] mb-5">
                                <span className="font-light block mb-1 text-[rgba(88,88,88,0.86)] text-[14px]">
                                  You&apos;ll Be Paying
                                </span>

                                <span className="font-[500] text-[rgb(32,33,36)] text-[1.21rem]">
                                  <NumberFormat
                                    value={amount}
                                    thousandSeparator={true}
                                    displayType={"text"}
                                    prefix={"USD "}
                                  />
                                </span>

                                <span className="font-normal text-[rgb(78,79,80)] text-[15px]">
                                  1% fee
                                </span>
                              </div>
                            )}

                            <FormControl fullWidth>
                              <div className="pb-3 font-bold">Billed</div>
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
                                  "& .MuiButtonBase-root": {
                                    marginRight: "15px !important",
                                  },
                                  "& .MuiToggleButtonGroup-grouped": {
                                    borderRadius: "4px !important",
                                    minWidth: 70,
                                    border:
                                      "1px solid rgba(0, 0, 0, 0.12) !important",
                                  },
                                }}
                                className="w-full cusscroller overflow-y-hidden justify-between mb-2 pb-1"
                                onChange={(e: any) => {
                                  setTransferFail?.(false);
                                  setFailMessage?.("");
                                  setLoadingText?.("");
                                  const val = e.target.value;
                                  setTinterval?.(val);
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

                              <div className="my-2">
                                {!amountFixed && (
                                  <div className="py-3 font-bold">
                                    Amount (USD) (1% fee)
                                  </div>
                                )}

                                {Boolean(userD?.amountMultiple.length) &&
                                  !amountFixed && (
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
                                        "&.MuiButtonBase-root": {
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
                                        setTransferFail?.(false);
                                        setLoadingText?.("");
                                        setFailMessage?.("");
                                        const val = e.target.value;

                                        setAmount?.(val.replace(/[^\d.]/g, ""));
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
                                !amountFixed && (
                                  <div className="py-3 font-bold">
                                    Or input Amount
                                  </div>
                                )}

                              {!amountFixed && (
                                <TextField
                                  fullWidth
                                  variant="standard"
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
                                    setTransferFail?.(false);
                                    setFailMessage?.("");
                                    setLoadingText?.("");
                                    const val = e.target.value;
                                    setAmount?.(val.replace(/[^\d.]/g, ""));
                                  }}
                                />
                              )}
                            </FormControl>
                          </TabPanel>
                        </>
                      )}
                    </TabPanel>

                    {/* end here */}
                  </div>

                  <div className="bg-[#fff] flex justify-center flex-col rounded-b-[.9rem] px-6 py-4">
                    <div className="flex items-center justify-evenly">
                      {!subValue![!value ? "onetime" : "sub"] ? (
                        <>
                          <Button
                            sx={{
                              backgroundColor: `${data.colorScheme} !important`,
                              color: `${data.white} !important`,
                            }}
                            onClick={() =>
                              begin?.(!value ? "onetime" : "sub", true)
                            }
                            className="!py-2 !min-w-[200px] !font-[600] !px-3 !capitalize !flex !items-center !text-white !border !border-solid !border-[none] !transition-all !delay-500 !rounded-[0]"
                          >
                            Next
                          </Button>
                        </>
                      ) : (
                        <>
                          {token?.payment.manual && (
                            <Button
                              sx={{
                                backgroundColor: `${data.colorScheme} !important`,
                                color: `${data.white} !important`,
                              }}
                              onClick={() =>
                                begin?.(
                                  value ? "sub" : "onetime",
                                  false,
                                  onSuccess
                                )
                              }
                              className="!py-2 !min-w-[130px] !px-3 !capitalize !flex !items-center !text-white !bg-[#3cb4ac] !border !border-solid !border-[none] !transition-all !delay-500 !rounded-[0]"
                            >
                              Pay Manually
                            </Button>
                          )}

                          {token?.payment.auto && (
                            <Button
                              sx={{
                                backgroundColor: `${data.colorScheme} !important`,
                                color: `${data.white} !important`,
                              }}
                              onClick={() =>
                                begin?.(
                                  value ? "sub" : "onetime",
                                  true,
                                  onSuccess
                                )
                              }
                              className="!py-2 !min-w-[130px] !px-3 !capitalize !flex !items-center !border !border-solid !border-[none] !transition-all !delay-500 !rounded-[0]"
                            >
                              Pay
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                    <Secured className="pt-3" />
                  </div>
                </Box>
              </Modal>

              <div className="bg-[#fff] bigHeader fixed hidden w-full px-[16px] z-[1000] shadow-[0_5px_10px_0_rgba(0,0,0,0.05)] top-0 max-h-[88px] items-center justify-between py-[1rem]">
                <p className="text-[18px] w-full header_page truncate block pr-5">
                  {Boolean(data.header.text.length)
                    ? data.header.text
                    : `${usern}`}
                </p>

                <Button
                  onClick={() => {
                    if (!expired) {
                      openModal();
                    }
                  }}
                  sx={{
                    backgroundColor: `${
                      !expired ? "#777" : data.colorScheme
                    } !important`,
                    color: `${data.white} !important`,
                  }}
                  className="!normal-case !cursor-pointer !text-[16px] !transition-all !delay-300 !font-bold !py-[1rem] !border-solid !px-[1rem] !rounded-[0px] !min-w-fit !outline-none"
                >
                  {!expired ? "Campaign Expired" : "Back This Project"}
                </Button>
              </div>

              <div
                style={data.board}
                className="-z-[1] tlg:bg-cover tlg:bg-[center_center] bg-[top_center] bg-no-repeat absolute right-0 top-0 w-full bg-contain"
              ></div>

              <div
                style={data.board0}
                className="max-w-[730px] minMain mx-auto my-0 w-[90%] relative z-[10] tmd:w-full mb-[6rem] tlg:shadow-md"
              >
                <div className="w-full rounded-[.27rem] p-[3rem] items-center  flex justify-center flex-col bg-white pt-0 2usmm:px-[1.5rem]">
                  <div
                    style={data.linkImage}
                    className="-mt-[30px] items-center rounded-[50%] border-[3px] border-solid justify-center w-full"
                  >
                    <Avatar
                      src={
                        data.image.text.length
                          ? undefined
                          : data.image.src.length
                          ? data.image.src
                          : img
                      }
                      sx={data.image.style}
                      alt={usern}
                      className="!font-bold imgx_page"
                      variant="circular"
                    >
                      {data.image.text.length
                        ? data?.image?.text.substr(0, 7)
                        : usern?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>

                  <div className="pt-[3.5rem] w-full px-0">
                    <h2
                      style={data.header.style}
                      className="text-[24px] block header_page font-bold"
                    >
                      {Boolean(data.header?.text.length)
                        ? data.header.text
                        : `${usern}`}
                    </h2>

                    <p
                      style={data.introText.style}
                      className="mt-[.5rem] intro_text_page"
                    >
                      {Boolean(data?.introText?.text?.length)
                        ? data.introText.text
                        : `${description || "..."}`}
                    </p>
                  </div>
                </div>
                <div className="bg-[#fff] rounded-[.27rem] w-full 2usmm:px-[1.5rem] px-[3rem] flex-col py-[1rem]">
                  <div
                    className="topCont flex justify-between"
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <div className="priceCont">
                      <h2 className="text-[1.5em] block font-bold">
                        <NumberFormat
                          value={config.current?.raised || data.config.raised}
                          thousandSeparator={true}
                          displayType={"text"}
                          prefix={"$"}
                        />
                      </h2>
                      <p className="text-[#9b9b9b] text-[14px]">
                        of{" "}
                        <NumberFormat
                          value={config.current?.total || data.config.total}
                          thousandSeparator={true}
                          displayType={"text"}
                          prefix={"$"}
                        />{" "}
                        backed
                      </p>
                    </div>
                    <div className="totalbackers">
                      <h2 className="text-[1.5em] block font-bold">
                        <NumberFormat
                          value={config.current?.backers || data.config.backers}
                          thousandSeparator={true}
                          displayType={"text"}
                        />
                      </h2>
                      <p className="text-[#9b9b9b] text-[14px]">backers</p>
                    </div>
                    <div className="percent"></div>
                  </div>

                  <div className="progressCont mt-[1.5rem] mx-0 mb-[.6rem]">
                    <div className="progress w-full bg-[#c4c4c4] rounded-[99px] h-[10px] relative">
                      <div
                        style={{
                          width: `${
                            (config.current?.raised || data.config.raised) <=
                            (config.current?.total || data.config.total)
                              ? ((config.current?.raised || data.config.raised) / (config.current?.total || data.config.total)) * 100
                              : 100
                          }%`,
                          backgroundColor: data.colorScheme,
                        }}
                        className="progressBar transition-all delay-300 absolute h-full rounded-[99px]"
                      ></div>
                    </div>
                  </div>

                  <div className="topCont flex items-start justify-between">
                    <div className="daysLeft">
                      <p className="text-[#9b9b9b] text-[14px]">
                        {/* time here */}
                        {timer.current}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="actBtn w-full mt-[2rem] flex items-center justify-between 2usmm:px-[1.5rem] px-[3rem]">
                  <div className="flex items-center tsm:justify-center tsm:w-full">
                    <Button
                      sx={{
                        backgroundColor: `${
                          expired ? "#777" : data.colorScheme
                        } !important`,
                        color: `${data.white} !important`,
                      }}
                      onClick={async () => {
                        if (!expired) {
                          openModal();
                        }
                      }}
                      className="!text-white !normal-case !cursor-pointer !text-[16px] !transition-all !delay-300 !font-bold !py-[1rem]  !border-b-[5px] !border-solid !px-[2.6rem] !rounded-[0px] !outline-none"
                    >
                      {expired ? "Campaign Expired" : "Back This Project"}
                    </Button>
                  </div>
                </div>

                <div
                  className="bg-[#fff] rounded-[.27rem] w-full mt-[1.5rem] 2usmm:px-[1.5rem] p-[3rem] pt-[1.8rem] scroll-mt-[10px]"
                  id="about"
                >
                  {Boolean(data?.about?.texts?.length) && (
                    <div className="aboutCont px-[0.5rem] pt-0">
                      <header className="mb-8">
                        <h4 className="font-bold text-[18px]">
                          About this project
                        </h4>
                      </header>
                      <article>
                        {data.about.texts.map((item: string, index: number) => (
                          <p key={index} style={data.about.style}>
                            {item}
                          </p>
                        ))}
                      </article>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Droplets;
