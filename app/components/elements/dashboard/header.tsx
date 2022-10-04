import { Avatar, Popover } from "@mui/material";
import React, { useContext, useState } from "react";
import { BiBell } from "react-icons/bi";
import { dash, DashContext } from "../../../contexts/GenContext";

const DashHeader = ({className, username, dp} : { className?: string, username: string, dp: string }) => {

    const { sidebar }: dash = useContext(DashContext);

    const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
      null
    );

    const handleNotes = (event: React.SyntheticEvent) => {
      setAnchorEl(event.currentTarget);
    };

    const notesClose = () => {
      setAnchorEl(null);
    };

    const nopen = Boolean(anchorEl);
    const id = nopen ? "Your Notifications" : undefined;

    return (
      <>
        <div
          style={{
            width: sidebar?.openPage
              ? "calc(100% - 247px)"
              : "calc(100% - 77px)",
            right: 0,
          }}
          className={`${
            className === undefined
              ? "flex transition-all delay-500 z-10 px-[20px] fixed py-[13px] justify-between items-center border-solid border-b-[1px] 3md:border-b-transparent bg-white border-b-[#E3E3E3]"
              : className
          }`}
        >
          <div className="">
            <h1 className="font-bold">Welcome {username}!☕</h1>
            <span>Looking good today..</span>
          </div>
          <div className="flex items-center">
            {/* <form
              className="relative min-w-[260px] mr-[10px] flex items-center"
              method="get"
              action=""
            >
              <BiSearch
                className="absolute left-[9px]"
                color="#626262"
                size={22}
              />
              <input
                className="rounded-lg border p-2 w-full pl-[35px] focus:outline-none focus:shadow-outline-blue text-[#A9A9A9] placeholder-[#A9A9A9]"
                placeholder="Search..."
                type="search"
                name="username"
              />
            </form> */}

            <div className="h-full w-[20px] mx-2">
              <BiBell
                size={23}
                aria-describedby={id}
                onClick={handleNotes}
                className="cursor-pointer"
                color="#000"
              />
              <Popover
                id={id}
                open={nopen}
                anchorEl={anchorEl}
                onClose={notesClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="py-3 px-2 bg-pattern">
                  <div className="flex flex-col">
                    <div className="not my-2 py-2 px-3 border border-gray-600 rounded-lg bg-[#FFF7EA] flex flex-row justify-between align-middle">
                      <div className="img">
                        <Avatar>U</Avatar>
                      </div>
                      <div className="font-medium text-base">
                        You received 0.1ETH from 0xabc
                      </div>
                    </div>

                    <div className="not my-2 py-2 px-3 border border-gray-600 rounded-lg bg-[#FFF7EA] flex flex-row justify-between align-middle">
                      <div className="img">
                        <Avatar>J</Avatar>
                      </div>
                      <div className="font-medium text-base">
                        You received 0.1ETH from joel.eth
                      </div>
                    </div>

                    <div className="not my-2 py-2 px-3 border border-gray-600 rounded-lg bg-[#FFF7EA] flex flex-row justify-between align-middle">
                      <div className="img">
                        <Avatar>L</Avatar>
                      </div>
                      <div className="font-medium text-base">
                        You received 0.1ETH from lucid.eth
                      </div>
                    </div>
                  </div>
                </div>
              </Popover>
            </div>
            <Avatar
              src={dp}
              sx={{
                width: 40,
                height: 40,
                bgcolor: !Boolean(dp) ? "#f57059" : undefined,
              }}
              alt={username}
            >
              {username?.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </div>
      </>
    );

}

export default DashHeader;