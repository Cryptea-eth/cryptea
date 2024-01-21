import Nav from "../../app/components/elements/Nav";
import Link from "next/link";
import Router from 'next/router'
import Head from "next/head";
import { Button } from "@mui/material";
const Notfound = () => {

  return (
    <div className="h-screen">
      <Head>
        <title>404 page not found | Cryptea</title>
        <meta
          name="description"
          content="Cryptea - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="w-full h-fit flex flex-col justify-items-center my-8">
        <h2 className="text-black font-bold text-4xl mx-auto mt-24">
          Oops... Page not found
        </h2>

        <h3 className="text-[#F57059] font-semibold text-lg mx-auto mt-12">
          Click this button below, to go back home
        </h3>
        <div className="mx-auto mt-8">
          <Link href="/dashboard">
            <a className="text-center mt-3">
              <Button className="!ml-2 hover:!bg-[#ff320e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-3 !px-4 !mx-auto">
                Go home
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
