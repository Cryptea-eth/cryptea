import Nav from "../../app/components/elements/Nav";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@mui/material";
import { BiSync } from "react-icons/bi/index.js";
import Router from "next/router";

const Usedkey = () => {
  return (
    <div className="h-screen">
      <Head>
        <title>Used Reference Key | Breew</title>
        <meta
          name="description"
          content="Breew - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="w-full h-fit flex flex-col justify-items-center mx-5 my-8">
        <h2 className="text-[#8036de] font-[400] 2sm:text-2xl text-4xl mx-auto mt-24">
          Oops... Incorrect transaction reference
        </h2>

        <div className="mt-3 mx-auto">
          <h3 className="text-[#636363] mb-2 font-semibold text-center">
            How to fix?
          </h3>
          <ul className="pl-8 my-3">
            <li className="text-[#888888] list-item mb-1">
              {" "}
              - You would have to go back to original site/app that linked you
              here <br /> and try clicking their pay button or re-querying
              payment again.
            </li>

            <li className="text-[#888888] list-item mb-1">
              {" "}
              - Complain to the customer care of the site/app that linked you
              here,
              <br /> its most likely payment has been completed by you earlier.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Usedkey;
