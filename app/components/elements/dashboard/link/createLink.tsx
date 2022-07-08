import {
  Box,
  TextField,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  Button,
  AlertTitle
} from "@mui/material";
import { MdInfo, MdAddLink, MdInsertLink, MdPayment, MdPayments } from "react-icons/md";
import LogoSpace from "../../logo";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Loader from "../../loader";


export const NewLink = () =>{
    interface TabPanelProps {
      children?: React.ReactNode;
      index: number;
      value: number;
    }

    enum Type {
      sub,
      onetime,
    }

    function TabPanel(props: TabPanelProps) {
      const { children, value, index, ...other } = props;

      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              <div>{children}</div>
            </Box>
          )}
        </div>
      );
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

    interface Strings{
        [index:string]: string;
        sub: string;
        onetime: string;
    }

    interface data {
      title: Strings;
      amount: {
        [index:string]: number;
        sub: number;
        onetime: number;
      };
      desc: Strings;
      slug: Strings
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


    const [data, udata] = useState<data>({
      title: {
        sub: "",
        onetime: "",
      },
      amount: {
        sub: 0,
        onetime: 0,
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
      desc: {
        sub: "",
        onetime: "",
      },
      slug: {
        sub: "",
        onetime: "",
      }
    });

    const [success, usuccess] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(false);

    const init = (obj:object) => {
        uerror({
            ...error, ...obj
        });
        setLoading(false);
    }

    const checkError = ():boolean => {
        let e:any, t:boolean = false;

        for(e in error){
            const {sub, onetime} = error[String(e)];
            if (sub.length || onetime.length) {
                t = true;
            }
        }
        return t;
    }

    const saveLink = async () => {
        setLoading(true);
        document.querySelector('.linkadd')?.scrollIntoView()
        const index:string = value === Type.onetime ? 'onetime' : 'sub'; 

        const mainData:(number | string)[] = [ data.amount[index], data.desc[index], data.slug[index], data.title[index]];
        
        const indx = [
            "amount",
            "desc",
            "slug",
            "title"
        ];

        mainData.forEach((d, i) => {
            if(!Boolean(d)){
                const xx:{[index:string]: string} = {};

                xx[index] = "should not be left empty";
                
                init({ ...error[indx[i]],  ...xx });  
            }
        });

        if(!checkError()){
            
            if(!(/[^a-z]/gi.test((data.slug[index]).charAt(0)))){
                const xe = { ...error.slug };
                xe[index] = "Slug must start with an alphabet";
                init({
                    ...error.slug, 
                });
                return;
            } 
            
            if (/[!@#$%^`&*=?>+<\\\'\"]/g.test(data.slug[index])) {
                const xe = { ...error.slug };
                xe[index] = "Slug can only contain special character like ~, -, _";
                init({
                  ...error.slug,
                });

                return;
            }

           const Link = Moralis.Object.extend('link');
           const link = new Link();

           const mQ = new Moralis.Query(Link);
           mQ.equalTo("link", (data.slug[index]).toLowerCase());

            mQ.find().then(async ld => {
                if (ld === undefined) {
                  link?.set("link", data.slug[index].toLowerCase());
                  link?.set("amount", data.amount[index]);
                  link?.set("desc", data.desc[index]);
                  link?.set("title", data.title[index]);
                  link?.set(
                    "type",
                    value === Type.onetime ? "onetime" : "subscription"
                  );
                  link?.set("user", user);

                  try {
                    await link?.save();
                    window.location.href = "/dashboard/links";
                  } catch (e) {
                    const errorObject = e as Error;
                    setGenError(errorObject?.message);
                    setLoading(false);
                  }
                }else{
                    setGenError("Link slug has already been taken");
                    setLoading(false);
                }
            });    
        }
    }

    
        return (
          <>
            {loadpage && <Loader />}

            {!loadpage && (
              <div className="w-screen linkadd sm:px-2 px-10 flex justify-center items-center bg-pattern3 h-fit">
                <div className="w-full flex justify-center flex-col h-full backdrop-blur-[12px]">
                  <LogoSpace
                    style={{
                      marginBottom: 20,
                      marginTop: 20,
                    }}
                  />

                  <h2 className="font-[900] text-[30px] mt-0 flex items-center mx-auto mb-5">
                    <MdAddLink size={32} className="mr-1" /> Create A Link
                  </h2>

                  <div className="relative 2mmd:px-0 p-6 flex-auto">
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          aria-label="basic tabs"
                        >
                          <Tab
                            iconPosition="start"
                            icon={<MdPayment size={17} />}
                            label="One Time Payments"
                            {...a11yProps(0)}
                          />
                          <Tab
                            iconPosition="start"
                            icon={<MdPayments size={17} />}
                            label="Subscriptions"
                            {...a11yProps(1)}
                          />
                        </Tabs>
                      </Box>

                      {checkError() ||
                        (Boolean(genError.length) && (
                          <Alert className="w-full" severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {genError.length
                              ? genError
                              : "Something is up with your inputted data"}
                          </Alert>
                        ))}

                      {success && (
                        <Alert className="w-full" severity="success">
                          <AlertTitle>Success</AlertTitle>
                        </Alert>
                      )}

                      {isLoading && (
                        <Box className="text-[#121212]" sx={{ width: "100%" }}>
                          <LinearProgress color="inherit" />
                        </Box>
                      )}

                      <TabPanel value={value} index={0}>
                        <div className="mt-8 w-full overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                            <span className="uppercase font-semibold mr-3">
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
                                id="outlined-basic"
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
                                id="amount"
                                value={data["amount"]["onetime"]}
                                label="Amount"
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
                                      onetime: parseFloat(
                                        val.replace(/[^\d.]/g, "")
                                      ),
                                    },
                                  });
                                }}
                                name="amount"
                                type="text"
                                fullWidth
                              />
                            </div>
                          </div>
                          <div className="w-full sm:px-2 px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField
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
                                minRows={3}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 w-full overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                            <span className="uppercase font-semibold mr-3">
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
                        <div className="mt-8 w-full overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                            <span className="uppercase font-semibold mr-3">
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
                                id="amount"
                                value={data["amount"]["sub"]}
                                label="Amount"
                                variant="standard"
                                name="amount"
                                type="text"
                                helperText={error["amount"]["sub"]}
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
                                      sub: parseFloat(
                                        val.replace(/[^\d.]/g, "")
                                      ),
                                    },
                                  });
                                }}
                                fullWidth
                              />
                            </div>
                          </div>

                          <div className="w-full sm:px-2 px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField
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
                        <div className="mt-8 w-full overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                            <span className="uppercase font-semibold mr-3">
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

                    <Button
                      onClick={saveLink}
                      className="py-3 font-bold px-6 !capitalize flex items-center text-white bg-[#121212] transition-all delay-500 hover:bg-[#000] m-auto rounded-lg"
                    >
                      <MdInsertLink size={25} className="mr-1" /> Create Link
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
}

