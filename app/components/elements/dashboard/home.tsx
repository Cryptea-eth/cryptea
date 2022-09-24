
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, Fragment } from "react";
import { FaWallet } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Loader from "../loader";
import Image from 'next/image';
import { BsBoxArrowInDownLeft, BsArrowRight } from "react-icons/bs";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdMode, MdPreview } from "react-icons/md";
import {
  TextField,
  Button,
  AvatarGroup,
  IconButton,
  Modal,
  Box,
  Collapse,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Avatar,
  TableCell,
  TableBody,
  TablePagination
} from "@mui/material";
import { data } from "autoprefixer";
import Link from 'next/link'
import { useCryptea } from "../../../contexts/Cryptea";

const DashHome = () => {

  const { 
    isAuthenticated,
    account,
    chainId
   } = useCryptea();

   

  const [links, addLinks] = useState<any>([]);

  const userAddress = account;

  const BigNum = (n = 0, p: number) => {

    const nn = String(n).split('.');

    if (Boolean(nn[1])) {
      if (nn[1].length >= p) {
        return Number(n.toFixed(p));
      } else {
        return n.toFixed(nn[1].length)
      }
    } else {
      return n;
    }
  }

  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [wdata, setWData] = useState({});
  const [rows, setrows] = useState([]);
  const [nft, viewN] = useState(false);
  const [nfts, setNfts] = useState<number | undefined>(0)


  useEffect(() => {
    if(isAuthenticated){
    const mlink = ('links').get('*',true);

    mlink.then((e) => {
      addLinks(e);
      setLoading1(false);
    });

      fetch(
        `https://api.covalenthq.com/v1/${Number(
          chainId
        )}/address/${userAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_d8fd93851d6a4d57bdcf14a337d`
      )
        .then(async (d) => {

          const response = await d.json();

          const { data } = response;

          setWData(data);
          setLoading2(false);

          const { items } = data;

          setrows(
            items.map(
              ({
                balance,
                contract_name,
                contract_decimals,
                contract_ticker_symbol,
                quote,
                quote_24h,
                logo_url,
              }: {
                balance: number,
                contract_name: string,
                contract_decimals: number,
                contract_ticker_symbol: string,
                quote: number,
                quote_24h: number,
                logo_url: string
              }) => {
                return {
                  name: (
                    <div className="flex items-center">
                      <Avatar
                        alt={contract_ticker_symbol}
                        src={logo_url}
                        sx={{ width: 24, height: 24, marginRight: "10px" }}
                      />
                      <span>{contract_name}</span>
                    </div>
                  ),
                  code: (
                    <span className="text-[#626262]">
                      {contract_ticker_symbol}
                    </span>
                  ),
                  price: `$${BigNum(quote, 4)}`,
                  change: (
                    <div
                      style={{
                        color:
                          ((quote - quote_24h) / quote_24h) * 100 > 0
                            ? "#53D258"
                            : "#f83333",
                      }}
                      className={`flex items-center justify-end`}
                    >
                      {Boolean(quote_24h)
                        ? (((quote - quote_24h) / quote_24h) * 100 > 0
                          ? "+"
                          : "") +
                        BigNum(((quote - quote_24h) / quote_24h) * 100, 2) +
                        "%"
                        : "0%"}

                    </div>
                  ),
                  amount:
                    "$" +
                    BigNum(
                      (Boolean(balance) ? balance / 10 ** contract_decimals : 0) *
                      quote,
                      5
                    ),
                };
              }
            )
          );
        });
      }

  }, [chainId, isAuthenticated, loading2, userAddress]);



  // const balances = () => {
  //   if (!loading2) {
  //     let bs = user?.get("balances");
  //     const { items }: { items?: object[] } = wdata;
  //     let bss = 0;

  //     items?.forEach(({ quote = 0, balance = 0, contract_decimals = 0 }: { quote?: number, balance?: number, contract_decimals?: number }) => {
  //       bss += (balance / 10 ** contract_decimals) * quote;
  //     });

  //     if (!Boolean(bs)) {
  //       const json = [];
  //       json.push({ amt: 0 }, { amt: bss });

  //       user?.set("balances", JSON.stringify(json));
  //       user?.save();

  //       return json;

  //     } else {
  //       bs = JSON.parse(bs);

  //       if (BigNum(bs[bs.length - 1].amt, 5) !== BigNum(bss, 5)) {
  //         bs.push({ amt: bss });
  //         user?.set("balances", JSON.stringify(bs));
  //         user?.save();
  //       }

  //       return bs;
  //     }
  //   }
  // }



  const balance: {
      amt: number
  }[] = [{ amt: 0 }, { amt: 0 }];

  const received = [{ amt: 0 }];


  const [rprevious, rcurrent] = false ? [
    received[received.length - 2].amt,
    received[received.length - 1].amt,
  ] : [0, 0];
  const rchange = false ? ((rcurrent - rprevious) / rprevious) * 100 : 0;


  const columns: { id: string, label: string, minWidth: number, align?: "right" | "left", format?: <Val extends string & number>(value: Val) => (string | number) }[] = [

    { id: "name", label: "Token", minWidth: 170 },
    { id: "code", label: "Symbol", minWidth: 100 },
    {
      id: "price",
      label: "Label Price",
      minWidth: 150,
      align: "right",
      format: (value: string) => value.toLocaleString(),
    },
    {
      id: "change",
      label: "24h change",
      minWidth: 100,
      align: "right",
      format: (value: string) => value.toLocaleString(),
    },
    {
      id: "amount",
      label: "Amount",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toFixed(2),
    },
  ];

  const rowss = [
    {
      name: (
        <div className="flex items-center">
          <Avatar
            alt="BNB"
            src={require("../../../../public/images/bnb.png")}
            sx={{ width: 24, height: 24, marginRight: "10px" }}
          />
          <span>Binance</span>
        </div>
      ),
      code: <span className="text-[#626262]">BNB</span>,
      price: "$1354",
      change: <div className={`flex items-center text-[#53D258]`}> +32% </div>,
      amount: "$220",
    },
    {
      name: (
        <div className="flex items-center">
          <Avatar
            alt="BTC"
            src={require("../../../../public/images/btc.png")}
            sx={{ width: 24, height: 24, marginRight: "10px" }}
          />
          <span>Bitcoin</span>
        </div>
      ),
      code: <span className="text-[#626262]">BTC</span>,
      price: "$140365",
      change: <div className={`flex items-center text-[#53D258]`}> +32% </div>,
      amount: "$334",
    },
    {
      name: (
        <div className="flex items-center">
          <Avatar
            alt="ETH"
            src={require("../../../../public/images/eth.png")}
            sx={{ width: 24, height: 24, marginRight: "10px" }}
          />
          <span>Ethereum</span>
        </div>
      ),
      code: <span className="text-[#626262]">ETH</span>,
      price: "$3973",
      change: <div className={`flex items-center text-[#53D258]`}> +32% </div>,
      amount: "$100",
    },
    {
      name: (
        <div className="flex items-center">
          <Avatar
            alt="LUNA"
            src={require("../../../../public/images/terra.png")}
            sx={{ width: 24, height: 24, marginRight: "10px" }}
          />
          <span>Terra</span>
        </div>
      ),
      code: <span className="text-[#626262]">LUNA</span>,
      price: "$0.001",
      change: <div className={`flex items-center text-[#53D258]`}> +32% </div>,
      amount: "$100",
    },
    {
      name: (
        <div className="flex items-center">
          <Avatar
            alt="Cardano"
            src={require("../../../../public/images/cardano.png")}
            sx={{ width: 24, height: 24, marginRight: "10px" }}
          />
          <span>Cardano</span>
        </div>
      ),
      code: <span className="text-[#626262]">ADA</span>,
      price: "$332",
      change: <div className={`flex items-center text-[#53D258]`}> +32% </div>,
      amount: "$100",
    },

    {
      collapse: true,
      name: (
        <div className="flex items-center">
          <Avatar
            alt="NFT"
            src={require("../../../../public/images/nft.png")}
            sx={{ width: 24, height: 24, marginRight: "10px" }}
          />
          <span>NFT</span>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              viewN(!nft);
              const { clientWidth = 0 }: { clientWidth?: number } = document?.querySelector('.mainTable') || {}

              setNfts(clientWidth);
            }}
          >
            {nft ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </IconButton>
        </div>
      ),
      code: (
        <div>
          <AvatarGroup max={3}>
            <Avatar
              alt="one"
              sx={{ width: 30, height: 30 }}
              src={require("../../../../public/images/nft.png")}
            />
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt="two"
              src={require("../../../../public/images/cardano.png")}
            />
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt="three"
              src={require("../../../../public/images/terra.png")}
            />
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt="four"
              src={require("../../../../public/images/bnb.png")}
            />
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt="five"
              src={require("../../../../public/images/eth.png")}
            />
          </AvatarGroup>
        </div>
      ),
      price: "20 - 10,000",
      change: <div className={`flex items-center text-[#53D258]`}> +3 </div>,
      amount: 10,
    }
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    width: "50%",
    maxWidth: 600,
    p: 4,
  };

  return (
    <div className="dashbody h-[calc(100%-75px)] pt-[75px] 2sm:pr-1 flex px-5 pb-5">
      {(loading1 || loading2) && <Loader />}

      {(!loading1 && !loading2) && (<Fragment>

        <div className="mr-[20px] 2sm:mr-0 h-full pb-1 pt-5 pr-2 w-full cusscroller overflow-y-scroll">
          <svg
            style={{
              width: 0,
              height: 0,
              position: "absolute",
            }}
            aria-hidden="true"
            focusable="false"
          >
            <linearGradient id="green" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="30%" stopColor="rgba(83, 210, 87, 0.6)" />
              <stop offset="70%" stopColor="rgba(83, 210, 87, 0.3)" />
              <stop offset="100%" stopColor="rgba(83, 210, 87, 0.01)" />
            </linearGradient>
          </svg>

          <svg
            style={{
              width: 0,
              height: 0,
              position: "absolute",
            }}
            aria-hidden="true"
            focusable="false"
          >
            <linearGradient id="red" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="30%" stopColor="rgba(124, 36, 36, 0.6)" />
              <stop offset="70%" stopColor="rgba(124, 36, 36, 0.3)" />
              <stop offset="100%" stopColor="rgba(124, 36, 36, 0.01)" />
            </linearGradient>
          </svg>
          <div className="w-full flex overflow-y-hidden overflow-x-scroll pb-[11px] cusscroller">
            <div className="flex flex-col mr-7 justify-center relative">
              <div className="w-[227px] relative p-3 bg-[#F57059] rounded-[4px] flex justify-between flex-col h-[138px]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-white w-[32px] mr-3 h-[32px] rounded-[50%] flex items-center justify-center">
                      <FaWallet className="text-[#F57059]" size={15} />
                    </div>
                    <span className="text-white">Balance</span>
                  </div>

                  {/* <div className="w-[40px] h-[40px]">
                    <ResponsiveContainer height="100%" width="100%">
                      <AreaChart width={400} height={400} data={balance}>
                        <Area
                          type="monotone"
                          dataKey="amt"
                          strokeWidth={3}
                          fill={`url(#${change > 0 ? "green" : "red"
                            }) transparent`}
                          stroke={change > 0 ? "#53D258" : "#7c2424"}
                        />
                        <Tooltip />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div> */}
                </div>

                <div className="w-full">
                  <span className="block text-white font-bold text-[15px]">
                    ${BigNum(balance[0].amt, 5)}
                  </span>
                  {/* <span
                    style={{
                      color: change > 0 ? "#53D258" : "#7c2424",
                    }}
                    className={`block text-[13px]`}
                  >
                    {change > 0 ? "+" + change.toFixed(2) : change.toFixed(2)}%
                  </span> */}
                </div>
              </div>
            </div>

            <div className="w-[227px] p-3 bg-transparent border-solid border-[1px] rounded-[4px] flex justify-between flex-col h-[138px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-[#D0DBFF] w-[32px] mr-3 h-[32px] rounded-[50%] flex items-center justify-center">
                    <BsBoxArrowInDownLeft className="text-[#F57059]" size={15} />
                  </div>
                  <span className="text-black">Received</span>
                </div>

                <div className="w-[40px] h-[40px]">
                  <ResponsiveContainer height="100%" width="100%">
                    <AreaChart width={400} height={400} data={received}>
                      <Area
                        type="monotone"
                        dataKey="amt"
                        strokeWidth={3}
                        fill={`url(#${rchange > 0 ? "green" : "red"
                          }) transparent`}
                        stroke={rchange > 0 ? "#53D258" : "#7c2424"}
                      />
                      <Tooltip />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="w-full">
                <span className="block text-black font-bold text-[15px]">
                  ${received[0].amt}
                </span>
                <span
                  style={{
                    color: rchange > 0 ? "#53D258" : "#7c2424",
                  }}
                  className={`block text-[13px]`}
                >
                  {rchange > 0 ? "+" + rchange.toFixed(2) : rchange.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          {/* <div className="">
            <Button
              variant="contained"
              className="!bg-[#F57059] !hidden !mt-4 2sm:!block !py-[8px] !max-w-[520px] !m-auto !font-medium !capitalize"
              style={{
                fontFamily: "inherit",
              }}
              fullWidth
              onClick={handleOpen}
            >
              Transfer
            </Button>
          </div> */}

          <div className="bg-white mt-6 p-3 border-solid border-[1px] border-[#e3e3e3]">
            <div className="py-[10px]">
              <h2 className="text-[16px] font-bold text-bold">Portfolio</h2>
            </div>
            <TableContainer className="mainTable" sx={{ maxHeight: "auto" }}>
              <Table
                stickyHeader
                style={{
                  borderSpacing: "0px 12px",
                }}
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column, id) => (
                      <TableCell
                        key={column.id + "-" + id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        className="border-b-solid !text-[#A9A9A9]"
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, id) => {
                      return (
                        <Fragment key={id}>
                          <TableRow role="checkbox" tabIndex={-1}>
                            {columns.map((column, idd) => {
                              const value = row[column.id];
                              return (
                                <TableCell
                                  className="!border-[0px] !border-none"
                                  key={column.id + "-" + id}
                                  align={column.align}
                                  style={{
                                    background: "#f5f5f5",
                                    position: "relative",
                                    zIndex: 7 - idd,
                                    borderRadius:
                                      idd === 4
                                        ? "0px 6px 6px 0px"
                                        : idd
                                          ? 0
                                          : "6px 0px 0px 6px",
                                  }}
                                >
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>

                          {row["collapse"] !== undefined && (
                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={5}
                              >
                                <Collapse in={nft} timeout="auto" unmountOnExit>
                                  <Box
                                    sx={{ margin: 1 }}
                                  >
                                    <h2 className="text-[16px] font-bold text-bold">
                                      NFTs
                                    </h2>

                                    <div
                                      className="flex nfts cusscroller pb-[10px] w-full overflow-y-hidden overflow-x-scroll flex-nowrap mt-5"
                                      style={{
                                        maxWidth: nfts ? (nfts - 50) : 0
                                      }}
                                    >
                                      <div className="gridx item-center min-w-[256px] w-[256px] rounded-[16px] mr-3 overflow-hidden">
                                        <Image
                                          alt="something"
                                          src={require("../../../../public/images/art.png")}
                                          className="w-[256px] h-[210px] object-cover"
                                        />
                                        <div className="flex flex-col justify-between flex-start py-3 px-2 bg-[#f1f1f1a9]">
                                          <div className="flex justify-between">
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              0xf0...0f20
                                            </span>
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              MATIC
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between">
                                            <span className="block mb-1 font-semibold">
                                              Name Of Something
                                            </span>
                                            <div className="flex items-center">
                                              <Avatar
                                                alt="name of something"
                                                src={require("../../../../public/images/cardano.png")}
                                                sx={{
                                                  width: 15,
                                                  height: 15,
                                                  marginRight: "3px",
                                                }}
                                              />{" "}
                                              0.011
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="gridx item-center min-w-[256px] w-[256px] rounded-[16px] mr-3 overflow-hidden">
                                        <Image
                                          alt="something"
                                          src={require("../../../../public/images/art.png")}
                                          className="w-[256px] h-[210px] object-cover"
                                        />
                                        <div className="flex flex-col justify-between flex-start py-3 px-2 bg-[#f1f1f1a9]">
                                          <div className="flex justify-between">
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              0xf0...0f20
                                            </span>
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              MATIC
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between">
                                            <span className="block mb-1 font-semibold">
                                              Name Of Something
                                            </span>
                                            <div className="flex items-center">
                                              <Avatar
                                                alt="name of something"
                                                src={require("../../../../public/images/cardano.png")}
                                                sx={{
                                                  width: 15,
                                                  height: 15,
                                                  marginRight: "3px",
                                                }}
                                              />{" "}
                                              0.011
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="gridx item-center min-w-[256px] w-[256px] rounded-[16px] mr-3 overflow-hidden">
                                        <Image
                                          alt="something"
                                          src={require("../../../../public/images/art.png")}
                                          className="w-[256px] h-[210px] object-cover"
                                        />
                                        <div className="flex flex-col justify-between flex-start py-3 px-2 bg-[#f1f1f1a9]">
                                          <div className="flex justify-between">
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              0xf0...0f20
                                            </span>
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              MATIC
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between">
                                            <span className="block mb-1 font-semibold">
                                              Name Of Something
                                            </span>
                                            <div className="flex items-center">
                                              <Avatar
                                                alt="name of something"
                                                src={require("../../../../public/images/cardano.png")}
                                                sx={{
                                                  width: 15,
                                                  height: 15,
                                                  marginRight: "3px",
                                                }}
                                              />{" "}
                                              0.011
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="gridx item-center min-w-[256px] w-[256px] rounded-[16px] mr-3 overflow-hidden">
                                        <Image
                                          alt="something"
                                          src={require("../../../../public/images/art.png")}
                                          className="w-[256px] h-[210px] object-cover"
                                        />
                                        <div className="flex flex-col justify-between flex-start py-3 px-2 bg-[#f1f1f1a9]">
                                          <div className="flex justify-between">
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              0xf0...0f20
                                            </span>
                                            <span className="text-[#a1a1a1] text-[12px]">
                                              MATIC
                                            </span>
                                          </div>

                                          <div className="flex items-center justify-between">
                                            <span className="block mb-1 font-semibold">
                                              Name Of Something
                                            </span>
                                            <div className="flex items-center">
                                              <Avatar
                                                alt="name of something"
                                                src={require("../../../../public/images/cardano.png")}
                                                sx={{
                                                  width: 15,
                                                  height: 15,
                                                  marginRight: "3px",
                                                }}
                                              />{" "}
                                              0.011
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
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
          </div>
        </div>

        <div className="min-w-[337px] 2sm:hidden pt-5 h-full">
          <div className="px-4 pt-3 bg-white border-[1px] border-solid border-[#e3e3e3] rounded-[4px]">
            <h2 className="text-[18px] font-bold pb-[10px]">Pages</h2>
            {Boolean(links.length) && !loading2 && (
              <div className="py-2">
                {links.map(({ template_data, link, desc }: any, i: number) => {
                  let source = '';
                  if (template_data !== undefined) {
                    const { data: temp } = JSON.parse(template_data);
                    const { image } = temp;
                    source = image.src
                  }
                  return (<div key={i}>
                    <div className="border-b-[#f57059] border-b flex justify-between py-2">
                      <div className="flex">
                        <div className="i">
                          <Avatar sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#f57059',
                          }} src={source} variant='rounded'>{(
                            String(link).charAt(0) +
                            String(link).charAt(1)
                          ).toUpperCase()}</Avatar>
                        </div>
                        <div className="pl-2 flex flex-col">
                          <div className="font-bold text-[15px]">{link}</div>
                          <div className="font-nomal text-[10px]">{desc ? desc : ""}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center w-full">
                          <Link href={`/user/${link.toLowerCase()}/edit`}>
                            <a title='Edit Page' rel="noreferrer">
                              <IconButton color="inherit"
                                size={"large"}
                                sx={{ color: "#f36e57b8" }}>
                                <MdMode size={20} />
                              </IconButton>
                            </a>
                          </Link>

                          <Link href={`/user/${link.toLowerCase()}`}>
                            <a title="View Page" target="_blank" rel="noreferrer">
                              <IconButton
                                color="inherit"
                                size={"large"}
                                sx={{ color: "#f36e57b8" }}
                              >
                                <MdPreview size={20} />{" "}
                              </IconButton>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
            )}
            <Link href={`/dashboard/links/new`}>
              <div className="py-4 flex justify-center">
                <Button
                  variant="contained"
                  className="!bg-[#F57059] !py-[13px] !font-medium !capitalize"
                  style={{
                    fontFamily: "inherit",
                  }}
                  fullWidth
                >
                  New Page <BsArrowRight className="ml-3 font-medium" size={18} />
                </Button>
              </div>
            </Link>
          </div>
          {/* <div className="px-4 pt-3 pb-5 mb-10 bg-white border-[1px] border-solid border-[#E3E3E3] rounded-[4px]">
          <h2 className="text-[18px] font-bold text-bold pb-[10px]">
            Quick Transfer
          </h2>
          <div className="py-2">
            <TextField
              value={amount}
              onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const val = e.target.value;
              setAmount(parseFloat(val.replace(/[^\d.]/g, "")));
              }}
              label={"Amount"}
              fullWidth
              className="amount"
              id="Amount"
            />
          </div>
          <div className="py-2">
            <TextField
              label={"Account/Address"}
              fullWidth
              className="account"
              value={receiver}
              onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setReceiver(e.target.value)}
              id="account"
            />
          </div>
          <div className="py-2 flex justify-center">
            <Button
              onClick={() => fetched()}
              variant="contained"
              className="!bg-[#F57059] !py-[13px] !font-medium !capitalize"
              style={{
                fontFamily: "inherit",
              }}
              fullWidth
            >
              Transfer <BsArrowRight className="ml-3 font-medium" size={18} />
            </Button>
          </div>
        </div> */}
        </div></Fragment>)}

    </div>
  );
};

export default DashHome;
