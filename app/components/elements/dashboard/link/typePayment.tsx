import { useContext, useState } from "react";
import Link from "next/link";
import { Avatar, Button, CircularProgress, Alert } from "@mui/material";
import Loader from "../../loader";
import Head from "next/head";
import empty from "../../../../../public/images/coming-soon.svg";
import { dash, DashContext } from "../../../../contexts/GenContext";
import Sidebar from "../sidebar";
import Image from "next/image";
import { GiTwoCoins } from "react-icons/gi";
import Router from "next/router";

const TypePayment = ({
  children,
  which,
  data,
  support = false
}: {
  children: React.ReactElement[] | React.ReactElement;
  which: "sub" | "onetime";
  support: boolean,
  data: {
    id: number,
    src: string,
    title: string,
    slug: string
  }
}) => { 

  const { sidebar }: dash = useContext(DashContext);

  const [isSaving, saving] = useState<boolean>(false);

  const [genError, setGenError] = useState<string>('');

  const whichM: string = which == "sub" ? "subscription" : "onetime";

  const addSupport = async ( ) => {

      saving(true);

      setGenError('');

       try {
         await `links/${data.id}`.update({
           type: 'both'
         });

         Router.reload()

       } catch (err) {
         const error = err as any;

         saving(false)

         // console.log(error, "oer");

         if (error.response) {
           setGenError(error.response?.data.message);
         } else {
           setGenError("Something went wrong please try again");
         }
       }
  }; 

  return (
    <>
      <Head>
        <title>
          {whichM.charAt(0).toUpperCase() + whichM.substring(1)} Payments |{" "}
          {data.slug} | Breew
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
              <div className="flex z-10 w-full bg-white pl-6 py-[16.8px] border-solid border-b border-b-[#E3E3E3] fixed items-center">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    marginRight: ".7pc",
                    backgroundColor: !Boolean(data.src) ? "#8036de" : undefined,
                  }}
                  className="text-[17px] font-bold"
                  variant="circular"
                  src={data.src}
                >
                  {(
                    String(data.slug).substring(0, 2)
                  ).toUpperCase()}
                </Avatar>

                <Link href={`/pay/${data.slug}/overview`}>
                  <a className="cursor-pointer text-[1.55rem] leading-[2.05rem] flex items-center">
                    <span className="mr-2">{data.title}</span>
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
                  {which != 'sub' ? <span className="mt-2 text-[17px] text-[#565656] block w-full text-center">
                    This link does not support {whichM} payments, Click the
                    button below to add support
                  </span> : <span className="mt-2 text-[17px] text-[#565656] block w-full text-center">
                    Subscriptions are coming soon, we are working on it
                  </span>}
                </div>

                {Boolean(genError) && (
                  <Alert
                    className="w-full font-bold mt-3 mb-2"
                    severity="error"
                  >
                    {genError}
                  </Alert>
                )}

                <div className="flex item-center justify-center">
                  {Boolean(which != 'sub') && <Button
                    onClick={addSupport}
                    className="!py-2 !font-bold !px-5 !capitalize !flex !items-center !text-white !bg-[#8036de] !border !border-solid !border-[rgb(200,200,220)] !transition-all mr-2 !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="mr-3 h-[20px] text-[#fff]">
                          <CircularProgress
                            color={"inherit"}
                            className="!w-[20px] !h-[20px]"
                          />
                        </div>{" "}
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <GiTwoCoins size={25} className="mr-1" />{" "}
                        <span>Add Support</span>
                      </>
                    )}
                  </Button>}

                  {!isSaving && (
                    <Link href={`/pay/${data.slug}/overview`}>
                      <a>
                        <Button className="!py-2 opacity-80 !font-bold !px-5 !capitalize !flex !items-center !text-white !bg-[#8036de] !border !border-solid !border-[rgb(200,200,220)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg">
                          {which == 'sub' ? "Go back" : "Maybe Later"}
                        </Button>
                      </a>
                    </Link>
                  )}
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
