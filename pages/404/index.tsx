import Nav from "../../app/components/elements/Nav";
import Link from "next/link";
import Head from 'next/head'
import { Button } from "@mui/material";
const Notfound = () => {
  return (
    <div className="h-screen">
      <Head>
        <title>404 not found | Cryptea</title>
        <meta
          name="description"
          content="Cryptea - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="w-full h-fit flex flex-col justify-items-center my-8">
        <h2 className="text-black font-bold text-4xl mx-auto mt-24">
          We think we lost you
        </h2>

        <h3 className="text-[#F57059] font-semibold text-lg mx-auto mt-12">
          Click this button, and let&#39;s get you found
        </h3>
        <div className="mx-auto mt-8">
          <Link href="/">
            <a className="text-center mt-3">
              <Button className="!ml-2 hover:!bg-[#ff320e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-3 !px-4 !mx-auto">
                Find me
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
