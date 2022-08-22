import one from "../../../../public/images/one.svg";
import two from "../../../../public/images/two.svg";
import three from "../../../../public/images/three.svg";
import circle from "../../../../public/images/circle.svg";
import Supported from "../Supported";
import Image from "next/image";
import { HomeContextSet } from '../../../contexts/HomeContext';
import { useContext } from "react";

const About = () => {

  const useUpdateWalletModal = useContext(HomeContextSet);


  return (
    <div className="mx-[30px] mt-24 px-14 2md:px-4 2md:mx-1" id="about">
      <div className="w-[350px]">
        <span className="uppercase text-[#F57059] font-semibold text-[14px]">
          receive payments globally
        </span>
        <h1 className="text-black w-fit font-bold text-[29px] my-1">
          Accept Crypto Globally
        </h1>
        <span className="text-[#64607D] font-normal block text-[17px] mt-[10px]">
          We allow businesses to accept cryptocurrency payments globally. We&#39;re helping online merchants around the world accept cryptocurrency as easily as they accept credit cards or PayPal today.
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
            You’re good to go. Share your payment link, and receive crypto payment with ease.
          </span>
        </div>
        <div className="!absolute !-right-[5.406rem] !bottom-0 !z-[-1] !w-[290px]">

          <Image
            src={circle}
            alt="for you"
          />
        </div>
      </div>

      <div className="rounded-[14px] mt-[6rem] bg-cover h-[386px] bg-no-repeat m-auto max-w-[800px] bg-donation bg-[rgba(0,0,0,0.5)] bg-blend-color flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-center mx-auto w-[85%] text-[44px] mb-0 mt-[8px] mmd:text-[30px]">
          Receive payments on a global scale
        </h1>

        <span className="text-white mx-[10px] block text-[20px]">
          Secure subscriptions and payments in one platform/API.
        </span>

        <button
          onClick={useUpdateWalletModal}
          className="text-sm mmd:mt-10 hover:bg-[#ff320e] transition-all delay-500 rounded-[6rem] bg-[#F57059] mt-20 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
        >
          Connect Wallet
        </button>
      </div>

      <Supported />
    </div>
  );
};

export default About;
