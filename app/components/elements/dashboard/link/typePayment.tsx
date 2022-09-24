import { useContext } from "react";
import Link from "next/link";
import { Avatar, Button } from "@mui/material";
import Loader from "../../loader";
import Head from "next/head";
import empty from "../../../../../public/images/coming-soon.svg";
import { dash, DashContext } from "../../../../contexts/GenContext";
import Sidebar from "../sidebar";
import Image from "next/image";
import { GiTwoCoins } from "react-icons/gi";

const TypePayment = ({
  children,
  which,
  data,
  support = false
}: {
  children: JSX.Element[] | JSX.Element;
  which: "sub" | "onetime";
  support: boolean,
  data: {
    src: string,
    title: string,
    slug: string
  }
}) => {
 

  const { sidebar }: dash = useContext(DashContext);

 
  const whichM: string = which == "sub" ? "subscription" : "onetime";

 
  return (
    <>
        <Head>
            <title>
              {whichM.charAt(0).toUpperCase() + whichM.substring(1)} Payments |{" "}
              {data.slug} | Cryptea
            </title>
          </Head>

          <div className="h-full transition-all delay-500 dash w-full bg-[#fff] flex">
            <Sidebar page={"link"} />

            <div
              className={`body pb-6 transition-all delay-500 ${
                sidebar?.openPage ? "pl-[249px]" : "pl-[79px]"
              } w-full h-full 2sm:!pl-[75px]`}
            >
              {support ? (
                <>{children}</>
              ) : (
                <>
                  <div className="flex z-10 w-full bg-white pl-6 py-[6.8px] border-solid border-b border-b-[#E3E3E3] fixed items-center">
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        marginRight: ".7pc",
                        backgroundColor: "#f57059",
                      }}
                      className="text-[22px] font-bold"
                      variant="circular"
                      src={data.src}
                    >
                      {(
                        String(data.slug).charAt(0) + String(data.slug).charAt(1)
                      ).toUpperCase()}
                    </Avatar>

                    <Link href={`/user/${data.slug}/overview`}>
                      <a className="cursor-pointer text-[1.95rem] leading-[2.45rem] flex items-center">
                        <span className="mr-2">
                          {data.title}
                        </span>
                      </a>
                    </Link>
                  </div>

                  <div
                    className="empty"
                    style={{
                      display: "flex",
                      width: "100%",
                      paddingTop: 80,
                      height: "fit-content",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div className="h-[393px] flex">
                      <Image
                        src={empty}
                        className="mb-3"
                        width={300}
                        height={300}
                        alt="Support Required"
                      />
                    </div>

                    <div className="mt-2 mb-3">
                      <h2 className="text-[22px] capitalize text-center font-bold">
                        {whichM} Support Required
                      </h2>
                      <span className="mt-2 text-[17px] text-[#565656] block w-full text-center">
                        This link does not support {whichM} payments, Click the
                        button below to add support
                      </span>
                    </div>
                    <div className="flex item-center justify-center">
                      <Link href="/working">
                        <a>
                          <Button className="!py-2 !font-bold !px-5 !capitalize !flex !items-center !text-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all mr-2 !delay-500 hover:!text-[#f0f0f0] !rounded-lg">
                            <GiTwoCoins size={25} className="mr-1" /> Add
                            Support
                          </Button>
                        </a>
                      </Link>

                      <Link href={`/user/${data.slug}/overview`}>
                        <a>
                          <Button className="!py-2 opacity-80 !font-bold !px-5 !capitalize !flex !items-center !text-white !bg-[#F57059] !border !border-solid !border-[rgb(218,220,224)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg">
                            Nah Maybe Later
                          </Button>
                        </a>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
    </>
  );
};

export default TypePayment;
