import Head from "next/head";
import { styled } from "@mui/material/styles";
import { HiBadgeCheck as Check } from "react-icons/hi";
import { BiError as ErrorIcon } from 'react-icons/bi';
import Image from "next/image";
import SwipeableViews from "react-swipeable-views";
import {
  Box,
  stepConnectorClasses,
  StepConnector,
  Step,
  Stepper,
  StepLabel,
  TextField,
  Skeleton,
  Alert,
  Button,
  AlertTitle,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Checkbox,
  Select,
  FormControl,
  ListItemText,
  MenuItem,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
  FormHelperText,
  Switch,
} from "@mui/material";
import { MdInfo, MdAddLink, MdInsertLink, MdClose } from "react-icons/md";
import { GiTwoCoins } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import LogoSpace from "../../logo";
import { useEffect, useState, useRef, useContext } from "react";
import Loader from "../../loader";
import TabPanel from "./TabPanel";
import Router from "next/router";
import { useCryptea } from "../../../../contexts/Cryptea";
import {
  DashContext,
  dash,
  Link as Linkx,
} from "../../../../contexts/GenContext";

const NewLink = () => {
  const StepperLine = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#f57059",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#f57059",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[800]
          : theme.palette.grey[500],
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const StepperMain: any = styled("div")(({ theme, ownerState }: any) => ({
    color: "#fff",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#f57059",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#f57059",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 10,
      height: 10,
      border: `2px solid ${
        ownerState.active
          ? "#f57059"
          : theme.palette.mode === "dark"
          ? theme.palette.grey[700]
          : theme.palette.grey[500]
      }`,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  }));

  const [minMax, setMinMax] =useState<boolean>(false);

  const QontoStepIcon = (props: any) => {
    const { active, completed, className, icon } = props;

    return (
      <StepperMain ownerState={{ active }} className={className}>
        {completed ? (
          checkError(stages[icon - 1]) ? (
            <ErrorIcon
              onClick={() => setValue(icon - 1)}
              size={23}
              className="QontoStepIcon-completedIcon cursor-pointer"
            />
          ) : (
            <Check
              onClick={() => setValue(icon - 1)}
              size={23}
              className="QontoStepIcon-completedIcon cursor-pointer"
            />
          )
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </StepperMain>
    );
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const item_height = 48;
  const padding_top = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: item_height * 4.5 + padding_top,
        width: 250,
        marginTop: "39px",
      },
    },
  };

  const steps = ["Details", "Amount", "Link", "Templates"];


    const { newLink: formLink }: dash = useContext(DashContext);

    const { errors: LinkErr } = formLink as Linkx;
  

  const [value, setValue] = useState<number>(Number(Boolean(formLink.title)));

  const [linkTemplate, setTemplate] = useState("origin");

  interface data {
    title: string;
    range: [string | number, string | number | undefined];
    amount: string | number;
    multi: number[];
    amountType: "variable" | "range" | "fixed";
    desc: string;
    type: "onetime" | "sub";
    slug: string;
    rdata: {
      sub: string[];
      onetime: string[];
      [index: string]: string[];
    };
    [index: string]: any;
  }

  const { isAuthenticated, account, validator } = useCryptea();

  const [loadpage, isloadPage] = useState<boolean>(true);

  const cache = useRef<boolean>(true);

  const [list, setList] = useState<
    ({ name: string; selected: boolean } | string)[]
  >(["", "", "", "", "", "", "", "", "", ""]);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        Router.push("/auth");
      } else {
        "templates".get("data", cache.current).then((e: any) => {
          setList(
            e.map(({ name }: any) => ({ name, selected: linkTemplate == name }))
          );

          cache.current = false;
        });

        isloadPage(false);
      }
    }
  }, [isAuthenticated, linkTemplate]);

  const helper = {
    padding: "6px 3px",
    backgroundColor: "#fff",
    color: "#565656",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "0px",
  };

  const text = {
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
    "& .MuiFormHelperText-root": helper,
  };

  const [data, udata] = useState<data>({
    title: formLink.title || '',
    amount: formLink.amount || '',
    range: ["", ""],
    multi: [0.1, 10, 50, 100],
    amountType: formLink.amountType || 'variable',
    desc: formLink.desc || '',
    type: "onetime",
    slug: formLink.slug || '',
    redirect: formLink.slug || '',
    rdata: {
      sub: ["Email", "Name"],
      onetime: ["Name", "Email"],
    },
  });

  const [amountOpt, setAmountOpt] = useState("");

  interface Errors {
    [index: string]: string;
  }

  const [genError, setGenError] = useState<string>("");

  const [error, uerror] = useState<Errors>({
    title: LinkErr?.title || "",
    amount: LinkErr?.amount || "",
    amountMulti: "",
    desc: LinkErr?.desc || "",
    redirect: LinkErr?.redirect || "",
    slug: LinkErr?.slug || "",
    rdata: "",
  });

  const [success, usuccess] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const init = (obj: object) => {
    uerror({
      ...error,
      ...obj,
    });
    setLoading(false);
  };

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

  const stages = [
    ["type", "title", "desc"],
    ["amountType", "amount", "amountMulti"],
    ["slug", "redirect", "rdata"],
  ];

  const saveLink = async () => {
    if (isLoading) return;

    let amount: string | number = "variable";

    if (!value || value == 3) {
      if (!Boolean(data.title)) {
        init({ title: "Title is required" });
        return;
      }

      setValue(1);
    }

    if (value == 1 || value == 3) {

      if (data.amountType == "range" && minMax) {
        if (
          !Boolean(Number(data.range[0])) &&
          !Boolean(Number(data.range[1]))
        ) {
          init({
            amount: "Range values should not be left empty",
          });

          setGenError("There is an issue with your range values");

          return;
        } else if (
          data.range[0] > (data.range[1] as number) &&
          data.range[1] !== undefined
        ) {

          init({
            amount: "Range Minimum should not be greater than maximum",
          });

          setGenError("There is an issue with your range values");

          return;
        } else if (data.range[0] == (data.range[1] as number)) {
          init({
            amount: "Range minimum and maximum should not be equal",
          });

          setGenError("There is an issue with your range values");

          return;
        } else {
          amount = JSON.stringify(data.range);
        }
      } else if (data.amountType == "fixed") {
        if (!Boolean(Number(data.amount))) {
          init({
            amount: "Amount should not be empty",
          });
          setGenError("There is an issue with your amount field");

          return;
        } else {
          amount = Number(data.amount);
        }
      }

      setValue(2);
    }

    if (value == 2 || value == 3) {
      if (!/[a-z]/gi.test(data.slug.charAt(0))) {
        init({
          slug: "Slug must start with an alphabet",
        });

        return;
      }

      if (!validator.isAlphanumeric(data.slug)) {
        init({
          slug: "Slug should not contain any special characters",
        });

        return;
      }

      if (Boolean(data.redirect)) {
        if (!validator.isURL(data.redirect)) {
          init({
            redirect: "A valid link is required",
          });

          return;
        }
      }

      setValue(3);
    }

    if (value == 3 && !checkError()) {
      setLoading(true);

      const templateData: {
        name: string;
        data?: any;
      } = {
        name: linkTemplate,
      };

      const { data: datax } = await import(
        `../../../../templates/${linkTemplate}/data`
      );

      templateData["data"] = datax;


      let ix: string;

      const rinputs: {
        sub: string[];
        onetime: string[];
        [index: string]: any;
      } = {
        onetime: [],
        sub: [],
      };

      for (ix in data.rdata) {
        const { rdata } = data;

        if (rdata[ix].length) {
          rdata[ix].forEach((input: string) => {
            if (validator.isAlphanumeric(input)) {
              rinputs[ix].push(input);
            }
          });
        }
      }

      

      const newData = {
        slug: data.slug.toLowerCase(),
        desc: data.desc,
        title: data.title,
        amount,
        address: account,
        amountMulti: JSON.stringify(data.multi.filter((v) => Number(v))),
        type: data.type === undefined ? "onetime" : data.type,
        rdata: JSON.stringify(rinputs),
        template_data: JSON.stringify(templateData),
      };

      try {
        await "links".save(newData);

        Router.push(`/user/${newData.slug}/overview`);
      } catch (e) {
        const errorObject = e as any;

        console.log(errorObject);

        if (errorObject.error) {

          setGenError(errorObject.message);

        } else {
          setGenError("Something went wrong, please try again");
        }
        setLoading(false);

        document.querySelector(".linkadd")?.scrollIntoView();
      }
    }
  };

  const multiAmount = () => {
    const [min, max] = data.range;

    const values = data["multi"];
    let minn = Number(min);
    let maxx = Number(max);

    if (!Boolean(minn)) minn = 0;

    if (!Boolean(maxx)) maxx = 0;

    values.forEach((v: number, i: number) => {
      if (maxx && v > maxx) {
        delete values[i];
      }

      if (minn && v < minn) {
        delete values[i];
      }
    });

    udata({
      ...data,
      multi: values,
    });
  };

  const pushMulti = (num: number) => {
    let set = true;
    let error = false;
    const values = data["multi"];

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

      init({
        amountMulti: "",
      });

      udata({
        ...data,
        multi: ready,
      });

      setAmountOpt("");
    }

    if (error) {
      return false;
    }

    return true;
  };

  const addmultiprice = (value: string | number, type: string) => {
    let val: number;

    if (typeof value == "string") {
      val = Number(value.replace(/[^\d.]/g, ""));
    } else {
      val = value;
    }

    if (Boolean(val)) {
      if (data["amountType"] == "range") {
        if (
          Boolean(data["range"][0]) &&
          val < (data["range"][0] as number | string)
        ) {
          uerror({
            ...error,
            amountMulti: "Amount cannot be lower than minimum amount",
          });
        } else if (
          Boolean(data["range"][1]) &&
          val > (data["range"][1] as number | string)
        ) {
          uerror({
            ...error,
            amountMulti: "Amount cannot be lower than maximum amount",
          });
        } else {
          if (!pushMulti(val)) {
            uerror({
              ...error,
              amountMulti: "Amount exists already eg 10 is too close to 10.5",
            });
          }
        }
      } else {
        if (!pushMulti(val)) {
          uerror({
            ...error,
            amountMulti: "Amount exists already eg 10 is too close to 10.5",
          });
        }
      }
    } else {
      uerror({
        ...error,
        amountMulti: "Cannot set a null number to Amount options",
      });
    }
  };

  return (
    <>
      <Head>
        <title>
          Create New Link | Receive Payments Instantly With Ease | Cryptea
        </title>
      </Head>

      {loadpage && <Loader />}

      {!loadpage && (
        <div className="w-screen min-w-[340px] linkadd 2md:pl-0 sm:px-2 flex justify-center items-center bg-pattern2 h-full min-h-screen">
          <div className="w-full flex 2md:px-0 px-10 justify-center flex-col h-full backdrop-blur-[6px]">
            <LogoSpace
              className={"2mmd:mx-auto"}
              style={{
                marginBottom: 20,
                marginTop: 20,
              }}
            />

            <h2 className="font-[900] text-[#f57059] text-[30px] mt-0 flex items-center mx-auto mb-5">
              <MdAddLink size={32} className="mr-1" /> Create A Link
            </h2>

            <div className="relative 2mmd:px-0 p-6 flex-auto">
              <Box sx={{ width: "100%" }}>
                <Box sx={{ marginBottom: 2 }}>
                  <Stepper
                    alternativeLabel
                    activeStep={value}
                    connector={<StepperLine />}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon}>
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                {success && (
                  <Alert className="w-full" severity="success">
                    <AlertTitle>Success</AlertTitle>
                  </Alert>
                )}

                {(checkError() || Boolean(genError.length)) && (
                  <Alert className="w-full font-bold mb-2" severity="error">
                    {genError.length ? genError : "Incorrect input data"}
                  </Alert>
                )}

                <SwipeableViews index={value}>
                  <TabPanel value={value} index={0}>
                    <form
                      encType="multipart/form-data"
                      action="#"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveLink();
                      }}
                      className="mt-3 w-full relative overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                        <span className="uppercase font-bold mr-3">
                          Link Details
                        </span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            These are your new link details
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 px-10 pt-5 pb-0">
                        <FormLabel
                          sx={{
                            fontWeight: "600",
                            color: "#121212",
                            display: "block",
                            marginBottom: "10px",
                          }}
                          id="demo-row-radio-buttons-group-label"
                        >
                          Payments
                        </FormLabel>

                        <ToggleButtonGroup
                          value={data.type}
                          sx={{
                            justifyContent: "space-between",
                            width: "100%",
                            "& .Mui-selected": {
                              backgroundColor: `rgba(245, 112, 89, 0.8) !important`,
                              color: `#fff !important`,
                            },
                            "& .MuiButtonBase-root:first-of-type": {
                              marginRight: "0px !important",
                              marginLeft: "0px !important",
                            },
                            "& .MuiButtonBase-root": {
                              padding: "10px 15px !important",
                            },
                            "& .MuiToggleButtonGroup-grouped": {
                              borderRadius: "4px !important",
                              minWidth: 55,
                              marginLeft: 3,
                              backgroundColor: "#1212121a",
                              border: "none",
                            },
                          }}
                          exclusive
                          className="w-full cusscroller overflow-y-hidden justify-around mb-2 pb-1"
                          onChange={(e: any) => {
                            if (e.target.value !== undefined) {
                              init({
                                type: "",
                              });
                              udata({
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
                            }}
                            value={"onetime"}
                          >
                            <GiTwoCoins className="mr-2" size={20} /> Onetime
                          </ToggleButton>
                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                            value={"sub"}
                          >
                            <FaCoins className="mr-2" size={20} /> Subscription
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>

                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            label="Title"
                            helperText={error["title"]}
                            error={Boolean(error["title"])}
                            value={data["title"]}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              init({
                                title: "",
                              });
                              udata({
                                ...data,
                                title: e.target.value,
                              });
                            }}
                            variant="standard"
                            name="title"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            type="textarea"
                            label={"Description"}
                            value={data["desc"]}
                            helperText={error["desc"]}
                            error={Boolean(data["desc"])}
                            placeholder={"I Created Ethereum"}
                            maxRows={4}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              init({
                                desc: "",
                              });
                              udata({
                                ...data,
                                desc: e.target.value,
                              });
                            }}
                            variant="standard"
                            name="desc"
                            fullWidth
                            multiline
                          />
                        </div>
                      </div>
                    </form>
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    <form
                      encType="multipart/form-data"
                      action="#"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveLink();
                      }}
                      className="mt-3 w-full overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                        <span className="uppercase font-bold mr-3">Amount</span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            Amount Configuration For Links
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>


                      <div className="w-full sm:px-2 p-10">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            id="amount"
                            value={data["amount"]}
                            label="Amount (USD)"
                            variant="standard"
                            helperText={error["amount"] || 'Can be left blank'}
                            error={Boolean(error["amount"])}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: "",
                              });
                              udata({
                                ...data,
                                amount: val.replace(/[^\d.]/g, ""),
                              });

                              setMinMax(false)

                            }}
                            name="amount"
                            type="text"
                            fullWidth
                          />
                        </div>
                      </div>

                      <div className="sm:px-2 p-10">
                        <div
                          onClick={() => {
                            setMinMax(!minMax);

                            const ux = {
                              ...data,
                              amount: "",
                            };

                            ux.amountType = "range";

                            if(!minMax == false){
                                ux.amountType = 'variable'
                            }

                            udata(ux);  

                          }}
                          className="justify-between w-full flex items-center"
                        >
                          <div className="font-semibold mt-4 mb-2 text-[#121212]">
                            <p>Specify Min/Max amount</p>
                          </div>

                          <div className="">
                            <Switch
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setMinMax(e.target.checked);
                              }}
                              checked={minMax}
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

                        {minMax && (
                          <div className="flex items-center ssm:flex-wrap">
                            <TextField
                              sx={text}
                              id="min"
                              placeholder="Amount"
                              onBlur={multiAmount}
                              label={"Min"}
                              value={data["range"][0]}
                              variant="standard"
                              helperText={error["amount"]}
                              error={Boolean(error["amount"])}
                              onChange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) => {
                                const val = e.target.value;

                                init({
                                  amount: "",
                                });

                                const ux = {
                                  ...data,
                                  amount: "",
                                };

                                ux.amountType = 'range';

                                if (!minMax == false) {
                                  ux.amountType = "variable";
                                }

                                udata({
                                  ...ux,
                                  range: [
                                    val.replace(/[^\d.]/g, ""),
                                    data["range"][1],
                                  ],
                                });

                              }}
                              name="max"
                              type="text"
                              fullWidth
                            />

                            <TextField
                              sx={text}
                              id="max"
                              value={data["range"][1]}
                              variant="standard"
                              label="Max"
                              placeholder="Amount"
                              error={Boolean(error["amount"])}
                              helperText={error["amount"]}
                              onBlur={multiAmount}
                              onChange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) => {
                                const val = e.target.value;
                                init({
                                  amount: "",
                                });

                                const ux = {
                                  ...data,
                                  amount: "",
                                };

                                ux.amountType = 'range';

                                if (!minMax == false) {
                                  ux.amountType = "variable";
                                }

                                udata({
                                  ...ux,
                                  range: [
                                    data["range"][0],
                                    val.replace(/[^\d.]/g, ""),
                                  ],
                                });

                              }}
                              name="max"
                              type="text"
                              fullWidth
                            />
                          </div>
                        )}
                      </div>

                      {!Boolean(data['amount']) && (
                        <div className="w-full s:px-2 px-10 py-5">
                          <div className="flex items-center ssm:flex-wrap">
                            <div className="w-full">
                              <FormLabel
                                sx={{
                                  fontWeight: "600",
                                  color: "#121212",
                                  display: "block",
                                  marginBottom: "10px",
                                }}
                                id="demo-row-radio-buttons-group-label"
                              >
                                Amount Options
                              </FormLabel>

                              <div className="flex cusscroller overflow-x-scroll overflow-y-hidden mb-3 pb-1 items-center">
                                {data["multi"].map(
                                  (
                                    v: string | number | undefined,
                                    i: number
                                  ) => {
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
                                              const newD = data.multi;
                                              delete newD[i];

                                              udata({
                                                ...data,
                                                multi: newD,
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
                                sx={text}
                                id="amountOptions"
                                value={amountOpt}
                                helperText={error["amountMulti"]}
                                variant="standard"
                                error={Boolean(error["amountMulti"])}
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
                                    if (amountOpt.length) {
                                      addmultiprice(amountOpt, "onetime");
                                    }
                                  }
                                }}
                                onBlur={(e: any) => {
                                  const val = e.target.value;
                                  const sval = val.replace(/[^\d.]/g, "");
                                  setAmountOpt(sval);

                                  if (amountOpt.length) {
                                    addmultiprice(amountOpt, "onetime");
                                  }
                                }}
                                name="amountOptions"
                                type="text"
                                fullWidth
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    </form>
                  </TabPanel>

                  <TabPanel value={value} index={2}>
                    <form
                      encType="multipart/form-data"
                      action="#"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveLink();
                      }}
                      className="mt-3 w-full overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                        <span className="uppercase font-bold mr-3">Link</span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            This is your new Link page:
                            {/* `https://cryptea.com/{$username}/{$link}` */}
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 p-10">
                        <div className="w-full sm:px-2 pt-0 pb-5">
                          <TextField
                            sx={text}
                            label={"Enter Link Slug"}
                            value={data["slug"]}
                            placeholder="wagmi"
                            error={Boolean(error["slug"])}
                            helperText={error["slug"]}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val: string = e.target.value;

                              init({
                                slug: "",
                              });

                              udata({
                                ...data,
                                slug: val.toLowerCase(),
                              });
                            }}
                            variant="standard"
                            name="link"
                            fullWidth
                          />
                        </div>

                        <div className="w-full sm:px-2 py-5">
                          <TextField
                            sx={text}
                            label={"Redirect link - (After payment)"}
                            value={data["redirect"]}
                            placeholder="Link"
                            error={Boolean(error["redirect"])}
                            helperText={
                              Boolean(error["redirect"])
                                ? error["redirect"]
                                : "Not required"
                            }
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val: string = e.target.value;

                              init({
                                redirect: "",
                              });

                              udata({
                                ...data,
                                redirect: val.toLowerCase(),
                              });
                            }}
                            variant="standard"
                            name="redirect"
                            fullWidth
                          />
                        </div>

                        <div className="w-full sm:px-2 py-5">
                          <FormControl
                            variant="standard"
                            sx={{
                              "& .Mui-focused.MuiInputLabel-root": {
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
                              "& .MuiFormHelperText-root": {
                                padding: "6px 3px",
                                backgroundColor: "#fff",
                                color: "#565656",
                                marginTop: "0px",
                              },
                              width: "100%",
                            }}
                          >
                            <InputLabel
                              variant="standard"
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#f57059",
                                },
                              }}
                              id="inputBox"
                            >
                              User Data Required
                            </InputLabel>
                            <Select
                              variant="standard"
                              labelId="inputBox"
                              id="input"
                              multiple
                              error={Boolean(error.rdata)}
                              value={data.rdata[data.type]}
                              onChange={(event: SelectChangeEvent<any>) => {
                                const {
                                  target: { value },
                                } = event;

                                init({
                                  rdata: "",
                                });

                                const rdata: any = { ...data["rdata"] };

                                rdata[data.type] =
                                  typeof value === "string"
                                    ? value.split(",")
                                    : value;

                                udata({
                                  ...data,
                                  rdata,
                                });
                              }}
                              renderValue={(selected) => selected.join(", ")}
                              MenuProps={MenuProps}
                            >
                              {["Name", "Email", "Phone"].map((name) => (
                                <MenuItem
                                  sx={{
                                    "&.Mui-selected": {
                                      backgroundColor: "#f5705914 !important",
                                    },
                                  }}
                                  key={name}
                                  value={name}
                                >
                                  <Checkbox
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fill: "#f57059",
                                      },
                                    }}
                                    checked={
                                      data.rdata[data.type].indexOf(name) > -1
                                    }
                                  />
                                  <ListItemText primary={name} />
                                </MenuItem>
                              ))}
                            </Select>

                            <FormHelperText variant="standard" sx={helper}>
                              {Boolean(error.rdata)
                                ? error.rdata
                                : "Not required"}
                            </FormHelperText>
                          </FormControl>
                        </div>
                      </div>
                    </form>
                  </TabPanel>

                  <TabPanel value={value} index={3}>
                    <form
                      encType="multipart/form-data"
                      action="#"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveLink();
                      }}
                      className="mt-3 w-full overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                        <span className="uppercase font-bold mr-3">
                          Custom Template
                        </span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            Page users see when they load your link
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full py-8">
                        <div className="w-full cusscroller flex items-start pb-5 overflow-y-hidden overflow-x-scroll">
                          {list.map((e: any, i: number) => {
                            if (!Boolean(e)) {
                              return (
                                <div key={i} className="mr-3">
                                  <Skeleton
                                    variant="rounded"
                                    sx={{ marginBottom: "4px" }}
                                    width={361.41}
                                    height={180}
                                  />

                                  <Skeleton
                                    variant="text"
                                    width={180}
                                    sx={{ fontSize: "1rem" }}
                                  />
                                </div>
                              );
                            } else {
                              const image = require(`../../../../templates/${e.name}/img.png`);

                              return (
                                <div
                                  key={i}
                                  onClick={() => setTemplate(e.name)}
                                  className="mr-3 relative cursor-pointer"
                                >
                                  <Skeleton
                                    variant="rounded"
                                    className="border-solid hover:border-[#bfbfbf] absolute hover:border-2"
                                    sx={{ marginBottom: "4px" }}
                                    width={361.41}
                                    height={180}
                                  />
                                  <div
                                    style={{
                                      borderColor: e.selected
                                        ? "#bfbfbf"
                                        : undefined,
                                    }}
                                    className="mb-1 w-[361.41px] min-h-[180px] border-solid hover:border-[#bfbfbf] rounded-sm relative border-[#fff] overflow-hidden border-2
                                      "
                                  >
                                    <Image
                                      alt={e.name}
                                      src={image}
                                      layout={"fill"}
                                    />
                                  </div>

                                  <span className="capitalize text-[#121212] block text-[1rem] font-[400]">
                                    {" "}
                                    {e.name}{" "}
                                  </span>
                                  {e.selected && (
                                    <span className="text-[#464646] text-[15px] font-light">
                                      Selected
                                    </span>
                                  )}
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </form>
                  </TabPanel>
                </SwipeableViews>
              </Box>

              <div className="flex relative justify-center items-center">
                {" "}
                {isLoading && (
                  <Button className="!py-3 !font-bold !px-6 !normal-case !flex !items-center !text-white hover:!bg-[#f57059] !bg-[#f57059] !m-auto !rounded-lg">
                    <CircularProgress
                      sx={{
                        color: "white",
                        maxWidth: 24,
                        maxHeight: 24,
                        marginRight: 1,
                      }}
                      thickness={4.5}
                      color="inherit"
                    />{" "}
                    Wait a Sec...
                  </Button>
                )}
                {!isLoading && (
                  <div className="flex items-center">
                    {Boolean(value) && (
                      <Button
                        onClick={() => setValue(value - 1)}
                        className="!w-fit !py-3 !items-center !flex !rounded-md font-[600] !text-[#777] !px-0 !capitalize !border-none"
                      >
                        Back
                      </Button>
                    )}

                    <Button
                      onClick={saveLink}
                      className="!py-3 !font-bold !px-6 !capitalize !flex !items-center !text-white !bg-[#f57059] !transition-all !delay-500 hover:!bg-[#fb4d2e] !m-auto !rounded-lg"
                    >
                      <MdInsertLink size={25} className="mr-1" />{" "}
                      {value != 3 ? "Next" : "Create Link"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewLink;
