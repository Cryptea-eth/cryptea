import { Avatar, Button, IconButton, Skeleton } from "@mui/material";
import Link from "next/link";
import NumberFormat from "react-number-format";
import LineChart from "../Extras/Rep/lineChart";
import sortData from "./linkOverview/generateData";
import Image from "next/image";
import Direction from "./direction";
import { get_request } from "../../../contexts/Cryptea/requests";
import { useEffect, useState } from "react";
import { cryptoDeets } from "../../../functions/crypto";
import axios from "axios";
import CustomImg from "../customImg";

const DashHome = () => {
  const [dashData, setDashData] = useState<any>({
    payments: [],
    views: [],
    link: [],
    breakdown: [],
    sortBreakdown: [],
  });

  const [blur, removeBlur] = useState<boolean>(true);

  const [rand, setRand] = useState<number>(0);

  useEffect(() => {
    setRand(Math.floor(Math.random() * 4));

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

      payments.forEach((value: any) => {
        if (breakdown[value.token || "matic"] === undefined) {
          breakdown[value.token || "matic"] = [];
        }

        breakdown[value.token || "matic"].push({
          created_at: new Date(value.created_at).getTime(),
          amount: value.amount,
          token: value.token || "matic",
        });
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

      setTimeout(init, 3000);
    };

    init();
  }, []);

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
      <div className="flex items-start justify-between">
        <div className="mainx w-[calc(100%-340px)] 2sm:w-full">
          <div className="py-3">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              <span className="uppercase mb-2 text-[#818181] font-bold text-[.64rem]">
                Total Received
              </span>
            )}

            <div className="flex mb-3 items-end w-fit">
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

          <div className="py-3">
            {blur ? (
              <Skeleton
                className="mb-2"
                sx={{ fontSize: "1.04rem", width: "80px" }}
              />
            ) : (
              <span className="block uppercase mb-2 text-[#818181] font-bold text-[.64rem]">
                Break Down
              </span>
            )}

            <div className="flex items-center cusscroller overflow-x-scroll overflow-y-hidden pb-1">
              {blur
                ? ["x", "x", "x"].map((v: any, i: number) => {
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

        <div className="min-w-[337px] 2sm:hidden pt-5 h-full">
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
              ? ["x", "x", "x"].map((x: any, i: number) => (
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
                      <Link href={`/user/${l.link}/overview`}>
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
                            <div className="block truncate capitalize text-[#a1a1a1] font-[500] text-[1.2rem]">
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

      <div className="mt-2 pt-1 pb-3 2iism:flex-row sm:flex-col w-full flex">
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
