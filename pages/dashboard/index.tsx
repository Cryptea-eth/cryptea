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
import Sidebar from "../../app/components/elements/dashboard/sidebar";
import { useCryptea } from "../../app/contexts/Cryptea";
import DashHeader from "../../app/components/elements/dashboard/header";

const DashboardIndex = () => {

  const { 
    user,
    connected,
    isAuthenticated,
    signer
  } = useCryptea();

  const router = useRouter();

  const { sidebar, logout: { active } }: dash = useContext(DashContext);
  
  const [loading, isLoading] = useState<Boolean>(true);

  const [data, setData] = useState<any>({ username: "", img: "" });
  

  useEffect(() => {

    if(isAuthenticated !== undefined){
      if(!isAuthenticated){
        if(!active){
          router.push('/auth')
        }
      } else {
         "user".get("*", true).then((e: any) => {
           if(!Boolean(e.email)) {
              
              router.push('/signup')
  
           }else{
           if (e !== null) {
             setData(typeof e == "object" ? e : { username: "", img: "" });
           }
            isLoading(false);
          }
         });
      }
    }
  }, [
    user,
    router,
    isLoading,
    isAuthenticated
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
          {data?.username ? data?.username + " | " : ""} Dashboard | Cryptea
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
            } w-full h-full`}
          >
            <DashHeader
              className={
                "flex transition-all delay-500 z-10 fixed px-[20px] py-[13px] justify-between items-center border-solid border-b-[1px] 3md:border-b-transparent bg-white border-b-[#E3E3E3]"
              } dp={data.img} username={data.username}
            />

            <DashHome />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardIndex;
