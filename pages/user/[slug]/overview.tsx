import { useMoralis } from "react-moralis";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../../../app/components/elements/loader";
import Head from 'next/head';
import { dash, DashContext } from "../../../app/contexts/GenContext";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import { Avatar, IconButton } from "@mui/material";
import NumberFormat from 'react-number-format';
import { FiShare2, FiTrash2 } from "react-icons/fi";
import {
  initD
} from "../../../app/components/elements/dashboard/link/data";
import Link from "next/link";
import LineChart from "../../../app/components/elements/Extras/Rep/lineChart";
import { MdArrowBackIos, MdLink } from "react-icons/md";
import sortData from "../../../app/components/elements/dashboard/linkOverview/generateData";

import { TbApiApp } from 'react-icons/tb';
import { AiOutlineUser } from 'react-icons/ai'
import ShareLink from "../../../app/components/elements/dashboard/linkOverview/share";

const Overview = () => {

    const { isAuthenticated, isInitialized, user } = useMoralis();


    const [isLoading, setLoading] = useState<boolean>(true);

    const router = useRouter();    

    const [social, toggleSocial] = useState<boolean>(false);

    const { slug } = router.query;

    const { sidebar }: dash  = useContext(DashContext);

    const [data, setData] = useState<any>({});

    const [userLk, setUserLk] = useState<string>('');

    useEffect(() => {

        const init = async () => {
            
        const mDx = await initD(String(slug).toLowerCase());

        setUserLk(`${window.location.origin}/user/${slug}`); 

        if(user !== null){
            if (user.id === mDx.attributes.user.id) {

                let src = '';

                let template = '';

                if (mDx.get('template_data') !== undefined) {
                    const { data: tdata, name } = JSON.parse(mDx.get('template_data'));

                    const { src:srcc } = tdata.image;
                    

                     src = srcc;

                     template = name;
                }   

                setData({
                  src,

                  title: mDx.get("title") == undefined ? mDx.get("title") : "",

                  desc: mDx.get("desc") == undefined ? mDx.get("desc") : "",

                  template,

                  link: mDx.get("link"),

                  type: mDx.get("type"),

                  onetime:
                    mDx.get("onetime") !== undefined
                      ? JSON.parse(mDx.get("onetime"))
                      : [],

                  subscribers:
                    mDx.get("subscribers") !== undefined
                      ? JSON.parse(mDx.get("subscribers"))
                      : [],

                  views:
                    mDx.get("views") !== undefined
                      ? JSON.parse(mDx.get("views"))
                      : [],
                });

                setLoading(false);


            }else {
                router.push('/')
            }
        }else{
            router.push('/')
        }
    };

    if (isInitialized && router.isReady) {
      
            if (!isAuthenticated) {
                router.push("/");
            }else{
                init();
            }
         
      }

    }, [isAuthenticated, isInitialized, user, slug, router.isReady, router]);
  
   
      return (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Head>
                <title>Overview | {slug} | Cryptea</title>
              </Head>

              <div className="h-full transition-all delay-500 dash w-full bg-[#fff] flex">
                <Sidebar page={"link"} />

                <ShareLink
                  data={{
                    src: data.src,
                    usrc: user?.get("img"),
                    desc: data.desc,
                    userLk,
                    slug: String(slug)
                  }}
                  toggleSocial={(ee: boolean) => toggleSocial(ee)}
                  open={social}
                />

                <div
                  className={`body pb-6 transition-all delay-500 ${
                    sidebar?.openPage ? "pl-[257px]" : "pl-[87px]"
                  } w-full h-full pr-[10px] 2sm:!pl-[87px]`}
                >
                  <div className="mb-6">
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        margin: "1pc auto",
                        backgroundColor: "#f57059",
                      }}
                      className="text-[50px] font-bold"
                      variant="circular"
                      src={data.src}
                    >
                      {(
                        String(slug).charAt(0) + String(slug).charAt(1)
                      ).toUpperCase()}
                    </Avatar>
                    <h1
                      style={{
                        maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                      }}
                      className="text-[rgb(32,33,36)] mb-[16px] font-[400] flex items-center justify-between relative mx-auto text-center"
                    >
                      <Link href="/dashboard/links">
                        <a>
                          <IconButton
                            size="large"
                            className="cursor-pointer flex items-center justify-center"
                          >
                            <MdArrowBackIos
                              color={"rgb(32,33,36)"}
                              className="relative left-[4px]"
                              size={20}
                            />
                          </IconButton>
                        </a>
                      </Link>

                      <Link href={`/user/${slug}`}>
                        <a className="cursor-pointer text-[1.95rem] leading-[2.45rem] mx-auto flex items-center">
                          <span className="mr-2">
                            {data.title !== undefined ? data.title : slug}
                          </span>

                          <MdLink className="relative top-[2px]" size={30} />
                        </a>
                      </Link>

                      <IconButton
                        onClick={() => toggleSocial(!social)}
                        size="large"
                        className="cursor-pointer flex items-center justify-center"
                      >
                        <FiShare2 color={"rgb(32,33,36)"} size={22} />
                      </IconButton>
                    </h1>

                    <p
                      style={{
                        maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                      }}
                      className="text-[0.875rem] text-[rgb(95,99,104)]  truncate leading-[1.25rem] block"
                    >
                      {data.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(410px, 1fr))",
                      maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                    }}
                    className="m-auto transition-all delay-500 grid gap-6 grid-flow-dense"
                  >
                    <div
                      style={{
                        gridColumn: "span 2",
                      }}
                      className=" border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid"
                    >
                      <div className="px-6 pt-6 relative pb-3">
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-bold text-[.8rem] leading-[1.75rem] ">
                            Payments Today
                          </h2>

                          <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                            24 Hr
                          </span>
                        </div>

                        <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                          <NumberFormat
                            value={[
                              ...sortData(data.subscribers, "24h", false)[
                                "data"
                              ],
                              ...sortData(data.onetime, "24h", false)["data"],
                            ].reduce((a, b) => {
                              return a + b;
                            }, 0)}
                            thousandSeparator={true}
                            displayType={"text"}
                            prefix={"$"}
                          />
                        </div>

                        <LineChart
                          label={["onetime", "subscribers"]}
                          name="chart1"
                          prefix="$"
                          color={["#f57059", "#961d08"]}
                          dataList={[
                            sortData(
                              data.onetime.length
                                ? data.onetime
                                : [{ amount: 0, date: 0 }],
                              "24h",
                              false
                            )["data"],
                            sortData(
                              data.subscribers.length
                                ? data.subscribers
                                : [{ amount: 0, date: 0 }],
                              "24h",
                              false
                            )["data"],
                          ]}
                          // dataList={[
                          //   [
                          //     100, 230, 360, 230, 520, 200, 300, 400, 500,
                          //     130, 1100, 1230, 1210, 1200, 1300, 1400, 1340,
                          //     1400, 1600, 1900, 2200, 1200, 1340, 2400, 2200,
                          //   ],
                          //   [
                          //     10, 23, 36, 23, 50, 40, 30, 30, 50, 130, 110,
                          //     123, 121, 120, 130, 140, 134, 140, 1600, 1900,
                          //     2200, 1200, 1340, 240, 200,
                          //   ],
                          // ]}
                          styles={{
                            width: "100%",
                          }}
                          labels={
                            sortData([{ amount: 0, date: 0 }], "24h", false)[
                              "label"
                            ]
                          }
                        />
                      </div>

                      <Link href={`/user/${slug}/onetime`}>
                        <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all relative bg-white delay-150">
                          View more payment data
                        </a>
                      </Link>
                    </div>

                    <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                      <div className="px-6 pt-6 relative pb-3">
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-bold text-[.8rem] leading-[1.75rem] ">
                            Page Views Today
                          </h2>

                          <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                            24 Hr
                          </span>
                        </div>

                        <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                          <NumberFormat
                            value={sortData(data.views, "24h", false)[
                              "data"
                            ].reduce((a, b) => a + b, 0)}
                            thousandSeparator={true}
                            displayType={"text"}
                          />
                        </div>

                        <LineChart
                          label={["data"]}
                          name="views"
                          prefix="$"
                          dataList={[
                            sortData(
                              data.views.length
                                ? data.views
                                : [{ amount: 0, date: 0 }],
                              "24h",
                              false
                            )["data"],
                          ]}
                          styles={{
                            width: "100%",
                          }}
                          labels={
                            sortData(
                              data.views.length
                                ? data.views
                                : [{ amount: 0, date: 0 }],
                              "24h",
                              false
                            )["label"]
                          }
                        />
                      </div>

                      {/* <Link href="/working">
                          <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all relative bg-white delay-150">
                            View more data
                          </a>
                        </Link> */}
                    </div>

                    <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                      <div className="px-6 pt-6 relative pb-3">
                        {data.type == "both" || data.type == "sub" ? (
                          <>
                            <div className="flex justify-between mb-[16px] items-center">
                              <h2 className="font-bold text-[.8rem] leading-[1.75rem] ">
                                Subscribers
                              </h2>

                              <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                                24 Hr
                              </span>
                            </div>

                            <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                              <NumberFormat
                                value={sortData(
                                  data.subscribers,
                                  "24h",
                                  false,
                                  false
                                )["data"].reduce((a, b) => a + b, 0)}
                                thousandSeparator={true}
                                displayType={"text"}
                              />
                            </div>

                            <LineChart
                              label={["data"]}
                              name="subscribers"
                              dataList={[
                                sortData(
                                  data.subscribers.length
                                    ? data.subscribers
                                    : [{ amount: 0, date: 0 }],
                                  "24h",
                                  false,
                                  false
                                )["data"],
                              ]}
                              styles={{
                                width: "100%",
                              }}
                              labels={
                                sortData(
                                  data.subscribers.length
                                    ? data.subscribers
                                    : [{ amount: 0, date: 0 }],
                                  "24h",
                                  false,
                                  false
                                )["label"]
                              }
                            />
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between mb-[16px] items-center">
                              <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                                Subscribers
                              </h2>

                              <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                                24 Hr
                              </span>
                            </div>

                            <div className="z-0 right-0 flex items-center top-[32px] bottom-0 m-auto absolute">
                              <div className="absolute z-0 h-full w-[100px] bg-overlay"></div>
                              <AiOutlineUser size={180} color={"#f5705933"} />
                            </div>

                            <div className="w-full z-10 relative items-center flex text-[rgb(95,99,104)] h-[100px]">
                              This link only supports one-time payments. Click
                              below to enable subscriptions
                            </div>
                          </>
                        )}
                      </div>
                      <Link href="/working">
                        <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all relative bg-white delay-150">
                          {data.type == "sub" || data.type == "both"
                            ? "View more subscription data"
                            : "Add subscription support to link"}
                        </a>
                      </Link>
                    </div>

                    <div className="border-[rgb(218,220,224)] rounded-[8px] border relative bg-white overflow-hidden border-solid">
                      <div className="px-6 pt-6 relative pb-3">
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                            Link Template
                          </h2>

                          <span className="font-[400] capitalize text-[1.0rem] leading-[1.75rem]">
                            {data.template}
                          </span>
                        </div>
                        <div className="z-0 right-0 top-0 bottom-0 m-auto absolute">
                          <div className="absolute z-0 h-full w-[100px] bg-overlay"></div>
                          <MdLink size={220} color={"#f5705933"} />
                        </div>
                        <div className="w-full relative z-10 items-center flex text-[rgb(95,99,104)] h-[100px]">
                          Make changes to your link template here, click the
                          link below to edit your link template
                        </div>
                      </div>
                      <Link href={`/user/${slug}/edit`}>
                        <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all relative bg-white delay-150">
                          Edit Template
                        </a>
                      </Link>
                    </div>

                    <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white relative overflow-hidden border-solid">
                      <div className="px-6 pt-6 relative pb-3">
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                            SDK/APIs
                          </h2>

                          <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                            Non Active
                          </span>
                        </div>

                        <div className="z-0 right-0 flex items-center top-[50px] bottom-0 m-auto absolute">
                          <div className="absolute z-0 h-full w-[100px] bg-overlay"></div>
                          <TbApiApp size={180} color={"#f5705933"} />
                        </div>

                        <div className="w-full relative z-[10] items-center flex text-[rgb(95,99,104)] h-[100px]">
                          To Integrate This link through our API, Click Below
                        </div>
                      </div>
                      <Link href="/working">
                        <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all relative bg-white delay-150">
                          Lookup SDK/API
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      );
}

export default Overview;