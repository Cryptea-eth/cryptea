import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../../../app/components/elements/loader";
import Head from "next/head";
import { dash, DashContext } from "../../../app/contexts/GenContext";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import {
  Modal,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  ToggleButton,
  Button,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import NumberFormat from "react-number-format";
import { FiShare2, FiTrash2 } from "react-icons/fi";
import { BiBook, BiCopy } from "react-icons/bi";
import { initD } from "../../../app/components/elements/dashboard/link/data";
import Link from "next/link";
import LineChart from "../../../app/components/elements/Extras/Rep/lineChart";
import {
  MdArrowBackIos,
  MdClose,
  MdLink,
  MdOutlineSettingsSuggest,
} from "react-icons/md";
import sortData, {
  totSub,
} from "../../../app/components/elements/dashboard/linkOverview/generateData";
import { TbApiApp } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
import ShareLink from "../../../app/components/elements/dashboard/linkOverview/share";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { BsShieldLock } from "react-icons/bs";
import { get_request, post_request } from "../../../app/contexts/Cryptea/requests";
import copy from "copy-to-clipboard";

const Api = () => {
  const { isAuthenticated } = useCryptea();

  const [isLoading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const [social, toggleSocial] = useState<boolean>(false);

  const { slug } = router.query;

  const { sidebar, chartData }: dash = useContext(DashContext);

  const [gLoader, setGLoader] = useState(false);

  const [data, setData] = useState<any>({});

  const [userLk, setUserLk] = useState<string>("");

  const [userx, setUserX] = useState<any>({});

  const [interval, updInter] = useState<"24h" | "7d" | "30d" | "1yr" | "all">(
    "24h"
  );

  const [interText, setInterText] = useState<{ [index: string]: string }>({
    "24h": "24 hours ago",
    "7d": "7 days ago",
    "30d": "past 30 days",
    "1yr": "1yr ago",
    all: "All time",
  });

  const [hash, setHash] = useState<string>(`leo`);

  const cxHash = () => {

      copy(hash);

      setHash('');
  }

  const [error, setError] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      setUserX(await "user".get("*", true));

      const {
        link: mDx,
        user,
        onetime,
        sub,
      } = await initD(String(slug).toLowerCase());

      setUserLk(`${window.location.origin}/pay/${slug}`);

      if (user["owner"]) {
        let src = "";

        let template = "";

        if (mDx.template_data !== undefined) {
          const { data: tdata, name } = JSON.parse(mDx.template_data);

          const { src: srcc } = tdata.image;

          src = srcc;

          template = name;
        }

        setData({
          id: mDx.id,

          src,

          title: mDx.title,

          desc: mDx.desc,

          activeKey: Boolean(mDx.api),

          img: user.img,

          template,

          link: mDx.link,

          type: mDx.type,

          onetime: onetime.filter(
            (a: any) => a.api !== undefined && a.api == "Yes"
          ),

          sub: sub.filter((a: any) => a.api !== undefined && a.api == "Yes"),
        });

        setLoading(false);
      } else {
        router.push(`/pay/${String(slug).toLowerCase()}`);
      }
    };

    if (isAuthenticated !== undefined && router.isReady) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        init();
      }
    }
  }, [isAuthenticated, slug, router.isReady, router]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Head>
            <title>API/SDK | {slug} | Cryptea</title>
          </Head>

          {Boolean(hash.length) && (
            <>
              <Modal
                open={Boolean(hash.length)}
                sx={{
                  "&& .MuiBackdrop-root": {
                    backdropFilter: "blur(5px)",
                  },
                }}
                onClose={cxHash}
                className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
                aria-labelledby="Generate New Api Key"
                aria-describedby="Generate Api"
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
                          New API Key
                        </h2>
                        <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                          Generate Key, to secure link
                        </span>
                      </div>

                      <IconButton size={"medium"} onClick={cxHash}>
                        <MdClose
                          size={20}
                          color={"rgb(32,33,36)"}
                          className="cursor-pointer"
                        />
                      </IconButton>
                    </div>

                    <div className="w-full items-center rounded-md flex justify-center bg-[#2020200e] py-2 px-3">
                      <span className="text-[#838383] font-[600] text-[1.2rem] h-fit">
                        {hash}
                      </span>
                    </div>

                    <span className="text-[#7c7c7c] mt-3 block font-[500] text-[14px]">
                      <b>Note: </b> You will not be able to view this key again
                      once you close this window, so be sure to record it,
                      Clicking the generate button would generate a new key
                      invalidating older keys.
                    </span>
                  </div>

                  <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                    <div className="flex items-center">
                      <Button
                        onClick={cxHash}
                        className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                      >
                        <BiCopy className={"mr-2"} size={23} /> Copy and Close
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </>
          )}

          <div className="h-full transition-all delay-500 dash w-full bg-[#fff] flex">
            <Sidebar page={"link"} />

            <ShareLink
              data={{
                src: data.src,
                usrc: userx.img,
                desc: data.desc,
                title: data.title,
                userLk,
                slug: String(slug),
              }}
              toggleSocial={(ee: boolean) => toggleSocial(ee)}
              open={social}
            />

            <div
              className={`body pb-6 transition-all delay-500 ${
                sidebar?.openPage ? "pl-[257px]" : "pl-[75px]"
              } w-full h-full 2sm:!pl-[75px]`}
            >
              <div className="pl-5 pr-2 flex items-center justify-between min-h-[75px] py-3 border-b sticky top-0 bg-white z-10 w-full">
                <div className="text-truncate capitalize text-[rgb(32,33,36)] text-[19px] mr-1">
                  <Link href={`/pay/${slug}/overview`}>
                    <a>{data.title !== undefined ? data.title : slug}</a>
                  </Link>
                </div>

                <div className="flex items-center">
                  <Tooltip arrow title="Share Link">
                    <IconButton
                      onClick={() => toggleSocial(!social)}
                      size="large"
                      className="cursor-pointer flex items-center justify-center"
                    >
                      <FiShare2 color={"rgb(32,33,36)"} size={22} />
                    </IconButton>
                  </Tooltip>
                  <Avatar
                    alt={data.username}
                    src={Boolean(data.img) ? data.img : ""}
                    sx={{ width: 45, height: 45, marginLeft: "10px" }}
                  />
                </div>
              </div>

              <h1 className="text-[rgb(32,33,36)] capitalize mb-[5px] font-[400] flex items-center text-[1.5rem] leading-[2.45rem] mx-auto w-fit relative text-center">
                <TbApiApp className="mr-2" size={28} /> API/SDK
              </h1>

              <p
                style={{
                  maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                }}
                className="text-[1.2rem] m-auto capitalize text-center text-[rgb(95,99,104)] flex items-center justify-center leading-[1.25rem] tooltiprep"
              >
                <div className="mr-2">
                  <NumberFormat
                    value={sortData(
                      data.onetime.length
                        ? data.onetime
                        : [{ amount: 0, date: 0 }],
                      interval,
                      false
                    )
                      ["data"].reduce((a: any, b: any) => a + b, 0)
                      .toFixed(2)}
                    thousandSeparator={true}
                    displayType={"text"}
                    className="font-bold"
                    prefix={"$"}
                  />{" "}
                  - Onetime
                </div>
                <div className="mr-2">
                  <NumberFormat
                    value={sortData(
                      data.sub.length ? data.sub : [{ amount: 0, date: 0 }],
                      interval,
                      false
                    )
                      ["data"].reduce((a: any, b: any) => a + b, 0)
                      .toFixed(2)}
                    className="font-bold"
                    thousandSeparator={true}
                    displayType={"text"}
                    prefix={"$"}
                  />{" "}
                  - Subscriptions
                </div>
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(410px, 1fr))",
                  maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                }}
                className="m-auto px-3 transition-all delay-500 grid gap-6 grid-flow-dense"
              >
                <div className="col-span-full border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    <div className="flex justify-between mb-[16px] items-center">
                      <h2 className="font-bold text-[.8rem] leading-[1.75rem] ">
                        Payments through API/SDK
                      </h2>
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
                          interval,
                          false
                        )["data"],
                        sortData(
                          data.sub.length ? data.sub : [{ amount: 0, date: 0 }],
                          interval,
                          false
                        )["data"],
                      ]}
                      styles={{
                        width: "100%",
                      }}
                      labels={
                        sortData([{ amount: 0, date: 0 }], interval, false)[
                          "label"
                        ]
                      }
                    />
                  </div>

                  <Link href={`/pay/${slug}/onetime`}>
                    <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#fff1ef] transition-all cursor-pointer relative bg-white delay-150">
                      View more payment data
                    </a>
                  </Link>
                </div>

                <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    {
                      <>
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                            Generate API key
                          </h2>

                          <div className="font-[400] relative z-30 text-[1.0rem] leading-[1.75rem]">
                            {error.length ? error : (data.activeKey ? 'Active' : '')}
                          </div>
                        </div>

                        <div className="z-0 right-0 flex items-center top-[32px] bottom-0 m-auto absolute">
                          <div className="absolute z-0 h-[117%] w-[100px] bg-overlay"></div>
                          <BsShieldLock size={180} color={"#f5705933"} />
                        </div>

                        <div className="w-full z-10 relative items-center flex text-[rgb(95,99,104)] h-[100px]">
                          Get API documentation, to integrate in your site /
                          application
                        </div>
                      </>
                    }
                  </div>
                  <div
                    onClick={async () => {

                      if (gLoader) {
                        return;
                      }

                      setGLoader(true);

                      try {
                        const ax = await post_request(
                          `/generate/api/${data.id}`,
                          {}
                        );

                        if (ax?.data.hash) {
                          setHash(ax?.data.hash);
                          setGLoader(false);
                        }
                      } catch (err) {
                        const errx = err as any;

                        console.log(errx, "ee");

                        if (errx.response) {
                          setError(errx.response.data.message);
                        } else {
                          setError("Failed, Check your internet access");
                        }

                        setGLoader(false);
                      }
                    }}
                    className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] cursor-pointer font-bold hover:bg-[#fff1ef] flex items-center transition-all relative bg-white delay-150"
                  >
                    {gLoader ? (
                      <>
                        <div className="mr-3 h-[20px] text-[#fff]">
                          <CircularProgress
                            color={"inherit"}
                            className="!w-[20px] text-[#f57059] !h-[20px]"
                          />
                        </div>{" "}
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate new key</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    {
                      <>
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-[400] text-[1.375rem] leading-[1.75rem] ">
                            Documentation
                          </h2>

                          <span className="font-[400] text-[1.0rem] leading-[1.75rem]"></span>
                        </div>

                        <div className="z-0 right-0 flex items-center top-[32px] bottom-0 m-auto absolute">
                          <div className="absolute z-0 h-[117%] w-[100px] bg-overlay"></div>
                          <BiBook size={180} color={"#f5705933"} />
                        </div>

                        <div className="w-full z-10 relative items-center flex text-[rgb(95,99,104)] h-[100px]">
                          Get API documentation, to integrate in your site /
                          application
                        </div>
                      </>
                    }
                  </div>
                  <Link href={`/working`}>
                    <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] cursor-pointer block font-bold hover:bg-[#fff1ef] transition-all relative bg-white delay-150">
                      Go to Documentation
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
};

export default Api;
