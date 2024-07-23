import linked from "../../../../public/images/icon0.png";
import Image from "next/image";
import mess from "../../../../public/images/icon1.png";
import twitt from "../../../../public/images/icon2.png";
import { HomeContext } from '../../../contexts/HomeContext';
import { useContext } from "react";
import LogoSpace from "../logo";
const Footer = () => {
  const date = new Date();

  const { open } = useContext(HomeContext);

  return (
    <div>
      <div className="flex mx-[70px] md:mx-5 mmd:mx-[10px] border-solid border-b-[#E5E5EA] border-b-[1px] w-auto p-5 justify-between pb-12">
        <div className="w-[220px]">
          <LogoSpace
            style={{
              marginBottom: 8,
            }}
          />

          <span className="text-[#757095] ">
            Support Web3 With Ease.
          </span>
          <div className="flex items-center mb-4 justify-between mt-[3pc] w-[200px]">
            <a className="mr-[5px]" href="https://linkedin.com">
              <Image alt="linkedIn" src={linked} />
            </a>
            <a className="mr-[5px]" href="https://messenger.com">
              <Image alt="Messenger" src={mess} />
            </a>
            <a className="mr-[5px]" href="https://twitter.com/UseBreew">
              <Image alt="Twitter" src={twitt} />
            </a>
          </div>
          <h3 className="font-bold hidden 2sm:block text-[18px] mb-2">
            Join Us
          </h3>
          <div className="hidden 2sm:flex items-center justify-between w-[200px]">
            <div className="mr-[5px] block">
              <button
                onClick={() => {
                  if (open !== undefined) open();
                }}
                className="text-sm hover:bg-[#4a168e] transition-all delay-500 rounded-[6rem] bg-[#8036de] mt-2 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
              >
                Connect Wallet
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-bold hidden 2sm:block text-[18px] mt-5 mb-2">
              Company
            </h3>
            <div className="flex-col hidden 2md:flex w-[200px]">
              <a className="mr-[5px] mb-3" href="">
                About Us
              </a>
              <a className="mr-[5px] mb-3" href="">
                Careers
              </a>
              <a className="mr-[5px] mb-3" href="/blog">
                Blog
              </a>
            </div>
          </div>
        </div>

        <div className="w-[220px] 2sm:hidden ssm:w-fit">
          <h3 className="font-bold text-[18px] mb-2">Company</h3>
          <div className="flex flex-col w-[200px] ssm:w-fit">
            <a className="mr-[5px] mb-3" href="">
              About Us
            </a>
            <a className="mr-[5px] mb-3" href="">
              Careers
            </a>
            <a className="mr-[5px] mb-3" href="">
              Blog
            </a>
          </div>
        </div>

        <div className="w-[220px] 2sm:hidden">
          <h3 className="font-bold text-[18px] mb-2">Use Cryptea</h3>
          <div className="flex items-center justify-between w-[200px]">
            <div className="mr-[5px]">
              <button
                onClick={() => {
                  if (open !== undefined) open();
                }}
                className="text-sm hover:bg-[#4a168e] transition-all delay-500 rounded-[6rem] bg-[#8036de] mt-2 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center font-semibold py-5">
      Copyright &copy; Breew {date.getFullYear()}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
