import Nav from "../../../app/components/elements/Nav";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@mui/material";
import { BiSync } from "react-icons/bi";
import Router from "next/router";
import Loader from "../../../app/components/elements/loader";
import { useState, useEffect, useRef } from "react";
import emailImg from "../../../public/images/email_success.svg";
import Image from "next/image";
import { post_request } from "../../../app/contexts/Cryptea/requests";

const Email = () => {

  const [isLoading, setLoading] = useState<boolean>(true);

  const [timer, setTimer] = useState<number>(0);

  const [resend, setResend] = useState<boolean>(false);

  const [mail, setEmail] = useState('');

  let count = useRef<any>();

  const startTimer = () => {
    
   count.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);

  };

  const runOnce = useRef<boolean>(false);

  useEffect(() => {
    if (!runOnce.current) {

        runOnce.current = true;
        
        "user".get("*", true).then(async (e: any) => {
            
            if (!Boolean(e.isEmailVerified) && Boolean(e.email)) {
            
                setEmail(e.email);

            const mx = await post_request("/verify/mail", {
              mail: e.email,
            });

            if (Boolean(mx.data.time)) {
              
              setTimer(mx.data.time);
            }

            setTimer(0);

            startTimer();

            setLoading(false);

          } else {
            
            Router.push("/dashboard");

          }
        });
    }
  }, []);

  useEffect(() => {
    
    if (timer >= 300) {
      clearInterval(count.current);
      setResend(true);
    }

  }, [timer]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="h-screen">
      <Head>
        <title>We Just Sent a Verification Mail | Breew</title>
        <meta
          name="description"
          content="Breew - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <div className="flex flex-col justify-center items-center h-[calc(100vh-75px)]">
      <div className="w-full h-fit flex flex-col justify-items-center px-5 my-8">
        <Image src={emailImg} width={70} height={82} alt={"Email Sent"} />

        <h2 className="text-[#8036de] 2md:text-2xl font-[400] text-4xl mx-auto mt-9">
          We Sent a Verification Mail
        </h2>

        <span className="text-[#7e7e7e] font-semibold text-lg mx-auto mt-12">
          Didnt receive the mail, click the button below to resend
        </span>
        <div className="mx-auto flex items-center mt-8">
          <Button
            style={{
              opacity: timer / 300,
            }}
            onClick={() => {
              if (timer >= 300) {
                setLoading(true);

                post_request("/verify/mail", {
                  mail,
                }).then((e) => {
                  if (Boolean(e.data.time)) {
                    setTimer(e.data.time);
                  }

                  setTimer(0);

                  startTimer();

                  setResend(false);

                  setLoading(false);
                });
              }
            }}
            className="!mr-2 hover:!bg-[#4a168e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#8036de] !text-white !font-semibold !py-3 !px-4 !mx-auto"
          >
            <BiSync size={22} className="mr-1" /> Resend
          </Button>

          {resend ? <></> : <span className="text-[18px] font-semibold text-[#7e7e7e]">
            {String((300 - timer) / 60).split(".")[0] +
              ":" +
              `${(300 - timer) % 60 <= 9 ? 0 : ""}${(300 - timer) % 60}`}
          </span>}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Email;
