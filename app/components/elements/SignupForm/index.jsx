import { useState, useEffect } from "react";
import { data } from "../../../templates/origin/data";

import {
  Button,
  TextField,
  LinearProgress,
  Box,
  Alert
} from "@mui/material";

import Router from "next/router";
import { useCryptea } from "../../../contexts/Cryptea";
import Loader from "../loader";


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

  const submitForm = async () => {

    if (!isAuthenticated) {
      authenticate(true);

      setLoading(false);
    } else {
      window.scrollTo(0, 0);
      setLoading(true);
      let more = true;
      [userDescription, userEmail, userInfo].forEach((val) => {
        if (!val.length) {
          setError("Data Incomplete, Please required fields should be field");
          setLoading(false);
          more = false;
        }
      });

      if (!validator.isAlphanumeric(userInfo)) {
        setError("Username cannot contain spaces or special characters");
        setLoading(false);
        more = false;
      }

      if (!validator.isEmail(validator.normalizeEmail(userEmail))) {
        setError("The email provided is incorrect");
        setLoading(false);
        more = false;
      }

      if (more) {
        try {
          const email = await "user".get("email", true);

          if (!Boolean(email)) {
            try {
              const templateData = { name: "origin", data };

              await "user".update({
                username: userInfo,
                email: validator.normalizeEmail(userEmail),
              });

              await "links".save({
                slug: userInfo.toLowerCase(),
                amount: "variable",
                desc: userDescription,
                onetime: "[]",
                subscribers: "[]",
                address: account,
                views: "[]",
                type: "both",
                accountMulti: JSON.stringify([0.1, 10, 50, 100]),
                title: userInfo,
                template_data: JSON.stringify(templateData),
                rdata: '{"sub":[],"onetime":[]}',
              });
            } catch (err) {
              console.log(err);
              if (err.message) {
                setError(err.response.message);
              } else {
                setError("Something Went Wrong Please Try Again Later");
              }
              setLoading(false);
              return;
            }

            Router.push("/dashboard");
          } else {
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
          setLoading(false);
        }
      }
    }
};

useEffect(() => {
  if(isAuthenticated !== undefined){

    if(!isAuthenticated){
      authenticate(true);
    }

    setMLoader(false);
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
          method="POST"
          action="#"
          encType="multipart/form-data"
        >
          <div className="w-full flex justify-center mt-8">
            <div className="flex flex-col w-[900px] mx-7 items-center justify-center">
              <div className="flex flex-row border-b border-[#F57059] justify-start w-full">
                <div className="text-[#F57059] flex font-semibold py-4 w-full">
                  <span className="text-xl">Signup</span>
                </div>
              </div>
              {isLoading && (
                <Box className="text-[#F57059]" sx={{ width: "100%" }}>
                  <LinearProgress color="inherit" />
                </Box>
              )}

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
                      />
                    </div>
                  </div>
                  <div name="inputEmail" className="rounded-md mt-8">
                    <div className="flex">
                      <TextField
                        label={"Email"}
                        placeholder="wagmi@ngmi.eth"
                        value={userEmail}
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-end w-full mt-8">
                <Button
                  variant="contained"
                  type="submit"
                  className="!text-sm !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-4 !px-10"
                >
                  Save
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
