import Head from "next/head";
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Alert,
  Button,
  AlertTitle,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import { MdInfo, MdAddLink, MdInsertLink, MdClose } from "react-icons/md";
import { GiTwoCoins } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import LogoSpace from "../../logo";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Loader from "../../loader";
import TabPanel from "./TabPanel";
import Router from "next/router";
import validator from 'validator';


const NewLink = () => {

  enum Type {
    onetime,
    sub,
  }


  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState<number>(Type.onetime);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [linkTemplate, setTemplate] = useState('origin');

  const templateData:{
    name: string,
    data?: any
  } = {
    name: linkTemplate,
  };

 import(`../../../../templates/${linkTemplate}/data`).then(e => {
     templateData['data'] = e.data;
 })

  interface Strings {
    [index: string]: string;
    sub: string;
    onetime: string;
  }


  interface data {
    title: Strings;
    amount: {
      onetime: {
        value: string | number;
        range: [string | number, string | number];
      };
      sub: {
        value: string | number;
        range: [string | number, string | number];
      };
      multi: number[];
      [index: string]: any
    };
    amountType: {
      sub: "variable" | "range" | "fixed";
      onetime: "variable" | "range" | "fixed";
      [index: string]: any
    };
    desc: Strings;
    slug: Strings;
  }


  const { isAuthenticated, isInitialized, Moralis, user } = useMoralis();

  const [loadpage, isloadPage] = useState<boolean>(true);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        window.location.href = "/";
      } else {
        isloadPage(false);
      }
    }
  }, [isAuthenticated, isInitialized, isloadPage]);

  const text = {
    "& .Mui-focused.MuiFormLabel-root": {
      color: "#f57059",
    },
    "& .MuiInputLabel-root": {
      fontWeight: "600",
      color: "#121212"
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
      {
        borderColor: `#f57059 !important`,
      },
    "& .MuiFormHelperText-root":{
        padding: '6px 3px',
        backgroundColor: '#fff',
        color: '#565656',
        fontSize: '12px',
        fontWeight: 'bold',
        marginTop: '0px',
    }
  };

  const [data, udata] = useState<data>({
    title: {
      sub: "",
      onetime: "",
    },
    amount: {
      sub: {
        value: "",
        range: ["", ""],
      },
      onetime: {
        value: "",
        range: ["", ""],
      },
      multi: [0.1, 10, 50, 100]
    },
    amountType: {
      sub: "fixed",
      onetime: "variable",
    },
    desc: {
      sub: "",
      onetime: "",
    },
    slug: {
      sub: "",
      onetime: "",
    },
  });

  const [amountOpt, setAmountOpt] = useState(''); 

  interface hmm {
    [index: string]: Strings;
  }

  const [genError, setGenError] = useState<string>("");

  const [error, uerror] = useState<hmm>({
    title: {
      sub: "",
      onetime: "",
    },
    amount: {
      sub: "",
      onetime: "",
    },
    amountMulti: {
      sub: "",
      onetime: ""
    },
    desc: {
      sub: "",
      onetime: "",
    },
    slug: {
      sub: "",
      onetime: "",
    },
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

  const checkError = (): boolean => {
    let e: any,
      t: boolean = false;

    for (e in error) {
      const { sub, onetime } = error[String(e)];

      // console.log(error, e, sub, onetime);

      if (sub.length || onetime.length) {
        t = true;
      }
    }
    return t;
  };

  const saveLink = async () => {
    setLoading(true);

    const index: string = value === Type.onetime ? "onetime" : "sub";

    const mainData: (number | string)[] = [
      data.desc[index],
      data.slug[index],
      data.title[index],
    ];

    const indx = ["desc", "slug", "title"];

    mainData.forEach((d, i) => {
      if (!Boolean(d)) {
        const xx: { [index: string]: string } = {};

        xx[index] = "should not be left empty";

        init({ ...error[indx[i]], ...xx });
      }
    });

    

    if (!checkError()) {
      let amount: string | number = 'variable';
      if (data.amountType[index] == 'range') {
          if (!Boolean(Number(data.amount[index].range[0])) || !Boolean(Number(data.amount[index].range[1]))) {

              const amountx:{[index:string]: string} = {};
              amountx[index] = "Range values should not be left empty";

              init({
                amount: {...amountx}
              });
              setGenError("There is an issue with your range values");
          }else if (data.amount[index].range[0] > data.amount[index].range[1]) {
              const amountx: { [index: string]: string } = {};
              amountx[index] =
                "Range Minimum should not be greater than maximum";

              init({ 
                  amount: {...amountx}           
               });  
               setGenError("There is an issue with your range values");
          } else if (data.amount[index].range[0] == data.amount[index].range[1]) {
            const amountx: { [index: string]: string } = {};
            amountx[index] = "Range minimum and maximum should not be equal";
 
              init({
                amount: {...amountx},
              });   

              setGenError("There is an issue with your range values");
          }else{
              amount = JSON.stringify(data.amount[index].range);
          }

      }else if (data.amountType[index] == 'fixed') {
          if (!Boolean(Number(data.amount[index].value))) {
            const amountx: {[index: string]: string} = {}
            amountx[index] = "Amount should not be empty";
              init({
                amount: {
                  ...amountx
                },
              });
              setGenError("There is an issue with your amount field");
          } else {
              amount = Number(data.amount[index].value);
          }
      }

      if (!/[a-z]/gi.test(data.slug[index].charAt(0))) {

        const xe = { ...error.slug };
        xe[index] = "Slug must start with an alphabet";
        init({
          slug: { ...xe }
        });
        return;
      }

      if (!validator.isAlphanumeric(data.slug[index])) {
        const xe = { ...error.slug };
        xe[index] = "Slug should not contain any special characters";
        init({
          slug: {...xe}
        });

        return;
      }

      const Link = Moralis.Object.extend("link");
      const link = new Link();

      const mQ = new Moralis.Query(Link);
      mQ.equalTo("link", data.slug[index].toLowerCase());

      mQ.find().then(async (ld) => {
        if (!ld.length) {
          link?.set("link", data.slug[index].toLowerCase());
          link?.set("amount", String(amount));
          link?.set("desc", data.desc[index]);
          link?.set("title", data.title[index]);
          link?.set("onetime", '[]');
          link?.set("subscribers", '[]');
          link?.set("amountMulti", JSON.stringify(data.amount.multi));
          link?.set(
            "type",
            value === Type.onetime ? "onetime" : "sub"
          );
          link?.set("user", user);

          link?.set("template_data", JSON.stringify(templateData));

          try {
            await link?.save();
            
            Router.push('/dashboard/links');

          } catch (e) {
            const errorObject = e as Error;
            setGenError(errorObject?.message);
            setLoading(false);

            document.querySelector(".linkadd")?.scrollIntoView();
          }
      } else {
        setGenError("Link slug has already been taken");
        setLoading(false);

        document.querySelector(".linkadd")?.scrollIntoView();
      }
      });
    }
  };

  const multiAmount = () => {

      const [min, max] = data.amount.onetime.range;

      const values = data["amount"]["multi"];
      let minn = Number(min);
      let maxx = Number(max);

      if(!Boolean(minn))
        minn = 0;
      

      if(!Boolean(maxx))
        maxx = 0;

      values.forEach((v:number, i: number) => {
          if (maxx && (v > maxx)) {
              delete values[i];
          }

          if (minn && (v < minn)) {
              delete values[i];
          }
      })

      udata({
        ...data,
        amount: {
          ...data.amount,
          multi: values,
        },
      });      

  };

  const pushMulti = (num: number) => {
      let set = true;
      let error = false;
      const values = data["amount"]["multi"];
      
      values.forEach((vv:number) => {
          if (Math.floor(vv) == Math.floor(num)) {
              if(vv != num){
                  error = true;
              }
              set = false;
          }
      });
      
      if(set){
        
        values.push(num);
        
        const ready = values.sort((a, b) => a - b);
      
          init({
            amountMulti: {
              sub: "",
              onetime: "",
            },
          });

          udata({
            ...data,
            amount: {
              ...data.amount,
              multi: ready
            }
          });

          setAmountOpt("");
      }

      if (error) {
          return false;
      }

      return true;
  }

  const addmultiprice = (value: string | number, type: string) => {
    let val: number

    if(typeof value == 'string'){
     val = Number(value.replace(/[^\d.]/g, ""));
    }else{
      val = value;
    }
   
    if (Boolean(val)) {

    if (data["amountType"][type] == 'range') {

      if (Boolean(data['amount'][type]['range'][1]) && val < data['amount'][type]['range'][0]) {
        
        const erx:any = {};
        
         erx[type] = "Amount cannot be lower than minimum amount";
        
        uerror({...error, amountMulti: {
            ...error.amountMulti,
            ...erx
        }});


      }else if(Boolean(data['amount'][type]['range'][1]) && val > data['amount'][type]['range'][1]){

        const erx:any = {};
        
         erx[type] = "Amount cannot be lower than maximum amount";
        
        uerror({...error, amountMulti: {
            ...error.amountMulti,
            ...erx
        }});

      }else{

        if(!pushMulti(val)){

          const erx: any = {};

          erx[type] = "Amount exists already eg 10 is too close to 10.5";

          uerror({
            ...error,
            amountMulti: {
              ...error.amountMulti,
              ...erx,
            },
          });

        };  
      }

    }else if(data["amountType"][type] == 'variable'){
        if(!pushMulti(val)){

          const erx: any = {};

          erx[type] = "Amount exists already eg 10 is too close to 10.5";

          uerror({
            ...error,
            amountMulti: {
              ...error.amountMulti,
              ...erx,
            },
          });

        };
    }
  }else{
    
    const erx: any = {};

    erx[type] = "Cannot set a null number to Amount options";
    
    uerror({...error, amountMulti: {
        ...error.amountMulti,
        ...erx
    }});
  }     
}

  return (
    <>
      <Head>
        <title>
          Create New Link | Receive Payments Instantly With Ease | Cryptea
        </title>
      </Head>

      {loadpage && <Loader />}

      {!loadpage && (
        <div className="w-screen linkadd sm:px-2 flex justify-center items-center bg-pattern2 h-fit">
          <div className="w-full flex px-10 justify-center flex-col h-full backdrop-blur-[1.5px]">
            <LogoSpace
              style={{
                marginBottom: 20,
                marginTop: 20,
              }}
            />

            <h2 className="font-[900] text-[#f57059] text-[30px] mt-0 flex items-center mx-auto mb-5">
              <MdAddLink size={32} className="mr-1" /> Create A Link
            </h2>

            <div className="relative 2mmd:px-0 p-6 flex-auto">
              {(checkError() || Boolean(genError.length)) && (
                <Alert className="w-full font-bold mb-2" severity="error">
                  {genError.length ? genError : "Incorrect input data"}
                </Alert>
              )}

              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    sx={{
                      "& .MuiTabs-flexContainer": {
                        width: "100%",
                        justifyContent: "space-around",
                      },
                      "& .MuiTab-root.MuiButtonBase-root.Mui-selected": {
                        fontWeight: "bold",
                        borderRadius: "4px",
                        opacity: 1,
                        color: "white",
                        backgroundColor: "rgba(245, 112, 89, 0.8) !important",
                        textTransform: "capitalize",
                      },
                      "& .MuiButtonBase-root.MuiTab-root": {
                        fontWeight: "bold",
                        borderRadius: "4px",
                        textTransform: "capitalize",
                        color: "rgb(18, 18, 18)",
                        minHeight: "50px",
                        opacity: 0.7,
                        backgroundColor: "rgba(18, 18, 18, 0.141) !important",
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "rgb(248, 102, 77) !important",
                      },
                    }}
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs"
                  >
                    <Tab
                      iconPosition="start"
                      icon={<GiTwoCoins size={17} />}
                      label="One Time Payments"
                      {...a11yProps(0)}
                    />
                    <Tab
                      iconPosition="start"
                      icon={<FaCoins size={17} />}
                      label="Subscriptions"
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </Box>

                {success && (
                  <Alert className="w-full" severity="success">
                    <AlertTitle>Success</AlertTitle>
                  </Alert>
                )}

                <TabPanel value={value} index={0}>
                  <div className="mt-3 w-full overflow-hidden">
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

                    <div className="w-full sm:px-2 px-10 py-5">
                      <div className="flex items-center ssm:flex-wrap">
                        <TextField
                          sx={text}
                          label="Title"
                          helperText={error["title"]["onetime"]}
                          value={data["title"]["onetime"]}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            init({
                              title: {
                                sub: "",
                                onetime: "",
                              },
                            });
                            udata({
                              ...data,
                              title: {
                                ...data["title"],
                                onetime: e.target.value,
                              },
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
                          value={data["desc"]["onetime"]}
                          helperText={error["desc"]["onetime"]}
                          placeholder={"I Created Ethereum"}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            init({
                              desc: {
                                sub: "",
                                onetime: "",
                              },
                            });
                            udata({
                              ...data,
                              desc: {
                                ...data["desc"],
                                onetime: e.target.value,
                              },
                            });
                          }}
                          variant="standard"
                          name="desc"
                          fullWidth
                          multiline
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 w-full overflow-hidden">
                    <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                      <span className="uppercase font-bold mr-3">Amount</span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          Amount Configuration For Links
                        </span>
                        <MdInfo size={20} color="#fff" />
                      </div>
                    </div>

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
                            Choose Amount Type
                          </FormLabel>

                          <ToggleButtonGroup
                            value={data["amountType"]["onetime"]}
                            exclusive
                            sx={{
                              justifyContent: "space-between",
                              width: "100%",
                              "& .Mui-selected.MuiToggleButtonGroup-grouped": {
                                backgroundColor: `#f57059 !important`,
                                color: `#fff !important`,
                                border: "1px solid #f57059 !important",
                              },
                              "& .MuiToggleButtonGroup-grouped": {
                                borderRadius: "4px !important",
                                backgroundColor: "#fff",
                                minWidth: 80,
                                border:
                                  "1px solid rgba(0, 0, 0, 0.3) !important",
                              },
                            }}
                            onChange={(e: any) => {
                              const val = e.target.value;
                              udata({
                                ...data,
                                amountType: {
                                  ...data.amountType,
                                  onetime: val,
                                },
                              });
                            }}
                          >
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value="range"
                            >
                              Range
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value="variable"
                            >
                              Variable
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value="fixed"
                            >
                              Fixed
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                    </div>

                    {data["amountType"].onetime == "fixed" && (
                      <div className="w-full sm:px-2 p-10">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            id="amount"
                            value={data["amount"]["onetime"]["value"]}
                            label="Amount (USD)"
                            variant="standard"
                            helperText={error["amount"]["onetime"]}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: {
                                  sub: "",
                                  onetime: "",
                                },
                              });
                              udata({
                                ...data,
                                amount: {
                                  ...data["amount"],
                                  onetime: {
                                    ...data["amount"]["onetime"],
                                    value: val.replace(/[^\d.]/g, ""),
                                  },
                                },
                              });
                            }}
                            name="amount"
                            type="text"
                            fullWidth
                          />
                        </div>
                      </div>
                    )}

                    {data["amountType"].onetime == "range" && (
                      <div className="w-full sm:px-2 p-10">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            id="min"
                            placeholder="Amount"
                            onBlur={multiAmount}
                            label={"Min"}
                            value={data["amount"]["onetime"]["range"][0]}
                            variant="standard"
                            helperText={error["amount"]["onetime"]}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: {
                                  sub: "",
                                  onetime: "",
                                },
                              });

                              udata({
                                ...data,
                                amount: {
                                  ...data["amount"],
                                  onetime: {
                                    ...data["amount"]["onetime"],
                                    range: [
                                      val.replace(/[^\d.]/g, ""),
                                      data["amount"]["onetime"]["range"][1],
                                    ],
                                  },
                                },
                              });
                            }}
                            name="max"
                            type="text"
                            fullWidth
                          />

                          <TextField
                            sx={text}
                            id="max"
                            value={data["amount"]["onetime"]["range"][1]}
                            variant="standard"
                            label="Max"
                            placeholder="Amount"
                            helperText={error["amount"]["onetime"]}
                            onBlur={multiAmount}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: {
                                  sub: "",
                                  onetime: "",
                                },
                              });
                              udata({
                                ...data,
                                amount: {
                                  ...data["amount"],
                                  onetime: {
                                    ...data["amount"]["onetime"],
                                    range: [
                                      data["amount"]["onetime"]["range"][0],
                                      val.replace(/[^\d.]/g, ""),
                                    ],
                                  },
                                },
                              });
                            }}
                            name="max"
                            type="text"
                            fullWidth
                          />
                        </div>
                      </div>
                    )}

                    {data["amountType"].onetime != "fixed" && (
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
                              {data["amount"]["multi"].map(
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
                                            const newD = data.amount.multi;
                                            delete newD[i];

                                            udata({
                                              ...data,
                                              amount: {
                                                ...data.amount,
                                                multi: newD,
                                              },
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
                              helperText={error["amountMulti"]["onetime"]}
                              variant="standard"
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
                  </div>

                  <div className="mt-3 w-full overflow-hidden">
                    <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                      <span className="uppercase font-bold mr-3">
                        Link Slug
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          This is your new Link page:
                          {/* `https://cryptea.com/{$username}/{$link}` */}
                        </span>
                        <MdInfo size={20} color="#fff" />
                      </div>
                    </div>

                    <div className="w-full sm:px-2 p-10">
                      <div className="flex items-center ssm:flex-wrap">
                        <TextField
                          sx={text}
                          label={"Enter Link Slug"}
                          value={data["slug"]["onetime"]}
                          placeholder="wagmi"
                          helperText={error["slug"]["onetime"]}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            const val: string = e.target.value;
                            const accept: string[] = ["~", "-", "_"];

                            const random: number = Math.floor(
                              Math.random() * 2
                            );
                            init({
                              slug: {
                                sub: "",
                                onetime: "",
                              },
                            });
                            udata({
                              ...data,
                              slug: {
                                ...data["slug"],
                                onetime: val
                                  .replace(
                                    /[!@#$%^`&*=?>+<\\\'\"]/g,
                                    accept[random]
                                  )
                                  .toLowerCase(),
                              },
                            });
                          }}
                          variant="standard"
                          name="link"
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <div className="mt-3 w-full overflow-hidden">
                    <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                      <span className="uppercase font-bold mr-3">
                        Subscription Details
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          These are your new subscription details
                        </span>
                        <MdInfo size={20} color="#fff" />
                      </div>
                    </div>

                    <div className="w-full sm:px-2 px-10 py-5">
                      <div className="flex items-center ssm:flex-wrap">
                        <TextField
                          sx={text}
                          id="outlined-basic"
                          label="Title"
                          value={data["title"]["sub"]}
                          variant="standard"
                          helperText={error["title"]["sub"]}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            init({
                              title: {
                                sub: "",
                                onetime: "",
                              },
                            });
                            udata({
                              ...data,
                              title: {
                                ...data["title"],
                                sub: e.target.value,
                              },
                            });
                          }}
                          name="title"
                          fullWidth
                        />
                      </div>
                    </div>

                    <div className="w-full sm:px-2 px-10 py-5">
                      <div className="flex items-center ssm:flex-wrap">
                        <TextField
                          sx={text}
                          id="description"
                          label="Description"
                          variant="standard"
                          value={data["desc"]["sub"]}
                          name="description"
                          helperText={error["desc"]["sub"]}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            init({
                              desc: {
                                sub: "",
                                onetime: "",
                              },
                            });
                            udata({
                              ...data,
                              desc: {
                                ...data["desc"],
                                sub: e.target.value,
                              },
                            });
                          }}
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 w-full overflow-hidden">
                    <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                      <span className="uppercase font-bold mr-3">Amount</span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          Amount Configuration For Links
                        </span>
                        <MdInfo size={20} color="#fff" />
                      </div>
                    </div>

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
                            Choose Amount Type
                          </FormLabel>

                          <ToggleButtonGroup
                            value={data["amountType"]["sub"]}
                            exclusive
                            sx={{
                              justifyContent: "space-between",
                              width: "100%",
                              "& .Mui-selected.MuiToggleButtonGroup-grouped": {
                                backgroundColor: `#f57059 !important`,
                                color: `#fff !important`,
                                border: "1px solid #f57059 !important",
                              },
                              "& .MuiToggleButtonGroup-grouped": {
                                borderRadius: "4px !important",
                                backgroundColor: "#fff",
                                minWidth: 80,
                                border:
                                  "1px solid rgba(0, 0, 0, 0.3) !important",
                              },
                            }}
                            onChange={(e: any) => {
                              const val = e.target.value;

                              udata({
                                ...data,
                                amountType: {
                                  ...data.amountType,
                                  sub: val,
                                },
                              });
                            }}
                          >
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value="range"
                            >
                              Range
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value="variable"
                            >
                              Variable
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value="fixed"
                            >
                              Fixed
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </div>
                    </div>

                    {data["amountType"].sub == "fixed" && (
                      <div className="w-full sm:px-2 p-10">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            id="amount"
                            value={data["amount"]["sub"]["value"]}
                            label="Amount (USD)"
                            variant="standard"
                            helperText={error["amount"]["sub"]}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: {
                                  onetime: "",
                                  sub: "",
                                },
                              });
                              udata({
                                ...data,
                                amount: {
                                  ...data["amount"],
                                  sub: {
                                    ...data["amount"]["sub"],
                                    value: val.replace(/[^\d.]/g, ""),
                                  },
                                },
                              });
                            }}
                            name="amount"
                            type="text"
                            fullWidth
                          />
                        </div>
                      </div>
                    )}

                    {data["amountType"].sub == "range" && (
                      <div className="w-full sm:px-2 p-10">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            sx={text}
                            id="min"
                            placeholder="Amount"
                            onBlur={multiAmount}
                            label={"Min"}
                            value={data["amount"]["sub"]["range"][0]}
                            variant="standard"
                            helperText={error["amount"]["sub"]}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: {
                                  onetime: "",
                                  sub: "",
                                },
                              });

                              udata({
                                ...data,
                                amount: {
                                  ...data["amount"],
                                  sub: {
                                    ...data["amount"]["sub"],
                                    range: [
                                      val.replace(/[^\d.]/g, ""),
                                      data["amount"]["sub"]["range"][1],
                                    ],
                                  },
                                },
                              });
                            }}
                            name="max"
                            type="text"
                            fullWidth
                          />

                          <TextField
                            sx={text}
                            id="max"
                            value={data["amount"]["sub"]["range"][1]}
                            variant="standard"
                            label="Max"
                            placeholder="Amount"
                            helperText={error["amount"]["sub"]}
                            onBlur={multiAmount}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              init({
                                amount: {
                                  onetime: "",
                                  sub: "",
                                },
                              });
                              udata({
                                ...data,
                                amount: {
                                  ...data["amount"],
                                  sub: {
                                    ...data["amount"]["sub"],
                                    range: [
                                      data["amount"]["sub"]["range"][0],
                                      val.replace(/[^\d.]/g, ""),
                                    ],
                                  },
                                },
                              });
                            }}
                            name="max"
                            type="text"
                            fullWidth
                          />
                        </div>
                      </div>
                    )}

                    {data["amountType"].sub != "fixed" && (
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

                            <div className="flex cusscroller overflow-x-scroll overflow-y-hidden mb-2 items-center">
                              {data["amount"]["multi"].map(
                                (v: string | number | undefined, i: number) => {
                                  if (v !== undefined) {
                                    return (
                                      <button
                                        key={i}
                                        className="min-w-[70px] border-solid bg-white cursor-default p-[10px] border border-[#7c7c7c] rounded-[3px] flex justify-center text-[#7c7c7c] mr-3 items-center"
                                      >
                                        ${v}
                                        <MdClose
                                          className="ml-2 min-w-[17px] cursor-pointer hover:text-[#121212]"
                                          size={17}
                                          onClick={() => {
                                            const newD = data.amount.multi;
                                            delete newD[i];

                                            udata({
                                              ...data,
                                              amount: {
                                                ...data.amount,
                                                multi: newD,
                                              },
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
                              helperText={error["amountMulti"]["sub"]}
                              variant="standard"
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
                                    addmultiprice(amountOpt, "sub");
                                  }
                                }
                              }}
                              onBlur={(e: any) => {
                                const val = e.target.value;
                                const sval = val.replace(/[^\d.]/g, "");
                                setAmountOpt(sval);

                                if (amountOpt.length) {
                                  addmultiprice(amountOpt, "sub");
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
                  </div>

                  <div className="mt-3 w-full overflow-hidden">
                    <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#f57059] text-white">
                      <span className="uppercase font-bold mr-3">
                        Link Slug
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">
                          This is your new Link page:
                          {/* `https://cryptea.com/{$username}/{$link}` */}
                        </span>
                        <MdInfo size={20} color="#fff" />
                      </div>
                    </div>

                    <div className="w-full sm:px-2 p-10">
                      <div className="flex items-center ssm:flex-wrap">
                        <TextField
                          sx={text}
                          label={"Enter Subscription Link Slug"}
                          placeholder="wagmi"
                          value={data["slug"]["sub"]}
                          helperText={error["slug"]["sub"]}
                          onChange={(
                            e: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            const val: string = e.target.value;
                            const accept: string[] = ["~", "-", "_"];

                            const random: number = Math.floor(
                              Math.random() * 2
                            );
                            init({
                              slug: {
                                sub: "",
                                onetime: "",
                              },
                            });
                            udata({
                              ...data,
                              slug: {
                                ...data["slug"],
                                sub: val
                                  .replace(
                                    /[!@#$%^`&*=?>+<\\\'\"]/g,
                                    accept[random]
                                  )
                                  .toLowerCase(),
                              },
                            });
                          }}
                          variant="standard"
                          name="link"
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </Box>

              <div className="flex relative items-center">
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
                  <Button
                    onClick={saveLink}
                    className="!py-3 !font-bold !px-6 !capitalize !flex !items-center !text-white !bg-[#f57059] !transition-all !delay-500 hover:!bg-[#fb4d2e] !m-auto !rounded-lg"
                  >
                    <MdInsertLink size={25} className="mr-1" /> Create Link
                  </Button>
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
