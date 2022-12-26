import { useState, useEffect } from "react";
import { data } from "../../../templates/origin/data";

import {
  Button,
  TextField,
  Box,
  Alert,
  InputAdornment,
  CircularProgress
} from "@mui/material";

import Router from "next/router";
import { useCryptea } from "../../../contexts/Cryptea";
import Loader from "../loader";
import LogoSpace from "../logo";
import { BiEnvelope, BiUserCircle, BiWallet } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";


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

  const [eoa, setAoa] = useState(true);

  const submitForm = async () => {

    if (!isAuthenticated) {
      authenticate(true);

      setLoading(false);
    } else {
      setLoading(true);
      let more = true;
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

      if(!validator.isEthereumAddress(userAddress) && !eoa){
          setError("A valid Ethereum address is required");
          setLoading(false);
          window.scrollTo(0, 0);
          more = false;
      }
      

      if (more) {
        try {
          const e = await "user".get("*", true);
          
          const acc = JSON.parse(e.accounts);

          if (!Boolean(e.email) || acc[0] == "null" || acc[0] == "undefined") {
            try {
              const templateData = { name: "origin", data };

              const def = {
                desc: userDescription,
                tz: window.jstz.determine().name(),
                username: userInfo,
              };

              let userObj = {
                email: validator.normalizeEmail(userEmail),
                init: true
              };

              if (!eoa) {
                userObj = {
                  address: userAddress,
                  eoa
                };
              }

              await "user".update({...userObj, ...def});

              await "links".save({
                slug: userInfo.toLowerCase(),
                amount: "variable",
                desc: userDescription,
                onetime: "[]",
                subscribers: "[]",
                address: eoa ? account : userAddress,
                views: "[]",
                type: "both",
                amountMulti: JSON.stringify([0.1, 10, 50, 100]),
                title: userInfo,
                template_data: JSON.stringify(templateData),
                rdata: '{"sub":[],"onetime":[]}',
              });
            } catch (err) {
              console.log(err);
              if (err.response.message) {
                setError(err.response.message);
              } else if (err.message) {
                setError(err.message);
              } else {
                setError("Something went wrong, please try again later");
              }
              setLoading(false);
              return;
            }
            console.log("sz");
            Router.push("/dashboard");
          } else {
            console.log("s");
            Router.push("/dashboard");
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          if (err.response) {
            setError(err.response.message);
          } else {
            setError("Something Went Wrong Please Try Again Later");
          }
          window.scrollTo(0, 0);
          setLoading(false);
        }
      }
    }
};

useEffect(() => {
  if(isAuthenticated !== undefined){

    if(!isAuthenticated){

      authenticate(true);

      setMLoader(false);

    }else{
      
      authenticate(false);

      ('user').get('*', true).then(e => {

        console.log(e)

        const addresses = JSON.parse(e.accounts);

        if (addresses[0] == "null" || addresses[0] == "undefined") {
          setAoa(false);
        }

        setMLoader(false);

      }).catch(err => {
        Router.push('/timeout');
      })
      
    }

  }
    
  }, [isAuthenticated, authenticate])


  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          method="POST"
          action="#"
          encType="multipart/form-data"
        >
          <div className="3md:w-[296px] 2mdd:w-[370px] w-[340px] mx-auto flex flex-col justify-center h-screen">
            <LogoSpace
              className="mx-auto"
              style={{
                marginBottom: "60px",
              }}
            />

            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row justify-start w-full">
                <div className="text-[rgb(32, 33, 36)] justify-center flex font-bold py-4 w-full">
                  <span className="text-[1.95rem] leading-[1.5rem]">
                    Signup
                  </span>
                </div>
              </div>
              

              {error.length > 0 && <Alert severity="error">{error}</Alert>}

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
                            color: "#f57059",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#f57059 !important`,
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
                            color: "#f57059",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `#f57059 !important`,
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
                              color: "#f57059",
                            },
                            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: `#f57059 !important`,
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
                          sx={{
                            "& .Mui-focused.MuiFormLabel-root": {
                              color: "#f57059",
                            },
                            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: `#f57059 !important`,
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

              <div className="flex flex-row w-full mt-3">
                <Button onClick={submitForm} className="!py-3 !w-full !mt-3 !font-bold !capitalize !flex !items-center !text-white !bg-[#F57059] !border-none !transition-all !delay-500 !rounded-lg !text-[17px]">
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
                  ) : (
                    <>Sign Up</>
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
