import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { MdInfo } from "react-icons/md";
import {
  Button,
  Link,
  OutlinedInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  LinearProgress,
  Box,
  Alert,
} from "@mui/material";

const SignupForm = () => {
  const {
    isAuthenticated,
    user,
    authenticate,
    Moralis,
    isWeb3Enabled,
    enableWeb3,
    chainId
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



  const [userLink, setUserLink] = useState("");
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
                window.location.href = "/dashboard";
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
        user.set("username", userInfo);
        user.set("desc", userDescription);
        user.set("email", userEmail);

        const Links = Moralis.Object.extend("link");
        const link = new Links();
        link.set("link", (userLink.length ? userLink : userInfo).toLowerCase());
        link.set("amount", "variable");
        link.set("user", user);

        try {
          await user.save();
          await link.save();
        } catch (err) {
          console.log(err);
          setError(err.message);
          setLoading(false);
          return;
        }

        window.location.href = "/dashboard";
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
          <div className="rounded-[5px] border-[#C2C7D6] mt-8 w-full border-2 border-solid overflow-hidden">
            <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#F57059] text-white">
              <span className="uppercase font-semibold mr-3">Cryptea Link</span>
              <div className="flex items-center">
                <span className="mr-2 text-sm">
                  This is the link which enables other crypto enthusiasts tip
                  you. E.g cryptea.com/wagmi <br />
                  If left empty your username is used as default link
                </span>
                <MdInfo size={20} color="#fff" />
              </div>
            </div>

            <div className="w-full p-10">
              <div className="flex items-center ssm:flex-wrap">
                <TextField
                  label={"Enter Link Slug"}
                  placeholder="wagmi"
                  sx={{
                    "& .Mui-focused.MuiFormLabel-root": {
                      color: "#f57059",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: `#f57059 !important`,
                    },
                  }}
                  value={userLink}
                  onChange={(e) => {
                    const lk = e.target.value;
                    setUserLink(lk.replace(/[/\\.@#&?;:"'~,*^%|]/g, ""));
                    setError("");
                  }}
                  name="link"
                  fullWidth
                />
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
