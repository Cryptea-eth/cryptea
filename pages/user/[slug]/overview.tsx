import { useMoralis } from "react-moralis";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../../../app/components/elements/loader";
import Head from 'next/head';
import { dash, DashContext } from "../../../app/contexts/GenContext";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import { Avatar } from "@mui/material";
import NumberFormat from 'react-number-format'
import {
  initD
} from "../../../app/components/elements/dashboard/link/data";
import Link from "next/link";
import Chart1 from "../../../app/components/elements/Extras/Rep/chart1";

const Overview = () => {

    const { isAuthenticated, isInitialized, user } = useMoralis();

    const [isLoading, setLoading] = useState<boolean>(true);

    const router = useRouter();    

    const { slug } = router.query;

    const { sidebar }: dash  = useContext(DashContext);

    const [ src, setSrc ] = useState<string>('');
    const [data, setData] = useState<any>({});

    useEffect(() => {

        const init = async () => {
            
        const mDx = await initD(String(slug).toLowerCase());


        if(user !== null){
            if (user.id === mDx.attributes.user.id) {

                setData(mDx);
            
                if (mDx.get('template_data') !== undefined) {
                    const { data: tdata } = JSON.parse(mDx.get('template_data'));

                    const { src:srcc } = tdata.image;
                    
                    setSrc(srcc);

                }   

                setLoading(false);

            }else {
                router.push('/')
            }
        }else{
            router.push('/')
        }
    };


    if (isInitialized) {
        if (router.isReady) {         
            if (!isAuthenticated) {
                router.push("/");
            }else{
                init();
            }
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

                  <div
                    className={`body transition-all delay-500 ${
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
                        src={src}
                      >
                        {(
                          String(slug).charAt(0) + String(slug).charAt(1)
                        ).toUpperCase()}
                      </Avatar>
                      <h1 className="text-[rgb(32,33,36)] text-[1.95rem] leading-[2.45rem] mb-[16px] font-[400] text-center">
                        {data.get("title") !== undefined
                          ? data.get("title")
                          : slug}
                      </h1>

                      <p className="text-[0.875rem] text-[rgb(95,99,104)]  truncate leading-[1.25rem] block">
                        {data.get("desc")}
                      </p>
                    </div>

                    <div
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(410px, 1fr))",
                      }}
                      className="max-w-[861px] m-auto grid gap-6 grid-flow-dense"
                    >

                      <div style={{
                        gridColumn: 'span 2'
                      }} className=" border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
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
                              value={2000}
                              thousandSeparator={true}
                              displayType={"text"}
                              prefix={"$"}
                            />
                          </div>

                          <Chart1
                            label="data"
                            name="chart1"
                            prefix="$"
                            dataList={[
                              100, 230, 360, 230, 520, 200, 300, 400, 500, 130,
                              1100, 1230, 1210, 1200, 1300, 1400, 1340, 1400,
                              1600, 1900, 2200, 1200, 1340, 2400, 2200,
                            ]}
                            styles={{
                              width: "100%",
                            }}
                            labels={[
                              "00:00",
                              "01:00",
                              "02:00",
                              "03:00",
                              "04:00",
                              "05:00",
                              "06:00",
                              "07:00",
                              "08:00",
                              "09:00",
                              "10:00",
                              "11:00",
                              "12:00",
                              "13:00",
                              "14:00",
                              "15:00",
                              "16:00",
                              "17:00",
                              "18:00",
                              "19:00",
                              "20:00",
                              "21:00",
                              "22:00",
                              "23:00",
                              "24:00",
                            ]}
                          />
                        </div>

                        <Link href="/working">
                          <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all delay-150">
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
                              value={2000}
                              thousandSeparator={true}
                              displayType={"text"}
                            />
                          </div>

                          <Chart1
                            label="data"
                            name="chart2"
                            dataList={[
                              10, 20, 30, 23, 52, 20, 30, 40, 50, 13,
                              110, 120, 110, 200, 10, 400, 340, 40,
                              10, 10, 20, 10, 10, 240, 20,
                            ]}
                            styles={{
                              width: "100%",
                            }}
                            labels={[
                              "00:00",
                              "01:00",
                              "02:00",
                              "03:00",
                              "04:00",
                              "05:00",
                              "06:00",
                              "07:00",
                              "08:00",
                              "09:00",
                              "10:00",
                              "11:00",
                              "12:00",
                              "13:00",
                              "14:00",
                              "15:00",
                              "16:00",
                              "17:00",
                              "18:00",
                              "19:00",
                              "20:00",
                              "21:00",
                              "22:00",
                              "23:00",
                              "24:00",
                            ]}
                          />
                        </div>

                        <Link href="/working">
                          <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all delay-150">
                            View more data
                          </a>
                        </Link>
                      </div>

                      <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                        <div className="px-6 pt-6 relative pb-3">
                          <div className="flex justify-between mb-[16px] items-center">
                            <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                              Subscribers
                            </h2>

                            <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                              24 Hr
                            </span>
                          </div>

                          <div className="w-full flex h-[100px]"></div>
                        </div>
                        <Link href="/working">
                          <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all delay-150">
                            Add subscription support to link
                          </a>
                        </Link>
                      </div>

                      <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                        <div className="px-6 pt-6 relative pb-3">
                          <div className="flex justify-between mb-[16px] items-center">
                            <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                              Link Template
                            </h2>

                            <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                              Origin
                            </span>
                          </div>

                          <div className="w-full flex h-[100px]"></div>
                        </div>
                        <Link href={`/dashboard/pages/${slug}`}>
                          <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all delay-150">
                            Edit Template
                          </a>
                        </Link>
                      </div>

                      <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                        <div className="px-6 pt-6 relative pb-3">
                          <div className="flex justify-between mb-[16px] items-center">
                            <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                              SDK/APIs
                            </h2>

                            <span className="font-[400] text-[1.0rem] leading-[1.75rem]">
                              Non Active
                            </span>
                          </div>

                          <div className="w-full flex h-[100px]"></div>
                        </div>
                        <Link href="/working">
                          <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all delay-150">
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