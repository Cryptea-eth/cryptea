import empty from '../../../public/images/empty2.png';
import { useState, useEffect, useContext, Fragment } from "react";
import Link from "next/link";
import {
  Avatar,
  Button,
  IconButton,
  TableCell,
  TableBody,
  TablePagination,
  TableContainer,
  TableHead,
  Grid,
  TableRow,
  Table,
  AvatarGroup,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import { useRouter } from "next/router";
import Loader from "../../../app/components/elements/loader";
import copy from "copy-to-clipboard";
import sortData, { totSub } from "../../../app/components/elements/dashboard/linkOverview/generateData";
import { initD } from "../../../app/components/elements/dashboard/link/data";
import { dash, DashContext } from "../../../app/contexts/GenContext";
import TypePayment from "../../../app/components/elements/dashboard/link/typePayment";
import { FiSettings, FiShare2 } from "react-icons/fi";
import { RiCoinLine } from "react-icons/ri";
import NumberFormat from "react-number-format";
import LineChart from "../../../app/components/elements/Extras/Rep/lineChart";
import { MdContentCopy, MdOutlineSettingsSuggest } from "react-icons/md";
import ShareLink from "../../../app/components/elements/dashboard/linkOverview/share";
import { defineType, types } from "../../../app/components/elements/dashboard/linkOverview/linkTypes";
import { BiCoinStack } from "react-icons/bi";
import Image from "next/image";
import { useCryptea } from '../../../app/contexts/Cryptea';
import { time } from '../../../app/contexts/Cryptea/DB';

const Onetime = () => {

  const router = useRouter();

  const { slug, type } = router.query;

  const [social, toggleSocial] = useState<boolean>(false);

  const { sidebar, chartData }: dash = useContext(DashContext);

  const [data, setData] = useState<{ [index: string]: any }>({});

  const [paymentS, setPaymentS] = useState<'latest' | 'top' | 'expired'>('latest');

  const [interval, updInter] = useState<{
    [index: string]: { [index: string]: "24h" | "7d" | "30d" | "1yr" | "all" };
  }>({
    onetime: { main: "24h", views: "24h" },

    sub: { main: "24h", views: "24h", subscribers: "24h" },
  });


  const [pcols, setPcols] = useState<string[]>([]);

  const genClr = ():string => {
     const clr:string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

      const max:number = 6;
      let gnClr:string = '';
      
      for(let i:number = 0; i < max; i++){
          const random:number = Math.floor(Math.random() * clr.length);
          
          gnClr = gnClr + clr[random];

      }

      return '#'+gnClr;

  }


  useEffect(() => {
    const ex:string[] = [];

      for (let i: number = 0; i < 10; i++) {
          ex.push(genClr());
      }

      setPcols(ex);

  }, []);

  const [interText, setInterText] = useState<{ [index: string]: string }>({
    "24h": "24 hours ago",
    "7d": "7 days ago",
    "30d": "past 30 days",
    "1yr": "1yr ago",
    all: "All time",
  });

  const [isLoading, setLoader] = useState<boolean>(true);

  const { isAuthenticated, user } = useCryptea();

  const [amountInfo, setAmountInfo] = useState<string>(``);

  const [copied, setCopied] = useState<boolean[]>([]);

  const mainCopy = (index: number, bool?: boolean) => {
        const ee = [...copied];
          ee[index] = bool !== undefined ? bool : !ee[index];

          setCopied(ee);
  }

  const dcolumns = [
    { id: "name", label: "Name", minWidth: 120 },

    { id: "asset", label: "Asset", minWidth: 100 },
    {
      id: "amount",
      label: "Amount",
      minWidth: 100,
    },
    { id: "address", label: "Address", minWidth: 100 },
  ];

  const [columns, setColumns] = useState([...dcolumns]);

  const [linkType, setLinkType] = useState<'onetime' | 'sub' | ''>('');

  const [rows, setRows] = useState<{[index: string]: JSX.Element | string | number}[]>([]);

  useEffect(() => {
    const init = async () => {

      const { link:oDx, user, onetime, sub, views } = await initD(String(slug).toLowerCase());


      if (user["owner"]) {

          let src = "";

          if (oDx.template_data !== undefined) {

            const { data: tdata } = JSON.parse(oDx.template_data);

            const { src: srcc } = tdata.image;

            src = srcc;
          }

          const dd = linkType == 'sub' ? sub : onetime;

          const amount = oDx.amount;

          const extra =
            oDx.rdata !== undefined ? JSON.parse(oDx.rdata) : {};

          let addColumn = [...dcolumns];

          if (Boolean(Number(amount))) {
            addColumn.forEach((v: any) => {
              if (v.id == "amount") {
                delete v.id;
              }
            });
          }

          if (extra[linkType] !== undefined) {
            extra[linkType].forEach((v: string) => {
              if (v != "Name") {
                addColumn.push({
                  id: v.toLowerCase(),
                  label: v,
                  minWidth: 100,
                });
              }
            });
          }

          const currentTime = await time();

          setColumns(addColumn);

          const rowx: any = [];

          if (dd.length) {
            let sdd: any[] = dd.sort((a: any, b: any) => b.date - a.date);

            if (paymentS == "top") {
              sdd = dd.sort((a: any, b: any) => b.amount - a.amount);
            } else if (paymentS == "expired") {
              sdd = dd.map((v: any) =>
                currentTime >= v.expired ? v : undefined
              );
            }

            if (sdd.length) {
              sdd.forEach(
                (
                  vmain: { [index: string]: string | number } | undefined,
                  ii: number
                ) => {
                  if (vmain !== undefined) {
                    const supply: { [index: string]: string | number } = {};

                    supply["name"] =
                      vmain.name === undefined ? "anonymous" : vmain.name;
                    supply["token"] =
                      vmain.token === undefined ? "matic" : vmain.token;
                    const msupply = { ...supply, ...vmain };

                    const date = new Date(msupply.created_at);

                    const hrx = date.getHours() % 12 || 12;
                    const rowD: { [index: string]: any } = {};

                    addColumn.forEach(
                      (v: { [index: string]: string | number }) => {
                        const ddx = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];

                        if (v["id"] == "name") {
                          rowD["name"] = (
                            <div className="flex items-center">
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  marginRight: "10px",
                                  backgroundColor:
                                    ii > 9 ? pcols[ii % 10] : pcols[ii],
                                  fontSize: "18px",
                                }}
                              >
                                {String(msupply.name).charAt(0).toUpperCase()}
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-semibold text-truncate text-[#4d4d4d]">
                                  {msupply.name}
                                </span>
                                <span className="block text-[#858585] font-normal">
                                  {ddx[date.getMonth()]}{" "}
                                  {String(date.getDate()).length == 1
                                    ? "0" + date.getDate()
                                    : date.getDate()}{" "}
                                  {date.getFullYear()} {hrx}:{date.getMinutes()}{" "}
                                  {hrx > 12 ? "pm" : "am"}
                                </span>
                              </div>
                            </div>
                          );
                        } else if (v["id"] == "address") {
                          rowD["address"] = (
                            <ClickAwayListener
                              onClickAway={() => mainCopy(ii, false)}
                            >
                              <Tooltip
                                placement="top"
                                onClose={() => mainCopy(ii, false)}
                                open={Boolean(copied[ii])}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                PopperProps={{
                                  disablePortal: true,
                                }}
                                arrow
                                title="Copied"
                              >
                                <div
                                  onClick={() => {
                                    mainCopy(ii, true);
                                    copy(String(msupply.address));
                                  }}
                                  className="flex cursor-pointer items-center relative"
                                >
                                  {" "}
                                  <span className="text-[#4d4d4d]">
                                    {String(msupply.address).substring(0, 6)}...
                                    {String(msupply.address).substring(38, 42)}
                                  </span>{" "}
                                  <MdContentCopy
                                    className="left-1 relative cursor-pointer"
                                    size={14}
                                  />
                                </div>
                              </Tooltip>
                            </ClickAwayListener>
                          );
                        } else if (v["id"] == "amount") {
                          const renewal =
                            msupply["renewal"] !== undefined
                              ? msupply["renewal"]
                              : "";

                          rowD["amount"] =
                            Number(msupply["amount"]).toFixed(2) +
                            " " +
                            renewal;
                        } else if (v["id"] == "asset") {
                          rowD["asset"] = msupply["token"];
                        } else if (v["id"] == "email") {
                          rowD["email"] = msupply["mail"];
                        } else {
                          rowD[v["id"]] = msupply[v["id"]];
                        }
                      }
                    );

                    rowx.push(rowD);
                  }
                }
              );
            }

            setRows([...rowx]);
          }


          setData({
                src,

                username: user.username,

                img: user.img,

                title: oDx.title,

                desc: oDx.desc,

                link: oDx.link,

                type: oDx.type,

                main: dd,

                amount: oDx.amount,

                views
                });

          setAmountInfo(
            `$${sortData(
              dd.length ? dd : [{ amount: 0, date: 0 }],
              "24h",
              false
            )
              ["data"].reduce((a, b) => a + b, 0)
              .toFixed(2)} - ${interText["24h"]}`
          );

      setLoader(false);

      }else {
           router.push(`/pay/${String(slug).toLowerCase()}`);
      }

    };

    if (router.isReady && isAuthenticated !== undefined) {
      if (isAuthenticated) {
        const ctypes = defineType(String(type).toLowerCase());

        if (types.indexOf(String(type).toLowerCase()) != -1 && ctypes !== false) {
      

          setLinkType(ctypes);

          init();
        } else {
          router.push("/404");
        }
      } else {
        router.push("/");
      }
    }
  }, [
    isAuthenticated,
    slug,
    type,
    linkType,
    router.isReady,
    router,
    pcols,
    interval,
    paymentS,
    interText
  ]);


  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (event:any, newPage:any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event:any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  useEffect(() => {
    if (chartData.hide) {
      if (!isLoading) {
        const setx = document.querySelector(
          ".tooltiprep"
        ) as HTMLParagraphElement;

        (setx || { innerHTML: '' }).innerHTML = `$${(sortData(
          data.main.length ? data.main : [{ amount: 0, date: 0 }],
          interval[linkType]['main'],
          false
        )["data"].reduce((a, b) => a + b, 0)).toFixed(2)} - ${
          interText[interval[linkType]['main']]
        }`;
      }
    }
  }, [chartData, interval, data.main, linkType, interText, isLoading]);

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
              slug: String(slug),
            }}
            support={data.type == "both" || data.type == linkType}
            which={linkType != "" ? linkType : "onetime"}
          >
            <ShareLink
              data={{
                src: data.src,
                usrc: data.img,
                title: data.title,
                desc: data.desc,
                userLk: `${window.location.origin}/pay/${slug}`,
                slug: String(slug),
              }}
              toggleSocial={(ee: boolean) => toggleSocial(ee)}
              open={social}
            />

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

            <div
              style={{
                maxWidth: !sidebar?.openPage ? "1031px" : "861px",
              }}
              className="mb-6 mt-3 mx-auto 2sm:px-3"
            >
              <h1 className="text-[rgb(32,33,36)] capitalize mb-[5px] font-[400] flex items-center text-[1.5rem] leading-[2.45rem] mx-auto w-fit relative text-center">
                {linkType == "sub" ? (
                  <>
                    <BiCoinStack className="mr-2" size={23} /> Subscription
                    Based Payments
                  </>
                ) : (
                  <>
                    <RiCoinLine className="mr-2" size={23} /> Onetime Payments
                  </>
                )}
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
                value={interval[linkType]["main"]}
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
                      data.main.length ? data.main : [{ amount: 0, date: 0 }],
                      val,
                      false
                    )
                      ["data"].reduce((a, b) => a + b, 0)
                      .toFixed(2)} - ${interText[val]}`
                  );

                  const ninterval: { [index: string]: any } = { ...interval };

                  ninterval[linkType] = {
                    main: val,
                    views: val,
                    subscribers: val,
                  };

                  updInter(ninterval);
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
                className="mt-4 mx-auto transition-all delay-500 grid gap-6"
              >
                <div className="w-full col-span-full border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="p-6 relative">
                    <LineChart
                      label={[linkType]}
                      name="chart1"
                      prefix="$"
                      color={["#f57059"]}
                      exportLabel={false}
                      dataList={[
                        sortData(
                          data.main.length
                            ? data.main
                            : [{ amount: 0, date: 0 }],
                          interval[linkType]["main"],
                          false
                        )["data"],
                      ]}
                      styles={{
                        width: "100%",
                        height: "200px",
                      }}
                      labels={
                        sortData(
                          data.main.length
                            ? data.main
                            : [{ amount: 0, date: 0 }],
                          interval[linkType]["main"],
                          false
                        )["label"]
                      }
                    />
                  </div>
                </div>

                <div className="w-full border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    <div className="flex justify-between mb-[16px] items-center">
                      <h2 className="font-bold text-[.8rem] leading-[1.75rem] ">
                        Page Views
                      </h2>

                      <ToggleButtonGroup
                        value={interval[linkType]["views"]}
                        sx={{
                          justifyContent: "space-between",
                          maxWidth: "270px",
                          "& .Mui-selected": {
                            backgroundColor: `#f57059 !important`,
                            color: `#fff !important`,
                          },
                          "& .MuiToggleButtonGroup-grouped": {
                            borderRadius: "4px !important",
                            minWidth: 48,
                            padding: "2px",
                            color: "#d3d3d3",
                            border: "none",
                          },
                        }}
                        exclusive
                        className="cusscroller top-[5px] relative overflow-y-hidden flex justify-center pb-1"
                        onChange={(e: any) => {
                          const val: string | any = e.target.value;
                          setAmountInfo(
                            `$${sortData(
                              data.main.length
                                ? data.main
                                : [{ amount: 0, date: 0 }],
                              val,
                              false,
                              false
                            )
                              ["data"].reduce((a, b) => a + b, 0)
                              .toFixed(2)} - ${interText[val]}`
                          );

                          const ninterval = { ...interval };

                          ninterval[linkType] = {
                            ...interval[linkType],
                            views: val,
                          };

                          updInter(ninterval);
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
                    </div>

                    <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                      <NumberFormat
                        value={sortData(
                          data.views,
                          interval[linkType]["views"],
                          false,
                          false
                        )["data"].reduce((a, b) => a + b, 0)}
                        thousandSeparator={true}
                        displayType={"text"}
                      />
                    </div>

                    <LineChart
                      label={["data"]}
                      name="views"
                      dataList={[
                        sortData(
                          data.views.length
                            ? data.views
                            : [{ amount: 0, date: 0 }],
                          interval[linkType]["views"],
                          false
                        )["data"],
                      ]}
                      styles={{
                        width: "100%",
                        height: "140px",
                      }}
                      labels={
                        sortData(
                          data.views.length
                            ? data.views
                            : [{ amount: 0, date: 0 }],
                          interval[linkType]["views"],
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

                {linkType == "sub" && (
                  <div className="w-full border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                    <div className="px-6 pt-6 relative pb-3">
                      <div className="flex justify-between mb-[16px] items-center">
                        <h2 className="font-bold text-[.8rem] leading-[1.75rem] ">
                          Subscribers
                        </h2>

                        <ToggleButtonGroup
                          value={interval["sub"]["subscribers"]}
                          sx={{
                            justifyContent: "space-between",
                            maxWidth: "270px",
                            "& .Mui-selected": {
                              backgroundColor: `#f57059 !important`,
                              color: `#fff !important`,
                            },
                            "& .MuiToggleButtonGroup-grouped": {
                              borderRadius: "4px !important",
                              minWidth: 48,
                              padding: "2px",
                              color: "#d3d3d3",
                              border: "none",
                            },
                          }}
                          exclusive
                          className="cusscroller top-[5px] relative overflow-y-hidden flex justify-center pb-1"
                          onChange={(e: any) => {
                            const val: string | any = e.target.value;
                            setAmountInfo(
                              `$${sortData(
                                data.main.length
                                  ? data.main
                                  : [{ amount: 0, date: 0 }],
                                val,
                                false,
                                false,
                                true
                              )
                                ["data"].reduce((a, b) => a + b, 0)
                                .toFixed(2)} - ${interText[val]}`
                            );

                            updInter({
                              ...interval,
                              sub: { ...interval["sub"], subscribers: val },
                            });
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
                      </div>

                      <div className="absolute top-[47px] font-[400] text-[1.5rem]">
                        <NumberFormat
                          value={totSub(data.main)}
                          thousandSeparator={true}
                          displayType={"text"}
                        />
                      </div>

                      <LineChart
                        label={["data"]}
                        name="subscribers"
                        dataList={[
                          sortData(
                            data.main.length
                              ? data.main
                              : [{ amount: 0, date: 0 }],
                            interval["sub"]["subscribers"],
                            false,
                            false,
                            true
                          )["data"],
                        ]}
                        styles={{
                          width: "100%",
                          height: "140px",
                        }}
                        labels={
                          sortData(
                            data.main.length
                              ? data.main
                              : [{ amount: 0, date: 0 }],
                            interval["sub"]["subscribers"],
                            false,
                            false,
                            true
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
                )}

                <div className="w-full border-[rgb(218,220,224)] rounded-[8px] border bg-white relative overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    <div className="flex justify-between mb-[16px] items-center">
                      <h2 className="font-[400] text-[1.375rem] leading-[1.75rem]">
                        Settings
                      </h2>
                    </div>

                    <div className="z-0 right-[15px] flex items-center top-[5px] bottom-0 m-auto absolute">
                      <div className="absolute z-0 h-full w-[140px] bg-overlay"></div>
                      <MdOutlineSettingsSuggest
                        size={180}
                        color={"#f5705933"}
                      />
                    </div>

                    <div className="w-full relative z-[10] items-center flex text-[rgb(95,99,104)] h-[100px]">
                      Configure link
                    </div>
                  </div>
                  <Link href={`/pay/${String(slug).toLowerCase()}/settings`}>
                    <a className="border-t px-6 p-3 border-solid border-[rgb(218,220,224)] text-[#f57059] block font-bold hover:bg-[#f570590c] transition-all relative bg-white delay-150">
                      Go To Settings
                    </a>
                  </Link>
                </div>

                <div className="w-full col-span-full border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="p-6 relative">
                    <div className="flex justify-between mb-[16px] items-center">
                      <h2
                        data-value={(rows.length < 10 ? '0' : '') + rows.length}
                        className="text-[1.3rem] text-[rgb(32,33,36)] leading-[1.6rem] font-[400] after:content-[attr(data-value)] after:absolute after:bg-[#f57059] after:w-fit after:text-white after:-right-[30px] after:font-bold after:text-[12px] after:rounded-md after:px-[5px] after:h-fit relative"
                      >
                        {linkType == "onetime" ? "Payments" : "Subscribers"}
                      </h2>

                      {data.amount == "variable" ||
                      Boolean(Number(data.amount)) ? (
                        <ToggleButtonGroup
                          value={paymentS}
                          sx={{
                            justifyContent: "space-between",
                            maxWidth: "270px",
                            "& .Mui-selected": {
                              backgroundColor: `#f57059 !important`,
                              color: `#fff !important`,
                            },
                            "& .MuiToggleButtonGroup-grouped": {
                              borderRadius: "4px !important",
                              minWidth: 65,
                              padding: "2px",
                              color: "#d3d3d3",
                              border: "none",
                            },
                          }}
                          exclusive
                          className="cusscroller top-[5px] relative overflow-y-hidden flex justify-center pb-1"
                          onChange={(e: any) => setPaymentS(e.target.value)}
                        >
                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            value={`latest`}
                          >
                            Latest
                          </ToggleButton>

                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            value={`top`}
                          >
                            Top
                          </ToggleButton>

                          {linkType == "sub" && (
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value={`expired`}
                            >
                              Expired
                            </ToggleButton>
                          )}
                        </ToggleButtonGroup>
                      ) : linkType == "onetime" ? (
                        <span className="font-semibold text-[rgb(32,33,36)]">
                          ${Number(data.amount).toFixed(2)}
                        </span>
                      ) : (
                        <ToggleButtonGroup
                          value={paymentS}
                          sx={{
                            justifyContent: "space-between",
                            maxWidth: "270px",
                            "& .Mui-selected": {
                              backgroundColor: `#f57059 !important`,
                              color: `#fff !important`,
                            },
                            "& .MuiToggleButtonGroup-grouped": {
                              borderRadius: "4px !important",
                              minWidth: 65,
                              padding: "2px",
                              color: "#d3d3d3",
                              border: "none",
                            },
                          }}
                          exclusive
                          className="cusscroller top-[5px] relative overflow-y-hidden flex justify-center pb-1"
                          onChange={(e: any) => setPaymentS(e.target.value)}
                        >
                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            value={`latest`}
                          >
                            Latest
                          </ToggleButton>

                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            value={`expired`}
                          >
                            Expired
                          </ToggleButton>
                        </ToggleButtonGroup>
                      )}
                    </div>

                    {Boolean(rows.length) ? (
                      <>
                        <TableContainer
                          className="mainTable"
                          sx={{ maxHeight: "auto" }}
                        >
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                {columns.map((column, id) => (
                                  <TableCell
                                    key={column.id + "-" + id}
                                    style={{
                                      minWidth: column.minWidth,
                                      borderBottom: "none",
                                      fontWeight: "bold",
                                      color: "rgb(32,33,36)",
                                      cursor: "default",
                                    }}
                                  >
                                    {column.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((row: any, id: number) => {
                                  return (
                                    <Fragment key={id}>
                                      <TableRow role="checkbox" tabIndex={-1}>
                                        {columns.map((column) => {
                                          const value = row[column.id];
                                          return (
                                            <TableCell
                                              className="!border-[0px] text-[#4d4d4d] relative font-[500] !border-none"
                                              key={column.id + "-" + id}
                                              style={{
                                                cursor: "default",
                                                verticalAlign: "baseline",
                                              }}
                                            >
                                              {value}
                                            </TableCell>
                                          );
                                        })}
                                      </TableRow>
                                    </Fragment>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[10, 25, 100]}
                          component="div"
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </>
                    ) : (
                      <div
                        className="empty"
                        style={{
                          display: "flex",
                          width: "100%",
                          height: "fit-content",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="w-[240px]">
                          <Image
                            src={empty}
                            className="mb-3 object-scale-down"
                            layout={"intrinsic"}
                            alt="Quite empty here"
                          />
                        </div>

                        <div className="mt-2 mb-3">
                          <h2 className="text-[20px] text-[#3e3e3e] capitalize text-center font-[400]">
                            No{" "}
                            {linkType == "onetime" ? "Payments" : "Subscribers"}{" "}
                            Yet
                          </h2>
                          <span className="mt-2 text-[17px] text-[#949494] block w-full text-center">
                            This place would be filled anytime soon😊
                          </span>
                          <div className="flex mt-2 item-center justify-center">
                            <Button
                              onClick={() => toggleSocial(true)}
                              className="!py-2 !font-bold !px-5 !capitalize !flex !items-center !text-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all mr-2 !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                            >
                              <FiShare2 size={25} className="mr-1" /> Share Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TypePayment>
        </>
      )}
    </>
  );
};

export default Onetime;
