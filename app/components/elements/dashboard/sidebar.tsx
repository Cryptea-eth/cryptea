import { BiHomeAlt, BiLinkAlt, BiCreditCard, BiLogOut } from "react-icons/bi/index.js";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io/index.js";
import { PiWalletBold } from "react-icons/pi/index.js";
import { dash, DashContext } from "../../../contexts/GenContext";
import Image from "next/image";
import Link from "next/link";
import { RiSettingsLine } from "react-icons/ri/index.js";
import logo from "../../../../public/images/breew-logo.png";
import logo2 from "../../../../public/images/breew1.png";
import { useContext } from "react";

const Sidebar = ({ page }: { page: string | string[] | undefined }) => {

  const { sidebar }: dash = useContext(DashContext);

  const active = "!border-l-[#8036de] !text-[#8036de]";

  let text: string = "transition-all delay-500 hidden";

  if (sidebar?.openDelay) text = "text-black text-xl ml-[5px]";

  if (!sidebar?.open) text = "transition-all delay-500 hidden";

  return (
    <div
      className={`sidebar fixed transition-all min-h-full z-[101] delay-500 ${
        sidebar?.open ? "min-w-[210px] w-[210px]" : `w-[75px] min-w-[75px]`
      } bg-white border-solid border-r-[1px] border-r-[#E3E3E3] h-[inherit]`}
    >
      <div
        className={`w-full py-[2.32rem] border-solid innerSide border-b-[1px] flex justify-center transition-all delay-500 items-center relative`}
      >
        <Link href="/">
          <a className="flex items-center absolute justify-center">
            <Image
              src={sidebar?.open ? logo2 : logo }
              alt="Breew"
              width={sidebar?.open ? 120 : 30}
              height={sidebar?.open ? 32 : 30}
              className={`transition-all delay-500`}
            />
          </a>
        </Link>
        {sidebar?.openDelay ? (
          <IoIosArrowDropleftCircle
            onClick={sidebar?.toggle}
            className={`transition-all cursor-pointer delay-500 text-[#8036de] absolute right-[-15px] m-auto z-[101] top-0 bottom-0`}
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
            className={`transition-all cursor-pointer delay-500 text-[#8036de] absolute right-[-15px] m-auto z-[101] top-0 bottom-0`}
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
            className={`rounded-tr-[4px] rounded-br-[4px] overflow-hidden flex-nowrap transition-all delay-200 hover:border-l-[#8749d7] hover:text-[#8036de] hover:bg-[#d3d3d333] border-solid ${
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
          className={`rounded-tr-[4px] rounded-br-[4px] border-l-[3px] cursor-pointer overflow-hidden flex-nowrap my-1 border-solid hover:border-l-[3px] hover:border-l-[#8036de] border-l-transparent text-[#A9A9A9] hover:text-[#8036de] hover:bg-[#d3d3d333] flex items-center py-[9px] ${
            page == "links" || page == "link" ? active : ""
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
          } border-solid hover:border-l-[3px] border-l-transparent text-[#A9A9A9] hover:border-l-[#8036de] hover:text-[#8036de] hover:bg-[#d3d3d333] flex cursor-pointer items-center py-[9px]`}
        >
          <Link href="/dashboard/settlements">
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
          className={`rounded-tr-[4px] rounded-br-[4px]  border-l-[3px] overflow-hidden flex-nowrap my-1 ${
            ["wallets", "wallet"].includes(page as string) ? active : ""
          } border-solid hover:border-l-[3px] border-l-transparent text-[#A9A9A9] hover:border-l-[#8036de] hover:text-[#8036de] hover:bg-[#d3d3d333] flex cursor-pointer items-center py-[9px]`}
        >
          <Link href="/dashboard/wallets">
            <a className="text-inherit flex font-[600] w-full items-center text-[14px]">
              <PiWalletBold
                size={sidebar?.openDelay ? 16.5 : 21}
                className={`text-inherit transition-all delay-400 ${
                  sidebar?.openDelay ? "min-w-[16.5px]" : "min-w-[21px]"
                } mx-[22.5px]`}
              />
              {sidebar?.openDelay ? "Wallets" : ""}
            </a>
          </Link>
        </div>

        <div
          className={`rounded-tr-[4px] rounded-br-[4px] cursor-pointer border-l-[3px] overflow-hidden flex-nowrap my-1 transition-all delay-200 border-solid hover:border-l-[3px] hover:border-l-[#8036de] hover:text-[#8036de] border-l-transparent text-[#A9A9A9] hover:bg-[#d3d3d333] flex items-center py-[9px] ${
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

        <div className="rounded-tr-[4px] rounded-br-[4px] border-l-[3px] cursor-pointer overflow-hidden flex-nowrap my-1 border-solid flex items-center hover:border-l-[3px] hover:border-l-[#8036de] border-l-transparent text-[#A9A9A9] hover:text-[#8036de] hover:bg-[#d3d3d333] py-[9px]">
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
