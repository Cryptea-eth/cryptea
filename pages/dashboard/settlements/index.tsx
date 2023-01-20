import NumberFormat from "react-number-format";
import Page from "../../../app/components/elements/dashboard";
import Head from 'next/head';
import { Skeleton, Tooltip, Button, CircularProgress, Modal, Box, IconButton } from "@mui/material";
import { MdInfo, MdOutlineVisibility, MdPayment, MdOutlineVisibilityOff, MdSubscriptions } from "react-icons/md";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { IoMdCash } from "react-icons/io";
import { FaCoins, FaCopy, FaWallet } from "react-icons/fa";
import CustomImg from "../../../app/components/elements/customImg";
import { BiCopy } from "react-icons/bi";
import copy from "copy-to-clipboard";
import { BsCoin } from "react-icons/bs";
import { HiCurrencyDollar } from "react-icons/hi";
import { RiCoinFill } from "react-icons/ri";
import Link from "next/link";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { PinField } from "react-pin-field";
import axios, { AxiosError } from "axios";
const Settlements = () => {

    const router = useRouter();

    const [blur, setBlur] = useState<boolean>(false);

    const [pins, setPin] = useState<{ [index: string]: string }>({
      newpin: "",
      renewpin: "",
    });

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

    const { isAuthenticated } = useCryptea();

    const [data, setData] = useState<any>({});

    const [copied, mainCopy] = useState<boolean[]>([false]);

    const switchCopy = (val: boolean, index: number) => {
      const copx = [...copied];
      copx[index] = val;
      mainCopy(copx);
    }

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

          await axios.post(
            `/api/settlement/new`,
            {
              ...newData,
              token: localStorage.getItem("userToken"),
            },
            {
              baseURL: window.origin,
            }
          );

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

    useEffect(() => {
      if (isAuthenticated !== undefined) {
        if (!isAuthenticated) {
          router.push("/auth");
        } else {
          "user".get("*", true).then((e: any) => {
            setData(e);

            setSettlePin(!Boolean(e.settlement.length));

            setBlur(false);
          });
        }
      }
    }, [isAuthenticated]);

    return (
      <Page>
        <Head>
          <title>Settlements | Dashboard | Cryptea</title>
          <meta
            name="description"
            content={`Distribute and receive all your funds in crypto and fiat`}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="pt-[75px] px-5 relative z-[1]">
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
                        <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                          Create Settlement Pin
                        </h2>
                        <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                          Create pin to be able to approve settlement
                          transactions
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
                          className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
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
                          type={
                            !pinsVisibility["renewpin"] ? "text" : "password"
                          }
                          length={5}
                          onComplete={(e) => setPin({ ...pins, renewpin: e })}
                          className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
                          validate={/^[0-9]$/}
                        />
                      </div>
                    </div>

                    <span className="text-[#7c7c7c] mt-3 block font-[500] text-[15px]">
                      <b>Please Note: </b> Forgetting your pin or your pin
                      getting into the wrong hands, could lead to loss of funds,
                      please keep it safe.
                    </span>
                  </div>

                  <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                    <div className="flex items-center">
                      <Button
                        onClick={savePin}
                        className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !fill-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
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
                          <>Create Pin</>
                        )}
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </>
          )}

          <h2 className="font-bold text-[25px] mt-[14px] mb-3">Settlements</h2>

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
                    "Cash Available for withdrawal, Balance subject to change, based on price data from coingecko"
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
                      value={"100"}
                      style={{
                        fontSize: "2.3rem",
                        color: "#121212",
                      }}
                      thousandSeparator={true}
                      displayType={"text"}
                      prefix={"$"}
                    />
                    <span className="leading-[2.7rem] text-[20px] text-[#898989]">
                      .{"01"}
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
                    "Amount that are pending and would be added to account balance in a bit, Amount subject to change, based on price data from coingecko"
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
                      value={"0"}
                      style={{
                        fontSize: "2.3rem",
                        color: "#121212",
                      }}
                      thousandSeparator={true}
                      displayType={"text"}
                      prefix={"$"}
                    />
                    <span className="leading-[2.7rem] text-[20px] text-[#898989]">
                      .{"00"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex cusscroller overflow-x-scroll overflow-y-hidden items-center mb-3 w-full pb-1">
            <Button className="!py-2 !font-[600] !capitalize !flex !items-center !text-white !bg-[#F57059] !min-w-fit !border-none !transition-all !delay-500 !rounded-lg !px-3 !text-[14px] mr-[2px]">
              <FaCoins size={16} className="mr-1" /> Withdraw Crypto
            </Button>

            <Button
              onClick={() => router.push("/working")}
              className="!py-2 !px-3 !font-[600] !capitalize !flex !items-center !text-white !bg-[#F57059] !border-none !min-w-fit !transition-all !delay-500 !rounded-lg !text-[14px] mx-[2px]"
            >
              <MdPayment size={16} className="mr-1" /> Withdraw
            </Button>

            <Button className="!py-2 !px-3 !font-[600] !min-w-fit !capitalize !flex !items-center !text-[#F57059] !border-[#F57059] !border !border-solid !transition-all !bg-transparent !delay-500 !rounded-lg !text-[14px] mx-[2px]">
              <RiCoinFill size={16} className="mr-1" /> Swap USDT
            </Button>

            <Button className="!py-2 !px-3 !font-[600] !min-w-fit !capitalize !flex !items-center !text-[#F57059] !border-[#F57059] !border !border-solid !transition-all !bg-transparent !delay-500 !rounded-lg !text-[14px] mx-[2px]">
              <MdSubscriptions size={16} className="mr-1" /> Auto Withdrawals
            </Button>
          </div>

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

            <div className="flex items-center cusscroller overflow-x-scroll overflow-y-hidden pb-1">
              <div className="flex flex-col items-start">
                <Tooltip
                  placement="top"
                  open={copied[0]}
                  arrow
                  title={"Copied"}
                >
                  <div
                    onClick={() => {
                      copy("0xA36dbla bla");

                      switchCopy(true, 0);

                      setTimeout(() => switchCopy(false, 0), 2000);
                    }}
                    className="cursor-pointer justify-between flex text-[#979797] items-center mb-2 w-[160px]"
                  >
                    <div className="flex items-center">
                      <FaWallet size={14} />
                      <span className="ml-1 text-[14px]">0xA36d...26a4</span>
                    </div>

                    <BiCopy size={16} />
                  </div>
                </Tooltip>

                <div className="border-solid flex items-center w-[350px] justify-between text-[#6a6a6ab0] p-4 mr-2 bg-white border-[rgb(218,220,224)] rounded-[8px] border">
                  <div className="flex items-center">
                    <div className="h-[40px] w-[40px] rounded-[.4rem] relative flex items-center justify-center">
                      <CustomImg
                        alt={"polygon"}
                        name={"polygon"}
                        symbol={"matic" as string}
                      />
                    </div>
                    <div className="ml-3 relative top-[2px]">
                      <p className="font-[600] capitalize truncate leading-[14px] text-[14px]">
                        {"Polygon"}
                      </p>
                      <span className="font-[400] uppercase text-[11px]">
                        {"MATIC"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end flex-col">
                    <NumberFormat
                      value={"1000"}
                      className="truncate text-[#414141b0] mb-[1px] block text-[1.5rem] leading-[24px]"
                      thousandSeparator={true}
                      displayType={"text"}
                    />

                    <NumberFormat
                      value={"1000"}
                      className="truncate text-[#6a6a6ab0] leading-[15px] block text-[0.9rem]"
                      thousandSeparator={true}
                      displayType={"text"}
                      prefix={"$"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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

            <div className="max-w-[650px] border border-solid border-[rgb(218,220,224)] rounded-lg py-3 flex flex-col w-full">
              <div className="mx-4 flex items-start py-4">
                <div className="text-[#F57059] mt-2 flex-shrink-0">
                  <MdPayment size={18} />
                </div>
                <span className="font-body text-gray-800 px-4 flex flex-col flex-1">
                  <span className="text-[14px] text-[#747474] font-[500]">
                    Withdrawal Made
                  </span>
                  <span className="text-xs text-gray-600">
                    Mon, 07 Nov 2022 12:02:45 GMT
                  </span>
                </span>
                <span className="font-body text-gray-800 flex flex-col">
                  <span className="text-sm">$-260.00</span>
                </span>
              </div>

              <div className="mx-4 flex items-start py-4">
                <div className="text-[#F57059] mt-2 flex-shrink-0">
                  <FaCoins size={18} />
                </div>
                <span className="font-body text-gray-800 px-4 flex flex-col flex-1">
                  <Link href={"https://local.me"} className="cursor-pointer">
                    <a
                      className="text-[14px] text-[#747474] font-[500]"
                      target={"_blank"}
                    >
                      Crypto Withdrawal Made to 0xA36d...26a4{" "}
                    </a>
                  </Link>
                  <span className="text-xs text-gray-600">
                    Mon, 07 Nov 2022 12:02:45 GMT
                  </span>
                </span>
                <span className="font-body text-gray-800 flex flex-col">
                  <span className="text-sm">$-260.00</span>
                </span>
              </div>

              <div className="mx-4 flex items-start py-4">
                <div className="text-[#F57059] mt-2 flex-shrink-0">
                  <RiCoinFill size={18} />
                </div>
                <span className="font-body text-gray-800 px-4 flex flex-col flex-1">
                  <Link href={"https://local.me"} className="cursor-pointer">
                    <a
                      className="text-[14px] text-[#747474] font-[500]"
                      target={"_blank"}
                    >
                      Usdt swap transfer to 0xA36d...26a4{" "}
                    </a>
                  </Link>
                  <span className="text-xs text-gray-600">
                    Mon, 07 Nov 2022 12:02:45 GMT
                  </span>
                </span>
                <span className="font-body text-gray-800 flex flex-col">
                  <span className="text-sm">$-260.00</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );

}

export default Settlements;