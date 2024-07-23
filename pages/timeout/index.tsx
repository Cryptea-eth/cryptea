import Nav from "../../app/components/elements/Nav";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@mui/material";
import { BiSync } from "react-icons/bi";
import Router from "next/router";

const Timeout = () => {
  return (
    <div className="h-screen">
      <Head>
        <title>Connection Timed out | Breew</title>
        <meta
          name="description"
          content="Breew - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="w-full h-fit flex flex-col justify-items-center mx-5 my-8">
        <h2 className="text-[#8036de] font-[400] 2sm:text-2xl text-4xl mx-auto mt-24">
          Oops... Connection Timed out
        </h2>

        <div className="mt-3 mx-auto">
          <h3 className="text-[#636363] mb-2 font-semibold text-center">
            How to fix?
          </h3>
          <ul className="pl-8 my-3">
            <li className="text-[#888888] list-item mb-1">
              {" "}
              - Check your internet connection, as no internet connectivity{" "}
              <br />
              might prevent some content from loading.
            </li>

            <li className="text-[#888888] list-item mb-1">
              {" "}
              - Try again in a few minutes.
            </li>

            <li className="text-[#888888] list-item mb-1"> - or Contact us.</li>
          </ul>
        </div>

        <span className="text-[#7e7e7e] font-semibold text-lg mx-auto mt-12">
          Click the button below, to try again
        </span>
        <div className="mx-auto mt-8">
          <Button
            onClick={() => Router.back()}
            className="!ml-2 hover:!bg-[#4a168e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#8036de] !text-white !font-semibold !py-3 !px-4 !mx-auto"
          >
            <BiSync size={22} className="mr-1" /> Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Timeout;
