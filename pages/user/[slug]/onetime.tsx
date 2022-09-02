import { useState, useEffect, useContext } from 'react'
import Link from "next/link";
import { Avatar, Button, IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRouter } from "next/router";
import Loader from "../../../app/components/elements/loader";
import Head from "next/head";
import sortData from '../../../app/components/elements/dashboard/linkOverview/generateData';
import { initD } from "../../../app/components/elements/dashboard/link/data";
import { dash, DashContext } from "../../../app/contexts/GenContext";
import { useMoralis } from "react-moralis";
import Image from 'next/image';
import { GiTwoCoins } from 'react-icons/gi';
import TypePayment from "../../../app/components/elements/dashboard/link/typePayment";
import { FiSettings, FiShare2 } from 'react-icons/fi';
import { RiCoinLine } from 'react-icons/ri';
import NumberFormat from 'react-number-format';
import LineChart from '../../../app/components/elements/Extras/Rep/lineChart';


const Onetime = () => {

    const router = useRouter();

    const { slug } = router.query;

    const [social, toggleSocial] = useState<boolean>(false);

    const { sidebar, chartData }: dash = useContext(DashContext);

    const [data, setData] = useState<{[index: string]: any}>({});

    const [interval, updInter] = useState<"24h" | "7d" | "30d" | "1yr" | "all">(
      "24h"
    );

    const [interText, setInterText] = useState<{[index: string]: string}>({
        '24h': "24 hours ago",
        '7d' : "7 days ago",
        '30d' : "past 30 days",
        '1yr' : '1yr ago',
        'all' : 'All time'
    });

    const [isLoading, setLoader] = useState<boolean>(true);

    const { isAuthenticated, isInitialized, user } = useMoralis();
  

    const [amountInfo, setAmountInfo] = useState<string>(``);

    useEffect(() => {
        const init = async () => {

        const oDx = await initD(String(slug).toLowerCase());
            
        if(user !== null){
            if (user.id === oDx.attributes.user.id) {
                
                 let src = "";

                 if (oDx.get("template_data") !== undefined) {
                   const { data: tdata } = JSON.parse(
                     oDx.get("template_data")
                   );

                   const { src: srcc } = tdata.image;

                   src = srcc;

                 }   
                const dd = oDx.get("onetime") !== undefined
                      ? JSON.parse(oDx.get("onetime"))
                      : [];
                setData({
                  src,

                  title: oDx.get("title") == undefined ? oDx.get("title") : "",

                  desc: oDx.get("desc") == undefined ? oDx.get("desc") : "",

                  link: oDx.get("link"),

                  type: oDx.get("type"),

                  onetime: dd,

                  views:
                    oDx.get("views") !== undefined
                      ? JSON.parse(oDx.get("views"))
                      : [],
                });

                setAmountInfo(`$${sortData(
        dd.length ? dd : [{ amount: 0, date: 0 }],
        interval,
        false
      )["data"].reduce((a, b) => a + b, 0)} - ${interText[interval]}`)
            
            }
        }

            setLoader(false);
        }

    if(router.isReady && isInitialized){
        if (isAuthenticated) {
            init();
        } else {
            router.push('/');
        }
    }

    }, [
      isAuthenticated,
      isInitialized,
      user,
      slug,
      router.isReady,
      router,
      interval,
      interText
    ]);

    

    useEffect(() => {
      if(chartData.hide){

      if(!isLoading){
        const setx = document.querySelector(".tooltiprep") as HTMLParagraphElement;

         setx.innerHTML = `$${sortData(
            data.onetime.length ? data.onetime : [{ amount: 0, date: 0 }],
            interval,
            false
          )["data"].reduce((a, b) => a + b, 0)} - ${interText[interval]}`;

      }
    }

    }, [chartData, interval, data.onetime, interText, isLoading]);

    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <TypePayment
              data={{
                src: data.src,
                title: data.title !== undefined ? data.title : slug,
                slug: String(slug)
              }}
              support={data.type == "both" || data.type == "onetime"}
              which={"onetime"}
            >
              <div className="pl-5 pr-2 flex items-center justify-between min-h-[75px] py-3 border-b sticky top-0 bg-white z-10 w-full">
                <div className="text-truncate capitalize text-[rgb(32,33,36)] text-[19px] mr-1">
                  <Link href={`/user/${slug}/overview`}>
                    <a>{data.title !== undefined ? data.title : slug}</a>
                  </Link>
                </div>

                <div className="flex items-center">
                  <IconButton
                    onClick={() => toggleSocial(!social)}
                    size="large"
                    className="cursor-pointer flex items-center justify-center"
                  >
                    <FiShare2 color={"rgb(32,33,36)"} size={22} />
                  </IconButton>

                  <IconButton
                    size="large"
                    className="cursor-pointer flex items-center justify-center"
                  >
                    <FiSettings color={"rgb(32,33,36)"} size={22} />
                  </IconButton>
                </div>
              </div>

              <div
                style={{
                  maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                }}
                className="mb-6 mt-3 mx-auto"
              >
                <h1 className="text-[rgb(32,33,36)] mb-[5px] font-[400] flex items-center text-[1.5rem] leading-[2.45rem] mx-auto w-fit relative text-center">
                  <RiCoinLine className="mr-2" size={23} /> Onetime Payments
                </h1>

                <p
                  style={{
                    maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                  }}
                  className="text-[1.2rem] capitalize text-center text-[rgb(95,99,104)] leading-[1.25rem] tooltiprep block"
                >
                  {amountInfo}
                </p>
                <ToggleButtonGroup
                  value={interval}
                  sx={{
                    justifyContent: "space-between",
                    maxWidth: "300px",
                    "& .Mui-selected": {
                      backgroundColor: `#f57059 !important`,
                      color: `#fff !important`,
                    },
                    "& .MuiToggleButtonGroup-grouped": {
                      borderRadius: "4px !important",
                      minWidth: 55,
                      padding: "2px",
                      color: "#d3d3d3",
                      border: "none",
                    },
                  }}
                  exclusive
                  className="cusscroller overflow-y-hidden flex justify-center mt-5 mx-auto mb-2 pb-1"
                  onChange={(e: any) => {
                    const val: string | any = e.target.value;
                    setAmountInfo(
                      `$${sortData(
                        data.onetime.length
                          ? data.onetime
                          : [{ amount: 0, date: 0 }],
                        val,
                        false
                      )["data"].reduce((a, b) => a + b, 0)} - ${interText[val]}`
                    );

                    updInter(val);
                  }}
                >
                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    value={`24h`}
                  >
                    24h
                  </ToggleButton>

                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    value={`7d`}
                  >
                    7d
                  </ToggleButton>

                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    value={`30d`}
                  >
                    30d
                  </ToggleButton>

                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    value={`1yr`}
                  >
                    1yr
                  </ToggleButton>

                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                    value={`all`}
                  >
                    all
                  </ToggleButton>
                </ToggleButtonGroup>
                <div
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(410px, 1fr))",
                    maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                  }}
                  className="mt-4 mx-auto transition-all delay-500 grid gap-6 grid-flow-dense"
                >
                  <div
                    style={{
                      gridColumn: "span 2",
                    }}
                    className=" border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid"
                  >
                    <div className="p-6 relative">
                      <LineChart
                        label={["onetime"]}
                        name="chart1"
                        prefix="$"
                        color={["#f57059"]}
                        exportLabel={false}
                        dataList={[
                          sortData(
                            data.onetime.length
                              ? data.onetime
                              : [{ amount: 0, date: 0 }],
                            interval,
                            false
                          )["data"],
                        ]}
                        styles={{
                          width: "100%",
                          height: "200px",
                        }}
                        labels={
                          sortData(
                            data.onetime.length
                              ? data.onetime
                              : [{ amount: 0, date: 0 }],
                            interval,
                            false
                          )["label"]
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TypePayment>
          </>
        )}
      </>
    );

}

export default Onetime;