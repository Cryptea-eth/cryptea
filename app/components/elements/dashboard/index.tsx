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

const Page = ({ children }: { children: JSX.Element[] | JSX.Element }) => {

  const { user, isAuthenticated } = useCryptea();

  const router = useRouter();

  const { sidebar }: dash = useContext(DashContext)

  const [data, setData] = useState<any>({ username: '', img: ''});

  const page = router.query['page'];

  const [loading, isLoading] = useState<boolean>(true); 
  

  useEffect(() => {
    
    "user".get("*", true).then((e) => {
      if (e !== null) {
        setData(typeof e == "object" ? e : {});
      }
    });

    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        isLoading(false);
      }
    }   
    
  }, [router, isLoading, page, isAuthenticated]);


  const dp = data.img;

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
                <div
                  style={{
                    width: sidebar?.openPage
                      ? "calc(100% - 247px)"
                      : "calc(100% - 77px)",
                    right: 0,
                  }}
                  className={`flex transition-all delay-500 z-10 px-[20px] fixed py-[13px] justify-between items-center border-solid border-b-[1px] 3md:border-b-transparent bg-white border-b-[#E3E3E3]`}
                >
                  <div className="">
                    <h1 className="font-bold">Welcome {data.username}!☕</h1>
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
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: !Boolean(dp) ? "#f57059" : undefined,
                      }}
                      alt={data.username}
                    >
                      {data.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </div>

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