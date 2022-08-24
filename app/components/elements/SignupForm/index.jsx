import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { data } from "../../../templates/origin/data";

import {
  Button,
  TextField,
  LinearProgress,
  Box,
  Alert
} from "@mui/material";
import Router from "next/router";

const SignupForm = () => {
  const {
    isAuthenticated,
    user,
    authenticate,
    Moralis,
    isWeb3Enabled,
    enableWeb3
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Logged in user:", user.get("ethAddress"));
    } else {
      console.log("Not logged in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [enableWeb3, isWeb3Enabled]);


  const [userDescription, setUserDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setuserInfo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitForm = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    let more = true;
    [userDescription, userEmail, userInfo].forEach((val) => {
      if (!val.length) {
        setError("Data Incomplete, Please required fields should be field");
        setLoading(false);
        more = false;
        return;
      }
    });

    if (!error.length) {
      if (!isAuthenticated) {
        await authenticate({ signingMessage: "Welcome to Cryptea" })
          .then(function (user) {
            if (user.get("email") !== undefined) {
              if (user.get("email").length) {
                Router.push('/dashboard');
              }
            }
          })
          .catch(function (error) {
            setError(error);
            console.log(error);
            setLoading(false);
            return;
          });
      }

      if (user.get("email") === undefined) {

        const templateData = { name: 'origin', data}

        user.set("username", userInfo);
        user.set("desc", userDescription);
        user.set("email", userEmail);
        user.set("link", userInfo);


        const Links = Moralis.Object.extend("link");
        const link = new Links();

        link?.set("link", userInfo.toLowerCase());
        link?.set("amount", "variable");
        link?.set("desc", userDescription);
        link?.set("onetime", "[]");
        link?.set("subscribers", "[]");
        link?.set("amountMulti", JSON.stringify([0.1, 10, 50, 100]));
        link?.set("type", "both");
        link?.set("user", user);
        link?.set("template_data", JSON.stringify(templateData));

        try {
          await user.save();
          await link.save();
        } catch (err) {
          console.log(err);
          setError(err.message);
          setLoading(false);
          return;
        }

        Router.push('/dashboard');

      } else {
        setError("Logout of your current wallet to sign up");
        setLoading(false);
      }
    }
  };

  return (
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
                    placeholder="wagmi.eth"
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
              {isAuthenticated ? "Save" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
