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

  const [mail, setEmail] = useState('');

  let count: any;

  const startTimer = () => {
    setTimer((timer) => timer + 1);

    count = setTimeout(startTimer, 1000);
  };

  const runOnce = useRef<boolean>(false);

  useEffect(() => {
    if (!runOnce.current) {

        runOnce.current = true;
        
        "user".get("*", true).then(async (e: any) => {

            
            if (!Boolean(e.email_verified_at) && Boolean(e.email)) {
            setEmail(e.email);

            const mx = await post_request("/verify/mail", {
              mail: e.email,
            });

            if (Boolean(mx.data.time)) {
              setTimer(mx.data.time);
            }

            startTimer();

            setLoading(false);
          } else {
            Router.push("/dashboard");
          }
              console.log("here");    
        });
    }
  }, []);

  useEffect(() => {
    if (timer >= 300) {
      clearTimeout(count);

      setTimer(0)

    }
  }, [timer]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="h-screen">
      <Head>
        <title>We Just Sent a Verification Mail - Cryptea</title>
        <meta
          name="description"
          content="Cryptea - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="w-full h-fit flex flex-col justify-items-center my-8">
        <Image src={emailImg} width={200} height={222} alt={"Email Sent"} />

        <h2 className="text-[#F57059] font-[400] text-4xl mx-auto mt-24">
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

                  startTimer();

                  setLoading(false);
                });
              }
            }}
            className="!mr-2 hover:!bg-[#ff320e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-3 !px-4 !mx-auto"
          >
            <BiSync size={22} className="mr-1" /> Resend
          </Button>

          <span className="text-[18px] font-semibold text-[#7e7e7e]">
            {String((300 - timer) / 60).split(".")[0] +
              ":" +
              `${(300 - timer) % 60 <= 9 ? 0 : ""}${(300 - timer) % 60}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Email;