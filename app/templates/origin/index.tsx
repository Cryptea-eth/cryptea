import Head from "next/head";
import Nav from "../../components/elements/Nav";
import TabPanel from "../../components/elements/dashboard/link/TabPanel";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";
import SwipeableViews from "react-swipeable-views";
import Link from "next/link";

import {
  Box,
  Avatar,
  Tabs,
  Tab,
  ToggleButton,
  FormControl,
  ToggleButtonGroup,
  TextField,
  Button,
  IconButton
} from "@mui/material";

import Select from 'react-select';
import { useRouter } from 'next/router';
import Loader from "../../components/elements/loader";
import { useState, useEffect, useContext } from "react";
import { PaymentContext } from "../../contexts/PaymentContext";
import { useCryptea } from "../../contexts/Cryptea";
import Secured from "../../components/elements/secured";
import { MdChevronLeft } from "react-icons/md";
import { subValueType } from "../../contexts/Cryptea/types";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

 
const Origin = ({
  className
}: {
  className?: string;
}) => {


    const [value, setValue] = useState<number>(0);


  const {
    userD,
    setUserD,
    token,
    setToken,
    data,
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
    begin,
    interval,
    setTinterval,
    explorer,
    is500,
    initMain,
    amount,
    reset,
    setAmount,
    setSubCheck,
    options,
    eSubscription,
    setSigner,
    subValue,
    setSubValue
  } = useContext(PaymentContext);

   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
     setValue(newValue);
     setFailMessage?.("");
     setPemail?.([]);
   };

  const {
    signer
  } = useCryptea();

  useEffect(() => {
      setSigner?.(signer);
  }, [signer])

  useEffect(() => {
      if (userD!.rdata[!value ? "onetime" : "sub"].length <= 1) {

        const nsVal = { ...subValue }

        nsVal[!value ? "onetime" : "sub"] = 1;

        setSubValue?.(nsVal as subValueType);

      }
      
  }, [value, userD]);


  const {
    username: usern,
    description,
    img
  }: {
    username?: string;
    description?: string;
    img?: string | null;
  } = userD ?? {username: '', description: '', img: ''};

    const text = {
      "& .Mui-focused.MuiFormLabel-root": {
        color: data.colorScheme,
      },
      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: `${data.colorScheme} !important`,
      },
    };
    
    const { pathname } = useRouter();

    useEffect(() => {
      const elem = document.querySelector(".origin") as HTMLDivElement;

      if (
        elem?.scrollHeight == document.body.scrollHeight &&
        pathname.indexOf("[slug]/edit") !== -1
      ) {
        elem.style.width = "calc(100% - 249px)";
      }
    });

  return (
    <div className={`origin ${className}`}>
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
                      src={
                        data.image.text.length
                          ? undefined
                          : data.image.src.length
                          ? data.image.src
                          : img
                      }
                      sx={data.image}
                      alt={usern}
                    >
                      {data.image.text.length
                        ? data.image.text.substr(0, 7)
                        : usern?.charAt(0).toUpperCase()}
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

                    {/* work statement */}
                    <div className="links mt-5 work_state_page">
                      <div style={data.workState}>
                        {Boolean(data.workState.text.length)
                          ? data.workState.text
                          : `Support ${usern}'s Work`}
                      </div>
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
                        color={data.colorScheme}
                        incLogo={false}
                      />
                    )}
                    {/* paymentbox */}
                    <div className="rounded-lg bg-white shadow-lg shadow-[#cccccc]">
                      <div className="border-b items-center flex py-[14px] px-[17px] text-xl font-bold">
                        {userD!.rdata[!value ? "onetime" : "sub"].length > 1 &&
                          subValue![!value ? "onetime" : "sub"] == 1 && (
                            <IconButton
                              className="mr-[6px]"
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

                        <span>Send Payment</span>
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
                              className="rounded-md -mb-4 w-[95%] font-bold mt-2 mx-auto p-3"
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
                                we found you have an existing unexpired
                                subscription, do you want to go on with
                                subscribing again?🤔
                              </div>

                              <div className="mt-11 flex justify-center items-center">
                                <Button
                                  onClick={() => {
                                    setFailMessage?.(
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
                                    setTransferSuccess?.(false);
                                    setFailMessage?.("");
                                    setHash?.("");
                                    setLoadingText?.("");
                                    setTransferFail?.(false);
                                    setSubCheck?.(false);
                                    begin?.("sub");
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

                              <Link href={`${explorer!.link}${hash}`}>
                                <a
                                  target={"_blank"}
                                  className="text-[#5a5a5a] cursor-pointer mb-1 font-normal"
                                >
                                  View transaction on {explorer!.name}
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

                          <SwipeableViews index={value}>
                            <TabPanel padding={4} value={value} index={0}>
                              {(userD?.linktype == "both" ||
                                userD?.linktype == "onetime") && (
                                <SwipeableViews
                                  index={subValue?.onetime as number}
                                >
                                  <TabPanel
                                    value={subValue?.onetime as number}
                                    index={0}
                                    padding={0}
                                  >
                                    {userD!.rdata["onetime"].map(
                                      (ixn: string, i: number) => (
                                        <>
                                          <div
                                            style={{
                                              paddingTop:
                                                (!i && 0.001) || undefined,
                                            }}
                                            className="py-3 font-bold"
                                          >
                                            {ixn}
                                          </div>

                                          <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            placeholder={`Your ${ixn}`}
                                            variant="outlined"
                                            sx={text}
                                            value={
                                              pemail![i] !== undefined
                                                ? pemail![i]
                                                : ""
                                            }
                                            onChange={(
                                              e: React.ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
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
                                        </>
                                      )
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
                                      onClick={() => begin?.("onetime")}
                                      fullWidth
                                    >
                                      Next
                                    </Button>
                                  </TabPanel>
                                  <TabPanel
                                    padding={0}
                                    value={subValue?.onetime as number}
                                    index={1}
                                  >
                                    <FormControl fullWidth>
                                      <div className="pb-3 font-bold">
                                        Token
                                      </div>

                                      <Select
                                        isClearable={false}
                                        name="colors"
                                        placeholder={"Tokens..."}
                                        options={options!}
                                        styles={{
                                          option: (provided, state) => {
                                            return {
                                              ...provided,
                                              backgroundColor: state.isSelected
                                                ? data.colorScheme
                                                : "transparent",
                                              "&:active": {
                                                backgroundColor:
                                                  data.colorScheme,
                                              },
                                              "&:hover": {
                                                backgroundColor:
                                                  state.isSelected
                                                    ? undefined
                                                    : `${data.colorScheme}29`,
                                              },
                                            };
                                          },
                                          container: (provided, state) => ({
                                            ...provided,
                                            height: "58px",
                                            "& .select__value-container": {
                                              padding: "11.5px 14px",
                                            },
                                            "& .select__control:hover": {
                                              borderColor: "#121212",
                                            },
                                            "& .select__control--is-focused": {
                                              borderWidth: "2px",
                                              borderColor: `${data.colorScheme} !important`,
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

                                      {userD.rdata["onetime"].length == 1 && (
                                        <>
                                          <div className="py-3 font-bold">
                                            {userD.rdata["onetime"][0]}
                                          </div>

                                          <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            placeholder={`Your ${userD.rdata["onetime"][0]}`}
                                            variant="outlined"
                                            sx={text}
                                            value={
                                              pemail![0] !== undefined
                                                ? pemail![0]
                                                : ""
                                            }
                                            onChange={(
                                              e: React.ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
                                              >
                                            ) => {
                                              setTransferFail?.(false);
                                              setLoadingText?.("");
                                              setFailMessage?.("");
                                              const val = e.target.value;
                                              pemail![0] = val;

                                              setPemail?.([...pemail!]);
                                            }}
                                          />
                                        </>
                                      )}

                                      <div className="py-3 font-bold">
                                        Amount (USD)
                                        {typeof userD?.linkAmount == "number"
                                          ? ` - $${userD?.linkAmount}`
                                          : ""}
                                      </div>

                                      {Boolean(userD?.amountMultiple.length) &&
                                        typeof userD?.linkAmount !=
                                          "number" && (
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
                                              "&.MuiButtonBase-root": {
                                                marginRight: "15px !important",
                                              },
                                              "& .MuiToggleButtonGroup-grouped":
                                                {
                                                  borderRadius:
                                                    "4px !important",
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
                                              setAmount?.(
                                                val.replace(/[^\d.]/g, "")
                                              );
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
                                        typeof userD?.linkAmount !=
                                          "number" && (
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
                                            "& .Mui-focused.MuiFormLabel-root":
                                              {
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
                                              | HTMLInputElement
                                              | HTMLTextAreaElement
                                            >
                                          ) => {
                                            setTransferFail?.(false);
                                            setFailMessage?.("");
                                            setLoadingText?.("");
                                            const val = e.target.value;
                                            setAmount?.(
                                              val.replace(/[^\d.]/g, "")
                                            );
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
                                        onClick={() => begin?.("onetime")}
                                        fullWidth
                                      >
                                        Pay
                                      </Button>
                                    </FormControl>
                                  </TabPanel>
                                </SwipeableViews>
                              )}
                            </TabPanel>
                            <TabPanel padding={4} value={value} index={1}>
                              {(userD?.linktype == "sub" ||
                                userD?.linktype == "both") && (
                                <>
                                <SwipeableViews
                                  index={subValue?.sub as number}
                                >
                                  <TabPanel
                                    value={subValue?.sub as number}
                                    index={0}
                                    padding={0}
                                  >
                                    {userD!.rdata["sub"].map(
                                      (ixn: string, i: number) => (
                                        <>
                                          <div
                                            style={{
                                              paddingTop: (!i && 0.001) || undefined,
                                            }}
                                            className="py-3 font-bold"
                                          >
                                            {ixn}
                                          </div>

                                          <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            placeholder={`Your ${ixn}`}
                                            variant="outlined"
                                            className="w-[calc(100%-1.1px)]"
                                            sx={text}
                                            value={
                                              pemail![i] !== undefined
                                                ? pemail![i]
                                                : ""
                                            }
                                            onChange={(
                                              e: React.ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
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
                                        </>
                                      )
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
                                      onClick={() => begin?.("sub")}
                                      fullWidth
                                    >
                                      Next
                                    </Button>
                                  </TabPanel>

                                  <TabPanel
                                    value={subValue?.sub as number}
                                    index={1}
                                    padding={0}
                                  >
                                    <FormControl fullWidth>
                                      <div className="pb-3 font-bold">
                                        Billed
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

                                      {(userD.rdata["sub"].length == 1 && userD.rdata['sub'][0] == 'Email') && (
                                        <>
                                          <div className="py-3 font-bold">
                                            {userD.rdata["sub"][0]}
                                          </div>

                                          <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            placeholder={`Your ${userD.rdata["sub"][0]}`}
                                            variant="outlined"
                                            sx={text}
                                            value={
                                              pemail![0] !== undefined
                                                ? pemail![0]
                                                : ""
                                            }
                                            onChange={(
                                              e: React.ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
                                              >
                                            ) => {
                                              setTransferFail?.(false);
                                              setLoadingText?.("");
                                              setFailMessage?.("");
                                              const val = e.target.value;
                                              pemail![0] = val;

                                              setPemail?.([...pemail!]);
                                            }}
                                          />
                                        </>
                                      )}

                                      <div className="my-2">
                                        <div className="py-3 font-bold">
                                          Amount (USD)
                                          {typeof userD?.linkAmount == "number"
                                            ? ` - $${userD?.linkAmount}`
                                            : ""}
                                        </div>

                                        {Boolean(
                                          userD?.amountMultiple.length
                                        ) &&
                                          typeof userD?.linkAmount !=
                                            "number" && (
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
                                                    marginRight:
                                                      "0px !important",
                                                    marginLeft:
                                                      "0px !important",
                                                  },
                                                "&.MuiButtonBase-root": {
                                                  marginRight:
                                                    "15px !important",
                                                },
                                                "& .MuiToggleButtonGroup-grouped":
                                                  {
                                                    borderRadius:
                                                      "4px !important",
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

                                                setAmount?.(
                                                  val.replace(/[^\d.]/g, "")
                                                );
                                              }}
                                            >
                                              {userD?.amountMultiple.map(
                                                (amount: number, i: number) => (
                                                  <ToggleButton
                                                    key={i}
                                                    sx={{
                                                      textTransform:
                                                        "capitalize",
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
                                        typeof userD?.linkAmount !=
                                          "number" && (
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
                                            "& .Mui-focused.MuiFormLabel-root":
                                              {
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
                                              | HTMLInputElement
                                              | HTMLTextAreaElement
                                            >
                                          ) => {
                                            setTransferFail?.(false);
                                            setFailMessage?.("");
                                            setLoadingText?.("");
                                            const val = e.target.value;
                                            setAmount?.(
                                              val.replace(/[^\d.]/g, "")
                                            );
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
                                        onClick={() => begin?.("sub")}
                                        fullWidth
                                      >
                                        Subscribe
                                      </Button>
                                    </FormControl>
                                  </TabPanel>
                                  </SwipeableViews>
                                </>
                                
                              )}
                            </TabPanel>
                          </SwipeableViews>

                          <Secured className="pb-3" />
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
