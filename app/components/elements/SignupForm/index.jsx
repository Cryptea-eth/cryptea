import { useState, useEffect } from "react";
import { data } from "../../../templates/origin/data";
import {
  Button,
  TextField,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import analytics from "../../../../analytics";
import Router from "next/router";
import { useCryptea } from "../../../contexts/Cryptea";
import Loader from "../loader";
import LogoSpace from "../logo";
import { BiEnvelope, BiUserCircle, BiWallet } from "react-icons/bi";
import { MdArrowBack, MdArrowBackIos, MdOutlineDescription, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import SwipeableViews from "react-swipeable-views";
import TabPanel from "../dashboard/link/TabPanel";
import { PinField } from "react-pin-field";
import axios from 'axios';
import Link from "next/link";
import http from "../../../../utils/http";


const SignupForm = () => {

  const {
    validator,
    isAuthenticated,
    account,
    authenticate
  } = useCryptea();

  const [userDescription, setUserDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setuserInfo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setMLoader] = useState(true);

  const [userAddress, setUserAddress] = useState('');

  const [pins, setPin] = useState({
    newpin: "",
    renewpin: "",
  });  

  const [pinsVisibility, setPinVisibility] = useState({
    newpin: true,
    renewpin: true,
  });

  const [signState, setSignState] = useState(0);

  const [eoa, setAoa] = useState(true);

  const submitForm = async () => {


      setLoading(true);
      let more = true;

      if (!signState) {
        [userDescription, userInfo].forEach((val) => {
          if (!val.length) {
            setError("Data Incomplete, Please required fields should be field");
            setLoading(false);
            window.scrollTo(0, 0);
            more = false;
          }
        });

        if (!validator.isAlphanumeric(userInfo)) {
          setError("Username cannot contain spaces or special characters");
          setLoading(false);
          window.scrollTo(0, 0);
          more = false;
        }

        if (!validator.isEmail(userEmail) && eoa) {
          setError("The email provided is incorrect");
          setLoading(false);
          window.scrollTo(0, 0);
          more = false;
        }

        if (!validator.isEthereumAddress(userAddress) && userAddress.length && !eoa) {
          setError("A valid Ethereum address was not given");
          setLoading(false);
          window.scrollTo(0, 0);
          more = false;
        }


        setSignState(1);        

        setLoading(false);


      } else {
        
        // drop here - signup
        analytics.track("Signup", {
          email: userEmail,
          username: userInfo,
        });

        try {

          const Authorization = localStorage.getItem("userToken");

          const e =  Authorization === null ? { accounts: '[]', settlements: [], emails: false } : await "user".get("*", true);
          

          const acc = typeof e?.accounts === 'string' ? JSON.parse(e.accounts || '[]') : e.accounts;

          if (!Boolean(e.email) || (!Boolean(e.settlement ? e.settlement.length : 0) && (acc[0] == "null" || acc[0] == "undefined"))) {

            try {

              if (pins.newpin != pins.renewpin) {
                setError("Re-entered pin does not match new pin");
                setLoading(false);
                window.scrollTo(0, 0);
                more = false;

                return;
              }

              if (pins.newpin.length != 5) {

                setError("your pin is incorrect");
                setLoading(false);
                window.scrollTo(0, 0);
                more = false;

                return;
                
              }

              const templateData = { name: "origin", data };

              const def = {
                desc: userDescription,
                username: userInfo,
              };

              let userObj = {
                email: validator.normalizeEmail(userEmail),
                init: true
              };

              if (!eoa) {
                userObj = {
                  address: userAddress || '',
                  eoa
                };
              }

              const signData = {
                user: { ...userObj, ...def },
                host: window.origin,
                pins,
                link: {
                  slug: userInfo.toLowerCase(),
                  amount: "variable",
                  desc: userDescription,
                  onetime: "[]",
                  subscribers: "[]",
                  address: (eoa ? account : userAddress) || '',
                  views: "[]",
                  type: "both",
                  amountMulti: JSON.stringify([0.1, 10, 50, 100]),
                  title: userInfo,
                  template_data: JSON.stringify(templateData),
                  rdata: '{"sub":[],"onetime":[]}',
                },
              };

              

              const { data: mdata } = await http.post('/api/signup', signData, {
                baseURL: window.origin,
              });


              if (mdata.user !== undefined) {

                  const { token: mtoken, user } = mdata;

                  localStorage.setItem('userToken', mtoken);

                  localStorage.setItem("user", JSON.stringify(user));

              }
              

            } catch (err) {
              console.log(err);
              if (err.response) {

                setError(err.response.data.message);

              
              } else if (err.message) {
                setError(err.message);
              } else {
                setError("Something went wrong, please try again later");
              }
              setLoading(false);
              return;
            }
            // console.log("sz");
            Router.push("/dashboard");
          } else {
            // console.log("s");
            Router.push("/dashboard");
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          if (err.response) {
            setError(err.response.data.message);
          } else {
            setError("Something Went Wrong Please Try Again Later");
          }
          window.scrollTo(0, 0);
          setLoading(false);
        }
      }
};

useEffect(() => {
  if(isAuthenticated !== undefined){

    if(isAuthenticated){
        // console.log('erre')
      ('user').get('*', true).then(e => {

        const addresses = JSON.parse(e.accounts || '[]');

        if (!Boolean(e.settlement ? e.settlement.length : 0) && (addresses[0] == "null" || addresses[0] == "undefined")) {
          setAoa(false);

          setMLoader(false);
        }else if (Boolean(e.email)) {
         
          Router.push('/dashboard');
          
        }else{
          setMLoader(false);
        }

      }).catch(err => {
        Router.push('/timeout');
      })
      
    }else{

      setMLoader(false);

    }

  }
    
  }, [isAuthenticated])


  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="flex flex-col items-center justify-center h-screen "
          method="POST"
          action="#"
          encType="multipart/form-data"
        >
          <div className="w-full relative 3mdd:justify-between mb-[60px] flex items-center px-3">
            <LogoSpace className="ml-3" />

            <Link href="/dashboard/logout">
              <Button className="!text-sm !rounded-lg 3mdd:!relative !absolute !right-0 !text-[#8036de] !font-semibold 3mdd:!mx-0 !py-3 !px-3 !mx-2 !capitalize">
                <MdArrowBack className="mr-1" size={14} /> Log out
              </Button>
            </Link>
          </div>

          <div className="3md:w-[296px] 2mdd:w-[370px] w-[340px] mx-auto flex flex-col justify-center h-[calc(100vh-170px)]">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row justify-start w-full">
                <div className="text-[rgb(32, 33, 36)] justify-center flex font-bold py-4 items-center relative w-full">
                  {Boolean(signState) && (
                    <IconButton
                      size="large"
                      className="cursor-pointer !p-[10px] absolute left-0 flex items-center justify-center"
                      onClick={() => setSignState(0)}
                    >
                      <MdArrowBackIos
                        color={"rgb(32,33,36)"}
                        className="relative left-1"
                        size={20}
                      />
                    </IconButton>
                  )}

                  <span className="text-[1.95rem] block leading-[2.5rem]">
                    Signup
                  </span>
                </div>
              </div>

              {error.length > 0 && (
                <Alert className="w-full mt-[10px]" severity="error">
                  {error}
                </Alert>
              )}

              <SwipeableViews className="w-full" index={signState}>
                <TabPanel value={signState} index={0}>
                  <div className="username w-full">
                    <div className="mt-8">
                      <div name="inputName" className="rounded-md">
                        <div className="flex">
                          <TextField
                            label={"Username"}
                            value={userInfo}
                            fullWidth
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#8036de",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: `#8036de !important`,
                                },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BiUserCircle size={20} color={"#121212"} />
                                </InputAdornment>
                              ),
                            }}
                            placeholder="wagmi"
                            name="username"
                            onChange={(e) => {
                              setError("");
                              setuserInfo(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div name="inputDescription" className="rounded-md mt-8">
                        <div className="flex">
                          <TextField
                            label={"Description"}
                            placeholder="I created Ethereum"
                            value={userDescription}
                            onChange={(e) => {
                              setUserDescription(e.target.value);
                              setError("");
                            }}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#8036de",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: `#8036de !important`,
                                },
                            }}
                            name="desc"
                            fullWidth
                            multiline
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdOutlineDescription
                                    size={20}
                                    color={"#121212"}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </div>
                      <div className="rounded-md mt-8">
                        <div className="flex">
                          {eoa ? (
                            <TextField
                              label={"Email"}
                              placeholder="wagmi@ngmi.eth"
                              value={userEmail}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <BiEnvelope size={20} color={"#121212"} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#8036de",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#8036de !important`,
                                  },
                              }}
                              onChange={(e) => {
                                setUserEmail(e.target.value);
                                setError("");
                              }}
                              name="email"
                              fullWidth
                            />
                          ) : (
                            <TextField
                              label={"Ethereum Address"}
                              placeholder="0x340..."
                              value={userAddress}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <BiWallet size={20} color={"#121212"} />
                                  </InputAdornment>
                                ),
                              }}
                              helperText={"Not required"}
                              sx={{
                                "& .Mui-focused.MuiFormLabel-root": {
                                  color: "#8036de",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: `#8036de !important`,
                                  },
                              }}
                              onChange={(e) => {
                                setUserAddress(e.target.value);
                                setError("");
                              }}
                              name="Ethereum Address"
                              fullWidth
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value={signState} index={1}>
                  <div className="username w-full">
                    <div className="mt-2">
                      <div name="inputName" className="rounded-md">
                        <div className="flex text-[#565656] items-center justify-between">
                          <label className="text-[#565656] mb-2 font-[400]">
                            New Pin
                          </label>

                          <IconButton
                            onClick={() =>
                              setPinVisibility({
                                ...pinsVisibility,
                                newpin: !pinsVisibility["newpin"],
                              })
                            }
                            size={"medium"}
                          >
                            {pinsVisibility["newpin"] ? (
                              <MdOutlineVisibility size={23} />
                            ) : (
                              <MdOutlineVisibilityOff size={23} />
                            )}
                          </IconButton>
                        </div>
                        <div className="flex justify-center item-center ">
                          <PinField
                            type={
                              !pinsVisibility["newpin"] ? "text" : "password"
                            }
                            length={5}
                            onComplete={(e) => setPin({ ...pins, newpin: e })}
                            className="font-[inherit] outline-none border border-[#d3d3d3] h-[3.6rem] text-center transition-all focus:border-[#8036de] focus:border-2 text-[1.6rem] hover:border-[#121212] w-[3.6rem] rounded-[.5rem] mx-auto"
                            validate={/^[0-9]$/}
                          />
                        </div>
                      </div>

                      <div name="inputName" className="rounded-md mt-2">
                        <div className="flex text-[#565656] items-center justify-between">
                          <label className="text-[#565656] mb-2 font-[400]">
                            Re enter Pin
                          </label>

                          <IconButton
                            onClick={() =>
                              setPinVisibility({
                                ...pinsVisibility,
                                renewpin: !pinsVisibility["renewpin"],
                              })
                            }
                            size={"medium"}
                          >
                            {pinsVisibility["renewpin"] ? (
                              <MdOutlineVisibility size={23} />
                            ) : (
                              <MdOutlineVisibilityOff size={23} />
                            )}
                          </IconButton>
                        </div>
                        <div className="flex justify-center item-center ">
                          <PinField
                            type={
                              !pinsVisibility["renewpin"] ? "text" : "password"
                            }
                            length={5}
                            onComplete={(e) => setPin({ ...pins, renewpin: e })}
                            className="font-[inherit] outline-none border border-[#d3d3d3] h-[3.6rem] text-center transition-all focus:border-[#8036de] focus:border-2 text-[1.6rem] hover:border-[#121212] w-[3.6rem] rounded-[.5rem] mx-auto"
                            validate={/^[0-9]$/}
                          />
                        </div>
                        <span className="text-[#7c7c7c] mt-3 block font-[500] text-[14px]">
                          <b>Please Note: </b> Forgetting your pin or your pin
                          getting into the wrong hands, could lead to loss of
                          funds, please keep it safe.
                        </span>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </SwipeableViews>

              <div className="flex flex-row w-full mt-3">
                <Button
                  onClick={submitForm}
                  className="!py-3 !w-full !mt-3 !font-bold !capitalize !flex !items-center !text-white !bg-[#8036de] !border-none !transition-all !delay-500 !rounded-lg !text-[17px]"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-3 h-[20px] text-[#fff]">
                        <CircularProgress
                          color={"inherit"}
                          className="!w-[20px] !h-[20px]"
                        />
                      </div>{" "}
                      <span>Just a sec...</span>
                    </>
                  ) : !signState ? (
                    <>Next</>
                  ) : (
                    <>Sign up</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default SignupForm;
