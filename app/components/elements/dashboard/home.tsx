import { Avatar, Box, Button, CircularProgress, FormControlLabel, IconButton, Modal, Skeleton, Tooltip } from "@mui/material";
import Link from "next/link";
import NumberFormat from "react-number-format";
import LineChart from "../Extras/Rep/lineChart";
import sortData from "./linkOverview/generateData";
import Direction from "./direction";
import { get_request } from "../../../contexts/Cryptea/requests";
import { useEffect, useRef, useState } from "react";
import { cryptoDeets } from "../../../functions/crypto";
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/router';
import CustomImg from "../customImg";
import CrypSwitch from "../CrypSwitch";
import {
  MdInfo,
  MdOutlineRefresh,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { PinField } from "react-pin-field";
import { CryptoList } from "../../../contexts/Cryptea/connectors/chains";
import { blockchains } from "../../../contexts/Cryptea/blockchains";
import http from "../../../../utils/http";

const DashHome = () => {

  const router = useRouter();

  const [dashBal, setDashBal] = useState<any>(0);

  const [dashData, setDashData] = useState<any>({
    payments: [],
    views: [],
    link: [],
    balance: [],
    breakdown: [],
    sortBreakdown: [],
  });

  const [blur, removeBlur] = useState<boolean>(true);

  const onceBal = useRef<boolean>(true);

  const [blurBal, removeBlurBal] = useState<boolean>(true);

  const once = useRef<boolean>(true)

  const [data, setData] = useState<any>({});

  const [rand, setRand] = useState<number>(0);

  const [payments, setPayments] = useState<any[]>([]);

  const [checked, setChecked] = useState<boolean>(false);


  const [refresh, setRefresh] = useState<boolean>(false);

  const changeChecked = async () => {
      setChecked(!checked);

      removeBlur(true);

      removeBlurBal(true);
      
      try {

      await 'user'.update({ live: !checked ? 'Yes' : 'No' }); 

      once.current = true;
      onceBal.current = true
    
      setRefresh(!refresh)

      }catch (err) {
          setChecked(!checked);
          removeBlur(false);
          removeBlurBal(false);
      }
  }

  const [settlePin, setSettlePin] = useState<boolean>(false);

  const closeSettleModal = () => setSettlePin(false)

  const [genSetError, setGenSetError] = useState<string>('');

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

        router.reload();

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
    setRand(Math.floor(Math.random() * 4));

    let address: string;    
   
    const init = async () => {

      const dashmain = await get_request(
        "/dashboard/home",
        {},
        undefined,
        false
      );

      let { payments, views, links } = dashmain?.data;

      const breakdown: {
        [index: string]: {
          created_at: number;
          amount: number;
          token: string;
        }[];
      } = {};

      const fees: { [index: string]: number } = {};

      setPayments(payments);

      payments.forEach((value: any) => {
        if (breakdown[value.token || "matic"] === undefined) {
          breakdown[value.token || "matic"] = [];
        }

        breakdown[value.token || "matic"].push({
          created_at: new Date(value.created_at).getTime(),
          amount: value.amount,
          token: value.token || "matic",
        });

        if (value.meta !== null) {
          const metadata = JSON.parse(value.meta);

          fees[metadata["chainId"]] = Number(metadata["discount"]);
        }

      });


      const sortBreak = Object.values(breakdown)
        .map((a: { created_at: number; amount: number; token: string }[]) => {
          return {
            total: a
              .reduce((xx, xxx) => Number(xx) + Number(xxx.amount), 0)
              .toFixed(2),
            token: a[0].token,
          };
        })
        .sort((a, b) => Number(b.total) - Number(a.total));

      const sortViews = views.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      for (let e = 0; e < links.length; e++) {
        let ex = 0;

        sortViews.forEach((v: any, i: number) => {
          if (v.linkid == links[e].id) {
            if (links[e]["views"] === undefined) {
              links[e]["views"] = [];
            }

            ex++;

            links[e]["views"].push({ created_at: v.created_at });
          }
        });

        if (links[e]["views"] !== undefined) {
          let sviews = sortData(links[e]["views"], "24h", false, false)["data"];

          links[e]["prevViews"] = sviews[sviews.length - 1];
        }

        links[e]["totalViews"] = ex;
      }

      const psort = links.sort((a: any, b: any) => b.prevViews - a.prevViews);

      const tsort = links.sort((a: any, b: any) => b.totalViews - a.totalViews);


      setDashData({
        payments,
        views,
        breakdown,
        links: (psort[0].prevViews > 0 ? psort : tsort).slice(0, 5),
        sortBreakdown: sortBreak,
      });

      if (blur) removeBlur(false);

      setTimeout(init, 6000);
    };

    if(once.current){

      once.current = false;

      'user'.get('*', true).then(async (e: any) => {
    
        setData(e);

        setChecked(e.live == 'Yes');

        setSettlePin(!Boolean(e.settlement ? e.settlement.length : 0));

        if (!Boolean(e.settlement ? e.settlement.length : 0)) {
          return;
        }
               

        await init();

    })

  }

  }, [refresh]);


  useEffect(() => {

    const initBal = async () => {
     


     const sAddresses: any = {};

     data.settlement.forEach((v: any) => {
       sAddresses[v.type] = v.address;
     });


      setDashBal(() => {
        const cache = JSON.parse(localStorage.getItem("cryptoCache") || "{}");

        let totlCache = 0;

        if (cache && Object.keys(cache).length > 0) {

        Object.values(sAddresses).forEach((e: any) => {
          if (cache[e]) {
            Object.values(cache[e]).forEach((value: any) => {
              totlCache += Number(value.amtFiat);
            });
          }
        });
      }

        return totlCache;
      });

      const authToken = localStorage.getItem("userToken");

      const { data: balances } = await http.get(`/api/settlement/balance`, {
        baseURL: window.origin,
        timeout: 300_000,
      });

      const { breakdown, total, prices } = balances;

      const valCache = JSON.parse(localStorage.getItem("tokenVal") || "{}");

      const cacheNew: any = {};

      Object.keys(breakdown).forEach((index: any) => {

        const dax = breakdown[index];

        const { blocktype, amount, token } = dax;

        const account = sAddresses[blocktype];

        cacheNew[account] = {
          ...(cacheNew[account] || {}),
          [index]: dax,
        };

        const price = prices[index] || 0;

        valCache[token.toLowerCase()] = price;
      });

      localStorage.setItem("cryptoCache", JSON.stringify(cacheNew));

      localStorage.setItem("tokenVal", JSON.stringify(valCache));

      setDashBal(total);
        

      if (blurBal) removeBlurBal(false);

    }
    

    if (payments.length && onceBal.current) {

      onceBal.current = false;

      initBal();

    }

  }, [refresh, payments])


  const change = (data: any[]): { value: number; direction: "up" | "down" } => {
    const [current, initial = 0] = data;

    let main, value;

    if (typeof current != "object") {
      main = Number(current) - Number(initial);

      value = main ? (main / (initial || 1)) * 100 : 0;
    } else {
      main = Number(current.amount) - Number(initial.amount);

      value = main ? (main / (initial.amount || 1)) * 100 : 0;
    }

    return { value: Math.abs(value), direction: value >= 0 ? "up" : "down" };
  };

  return (
    <div className="px-5 pt-[75px]">
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
              className="sm:w-full h-fit 2mdd:px-[2px]"
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
                      className="font-[inherit] 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] 2usmm:!justify-start outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
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
                      className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] 2usmm:!justify-start text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
                      validate={/^[0-9]$/}
                    />
                  </div>
                </div>

                <span className="text-[#7c7c7c] mt-3 block font-[500] text-[15px]">
                  <b>Please Note: </b> Forgetting your pin or your pin getting
                  into the wrong hands, could lead to loss of funds, please keep
                  it safe.
                </span>
              </div>

              <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                <div className="flex items-center">
                  <Button
                    onClick={savePin}
                    className="!py-2 !font-bold !min-w-[250px] !text-[16px] !px-3 !flex !items-center !text-white !fill-white !bg-[#F57059] !border !normal-case !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
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

      <div className="flex items-start justify-between">
        <div className="mainx relative w-[calc(100%-340px)] 2sm:w-full">
          <div className="w-fit right-0 flex items-end z-[9] justify-end absolute">
            <div className="mt-1 2sm:mt-0">
              {blur ? (
                <div className="flex items-center">
                  <Skeleton
                    sx={{ fontSize: "1rem", width: "32px", marginRight: "3px" }}
                  />

                  <Skeleton
                    variant={"rounded"}
                    sx={{ fontSize: ".9rem", width: "46px", height: "26px" }}
                  />
                </div>
              ) : (
                <Tooltip
                  placement="bottom"
                  arrow
                  title={
                    "Add testnet tokens support, not supported for production"
                  }
                >
                  <FormControlLabel
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: "600",
                        color: "#818181",
                        fontSize: ".9rem",
                      },
                    }}
                    control={
                      <CrypSwitch
                        sx={{ m: 1 }}
                        checked={checked}
                        onChange={changeChecked}
                      />
                    }
                    labelPlacement="start"
                    label={"Only live"}
                  />
                </Tooltip>
              )}
            </div>
          </div>

          <div className="flex items-start relative 2mdd:mt-9 py-3 flex-wrap gap-x-10 gap-y-3">
            <div className="min-w-[100px]">
              {blur ? (
                <Skeleton
                  className="mb-2"
                  sx={{ fontSize: "1.04rem", width: "80px" }}
                />
              ) : (
                <span className="uppercase flex text-[#818181] font-bold text-[.64rem]">
                  Total Received
                </span>
              )}

              <div className="flex mb-1 cusscroller overflow-x-scroll overflow-y-hidden items-end w-full">
                {blur ? (
                  <Skeleton sx={{ fontSize: "2.5rem", width: "156px" }} />
                ) : (
                  <>
                    <NumberFormat
                      value={
                        String(
                          dashData["payments"].reduce(
                            (a: any, b: any) => Number(a) + Number(b.amount),
                            0
                          )
                        ).split(".")[0]
                      }
                      style={{
                        fontSize: "1.95rem",
                        color: "#121212",
                      }}
                      thousandSeparator={true}
                      displayType={"text"}
                      prefix={"$"}
                    />
                    <span className="leading-[2.38rem] text-[20px] text-[#898989]">
                      .
                      {
                        dashData["payments"]
                          .reduce(
                            (a: any, b: any) => Number(a) + Number(b.amount),
                            0
                          )
                          .toFixed(2)
                          .split(".")[1]
                      }
                    </span>
                  </>
                )}
              </div>

              <div className="w-fit">
                {blur ? (
                  <Skeleton
                    variant="rounded"
                    className="p-[5px] rounded-[8px] text-[14px]"
                    sx={{ fontSize: "14px", height: "31px", width: "70px" }}
                  />
                ) : (
                  <Direction
                    direction={
                      change(
                        dashData["payments"].sort(
                          (a: any, b: any) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        )
                      ).direction
                    }
                    value={
                      change(
                        dashData["payments"].sort(
                          (a: any, b: any) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        )
                      ).value
                    }
                  />
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
                    "Balance subject to change, based on loaded data and price data from coingecko"
                  }
                >
                  <span className="uppercase cursor-pointer text-[#818181] flex items-center font-bold text-[.64rem]">
                    Account Balance <MdInfo size={16} className="ml-1" />
                  </span>
                </Tooltip>
              )}

              <div className="flex relative z-10 cusscroller overflow-x-scroll overflow-y-hidden items-end w-full">
                {blur ? (
                  <Skeleton sx={{ fontSize: "2.5rem", width: "156px" }} />
                ) : (
                  <>
                    <NumberFormat
                      value={
                        String(
                          dashBal
                        ).split(".")[0]
                      }
                      style={{
                        fontSize: "1.95rem",
                        color: "#121212",
                      }}
                      thousandSeparator={true}
                      displayType={"text"}
                      prefix={"$"}
                    />
                    <span className="leading-[2.38rem] text-[20px] text-[#898989]">
                      .
                      {
                        (dashBal)
                          .toFixed(2)
                          .split(".")[1]
                      }
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="py-3">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              Boolean(dashData["sortBreakdown"].length) && (
                <span className="block uppercase mb-2 text-[#818181] font-bold text-[.64rem]">
                  Tokens Received
                </span>
              )
            )}

            <div className="flex items-center cusscroller overflow-x-scroll overflow-y-hidden pb-1">
              {blur
                ? Array(1, 2, 3).map((v: any, i: number) => {
                    return (
                      <Skeleton
                        key={i}
                        variant={"rounded"}
                        className="min-w-[210px] h-[245px] text-[#6a6a6ab0] py-4 px-[15px] mr-2 rounded-[8px]"
                      />
                    );
                  })
                : dashData["sortBreakdown"].map((a: any, i: number) => {
                    const { name, symbol, useName, searchName } = cryptoDeets(
                      a.token
                    );

                    return (
                      <div
                        key={i}
                        className="border-solid w-[210px] h-[245px] text-[#6a6a6ab0] py-4 px-[15px] mr-2 bg-white border-[rgb(218,220,224)] rounded-[8px] border"
                      >
                        
                        <div className="flex items-center mb-2">
                          <div className="h-[40px] w-[40px] rounded-[.4rem] relative flex items-center justify-center">
                            <CustomImg
                              alt={name}
                              key={i}
                              name={searchName}
                              symbol={symbol as string}
                            />
                          </div>
                          <div className="ml-3 relative top-[2px]">
                            <p className="font-[600] capitalize truncate leading-[14px] text-[14px]">
                              {name}
                            </p>
                            <span className="font-[400] uppercase text-[11px]">
                              {symbol}
                            </span>
                          </div>
                        </div>

                        <div className="pb-1 h-[90px]">
                          <LineChart
                            label={["data"]}
                            gradient={false}
                            name={useName}
                            color={["#f57059"]}
                            dataList={[
                              sortData(
                                dashData["breakdown"][a.token],
                                "all",
                                false
                              )["data"],
                            ]}
                            styles={{
                              width: "100%",
                              height: "100%",
                            }}
                            noLabel={true}
                            labels={
                              sortData(
                                dashData["breakdown"][a.token],
                                "all",
                                false
                              )["label"]
                            }
                          />
                        </div>

                        <div>
                          <NumberFormat
                            value={a.total}
                            className="truncate text-[#6a6a6ab0] mb-[8px] block text-[1.55rem]"
                            thousandSeparator={true}
                            displayType={"text"}
                            prefix={"$"}
                          />

                          {blur ? (
                            <Skeleton
                              variant="rounded"
                              className="p-[5px] rounded-[8px] text-[14px]"
                              sx={{
                                fontSize: "14px",
                                height: "31px",
                                width: "70px",
                              }}
                            />
                          ) : (
                            <Direction
                              direction={
                                change(
                                  dashData["breakdown"][a.token].sort(
                                    (a: any, b: any) =>
                                      new Date(b.created_at).getTime() -
                                      new Date(a.created_at).getTime()
                                  )
                                ).direction
                              }
                              value={
                                change(
                                  dashData["breakdown"][a.token].sort(
                                    (a: any, b: any) =>
                                      new Date(b.created_at).getTime() -
                                      new Date(a.created_at).getTime()
                                  )
                                ).value
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        <div className="min-w-[337px] 2sm:hidden pt-[5px] h-full">
          <div className="px-4 pt-3 bg-white rounded-[4px]">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              <h2 className="block uppercase mb-2 text-[#818181] font-bold text-[.64rem]">
                Trending
              </h2>
            )}

            {blur
              ? Array(1, 2, 3).map((x: any, i: number) => (
                  <Skeleton
                    className={"rounded-[.9rem] py-3 h-[70px] mb-2"}
                    variant={"rounded"}
                    key={i}
                  />
                ))
              : dashData.links.map((v: any, i: number) => {
                  let index = i;

                  if (rand < dashData.links.length) {
                    if (i == 0) {
                      index = rand;
                    } else if (i == rand) {
                      index = 0;
                    }
                  }

                  const l = dashData.links[index];

                  const { template_data } = l;

                  const { image } =
                    template_data !== undefined
                      ? JSON.parse(template_data)
                      : { image: undefined };

                  const { src } =
                    image !== undefined ? image : { src: undefined };

                  let vws = [0, 0];

                  if (l.views) {
                    vws = sortData(l.views, "24h", false, false)["data"];
                  }

                  return (
                    <div
                      key={i}
                      style={{
                        height:
                          i == rand && rand < dashData.links.length
                            ? l.prevViews > 0
                              ? "98px"
                              : "66px"
                            : l.prevViews > 0
                            ? "98px"
                            : "66px",
                      }}
                      className="flex mb-2 justify-between min-h-[66px] overflow-hidden hover:!h-[98px] transition-all delay-700 flex-col cursor-pointer p-[1.1rem] border-[rgb(175,177,182)] border border-solid rounded-[.9rem] py-3"
                    >
                      <Link href={`/pay/${l.link}/overview`}>
                        <a className="flex w-full items-center">
                          <Avatar
                            sx={{
                              width: 40,
                              borderRadius: ".45rem",
                              height: 40,
                              color: "rgb(175,177,182)",
                              border: src ? undefined : "1px solid",
                              backgroundColor: "#fff",
                            }}
                            src={src}
                            variant="rounded"
                          >
                            {String(l.link.charAt(0)).toUpperCase()}
                          </Avatar>

                          <div className="pl-2 flex w-full items-center justify-between">
                            <div className="block truncate capitalize text-[#a1a1a1] font-[500] mr-[10px] text-[1.2rem]">
                              {l.link}
                            </div>

                            {blur ? (
                              <Skeleton
                                variant="rounded"
                                className="p-[5px] rounded-[8px] text-[14px]"
                                sx={{
                                  fontSize: "14px",
                                  height: "31px",
                                  width: "70px",
                                }}
                              />
                            ) : (
                              <Direction
                                tooltip={"%change 1hr"}
                                direction={
                                  change([
                                    vws[vws.length - 1],
                                    vws[vws.length - 2],
                                  ]).direction
                                }
                                value={
                                  change([
                                    vws[vws.length - 1],
                                    vws[vws.length - 2],
                                  ]).value
                                }
                              />
                            )}
                          </div>
                        </a>
                      </Link>

                      <div className="w-full text-[#c9c9c9] mt-2">
                        <span className="text-[1rem] font-[400] ml-[2px]">
                          {vws[vws.length - 1] || 0}
                        </span>
                        <span className="text-[0.9rem] ml-[3px] font-[400]">
                          view(s) in the last hour
                        </span>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-1 pb-3 2sm:flex-col w-full flex">
        {blur ? (
          <Skeleton
            variant={"rounded"}
            className={"col-span-2 mb-2 rounded-[8px] min-h-[200px]"}
          />
        ) : (
          <div className="border-[rgb(218,220,224)] mb-2 w-full mr-2 col-span-2 rounded-[8px] border bg-white overflow-hidden border-solid">
            <div className="px-6 pt-6 relative pb-3 h-full flex flex-col justify-between">
              <div className="flex justify-between mb-[16px] items-center">
                <h2 className="font-bold text-[.8rem] text-[#818181] leading-[1.75rem] ">
                  Payments
                </h2>

                <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                  All
                </span>
              </div>

              <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                <NumberFormat
                  value={[
                    ...sortData(
                      dashData["payments"].filter(
                        (e: any) => e.type == "onetime"
                      ),
                      "all",
                      false
                    )["data"],
                    ...sortData(
                      dashData["payments"].filter((e: any) => e.type == "sub"),
                      "all",
                      false
                    )["data"],
                  ]
                    .reduce((a, b) => {
                      return a + b;
                    }, 0)
                    .toFixed(2)}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"$"}
                />
              </div>

              <LineChart
                label={["onetime", "subscribers"]}
                name="payments"
                y={true}
                prefix="$"
                color={["#f57059", "#961d08"]}
                dataList={[
                  sortData(
                    dashData["payments"].filter(
                      (e: any) => e.type == "onetime"
                    ),
                    "all",
                    false
                  )["data"],
                  sortData(
                    dashData["payments"].filter((e: any) => e.type == "sub"),
                    "all",
                    false
                  )["data"],
                ]}
                styles={{
                  width: "100%",
                  height: "100%",
                  marginTop: "40px",
                }}
                labels={[
                  ...sortData(
                    dashData["payments"].filter(
                      (e: any) => e.type == "onetime"
                    ),
                    "all",
                    false
                  )["label"],
                  ...sortData(
                    dashData["payments"].filter((e: any) => e.type == "sub"),
                    "all",
                    false
                  )["label"],
                ]}
              />
            </div>
          </div>
        )}

        {blur ? (
          <Skeleton
            variant={"rounded"}
            className={"col-span-2 rounded-[8px] min-h-[200px]"}
          />
        ) : (
          <div className="border-[rgb(218,220,224)] w-full rounded-[8px] border bg-white overflow-hidden border-solid mb-2">
            <div className="px-6 pt-6 relative pb-3 h-full flex flex-col justify-between">
              <div className="flex justify-between mb-[16px] items-center">
                <h2 className="font-bold text-[.8rem] text-[#818181] leading-[1.75rem] ">
                  Total Page Views
                </h2>

                <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                  All
                </span>
              </div>

              <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                <NumberFormat
                  value={sortData(dashData.views, "all", false, false)[
                    "data"
                  ].reduce((a, b) => a + b, 0)}
                  thousandSeparator={true}
                  displayType={"text"}
                />
              </div>

              <LineChart
                label={["data"]}
                name="Views"
                color={["#f57059"]}
                y={true}
                dataList={[
                  sortData(dashData.views, "all", false, false)["data"],
                ]}
                styles={{
                  width: "100%",
                  marginTop: "40px",
                }}
                labels={sortData(dashData.views, "all", false)["label"]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashHome;
