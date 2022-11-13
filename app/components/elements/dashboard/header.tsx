import { Avatar, IconButton, Popover, Tab, Tabs } from "@mui/material";
import React, { useContext, useState } from "react";
import { BiBell } from "react-icons/bi";
import { dash, DashContext } from "../../../contexts/GenContext";

const DashHeader = ({className, username, dp} : { className?: string, username: string, dp: string }) => {

    const { sidebar }: dash = useContext(DashContext);

    const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
      null
    );

    const [open, setOpen] = useState(false);
    
    const [value, setValue] = useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, e: any) => setValue(e);

    const handleNotes = (event: React.SyntheticEvent) => {
      setAnchorEl(event.currentTarget);
    };

    const nopen = Boolean(anchorEl);
    const id = nopen ? "Your Notifications" : undefined;

    const active = "before:content-[''] before:bottom-[25px] before:left-[28px] before:bg-[#f57059] before:h-[5px] before:rounded-[50%] before:w-[5px]";

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
            <div className="h-full relative w-[20px] mx-2">
              <IconButton
                onClick={() => setOpen(!open)}
                className={`right-[14px] relative before:absolute ${active}`}
                size={"medium"}
              >
                <BiBell
                  size={24}
                  aria-describedby={id}
                  onClick={handleNotes}
                  className="cursor-pointer"
                  color="#6a6a6a"
                />
              </IconButton>

              <div
                style={{
                  display: open ? "block" : "none",
                }}
                className="w-[420px] top-0 p-3 right-0 shadow-md rounded-md absolute"
              >
                <div className="flex items-center mb-[16px] justify-between">
                  <h2 className="text-[rgb(32,33,36)] font-[400] flex items-center justify-between relative">
                    Notifications
                  </h2>

                  <span className="text-[rgb(32,33,36)] font-[400] underline text-center">
                    Mark all as read
                  </span>
                </div>

                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="tabs example"
                >
                  <Tab
                    value="one"
                    label="New Arrivals in the Longest Text of Nonfiction that should appear in the next line"
                    wrapped
                  />
                  <Tab value="two" label="Item Two" />
                  <Tab value="three" label="Item Three" />
                </Tabs>
              </div>
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