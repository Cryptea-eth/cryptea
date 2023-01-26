import {
  // BiSearch,
  BiBell,
} from "react-icons/bi";
import Sidebar from './sidebar'
import { Avatar, Popover } from "@mui/material";
import Loader from "../loader";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { dash, DashContext } from "../../../contexts/GenContext";
import { useCryptea } from "../../../contexts/Cryptea";
import DashHeader from "./header";

const Page = ({ children }: { children: JSX.Element[] | JSX.Element }) => {

  const { user, isAuthenticated } = useCryptea();

  const router = useRouter();

  const { sidebar }: dash = useContext(DashContext)

  const [data, setData] = useState<any>({ username: '', img: ''});

  const page = (router.pathname).split('/')[2];


  const [loading, isLoading] = useState<boolean>(true); 
  

  useEffect(() => {

    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        ('user').get('*', true).then((e: any) => {
          
          
            const acc = JSON.parse(e.accounts || '[]');

            if (!Boolean(e.email) || acc[0] == 'null' || acc[0] == 'undefined') {

                router.push('/signup');

            }else{

              setData(typeof e == "object" ? e : {});
              // console.log('here')
              isLoading(false);
            }
        });
  
      }
    }   
    
  }, [router, isLoading, page, isAuthenticated]);


  const dp = data.img;

  
  return (
    <>
      {/* <Head>
        <title>
          {Boolean(page)
            ? String(page).charAt(0).toUpperCase() +
              String(page).substring(1) +
              " | "
            : ""}{" "}
          Dashboard | Cryptea
        </title>
        <meta
          name="description"
          content={`Receive Payments Instantly With Ease`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      {loading && <Loader />}

      {!loading && (
        <>
          <div className="h-full dash w-full bg-white flex">
            <Sidebar page={page} />

            <div
              className={`body transition-all delay-500 ${
                sidebar?.openPage ? "pl-[247px]" : "pl-[77px]"
              } w-full h-full 2sm:!pl-[77px]`}
            >
              <>
                <DashHeader username={data.username} dp={dp}/>

                {children}
              </>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
