import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import image1 from "../../../public/images/cryptea1.png";

const Droplets = () => {
  return (
    <div className="w-screen">
      <Head>
        <title>Droplets</title>
      </Head>

      <div className="h-screen overflow-y-scroll flex flex-col justify-center justify-items-center">
        <div className="w-6/12 flex flex-col self-center border rounded-2xl px-10 py-4 pb-10">
          <div className="logo mb-10 py-5 self-center">
            <Image className="rounded-full border-2" src={image1} alt="cryptea" width={37.5} height={37.5} />
          </div>

          {/* Title & description */}
          <div className="text self-center text-center mb-5">
            <div className="text-2xl font-semibold">Droplets</div>
            <div className="text-lg font-base">Like droplets to the rain, our template completes your crowdfunding experience.</div>
          </div>

          {/* Buttons */}
          <div className="buttons flex justify-between">
            <button className="bg-[#F57059] text-white px-6 py-3 rounded-full">View Droplets</button>
            <button className="bg-[#F57059] text-white px-6 py-3 rounded-full">Fund campaign</button>
          </div>

          <div className="w-full flex flex-col mt-5">
            {/* Amount so far */}
            <div className="topCont flex justify-around items-start">
              <div className="priceProgress">
                <h2 className="text-xl font-bold">$89,914</h2>
                <p>of $100,000 droplets</p>
              </div>

              {/* Total Backers */}
              <div className="w-[1px] h-[40px] bg-black"></div>
              <div className="totalbackers">
                <h2 className="text-xl font-bold">5,007</h2>
                <p>total backers</p>
              </div>

              {/* Days Left */}
              <div className="w-[1px] h-[40px] bg-black"></div>
              <div className="daysLeft">
                <h2 className="text-xl font-bold">56</h2>
                <p>days left</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="border border-[#f57059] h-[10px] w-full rounded-full relative">
                <div className="progressBar relative w-[75%] h-full rounded-full bg-[#f57059]"></div>
              </div>
            </div>

            {/* About the project */}
            <div className="pt-3 scroll-mt-3 mt-4 p-4">
              <div className="p-1">
                <header>
                  <h2 className="text-xl font-bold mb-3">About the project</h2>
                </header>

                <article>
                  <p className="mb-3">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia aliquid quibusdam sunt iste. Atque tempore iure asperiores sit animi. Ipsam laborum totam praesentium impedit.
                  </p>
                </article>
              </div>
            </div>

            {/* Rewards */}
            {/* <div className="p-4">
              <div className="p-1">
                <header>
                  <h2 className="text-xl font-bold mb-3">Rewards</h2>
                </header>
              </div>

            </div> */}

            {/* Donate now button */}
            <div className="flex justify-center mt-5">
              <button className="bg-[#F57059] text-white w-full py-4 rounded-md">Donate now</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Droplets;