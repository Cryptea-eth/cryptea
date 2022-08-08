import Image from "next/image";
import { useContext } from "react";
import logo from "../../../../public/images/img.svg";
import desktop from "../../../../public/images/desktop.png";
import desktop1 from "../../../../public/images/desktop1.png";
import desktop2 from "../../../../public/images/desktop2.png";
import desktop3 from "../../../../public/images/desktop3.png";
import check from "../../../../public/images/tick.svg";
import { HomeContextSet } from '../../../contexts/HomeContext';
const Hero = () => {

  const useUpdateWalletModal = useContext(HomeContextSet)

  return (
    <div className="app">
      <div className="absolute left-0 top-0 z-0 md:w-full overflow-hidden">
        <svg
          width="100%"
          height="670"
          className="md:min-w-[737px]"
          viewBox="0 0 900 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M719.001 226.5C814.601 192.5 913.168 10.6667 897.501 -68L-109.5 -9.5L-141 820C-78.1666 805.833 29.7069 799 107.5 705C235.776 550 362 648 431.5 580C501 512 477 448 500.5 365C524 282 599.501 269 719.001 226.5Z"
            fill="#FFEBCD"
          />
        </svg>
      </div>

      <div className="flex overflow-hidden flex-row justify-between mmd:ml-0 relative ml-[30px] z-2">
        <div className="sm:mx-auto w-1/2 2md:pl-5 pl-12 3sm:w-[85%] 2md:w-full mt-20">
          <div className="text-black font-semibold text-lg">
            Bridging the Web3 payment gap
          </div>
          <div className="text-black mmd:text-[2rem] font-bold text-[3rem] mb-14 mt-[8px]">
            The Crypto Payment Infrastructure
          </div>
          <div className="w-[73%] 2md:w-[92%]">
            <div className="text-[#757095] font-normal text-[17px] mt-6">
              Cryptea is a payment infrastructure for businesses built on the blockchain. Our APIs and Product make it easy for any online business to accept cryptocurrency payments globally.
            </div>
            <div className="flex justify-center">
              <button
                onClick={useUpdateWalletModal}
                className="text-sm rounded-lg bg-[#1B1C31] mt-6 mx-auto justify-self-center place-self-center object-center text-white font-semibold py-4 px-8"
              >
                Connect Wallet
              </button>
            </div>
            <div className="flex sm:justify-center mt-16">
              <Image src={check} className="mr-1" alt="yes" />

              <span className="text-[#757095] ml-1 mr-2">Instant Payment</span>

              <Image src={check} className="mr-1" alt="yes" />
              <span className="text-[#757095] ml-1">Wallet To Wallet</span>
            </div>
          </div>
        </div>

        <div className="right sm:hidden w-1/2 flex justify-center">
          <Image
            src={desktop3}
            priority
            className="w-auto"
            alt="Cryptea"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
