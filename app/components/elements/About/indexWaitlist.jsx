import one from "../../../../public/images/one.svg";
import two from "../../../../public/images/two.svg";
import three from "../../../../public/images/three.svg";
import circle from "../../../../public/images/circle.svg";
import Supported from "../Supported";
import Image from "next/image";
import { HomeContextSet } from "../../../contexts/HomeContext";
import { useContext, useState } from "react";
import { LinearProgress, Box } from "@mui/material";
import axios from "axios";


const AboutWaitlist = () => {
  const useUpdateWalletModal = useContext(HomeContextSet);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false)

  const addToWait = () => {
    setLoading(true)
    setError('');
    setSuccess('');
    let go = true;
    [email, name].forEach(v => {
        if (!v.length) {
          setError('All fields must be filled')
          go = false;
          return
        }
    })

    if (go) {
      axios.post('https://cryptea.com/waitlist', {
        name, email
      }).then(d => {
         const {status, error} = d.data
         setLoading(false)
         if (error) {
            setError(status)
         }else{
            setSuccess("You have successfully been added to the waitinglist, and would be notified when we launch")
         }

      });

    }
}

  return (
    <div className="mx-[30px] mt-24 px-14 2md:px-4 2md:mx-1" id="about">
      <div className="w-[320px]">
        <span className="uppercase text-[#F57059] font-semibold text-[14px]">
          receive tips daily
        </span>
        <h1 className="text-black w-fit font-bold text-[29px] my-1">
          We have an easy signup process
        </h1>
        <span className="text-[#64607D] font-normal block text-[17px] mt-[10px]">
          As we are based on Web3, we provide the simplest way to receive
          payments from your fans, without needing to compromise your data
        </span>

        <button
          onClick={useUpdateWalletModal}
          className="text-sm hover:bg-[#ff320e] transition-all delay-500 rounded-[6rem] bg-[#F57059] mt-2 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
        >
          Connect Wallet
        </button>
      </div>

      <div className="w-[calc(100% - 6rem)] md:mt-[10pc] md:flex-wrap sm:w-full sm:ml-0 relative justify-around flex items-center mt-[19rem] ml-24">
        <div className="w-[232px] md:min-w-[232px] mmd:w-full md:mr-4 relative">
          <Image
            src={one}
            alt="step one"
            className="absolute bottom-[48px] right-0"
          />
          <h4 className="font-bold">Connect wallet</h4>
          <span className="text-[#64607D]">
            Easily connect to your metamask wallet. You’d also need to sign a
            message, to show ownership.
          </span>
        </div>

        <div className="w-[240px] md:min-w-[240px] mmd:w-full mmd:mt-[10pc] relative md:mt-0 mt-[-24pc]">
          <Image
            src={two}
            alt="step one"
            className="absolute bottom-[48px] right-0"
          />
          <h4 className="font-bold">Setup payment link</h4>
          <span className="text-[#64607D]">
            Once signed, you have the liberty to create a personalised link, and
            receive payments.
          </span>
        </div>

        <div className="w-[280px] md:min-w-[280px] mmd:w-full relative md:mt-[10pc] mt-[-51pc]">
          <Image
            src={three}
            alt="step one"
            className="absolute bottom-[48px] right-0"
          />
          <h4 className="font-bold">Receive payments</h4>
          <span className="text-[#64607D]">
            You’re good to go. Share your payment link, and receive crypto from
            your fans.
          </span>
        </div>
        <div className="!absolute !-right-[5.406rem] !bottom-0 !z-[-1] !w-[290px]">
          <Image src={circle} alt="for you" />
        </div>
      </div>

      <div
        className="rounded-[14px] mt-[6rem] bg-contain h-[386px] bg-no-repeat m-auto max-w-[800px] bg-donation bg-[rgba(0,0,0,0.75)]  bg-blend-overlay flex flex-col justify-center items-center"
        id="waitlist"
      >
        <h1 className="text-white font-bold text-center mx-auto w-[85%] text-[44px] mb-0 mt-[8px] mmd:text-[30px]">
          {/* Receive donations on another level */}
          Join our waitlist
        </h1>

        <span className="text-white mx-[10px] block text-[20px]">
          {/* Secure Donations and payments in one platform. */}
          Sign up to be notified first, once we launch
        </span>

        <div className="mx-[10px]">
          {loading && (
            <Box className="text-[#F57059]" sx={{ width: "100%" }}>
              <LinearProgress color="inherit" />
            </Box>
          )}
          {Boolean(error.length) && (
            <div className="rounded-md w-full p-2 bg-[#ff3535] my-2 text-white">
              {error}
            </div>
          )}

          {Boolean(success.length) && (
            <div className="rounded-md w-full p-2 bg-[#44b900] my-2 text-white">
              {success}
            </div>
          )}

          <div className="w-full mt-4 flex">
            <div className="mr-2 w-full">
              <label className="block text-white text-sm font-medium mb-2">
               
                Name{" "}
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-[#ff320e]"
                id="username"
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                type="text"
                placeholder="Wagmi"
              />
            </div>

            <div className="ml-2 w-full">
              <label className="block text-white text-sm font-medium mb-2">
                {" "}
                Email Address{" "}
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-[#ff320e]"
                id="email"
                type="email"
                onChange={(e) => {
                  let val = e.target.value;
                  if (
                    val.match(
                      /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
                    ) != null
                  ) {
                    setEmail(val);
                    setError("");
                  } else {
                    setError("Your email seems incorrect");
                  }

                   setSuccess("");
                }}
                placeholder="hello@cryptea.me"
              />
            </div>
          </div>
        </div>

        <button
          onClick={addToWait}
          className="text-sm mmd:mt-5 hover:bg-[#ff320e] transition-all delay-500 rounded-[6rem] bg-[#F57059] mt-5 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
        >
          Submit
        </button>
      </div>

      <Supported />
    </div>
  );
};

export default AboutWaitlist;
