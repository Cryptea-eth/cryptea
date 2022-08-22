import {
  // BiSearch,
  BiBell,
} from "react-icons/bi";

import { RiSettingsLine } from "react-icons/ri";
// import "../../app/styles/dash.css";
import { Avatar, Popover } from "@mui/material";
import DashHome from "../../app/components/elements/dashboard/home";
import Link from "next/link";
import Loader from "../../app/components/elements/loader";
import { useRouter } from "next/router";
import Head from "next/head";
import { DashContext, dash } from "../../app/contexts/GenContext";
import { useState, useEffect, useContext } from 'react';
import { useMoralis } from "react-moralis";
import Sidebar from "../../app/components/elements/dashboard/sidebar";

const DashboardIndex = () => {

  const {
    user,
    isAuthenticated,
    isInitialized,
    isWeb3Enabled,
    enableWeb3,
  } = useMoralis();
  const router = useRouter();

  const { sidebar }: dash = useContext(DashContext);

  const dp = user?.get("img");

  const [loading, isLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }

  if (isInitialized) {
      if(!isAuthenticated){
          window.location.href = "/";
      } else {
          isLoading(false);
      }
    }
  }, [
    user,
    isLoading,
    enableWeb3,
    isAuthenticated,
    isWeb3Enabled,
    isInitialized
  ]);


  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null);

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
      <Head>
        <title>
          {user?.get("username") ? user?.get("username") + " | " : ""} Dashboard
          | Cryptea
        </title>
        <meta
          name="description"
          content={`Receive Payments Instantly With Ease`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && <Loader />}

      {!loading && (
        <div className="h-full transition-all delay-500 dash w-full bg-[#fff] flex">
          <Sidebar page={"home"} />
          <div
            className={`body transition-all delay-500 ${
              sidebar?.openPage ? "pl-[247px]" : "pl-[77px]"
            } w-full h-full 2sm:!pl-[77px]`}
          >
            <div
              style={{
                width: sidebar?.openPage
                  ? "calc(100% - 247px)"
                  : "calc(100% - 77px)",
                right: 0,
              }}
              className="flex transition-all delay-500 z-10 fixed px-[20px] py-[13px] justify-between items-center border-solid border-b-[1px] 3md:border-b-transparent bg-white border-b-[#E3E3E3]"
            >
              <div className="">
                <h1 className="font-bold">
                  Welcome {user?.get("username")}!☕
                </h1>
                <span>Hope you are healthy and happy today..</span>
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
                    sx={{ width: 40, height: 40, bgcolor: "#F57059" }}
                    alt={user?.get("username")}
                  >
                    {user?.get("username")?.charAt(0).toUpperCase()}
                  </Avatar>
              </div>
            </div>

            <DashHome />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardIndex;
