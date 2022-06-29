import { 
  BiHomeAlt,
  BiPaperPlane,
  BiCreditCard,
  BiLogOut,
 } from 'react-icons/bi'

import { useMoralis } from "react-moralis";

 import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router'; 
import { RiSettingsLine } from "react-icons/ri";
import logo from "../../../../public/images/cryptea-logo.svg";


const Sidebar = ({page}: {page: string | string[] | undefined}) => {

  const { isAuthenticated, logout } = useMoralis();

  const router = useRouter()

  const [isOpen, close] = useState(false);
  const [isOpen3, close3] = useState(false);

  const active = "!border-l-[#F57059] !text-[#F57059]";

   const toggle = () => {
    close(!isOpen);

    setTimeout(() => {
      close3(!isOpen3);
    }, 900);
  };


    return (
        <div
        className={`sidebar transition-all z-[100] delay-500 ${isOpen
          ? "min-w-[250px] dsm:absolute w-[250px]"
          : `w-[75px]  min-w-[75px] ${isOpen3 ? "dsm:absolute" : "relative"}`
          } bg-white border-solid border-r-[1px] border-r-[#E3E3E3] h-[inherit]`}
      >
        <div
          className={`w-full ${isOpen ? "py-[1.32rem]" : "py-[1rem]"
            } border-solid innerSide border-b-[1px] flex justify-center transition-all delay-500 items-center relative`}
        >
          <Link href="/">
            <a className="flex items-center justify-center">
              <Image
                src={logo}
                alt="cryptea"
                width={isOpen ? 30 : 40}
                height={isOpen ? 30 : 40}
                className={`mr-[5px] min-w-[${isOpen ? 30 : 40
                  }px] transition-all delay-500`}
              />
              <span
                className={
                  isOpen3
                    ? "text-black text-2xl font-bold"
                    : "transition-all delay-500 hidden"
                }
              >
                CRYPTEA
              </span>
              {/* <img
              src={logo1}
              className={isOpen3 ? "" : "transition-all delay-500 hidden"}
              alt="cryptea"
            /> */}
            </a>
          </Link>
          {isOpen3 ? (
            <IoIosArrowDropleftCircle
              onClick={toggle}
              className={`transition-all cursor-pointer delay-500 text-[#F57059] absolute right-[-15px] m-auto z-50 top-0 bottom-0`}
              size={30}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "15px",
                height: "30px",
                width: "30px",
              }}
            />
          ) : (
            <IoIosArrowDroprightCircle
              onClick={toggle}
              className={`transition-all cursor-pointer delay-500 text-[#F57059] absolute right-[-15px] m-auto z-50 top-0 bottom-0`}
              size={30}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "15px",
                height: "30px",
                width: "30px",
              }}
            />
          )}
        </div>

        <div
          className={`flex innerSide transition-all delay-500 flex-col py-3 ${isOpen ? "px-[27px]" : "px-[1px]"
            } justify-center`}
        >
          <div className={`pb-3 mb-1 border-b-[#E3E3E3] border-b-[1px]`}>
            <div
              className={`rounded-[4px] overflow-hidden flex-nowrap transition-all delay-200 hover:border-l-[#f89e8e] hover:text-[#F57059] hover:bg-[#F5F8FE] border-solid ${page === "home" || page === undefined ? active : ""} border-l-[3px] flex items-center transition-all delay-500 bg-[#F5F8FE] py-[9px]`}
            >
              <Link
                href="/dashboard"
              ><a className="text-inherit flex items-center text-[14px]">
                  <BiHomeAlt
                    size={isOpen3 ? 16.5 : 21}
                    className={`text-inherit transition-all delay-400 ${isOpen3 ? "min-w-[16.5px]" : "min-w-[21px]"
                      } mx-[22.5px]`}
                  />
                  {isOpen3 ? "Dashboard" : ""}
                </a>
              </Link>
            </div>
          </div>

          <div
            className={`rounded-[4px]  border-l-[3px] overflow-hidden flex-nowrap my-1 ${(page === "userpages" || page === "pages" || page === "page")
              ? active
              : ""
              } border-solid hover:border-l-[3px] border-l-transparent text-[#A9A9A9] hover:border-l-[#F57059] hover:text-[#F57059] hover:bg-[#F5F8FE] flex cursor-pointer items-center py-[9px]`}
          >
            <Link
              href="/dashboard/pages"
            >
              <a className="text-inherit flex items-center text-[14px]">
                <BiPaperPlane
                  size={isOpen3 ? 16.5 : 21}
                  className={`text-inherit transition-all delay-400 ${isOpen3 ? "min-w-[16.5px]" : "min-w-[21px]"
                    } mx-[22.5px]`}
                />
                {isOpen3 ? "Your Pages" : ""}</a>

            </Link>
          </div>

          <div
            className={`rounded-[4px] border-l-[3px] cursor-pointer overflow-hidden flex-nowrap my-1 border-solid hover:border-l-[3px] hover:border-l-[#F57059] border-l-transparent text-[#A9A9A9] hover:text-[#F57059] hover:bg-[#F5F8FE] flex items-center py-[9px] ${(page === "links" || page === "link") ? active : ""
              }`}
          >
            <Link
              href="/dashboard/links"
            ><a className="text-inherit flex items-center text-[14px]">
                <BiCreditCard
                  size={isOpen3 ? 16.5 : 21}
                  className={`text-inherit transition-all delay-400  ${isOpen3 ? "min-w-[16.5px]" : "min-w-[21px]"
                    } mx-[22.5px]`}
                />
                {isOpen3 ? "Payment Links" : ""}</a>
            </Link>
          </div>

          <div
            className={`rounded-[4px] cursor-pointer border-l-[3px] overflow-hidden flex-nowrap my-1 transition-all delay-200 border-solid hover:border-l-[3px] hover:border-l-[#F57059] hover:text-[#F57059] border-l-transparent text-[#A9A9A9] hover:bg-[#F5F8FE] flex items-center py-[9px] ${(page === "settings" || page === "setting") ? active : ""
              }`}
          >
            <Link
              href="/dashboard/settings"
            ><a className="text-inherit flex items-center text-[14px]">
                <RiSettingsLine
                  size={isOpen3 ? 16.5 : 21}
                  className={`text-inherit transition-all delay-400  ${isOpen3 ? "min-w-[16.5px]" : "min-w-[21px]"
                    } mx-[22.5px]`}
                />
                {isOpen3 ? "Settings" : ""}
              </a>
            </Link>
          </div>

          <div className="rounded-[4px]  border-l-[3px] cursor-pointer overflow-hidden flex-nowrap my-1 border-solid flex items-center hover:border-l-[3px] hover:border-l-[#F57059] border-l-transparent text-[#A9A9A9] hover:text-[#F57059] hover:bg-[#F5F8FE] py-[9px]">
            <div
              className="text-inherit flex items-center text-[14px]"
              onClick={async () => {
                if (isAuthenticated) {
                  logout();
                }
                router.push("/");
              }}
            >
              <BiLogOut
                size={isOpen3 ? 16.5 : 21}
                className={`text-inherit cursor-pointer transition-all delay-400 ${isOpen3 ? "min-w-[16.5px]" : "min-w-[21px]"
                  } mx-[22.5px]`}
              />
              {isOpen3 ? "Log Out" : ""}
            </div>
          </div>
        </div>
      </div>
    )
}

export default Sidebar;