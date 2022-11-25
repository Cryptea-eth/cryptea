import { Switch, TextField, Tooltip } from "@mui/material";
import Head from "next/head";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import { Avatar, IconButton } from "@mui/material";
import NumberFormat from "react-number-format";
import { FiSettings, FiShare2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { MdArrowBackIos, MdInfo, MdLink } from "react-icons/md";
import Select from "react-select";
import { TbApiApp } from "react-icons/tb";
import { dash, DashContext } from "../../../app/contexts/GenContext";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { CiSettings } from "react-icons/ci";
import { initD } from "../../../app/components/elements/dashboard/link/data";
import sortData, {
  totSub,
} from "../../../app/components/elements/dashboard/linkOverview/generateData";
import ShareLink from "../../../app/components/elements/dashboard/linkOverview/share";
import { BiEnvelope, BiPhoneCall, BiUserCircle } from "react-icons/bi";

const Settings = () => {
  const { isAuthenticated } = useCryptea();
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

        setData({
          src,

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

  const options = [
    {
      label: (
        <div className="flex items-center">
          <BiUserCircle className="mr-[6px]" size={20} /> <span>Name</span>
        </div>
      ),
      value: "Name",
    },
    {
      label: (
        <div className="flex items-center">
          <BiEnvelope className="mr-[6px]" size={20} /> <span>Email</span>
        </div>
      ),
      value: "Email",
    },
    {
      label: (
        <div className="flex items-center">
          <BiPhoneCall className="mr-[6px]" size={20} /> <span>Phone</span>
        </div>
      ),
      value: "Phone",
    },
  ];

  const [requiredInputs, setRequired] = useState([
    {
      label: (
        <div className="flex items-center">
          <BiUserCircle className="mr-[6px]" size={20} /> <span>Name</span>
        </div>
      ),
      value: "Name",
    },
    {
      label: (
        <div className="flex items-center">
          <BiEnvelope className="mr-[6px]" size={20} /> <span>Email</span>
        </div>
      ),
      value: "Email",
    },
  ]);

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
              change everything about this link
            </p>

            <div className="col-span-full rounded-[8px] bg-white overflow-hidden mt-3">
              <div className="px-6 pt-6 relative pb-3">
                <div className="">
                  <div className="mb-5">
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
                              height: "58px",
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
                          value={requiredInputs}
                          onChange={(e: any) => {
                            setRequired(e);
                          }}
                          classNamePrefix="select"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="mb-5">
                    <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.2rem]">
                      Amount Config
                    </h2>
                    <span>Change link Amount Settings</span>
                  </div>

                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-2 text-[#525252]">
                      <p>Amount Options</p>
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
                            className="bg-[white]"
                            onChange={(txt) => {
                              // val.replace(/[^\d.]/g, "")
                            }}
                            helperText={
                              "Leaving this empty, makes all values valid"
                            }
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
                              className="bg-[white]"
                              onChange={(txt) => {
                                // val.replace(/[^\d.]/g, "")
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
                              onChange={(txt) => {
                                // val.replace(/[^\d.]/g, "")
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
                </div>

                <div className="mt-10">
                  <div className="mb-5">
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
        </div>
      </div>
    </>
  );
};

export default Settings;
