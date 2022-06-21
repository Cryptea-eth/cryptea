import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import Head from 'next/head';
import {
  TextField,
  Box,
  IconButton,
  InputLabel,
  LinearProgress,
  FormControl,
  OutlinedInput,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import Nav from "../../app/components/elements/Nav";
const LoginForm = () => {

  const [user, setUser] = useState('');
  const [pass, setPass] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    isAuthenticated,
    isAuthenticating,
    Moralis,
    isWeb3Enabled,
    enableWeb3,
    chainId,
    isWeb3EnableLoading,
  } = useMoralis();
  const [viewPass, setViewPass] = useState(false);

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [enableWeb3, isWeb3Enabled]);

  const submitForm = async () => {

    if (!isAuthenticated) {
      window.scrollTo(0, 0);
      setLoading(true);
      let more = true;
      [user, pass].forEach((val) => {
        if (!val.length) {
          setError("Password or username incorrect");
          setLoading(false);
          more = false;
          return;
        }
      });

      if (more) {
        if (pass.length < 6) {
          setError("Password or username incorrect");
          setLoading(false);
        }
      }

      if (!error.length) {
        if (!isAuthenticated) {
          try {

            Moralis.User.logIn(user, pass, {
              usePost: true,
            }).then(req => {
              window.location.reload()
            }).catch(err => {
              setError(err.message);
              setLoading(false);

            });

          } catch (err) {
            setError(err.message);
            setLoading(false);
            return;
          }

        } else {
          window.location.href = "/#/dashboard";
        }
      }
    } else {
      window.location.href = "/#/dashboard";
    }
  };


  return (
    <div>
      <Head>
        <title>Login | Cryptea</title>
        <meta name="description" content={`Receive tips/donations on another level`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <form
        action=""
        method="POST"
        encType="multipart/form-data"
        onSubmit={(c) => {
          c.preventDefault();
          submitForm();
        }}
      >
        <div className="w-full flex justify-center mt-8">
          <div className="flex flex-col w-[900px] mx-7 items-center justify-center">
            <div className="flex flex-row border-b border-[#F57059] justify-start w-full">
              <div className="text-[#F57059] font-semibold text-xl py-4">
                Login
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
                      value={user}
                      fullWidth
                      placeholder="wagmi.eth"
                      name="username"
                      onChange={(e) => {
                        setError("");
                        setUser(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div name="inputDescription" className="rounded-md mt-8">
                  <div className="flex">

                    <FormControl
                      sx={{
                        width: "100%",
                      }}
                      variant="outlined"
                    >
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        id="password"
                        type={viewPass ? "text" : "password"}
                        value={pass}
                        onChange={(e) => {
                          setPass(e.target.value);
                          setError("");
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setViewPass(!viewPass)}
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              edge="end"
                            >
                              {viewPass ? (
                                <MdVisibilityOff />
                              ) : (
                                <MdVisibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        placeholder="******"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center w-full mt-8">
              <Button
                type="submit"
                variant="contained"
                className="!text-sm !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-4 !px-10"
              >
                {isAuthenticated ? "Save" : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
