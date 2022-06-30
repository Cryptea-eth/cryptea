import {
  // BiSearch,
  BiBell,
} from "react-icons/bi";
import Sidebar from '../../app/components/elements/dashboard/sidebar'

// import "../../assets/styles/dash.css";
import { Avatar, Popover } from "@mui/material";
import DashHome from "../../app/components/elements/dashboard/home";
import DashLinks from "../../app/components/elements/dashboard/links";
import DashPages from "../../app/components/elements/dashboard/pages";
import DashSettings from "../../app/components/elements/dashboard/settings";

import Loader from "../../app/components/elements/loader";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import Image from "next/image";

const Dashboard = () => {

  const { user, isAuthenticated } = useMoralis();
  const router = useRouter();

  const page = router.query['page'];

  const [loading, isLoading] = useState<boolean>(true); 

  useEffect(() => {
    if (!user) {
      
      window.location.href = "/";

    }

    if (page) {
      isLoading(false);
    }
  }, [user, isLoading, page]);


  const dp = user?.get("img");

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null);

  const handleNotes = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const notesClose = () => {
    setAnchorEl(null);
  };

  const nopen = Boolean(anchorEl);
  const id = nopen ? "Your Notifications" : undefined;

  const active = "!border-l-[3px] !border-l-[#F57059] !text-[#F57059]";
  return (
    <>

    <Head>
        <title>{(String(page).charAt(0)).toUpperCase() + String(page).substring(1)} | Dashboard | Cryptea</title>
        <meta name="description" content={`Receive tips/donations on another level`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>


    {loading && <Loader />}  
    
    {!loading && (<div className="h-full  dash w-full bg-[#F9FAFF] flex">

      <Sidebar page={page}/>

      <div className="body w-full h-full">
        <div className="flex px-[20px] py-[13px] justify-between items-center border-solid border-b-[1px] 3md:border-b-transparent bg-white border-b-[#E3E3E3]">
          <div className="">
            <h1 className="font-bold">Welcome {user?.get("username")}!☕</h1>
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
            {Boolean(dp) ? (
              <Avatar
                src={dp}
                sx={{ width: 40, height: 40 }}
                alt={user?.get("username")}
              ></Avatar>
            ) : (
              <Avatar sx={{ bgcolor: "#F57059" }} alt={user?.get("username")}>
                {user?.get("username")?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </div>
        </div>

        {(page === "settings" || page === "setting") && <DashSettings />}

        {(page === "home" || page === undefined) && <DashHome />}

        {(page === "links" || page === "link") && <DashLinks />}

        {(page === "userpages" || page === "pages" || page === "page") && (
          <DashPages />
        )}

        {page !== undefined &&
          ![
            "settings",
            "setting",
            "home",
            "links",
            "link",
            "userpages",
            "pages",
            "page",
          ].includes(page.toString()) &&
          
          router.replace("/404")}
      </div>
    </div>)}
</>
  );
};

export default Dashboard;
