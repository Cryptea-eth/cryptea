import { BiHomeAlt, BiLinkAlt, BiCreditCard, BiLogOut } from "react-icons/bi";

import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

import { dash, DashContext } from "../../../contexts/GenContext";

import Image from "next/image";
import Link from "next/link";
import { RiSettingsLine } from "react-icons/ri";
import logo from "../../../../public/images/cryptea-logo.svg";
import logo2 from "../../../../public/images/cryptea.png";
import { useContext } from "react";

const Sidebar = ({ page }: { page: string | string[] | undefined }) => {
  const { sidebar }: dash = useContext(DashContext);

  const active = "!border-l-[#F57059] !text-[#F57059]";

  let text: string = "transition-all delay-500 hidden";

  if (sidebar?.openDelay) text = "text-black text-xl ml-[5px]";

  if (!sidebar?.open) text = "transition-all delay-500 hidden";

  return (
    <div
      className={`sidebar fixed transition-all min-h-full z-[100] delay-500 ${
        sidebar?.open
          ? "min-w-[250px] dsm:absolute w-[250px]"
          : `w-[75px] min-w-[75px]`
      } bg-white border-solid border-r-[1px] border-r-[#E3E3E3] h-[inherit]`}
    >
      <div
        className={`w-full py-[2.32rem] border-solid innerSide border-b-[1px] flex justify-center transition-all delay-500 items-center relative`}
      >
        <Link href="/">
          <a className="flex items-center absolute justify-center">
            <Image
              src={logo}
              alt="cryptea"
              width={sidebar?.open ? 30 : 40}
              height={sidebar?.open ? 30 : 40}
              className={`min-w-[${
                sidebar?.open ? 30 : 40
              }px] transition-all delay-500`}
            />
            <div className={text}>
              <Image src={logo2} alt="cryptea" className="min-w-[30px]" />
            </div>
            {/* <img
              src={logo1}
              className={sidebar?.openDelay ? "" : "transition-all delay-500 hidden"}
              alt="cryptea"
            /> */}
          </a>
        </Link>
        {sidebar?.openDelay ? (
          <IoIosArrowDropleftCircle
            onClick={sidebar?.toggle}
            className={`transition-all cursor-pointer delay-500 text-[#F57059] absolute right-[-15px] m-auto z-50 top-0 bottom-0`}
            size={25}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "15px",
              height: "25px",
              width: "25px",
            }}
          />
        ) : (
          <IoIosArrowDroprightCircle
            onClick={sidebar?.toggle}
            className={`transition-all cursor-pointer delay-500 text-[#F57059] absolute right-[-15px] m-auto z-50 top-0 bottom-0`}
            size={25}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "15px",
              height: "25px",
              width: "25px",
            }}
          />
        )}
      </div>

      <div
        className={`flex innerSide transition-all delay-500 flex-col py-3 justify-center`}
      >
        <div className={`pb-3 mb-1 border-b-[#E3E3E3] border-b-[1px]`}>
          <div
            className={`rounded-tr-[4px] rounded-br-[4px] overflow-hidden flex-nowrap transition-all delay-200 hover:border-l-[#f89e8e] hover:text-[#F57059] hover:bg-[#d3d3d333] border-solid ${
              page === "home" || page === undefined ? active : ""
            } border-l-[3px] flex items-center transition-all delay-500 bg-[#d3d3d333] py-[9px]`}
          >
            <Link href="/dashboard">
              <a className="text-inherit flex w-full font-[600] items-center text-[14px]">
                <BiHomeAlt
                  size={sidebar?.openDelay ? 16.5 : 21}
                  className={`text-inherit transition-all delay-400 ${
                    sidebar?.openDelay ? "min-w-[16.5px]" : "min-w-[21px]"
                  } mx-[22.5px]`}
                />
                {sidebar?.openDelay ? "Dashboard" : ""}
              </a>
            </Link>
          </div>
        </div>

        <div
          className={`rounded-tr-[4px] rounded-br-[4px] border-l-[3px] cursor-pointer overflow-hidden flex-nowrap my-1 border-solid hover:border-l-[3px] hover:border-l-[#F57059] border-l-transparent text-[#A9A9A9] hover:text-[#F57059] hover:bg-[#d3d3d333] flex items-center py-[9px] ${
            page === "links" || page === "link" ? active : ""
          }`}
        >
          <Link href="/dashboard/links">
            <a className="text-inherit flex font-[600] w-full items-center text-[14px]">
              <BiLinkAlt
                size={sidebar?.openDelay ? 16.5 : 21}
                className={`text-inherit transition-all delay-400  ${
                  sidebar?.openDelay ? "min-w-[16.5px]" : "min-w-[21px]"
                } mx-[22.5px]`}
              />
              {sidebar?.openDelay ? "Payment Links" : ""}
            </a>
          </Link>
        </div>

        <div
          className={`rounded-tr-[4px] rounded-br-[4px]  border-l-[3px] overflow-hidden flex-nowrap my-1 ${
            page === "settlements" || page === "settlement" || page === "settle"
              ? active
              : ""
          } border-solid hover:border-l-[3px] border-l-transparent text-[#A9A9A9] hover:border-l-[#F57059] hover:text-[#F57059] hover:bg-[#d3d3d333] flex cursor-pointer items-center py-[9px]`}
        >
          <Link href="/working">
            <a className="text-inherit flex font-[600] w-full items-center text-[14px]">
              <BiCreditCard
                size={sidebar?.openDelay ? 16.5 : 21}
                className={`text-inherit transition-all delay-400 ${
                  sidebar?.openDelay ? "min-w-[16.5px]" : "min-w-[21px]"
                } mx-[22.5px]`}
              />
              {sidebar?.openDelay ? "Settlement" : ""}
            </a>
          </Link>
        </div>

        <div
          className={`rounded-tr-[4px] rounded-br-[4px] cursor-pointer border-l-[3px] overflow-hidden flex-nowrap my-1 transition-all delay-200 border-solid hover:border-l-[3px] hover:border-l-[#F57059] hover:text-[#F57059] border-l-transparent text-[#A9A9A9] hover:bg-[#d3d3d333] flex items-center py-[9px] ${
            page === "settings" || page === "setting" ? active : ""
          }`}
        >
          <Link href="/dashboard/settings">
            <a className="text-inherit flex font-[600] w-full items-center text-[14px]">
              <RiSettingsLine
                size={sidebar?.openDelay ? 16.5 : 21}
                className={`text-inherit transition-all delay-400  ${
                  sidebar?.openDelay ? "min-w-[16.5px]" : "min-w-[21px]"
                } mx-[22.5px]`}
              />
              {sidebar?.openDelay ? "Settings" : ""}
            </a>
          </Link>
        </div>

        <div className="rounded-tr-[4px] rounded-br-[4px] border-l-[3px] cursor-pointer overflow-hidden flex-nowrap my-1 border-solid flex items-center hover:border-l-[3px] hover:border-l-[#F57059] border-l-transparent text-[#A9A9A9] hover:text-[#F57059] hover:bg-[#d3d3d333] py-[9px]">
          <Link href={"/dashboard/logout"}>
            <a className="text-inherit flex font-[600] w-full items-center text-[14px]">
              <BiLogOut
                size={sidebar?.openDelay ? 16.5 : 21}
                className={`text-inherit cursor-pointer transition-all delay-400 ${
                  sidebar?.openDelay ? "min-w-[16.5px]" : "min-w-[21px]"
                } mx-[22.5px]`}
              />
              {sidebar?.openDelay ? "Log Out" : ""}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
