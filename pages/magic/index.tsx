import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import LogoSpace from '../../app/components/elements/logo';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { post_request } from "../../app/contexts/Cryptea/requests";
import { AxiosError } from "axios";
import { useCryptea } from "../../app/contexts/Cryptea";
import { BiEnvelope } from "react-icons/bi";
import Image from 'next/image';
import emailImg from "../../public/images/email_success.svg";
import { useRouter } from "next/router";
import Loader from "../../app/components/elements/loader";

const Magic = () => {

    const { validator } = useCryptea();

    const [email, setEmail] = useState<string>('');

    const [user, setUser] = useState<boolean>(true);

    const [loading, isLoading] = useState<boolean>(false);

    const [success, setSuccess] = useState<boolean>(false);

    const [error, setError] = useState<string>('');

    const router = useRouter();

    const { isAuthenticated } = useCryptea();

    const [loader, setLoader] = useState<boolean>(true);

    useEffect(() => {
      if (isAuthenticated !== undefined) {
        if(isAuthenticated){
            router.push('/dashboard');
        }else{
          setLoader(false);
        }
      }
    }, [isAuthenticated, router])

    const auth = async () => {
        if (loading) {
            return false;
        }

        isLoading(true);

        if (!validator.isEmail(email)) {

            setError('Email is incorrect');

            isLoading(false)

        }

        try {

           const req = await post_request("/login/magic/request", {
              email: validator.normalizeEmail(email),
            });

            isLoading(false);

            setUser(req.data.user)              

            setSuccess(true);

        }catch (err) {
            const error = err as AxiosError;

            isLoading(false);

            if (error.message) {
                setError(error.message);
            }else if(error.response?.data){

                const errDx:any = error.response?.data;

                setError(errDx.message);

            }

            console.log(error, 'eor');
        }
    }

    return !loader ? (
      <div className="flex h-screen items-center flex-col justify-center">
        <Head>
          <title>Request Magic Link | Cryptea</title>
          <meta
            name="description"
            content="Cryptea - Receive Payments Instantly With Ease."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
          style={{
            height: success ? "60px" : "90px",
          }}
        >
          <LogoSpace
            className="mx-auto"
            style={{
              marginBottom: "5px",
            }}
          />
        </div>

        {success ? (
          <div className="flex flex-col justify-center items-center">
            <Image
              src={emailImg}
              width={70}
              height={81}
              alt={"magic link sent"}
            />

            <h2 className="mt-4 mb-2 font-bold text-[25px]">
              Check your Email
            </h2>
            <span className="text-[18px] block text-center w-[320px] mx-auto font-[500]">
              {user
                ? "Magic link sent successfully, check your email and click the link provided to sign in."
                : "Magic link sent successfully, check your email and click the link provided to sign up, or refresh the page to try another email address."}
            </span>
          </div>
        ) : (
          <>
            <h2 className="text-[rgb(32,33,36)] mb-[32px] font-[600] flex items-center justify-between relative mx-auto text-center text-[1.95rem] leading-[1.5rem]">
              Welcome
            </h2>

            <div className="3md:w-[296px] 2mdd:w-[370px] w-[340px] px-2">
              <TextField
                value={email}
                onChange={(e: any) => {
                  setEmail(e.target.value);
                }}
                className="bg-[white] mb-2"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BiEnvelope size={20} color={"#121212"} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiFormLabel-root": {
                    color: "#f57059",
                    borderColor: `#f57059 !important`,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `#f57059 !important`,
                    borderWidth: `2px`,
                  },
                }}
                label={"Email"}
                fullWidth
                helperText={Boolean(error) ? error : ""}
                error={Boolean(error)}
                placeholder="hello@cryptea.me"
              />

              <Button
                onClick={auth}
                className="!py-3 !w-full !mt-3 !font-bold !capitalize !flex !items-center !text-white !bg-[#F57059] !border-none !transition-all !delay-500 !rounded-lg !text-[17px]"
              >
                {loading ? (
                  <>
                    <div className="mr-3 h-[20px] text-[#fff]">
                      <CircularProgress
                        color={"inherit"}
                        className="!w-[20px] !h-[20px]"
                      />
                    </div>{" "}
                    <span>Sending...</span>
                  </>
                ) : (
                  <>Send link</>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    ) : (
      <Loader />
    );
}

export default Magic;