import {
  Switch,
  TextField,
  AlertTitle,
  Alert,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import Head from "next/head";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import { Avatar, IconButton, Button } from "@mui/material";
import { FiSettings, FiShare2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { MdClose, MdInfo, MdLink } from "react-icons/md";
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
    minAmt: "",
    maxAmt: "",
    amount: "",
  });

  const setError = (obj: object) => {
    setErr({ ...error, ...obj });
    setLoad(false);
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

  let amount, maxx = '', minn = 0;

  if (data.amount == "variable") {
    amount = "";
  }else if (!Number(data.amount)) {
    amount = data.amount;
  }else{
    const amt = JSON.parse(data.amount);

    if(amt[0] !== undefined){
        minn = amt[0];
    }

    if (amt[1] !== undefined) {
      maxx = amt[1];
    }
  }



  const [formdata, setForm] = useState<formData>({
    title: data.title,
    desc: data.desc,
    acceptedCrypto: JSON.parse(data.data || "[]"),
    rdata: [],
    amountOption: data.amountMulti,
    amount,
    minAmt: minn,
    maxAmt: maxx,
    redirect: data.redirect,
  });

  const setFormData = (obj: object) => {
    setForm({ ...formdata, ...obj });
    setGenError("");
    setError({
      title: "",
      desc: "",
      acceptedCrypto: "",
      rdata: "",
      amountOption: "",
      redirect: "",
      minAmt: "",
      maxAmt: "",
      amount: "",
    });
  };

  const [loading, setLoad] = useState<boolean>(false);

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
          val < (formdata["minAmt"] as number | string)
        ) {
          setError({
            amountOption: "Amount cannot be lower than minimum amount",
          });
        } else if (
          Boolean(formdata["maxAmt"]) &&
          val > (formdata["maxAmt"] as number | string)
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

  const validateFields = async () => {
    const payload: { [index: string]: any } = {};

    setSuccess(false);
    setLoad(true);

    window.scroll(0, 0);
    if (Boolean(formdata["redirect"].length)) {
      if (!validator.isURL(formdata["redirect"])) {
        setError({
          redirect: "A valid URL is required for Redirect Url",
        });

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

    const rdata = formdata["rdata"].map((v) => v.value);

    if (Boolean(formdata.title)) payload["title"] = formdata.title;
    if (Boolean(formdata.desc)) payload["desc"] = formdata.desc;
    if (Boolean(formdata.amountOption))
      payload["amountMulti"] = JSON.stringify(formdata.amountOption);

    try {

      await `links/${data.id}`.update({
        ...payload,
        amount,
        type: data.type,
        accepted,
        rdata: JSON.stringify({ sub: rdata, onetime: rdata }),
      });

      setLoad(false);
      setSuccess(true);
    } catch (err) {
      const error = err as any;

      console.log(error, 'oer')

      setLoad(false);

      if (error.response) {
        setGenError(error.response.data.message);
      } else {
        setGenError("Something went wrong please try again");
      }

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


      setUserLk(`${window.location.origin}/user/${slug}`);

      if (user["owner"]) {
        let src = "";

        let template = "";

        if (mDx.template_data !== undefined) {
          const { data: tdata, name } = JSON.parse(mDx.template_data);

          const { src: srcc } = tdata.image;

          src = srcc;

          template = name;
        }

        console.log(mDx)

        setData({
          id: mDx.id,

          src,

          accountMulti: mDx.accountMulti,

          redirect: mDx.redirect,

          rdata: mDx.rdata,

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

        setLoading(false);
      } else {
        router.push(`/user/${String(slug).toLowerCase()}`);
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

  return (
    <>
      <Head>
        <title>Settings | {slug} | Cryptea</title>
      </Head>

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
              userLk: `${window.location.origin}/user/${slug}`,
              slug: String(slug),
            }}
            toggleSocial={(ee: boolean) => toggleSocial(ee)}
            open={social}
          />

          <div className="pl-5 pr-2 flex items-center justify-between min-h-[75px] py-3 border-b sticky top-0 bg-white z-10 w-full">
            <div className="text-truncate capitalize text-[rgb(32,33,36)] text-[19px] mr-1">
              <Link href={`/user/${slug}/overview`}>
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
            <h1 className="text-[rgb(32,33,36)] capitalize mb-[5px] font-[500] flex items-center text-[1.5rem] leading-[2.45rem] mx-auto w-fit relative text-center">
              <>
                <FiSettings className="mr-2" size={23} />
                  Link Settings
              </>
            </h1>

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
                    <span>Change details of your link</span>
                  </div>

                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-2 text-[#525252]">
                      <p>Title</p>
                    </div>
                    <div className="">
                      <div className="rounded-md">
                        <div className="flex">
                          <TextField
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
                              setFormData({
                                rdata: e,
                              });
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
                    <span>Change link amount settings</span>
                  </div>

                  <div className="w-full">
                    <Tooltip
                      placement="bottom"
                      arrow
                      title={
                        "Crypto accepted by link for payment, leaving this empty makes all supported crypto valid as payment"
                      }
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
                      <p>Specify Minimum Amount</p>
                    </div>
                    <div className="">
                      <Switch
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setMin(e.target.checked);
                        }}
                        checked={min}
                        inputProps={{ "aria-label": "minimum amount" }}
                        sx={{
                          "&& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#f57059",
                          },
                          "&& .Mui-checked+.MuiSwitch-track": {
                            backgroundColor: "#f57059",
                          },
                        }}
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
                      <p>Specify Maximum Amount</p>
                    </div>
                    <div className="">
                      <Switch
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setMax(e.target.checked);
                        }}
                        checked={max}
                        inputProps={{ "aria-label": "maximum amount" }}
                        sx={{
                          "&& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#f57059",
                          },
                          "&& .Mui-checked+.MuiSwitch-track": {
                            backgroundColor: "#f57059",
                          },
                        }}
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
              onClick={() => {
                if (!loading) {
                  validateFields();
                }
              }}
              className="!py-2 !font-bold !capitalize !flex !items-center !text-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
            >
              {loading ? (
                <>
                  <div className="mr-3 h-[20px] text-[#fff]">
                    <CircularProgress
                      color={"inherit"}
                      className="!w-[20px] !h-[20px]"
                    />
                  </div>{" "}
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <MdLink size={25} className="mr-1" /> <span>Update Link</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
