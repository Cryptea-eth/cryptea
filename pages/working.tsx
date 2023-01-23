import Nav from "../app/components/elements/Nav";
import Head from "next/head";
import Image from "next/image";
import soon from "../public/images/coming-soon.svg";

const Working = () => {
  return (
    <div className="h-screen">
      <Head>
        <title>Working it out | Cryptea</title>
        <meta
          name="description"
          content="Cryptea - Receive Tips on a whole new level."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <div className="w-full h-fit flex flex-col justify-items-center my-8">
        <div className="mx-auto">
                <Image src={soon} width={300} height={300} alt="coming soon"/>
        </div>
        <div className="text-black font-bold text-4xl mx-auto mt-10">
            This feature is coming soon
        </div>
        <div className="text-[#aa9996] font-semibold text-lg mx-auto mt-12">
          We are still working on this feature and would be done soon
        </div>
      </div>
    </div>
  );
};

export default Working;
