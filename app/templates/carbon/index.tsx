import {
  Button,
  Avatar,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Link from "next/link";
import { useContext, useState } from "react";
import Select from "react-select";
import style from "../../../styles/carbon.module.css";
import Loader from "../../components/elements/loader";
import { PaymentContext } from "../../contexts/PaymentContext";
import Head from 'next/head';
import Nav from "../../components/elements/Nav";

const Carbon = ({
  className,
}: {
  className?: string;
}) => {
  
  const {
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
    beginSub,
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
    beginOne,
    interval,
    setTinterval,
    is500,
    initMain,
    amount,
    reset,
    setAmount,
    setSubCheck,
    options,
    eSubscription,
  } = useContext(PaymentContext);

  const {
    username: usern,
    img,
  }: {
    username?: string;
    description?: string;
    img?: string | null;
  } = userD ?? { username: "", description: "", img: "" };

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

  return (
    <div className={`carbon ${className}`}>
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
            <div
              className={`${style.wrapper} flex items-center justify-center h-screen`}
              style={data.body}
            >
              <div
                className="payment p-[35px] h-auto rounded-[5px] relative pt-[70px]"
                style={data.box}
              >
                <Avatar
                  className="imgx_page shadow-[0_0_5px_rgba(0,0,0,0.2)] before:content-[''] before:-z-[1] font-bold text-[40px] text-center absolute items-center justify-center before:block left-0 before:absolute before:top-[5px] mx-auto before:left-[5px]"
                  sx={data.avatar}
                  src={
                    !Boolean(data.avatar.text)
                      ? Boolean(data.avatar.src)
                        ? data.avatar.src
                        : img
                      : undefined
                  }
                  alt={usern}
                >
                  {Boolean(data.avatar.text) ? data.avatar.text : usern}
                </Avatar>

                <h2
                  className="!font-ubuntu header mb-9"
                  style={{
                    ...data.header,
                    letterSpacing: "2px",
                  }}
                >
                  {data.header.text}
                </h2>
                <div className="form">
                  {/* error */}
                  {(transferFail || Boolean(failMessage)) && (
                    <div
                      style={data.error}
                      className="rounded-md w-[95%] font-bold mt-2 mx-auto p-3"
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
                        we found you have an existing unexpired subscription, do
                        you want to go on with subscribing again?🤔
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
                            beginSub?.();
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
                        Payment was successful
                      </h2>

                      <Link href={`https://mumbai.polygonscan.com/tx/${hash}`}>
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

                  <div className="mb-5">
                    <label className="block font-[600] text-[#555555] mb-[6px] !font-ubuntu">
                      Token
                    </label>

                    <Select
                      isClearable={false}
                      value={token}
                      onChange={(e) => setToken?.(e!)}
                      name="colors"
                      placeholder={"Tokens..."}
                      options={options}
                      styles={{
                        option: (provided, state) => {
                          return {
                            ...provided,
                            backgroundColor: state.isSelected
                              ? data.colorScheme
                              : "transparent",
                            "&:active": {
                              backgroundColor: data.colorScheme,
                            },
                            "&:hover": {
                              backgroundColor: state.isSelected
                                ? undefined
                                : `${data.colorScheme}29`,
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
                      classNamePrefix="select"
                    />
                  </div>

                  {userD!.rdata["onetime"].map((ixn: string, i: number) => {
                    return (
                      <div key={i} className="mb-5">
                        <div className="block font-[600] text-[#555555] mb-[6px] !font-ubuntu">
                          {ixn}
                        </div>

                        <TextField
                          fullWidth
                          id="outlined-basic"
                          placeholder={`Your ${ixn}`}
                          variant="standard"
                          sx={text}
                          value={pemail![i] !== undefined ? pemail![i] : ""}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            setTransferFail?.(false);
                            setLoadingText?.("");
                            const val = e.target.value;
                            pemail![i] = val;

                            setPemail?.([...pemail!]);
                          }}
                        />
                      </div>
                    );
                  })}

                  <div className="mb-5">
                    <label className="block font-[600] text-[#555555] mb-[6px] !font-ubuntu">
                      Amount (USD)
                    </label>

                    {Boolean(userD?.amountMultiple.length) &&
                      typeof userD?.linkAmount != "number" && (
                        <ToggleButtonGroup
                          sx={{
                            justifyContent: "space-between",
                            width: "100%",
                            "& .Mui-selected": {
                              backgroundColor: `${data.colorScheme} !important`,
                              color: `#fff !important`,
                            },
                            "& .MuiButtonBase-root:first-of-type": {
                              marginRight: "0px !important",
                              marginLeft: "0px !important",
                            },

                            "& .MuiToggleButtonGroup-grouped": {
                              borderRadius: "4px !important",
                              minWidth: 55,
                              padding: "5px",
                              marginLeft: 3,
                              border:
                                "1px solid rgba(0, 0, 0, 0.12) !important",
                            },
                          }}
                          exclusive
                          className="w-full cusscroller overflow-y-hidden justify-between mb-2 pb-1"
                          value={amount}
                          onChange={(e: any) => {
                            setTransferFail?.(false);
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

                    <TextField
                      sx={text}
                      value={amount}
                      onChange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setTransferFail?.(false);
                        setLoadingText?.("");
                        const val = e.target.value;
                        setAmount?.(val.replace(/[^\d.]/g, ""));
                      }}
                      variant="standard"
                      name="amount"
                      fullWidth
                      placeholder="0.00"
                    />
                  </div>

                  <Button
                    sx={{
                      marginTop: "10px",
                      backgroundColor: `${data.colorScheme} !important`,
                      padding: "12px !important",
                      textAlign: "center",
                      fontWeight: "bold !important",
                      lineHeight: "18px",
                      fontSize: "16px",
                      fontFamily: "'ubuntu', sans-serif !important",
                      width: "100%",
                      color: "#fff",
                      borderRadius: "5px",
                      textTransform: "none",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: `${data.colorScheme} !important`,
                      },
                    }}
                    onClick={() => beginOne?.()}
                  >
                    Pay
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carbon;
