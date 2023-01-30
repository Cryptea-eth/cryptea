import {
  Switch,
  TextField,
  AlertTitle,
  Alert,
  Tooltip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Head from "next/head";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import { Avatar, IconButton, Button } from "@mui/material";
import { FiSettings, FiShare2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { MdArrowBackIos, MdClose, MdInfo, MdLink } from "react-icons/md";
import Select, { createFilter } from "react-select";
import { TbApiApp } from "react-icons/tb";
import { dash, DashContext } from "../../../app/contexts/GenContext";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { initD } from "../../../app/components/elements/dashboard/link/data";
import ShareLink from "../../../app/components/elements/dashboard/linkOverview/share";
import { BiEnvelope, BiPhoneCall, BiUserCircle } from "react-icons/bi";
import {
  CryptoList,
  inputsList,
} from "../../../app/contexts/Cryptea/connectors/chains";
import { token } from "../../../app/contexts/Cryptea/types";
import { AxiosError } from "axios";
import { GiTwoCoins } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import { RiCoinLine } from 'react-icons/ri'
import Loader from "../../../app/components/elements/loader";
import CrypSwitch from "../../../app/components/elements/CrypSwitch";

const Settings = () => {
  const { isAuthenticated, validator } = useCryptea();

  const [isLoading, setLoading] = useState<boolean>(true);


  const router = useRouter();

  const [social, toggleSocial] = useState<boolean>(false);

  const { slug } = router.query;

  const { sidebar }: dash = useContext(DashContext);

  const [data, setData] = useState<any>({});

  const [userLk, setUserLk] = useState<string>("");

  const [userx, setUserX] = useState<any>({});

  const [min, setMin] = useState<boolean>(false);
  const [max, setMax] = useState<boolean>(false);

  type Amt = string | number;

  interface formData {
    title: string;
    desc: string;
    rdata: { label: JSX.Element; value: string }[];
    acceptedCrypto: token[];
    amountOption: number[];
    redirect: string;
    amount: Amt;
    minAmt: Amt;
    type: string;
    maxAmt: Amt;
    [index: string]: any;
  }

  const [genError, setGenError] = useState<string>("");

  interface formError {
    title: string;
    desc: string;
    rdata: string;
    amountOption: string;
    minAmt: string;
    maxAmt: string;
    type: string;
    amount: string;
    acceptedCrypto: string;
    redirect: string;
    [index: string]: string;
  }

  const dataimg: { [index: string]: JSX.Element } = {
    name: <BiUserCircle className="mr-[6px]" size={20} />,
    email: <BiEnvelope className="mr-[6px]" size={20} />,
    phone: <BiPhoneCall className="mr-[6px]" size={20} />,
  };

  const [error, setErr] = useState<formError>({
    title: "",
    desc: "",
    acceptedCrypto: "",
    rdata: "",
    amountOption: "",
    redirect: "",
    type: "",
    minAmt: "",
    maxAmt: "",
    amount: "",
  });

  const setError = (obj?: object) => {
    if(obj !== undefined){
  
      setErr({ ...error, ...obj });
    
    }else{
      setErr({
        ...error,
        title: "",
        desc: "",
        acceptedCrypto: "",
        rdata: "",
        amountOption: "",
        redirect: "",
        minAmt: "",
        maxAmt: "",
        type: "",
        amount: "",
      })
    }

  };

  const [success, setSuccess] = useState<boolean>(false);

  const checkError = (arr?: string[]): boolean => {
    let values: string[] = Object.values(error);

    if (arr !== undefined) {
      values = arr.map((f) => error[f] || "");
    }

    const valid = values.filter((e) => e.length);

    if (valid.length) {
      return true;
    }

    return false;
  };

  const [formdata, setForm] = useState<formData>({
    title: "",
    desc: "",
    acceptedCrypto: [],
    rdata: [],
    type: "",
    amountOption: [],
    amount: "",
    minAmt: 0,
    maxAmt: "",
    redirect: "",
  });

  const setFormData = (obj: object) => {
    setForm({ ...formdata, ...obj });
    setGenError("");
    setError();
  };

 
  const [amountOpt, setAmountOpt] = useState<Amt>("");

  const pushMulti = (num: number) => {
    let set = true;
    let error = false;
    const values = formdata["amountOption"];

    values.forEach((vv: number) => {
      if (Math.floor(vv) == Math.floor(num)) {
        if (vv != num) {
          error = true;
        }
        set = false;
      }
    });

    if (set) {
      values.push(num);

      const ready = values.sort((a, b) => a - b);

      setError({
        amountOption: "",
      });

      setFormData({
        amountOption: ready,
      });

      setAmountOpt("");
    }

    if (error) {
      return false;
    }

    return true;
  };

  const addmultiprice = (value: string | number) => {
    let val: number;

    if (typeof value == "string") {
      val = Number(value.replace(/[^\d.]/g, ""));
    } else {
      val = value;
    }

    if (Boolean(val)) {
      if (Boolean(formdata["maxAmt"]) || Boolean(formdata["minAmt"])) {
        if (
          Boolean(formdata["minAmt"]) &&
          val < Number(formdata["minAmt"])
        ) {
          setError({
            amountOption: "Amount cannot be lower than minimum amount",
          });
        } else if (
          Boolean(formdata["maxAmt"]) &&
          val > Number(formdata["maxAmt"])
        ) {
          setError({
            amountOption: "Amount cannot be lower than maximum amount",
          });
        } else {
          if (!pushMulti(val)) {
            setError({
              amountOption: "Amount exists already eg 10 is too close to 10.5",
            });
          }
        }
      } else if (!Boolean(formdata["amount"])) {
        if (!pushMulti(val)) {
          setError({
            amountOption: "Amount exists already eg 10 is too close to 10.5",
          });
        }
      }
    } else {
      setError({
        amountOption: "Cannot set a null number to Amount options",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setUserX(await "user".get("*", true));

      const {
        link: mDx,
        user,
        onetime,
        sub,
        views,
      } = await initD(String(slug).toLowerCase());

      setUserLk(`${window.location.origin}/pay/${slug}`);

      if (user["owner"]) {
        let src = "";

        let template = "";

        if (mDx.template_data !== undefined) {
          const { data: tdata, name } = JSON.parse(mDx.template_data);

          const { src: srcc } = (typeof tdata == 'string' ? JSON.parse(tdata) : tdata).image;

          src = srcc;

          template = name;
        }

        setData({
          id: mDx.id,

          username: user.username,

          src,

          redirect: mDx.redirect,

          data: mDx.data,

          img: user.img,

          title: mDx.title,

          desc: mDx.desc,

          template,

          link: mDx.link,

          type: mDx.type,

          onetime,

          subscribers: sub,

          views,
        });


        const rdata = JSON.parse(mDx.rdata.toLowerCase())["onetime"].map(
          (v: string, i: number) => ({
            label: (
              <div key={i} className="flex items-center">
                {dataimg[v]} <span className="capitalize">{v}</span>
              </div>
            ),
            value: v
          })
        );

        let amount,
          maxx = "",
          minn = 0;

        if (data.amount == "variable") {
          amount = "";
        } else if (!Number(data.amount)) {
          amount = data.amount;
        } else {
          const amt = JSON.parse(data.amount);

          if (amt[0] !== undefined) {
            setMin(true)
            minn = amt[0];
          }

          if (amt[1] !== undefined) {
            setMax(true)
            maxx = amt[1];
          }
        }

        const acceptedCrypto = JSON.parse(mDx.data || "[]");

        
        setFormData({
          redirect: mDx.required,
          type: mDx.type,
          desc: mDx.desc,
          minAmt: minn,
          acceptedCrypto: CryptoList.filter(
            (v) => acceptedCrypto.indexOf(v.value) != -1
          ),
          amount,
          maxAmt: maxx,
          rdata,
          title: mDx.title,
          amountOption: JSON.parse(mDx.amountMulti),
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

  const options = [...inputsList];

  const acceptOptions = [...CryptoList];

  const [saving, saveData] = useState<boolean>(false);  

  const validateFields = async () => {

    const payload: { [index: string]: any } = {};

    if (saving) {
      return;
    }

    saveData(true);

    setSuccess(false);
    setError();
    setGenError("");

    window.scroll(0, 0);

    if (Boolean(formdata["redirect"])) {
      if (!validator.isURL(formdata["redirect"])) {
        setError({
          redirect: "A valid URL is required for Redirect Url",
        });
        saveData(false) 
        return;
      } else {
        
        payload["redirect"] = formdata["redirect"];

      }
    }

    let amount: string | number | (string | number)[] = "variable";

    if (Boolean(Number(formdata["amount"]))) {
      amount = formdata["amount"];
    }

    if (
      (Boolean(Number(formdata["maxAmt"])) && max) ||
      (Boolean(Number(formdata["minAmt"])) && min)
    ) {
      amount = [];

      if (max) {
        amount[1] = formdata["maxAmt"];
      }

      if (min) {
        amount[0] = formdata["minAmt"];
      }
    }

    const accepted = JSON.stringify(
      formdata["acceptedCrypto"].map((v: token) => v.value)
    );

    const rdata = formdata["rdata"].map((v) => (v.value).toLowerCase());

    if (Boolean(formdata.title)) payload["title"] = formdata.title;
    if (Boolean(formdata.desc)) payload["desc"] = formdata.desc;

    if (Boolean(formdata.amountOption))
      payload["amountMulti"] = JSON.stringify(formdata.amountOption.filter((a) => Number(a)));


    try {

      await `links/${data.id}`.update({
        ...payload,
        amount,
        type: formdata.type,
        accepted,
        rdata: JSON.stringify({ sub: rdata, onetime: rdata }),
      });

      saveData(false);
      setSuccess(true);
    } catch (err) {
      const error = err as any;

      // console.log(error, "oer");
      saveData(false);

      if (error.response) {
        setGenError(error.response.data.message);
      } else if (error.message !== undefined) {
          setGenError(error.message)
      }else {
        setGenError("Something went wrong please try again");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Settings | {slug} | Cryptea</title>
      </Head>

      {isLoading && <Loader />}

      {!isLoading && (
        <div className="h-full transition-all delay-500 dash w-full bg-[#fff] flex">
          <Sidebar page={"link"} />

          <div
            className={`body pb-6 transition-all delay-500 ${
              sidebar?.openPage ? "pl-[257px]" : "pl-[75px]"
            } w-full h-full 2sm:!pl-[75px]`}
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
                  src={Boolean(data.img) ? data.img : undefined}
                  sx={{
                    width: 45,
                    height: 45,
                    marginLeft: "10px",
                    fontWeight: "bold",
                    bgcolor: !Boolean(data.img) ? "#f57059" : undefined,
                  }}
                >
                  {data.username?.charAt(0).toUpperCase()}
                </Avatar>
              </div>
            </div>

            <div
              style={{
                maxWidth: !sidebar?.openPage ? "831px" : "661px",
              }}
              className="mb-6 mt-3 mx-auto 2sm:px-3"
            >
              <div className="flex relative items-center">
                {" "}
                <Link href={`/pay/${slug}/overview`}>
                  <a>
                    <IconButton className="absolute bottom-[0px]">
                      <MdArrowBackIos
                        color={"rgb(32,33,36)"}
                        className="relative left-[4px]"
                        size={18}
                      />
                    </IconButton>
                  </a>
                </Link>{" "}
                <h1 className="text-[rgb(32,33,36)] capitalize mb-[5px] font-[500] flex items-center text-[1.5rem] leading-[2.45rem] mx-auto w-fit relative text-center">
                  <>
                    <FiSettings className="mr-2" size={23} />
                    Link Settings
                  </>
                </h1>
              </div>

              <p
                style={{
                  maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                }}
                className="text-[1.2rem] capitalize text-center text-[rgb(95,99,104)] leading-[1.25rem] tooltiprep block"
              >
                Change everything about this link
              </p>

              {success && (
                <Alert className="w-full mt-3" severity="success">
                  <AlertTitle>Link updated successfully</AlertTitle>
                </Alert>
              )}

              {(checkError() || Boolean(genError.length)) && (
                <Alert className="w-full font-bold mt-3 mb-2" severity="error">
                  {genError.length ? genError : "Incorrect input data"}
                </Alert>
              )}

              <div className="col-span-full rounded-[8px] bg-white overflow-hidden mt-3">
                <div className="px-6 pt-6 relative pb-3">
                  <div className="">
                    <div id="basic" className="mb-5">
                      <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.2rem]">
                        Basic Details
                      </h2>
                      <span>Change Details of your link</span>
                    </div>

                    <div className="w-full">
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Title</p>
                      </div>
                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <TextField
                              value={formdata["title"]}
                              onChange={(e: any) => {
                                setFormData({
                                  title: e.target.value,
                                });
                              }}
                              className="bg-[white]"
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#f57059",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#f57059 !important`,
                                  },
                              }}
                              fullWidth
                              placeholder="Link title"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Description</p>
                      </div>
                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <TextField
                              multiline
                              value={formdata["desc"]}
                              onChange={(e: any) => {
                                setFormData({
                                  desc: e.target.value,
                                });
                              }}
                              minRows={3}
                              className="bg-[white]"
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#f57059",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#f57059 !important`,
                                  },
                              }}
                              fullWidth
                              placeholder="Link Description"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Link Type</p>
                      </div>
                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <ToggleButtonGroup
                              value={formdata.type}
                              sx={{
                                justifyContent: "space-between",
                                width: "100%",
                                "& .Mui-selected": {
                                  backgroundColor: `rgba(245, 112, 89, 0.8) !important`,
                                  color: `#fff !important`,
                                },
                                "& .MuiButtonBase-root:first-of-type": {
                                  marginLeft: "0px !important",
                                },
                                "& .MuiButtonBase-root": {
                                  padding: "10px 15px !important",
                                },
                                "& .MuiToggleButtonGroup-grouped": {
                                  borderRadius: "4px !important",
                                  minWidth: "fit-content",
                                  marginLeft: 3,
                                  backgroundColor: "#1212121a",
                                  border: "none",
                                },
                              }}
                              exclusive
                              className="w-full cusscroller overflow-y-hidden mb-2 pb-1"
                              onChange={(e: any) => {
                                if (e.target.value !== undefined) {
                                  setFormData({
                                    ...data,
                                    type: e.target.value,
                                  });
                                }
                              }}
                            >
                              <ToggleButton
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                                value={"onetime"}
                              >
                                <GiTwoCoins className="mr-2" size={20} />{" "}
                                Onetime
                              </ToggleButton>
                              <ToggleButton
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                                value={"sub"}
                              >
                                <FaCoins className="mr-2" size={20} />{" "}
                                Subscription
                              </ToggleButton>
                              <ToggleButton
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                                value={"both"}
                              >
                                <RiCoinLine className="mr-2" size={20} />{" "}
                                Onetime & Subscription
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Required Data</p>
                      </div>
                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <Select
                              isClearable={true}
                              name="Required Inputs"
                              placeholder={"Inputs..."}
                              options={options}
                              styles={{
                                option: (provided, state) => {
                                  return {
                                    ...provided,
                                    backgroundColor: state.isSelected
                                      ? "#f57059"
                                      : "transparent",
                                    zIndex: 1000,
                                    position: "relative",
                                    "&:active": {
                                      backgroundColor: "#f57059",
                                    },
                                    "&:hover": {
                                      backgroundColor: state.isSelected
                                        ? undefined
                                        : `#f5705929`,
                                    },
                                  };
                                },
                                container: (provided, state) => ({
                                  ...provided,
                                  minHeight: "58px",
                                  width: "100%",
                                  "& .select__value-container": {
                                    padding: "11.5px 14px",
                                  },
                                  "& .select__control:hover": {
                                    borderColor: "#121212",
                                  },
                                  "& .select__control--is-focused": {
                                    borderWidth: "2px",
                                    borderColor: `#f57059 !important`,
                                    boxShadow: "none",
                                  },
                                }),
                              }}
                              isMulti
                              value={formdata["rdata"]}
                              onChange={(e: any) => {
                                let p: boolean = true;
                                // console.log(e, "wo");
                                if (p) {
                                  setFormData({
                                    rdata: e,
                                  });
                                }
                              }}
                              classNamePrefix="select"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="mb-5" id="amount">
                      <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.2rem]">
                        Amount Config
                      </h2>
                      <span>Change link Amount Settings</span>
                    </div>

                    <div className="w-full">
                      <Tooltip
                        placement="bottom"
                        arrow
                        title=
                          {"Crypto accepted by link for payment, leaving this empty makes all supported crypto valid as payment.  Please note that if your account is live and only testnet tokens are selected, link would only be assessible by you."}
                        
                      >
                        <div className="font-semibold w-fit cursor-default mt-4 flex items-center mb-2 text-[#525252]">
                          <p className="block mr-1">Accepted Crypto</p>
                          <MdInfo size={20} />
                        </div>
                      </Tooltip>

                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <Select
                              isClearable={true}
                              filterOption={createFilter({
                                stringify: (option) =>
                                  `${option.value} ${option.data.name}`,
                              })}
                              name="Accepted Crypto"
                              placeholder={"Crypto..."}
                              options={acceptOptions}
                              styles={{
                                option: (provided, state) => {
                                  return {
                                    ...provided,
                                    backgroundColor: state.isSelected
                                      ? "#f57059"
                                      : "transparent",
                                    zIndex: 1000,
                                    position: "relative",
                                    "&:active": {
                                      backgroundColor: "#f57059",
                                    },
                                    "&:hover": {
                                      backgroundColor: state.isSelected
                                        ? undefined
                                        : `#f5705929`,
                                    },
                                  };
                                },
                                container: (provided, state) => ({
                                  ...provided,
                                  minHeight: "58px",
                                  width: "100%",
                                  "& .select__value-container": {
                                    padding: "11.5px 14px",
                                  },
                                  "& .select__control:hover": {
                                    borderColor: "#121212",
                                  },
                                  "& .select__control--is-focused": {
                                    borderWidth: "2px",
                                    borderColor: `#f57059 !important`,
                                    boxShadow: "none",
                                  },
                                }),
                              }}
                              isMulti
                              value={formdata["acceptedCrypto"]}
                              onChange={(e: any) => {
                                setFormData({
                                  acceptedCrypto: e,
                                });
                              }}
                              classNamePrefix="select"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Amount(USD)</p>
                      </div>
                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <TextField
                              value={formdata["amount"]}
                              helperText={
                                Boolean(error["amount"])
                                  ? error["amount"]
                                  : "Leaving this empty, makes any amount valid"
                              }
                              error={Boolean(error["amount"])}
                              className="bg-[white]"
                              onChange={(txt: any) => {
                                const val = txt.target.value;

                                setFormData({
                                  amount: val.replace(/[^\d]/g, ""),
                                });
                              }}
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#f57059",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#f57059 !important`,
                                  },
                              }}
                              fullWidth
                              placeholder="Amount link accepts"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setMin(!min);
                      }}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Specify Minimum amount</p>
                      </div>
                      <div className="">
                        <CrypSwitch
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setMin(e.target.checked);
                          }}
                          checked={min}
                          inputProps={{ "aria-label": "minimum amount" }}
                        />
                      </div>
                    </div>

                    {min && (
                      <div className="w-full">
                        <div className="">
                          <div className="rounded-md">
                            <div className="flex">
                              <TextField
                                value={formdata["minAmt"]}
                                helperText={error["minAmt"]}
                                error={Boolean(error["minAmt"])}
                                className="bg-[white]"
                                onChange={(txt: any) => {
                                  const val = txt.target.value;

                                  setFormData({
                                    minAmt: val.replace(/[^\d.]/, ""),
                                  });
                                }}
                                sx={{
                                  "& .Mui-focused.MuiFormLabel-root": {
                                    color: "#f57059",
                                  },
                                  "& .MuiInputLabel-root": {
                                    fontWeight: "600",
                                    color: "#121212",
                                  },
                                  "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
                                    {
                                      borderColor: `#f57059 !important`,
                                    },
                                }}
                                fullWidth
                                variant="standard"
                                placeholder="Minimum Amount"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        setMax(!max);
                      }}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="font-semibold mt-4 mb-2 text-[#525252]">
                        <p>Specify Maximum amount</p>
                      </div>
                      <div className="">
                        <CrypSwitch
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setMax(e.target.checked);
                          }}
                          checked={max}
                          inputProps={{ "aria-label": "maximum amount" }}
                        />
                      </div>
                    </div>

                    {max && (
                      <div className="w-full">
                        <div className="">
                          <div className="rounded-md">
                            <div className="flex">
                              <TextField
                                variant="standard"
                                className="bg-[white]"
                                value={formdata["maxAmt"]}
                                helperText={error["maxAmt"]}
                                error={Boolean(error["maxAmt"])}
                                onChange={(txt) => {
                                  const val = txt.target.value;

                                  setFormData({
                                    maxAmt: val.replace(/[^\d]/g, ""),
                                  });
                                }}
                                sx={{
                                  "& .Mui-focused.MuiFormLabel-root": {
                                    color: "#f57059",
                                  },
                                  "& .MuiInputLabel-root": {
                                    fontWeight: "600",
                                    color: "#121212",
                                  },
                                  "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
                                    {
                                      borderColor: `#f57059 !important`,
                                    },
                                }}
                                fullWidth
                                placeholder="Maximum Amount"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="w-full">
                      <div className="font-semibold mt-4 mb-1 text-[#525252]">
                        <p>Amount Options</p>
                      </div>

                      <div className="flex cusscroller overflow-x-scroll overflow-y-hidden items-center">
                        {formdata["amountOption"].map(
                          (v: string | number | undefined, i: number) => {
                            if (v !== undefined) {
                              return (
                                <button
                                  key={i}
                                  className="min-w-[70px] border-solid bg-white cursor-default p-[10px] border border-[#7c7c7c] rounded-[3px] flex justify-center text-[#7c7c7c] mr-3 items-center"
                                >
                                  ${v}
                                  <MdClose
                                    className="ml-2 cursor-pointer hover:text-[#121212]"
                                    size={17}
                                    onClick={() => {
                                      const newD = formdata.amountOption;

                                      delete newD[i];

                                      setFormData({
                                        amountOption: newD,
                                      });
                                    }}
                                  />
                                </button>
                              );
                            }
                          }
                        )}
                      </div>

                      <TextField
                        sx={{
                          "& .Mui-focused.MuiFormLabel-root": {
                            color: "#f57059",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#f57059 !important`,
                          },
                        }}
                        id="amountOptions"
                        value={amountOpt}
                        helperText={error["amountOption"]}
                        error={Boolean(error["amountOption"])}
                        placeholder="Enter Amount"
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          const val = e.target.value;
                          const sval = val.replace(/[^\d.]/g, "");
                          setAmountOpt(sval);
                        }}
                        onKeyUp={(e: any) => {
                          const val = e.target.value;
                          const sval = val.replace(/[^\d.]/g, "");
                          setAmountOpt(sval);

                          if (e.keyCode == 13 || e.which === 13) {
                            if (formdata["amountOption"].length) {
                              addmultiprice(amountOpt);
                            }
                          }
                        }}
                        onBlur={(e: any) => {
                          const val = e.target.value;
                          const sval = val.replace(/[^\d.]/g, "");

                          setAmountOpt(sval);

                          if (formdata["amountOption"].length || true) {
                            addmultiprice(amountOpt);
                          }
                        }}
                        name="amountOptions"
                        type="text"
                        fullWidth
                      />
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="mb-5" id="payment">
                      <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.2rem]">
                        Complete Payment
                      </h2>
                      <span>What to do after payment is done</span>
                    </div>

                    <div className="w-full">
                      <Tooltip
                        placement="bottom"
                        arrow
                        title={
                          "Link to redirect to if payment is successful, Can be overwitten through API"
                        }
                      >
                        <div className="font-semibold w-fit cursor-default mt-4 flex items-center mb-2 text-[#525252]">
                          <p className="block mr-1">Redirect URL</p>
                          <MdInfo size={20} />
                        </div>
                      </Tooltip>

                      <div className="">
                        <div className="rounded-md">
                          <div className="flex">
                            <TextField
                              className="bg-[white]"
                              value={formdata.redirect}
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#f57059",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#f57059 !important`,
                                  },
                              }}
                              onChange={(txt) => {
                                const redirect = txt.target.value;

                                setFormData({ redirect });
                              }}
                              fullWidth
                              placeholder="https://cryptea.me"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="button py-2 bg-white mt-2 bottom-0 w-full sticky flex items-center justify-center">
              <Button
                onClick={validateFields}
                className="!py-2 !font-bold !capitalize !flex !items-center !text-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
              >
                {saving ? (
                  <>
                    <div className="mr-3 h-[20px] text-[#fff]">
                      <CircularProgress
                        color={"inherit"}
                        className="!w-[20px] !h-[20px]"
                      />
                    </div>{" "}
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <MdLink size={25} className="mr-1" />{" "}
                    <span>Update Link</span>
                  </>
                )}
              </Button>
            </div>
          
            
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
