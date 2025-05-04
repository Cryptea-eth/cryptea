import Page from "../../../app/components/elements/dashboard";
import Head from 'next/head';
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Loader from "../../../app/components/elements/loader";
import { dash, DashContext } from "../../../app/contexts/GenContext";
import { IoWalletOutline } from "react-icons/io5/index.js";
import {
  Modal,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  ToggleButton,
  Button,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import NumberFormat from "react-number-format";
import { FiThumbsDown, FiThumbsUp, FiTrash2 } from "react-icons/fi/index.js";
import { BiBook, BiCopy } from "react-icons/bi/index.js";
import Link from "next/link";
import {
  MdClose,
} from "react-icons/md/index.js";
import { useCryptea } from "../../../app/contexts/Cryptea";
import {
  get_request,
  post_request,
} from "../../../app/contexts/Cryptea/requests";
import copy from "copy-to-clipboard";


const Wallets = () => {

  const { isAuthenticated } = useCryptea();

  const [isLoading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const { slug } = router.query;

  const { sidebar, chartData }: dash = useContext(DashContext);

  const [gLoader, setGLoader] = useState(false);

  const [rLoader, setRLoader] = useState(false);

  const [userx, setUserX] = useState<any>({});


  const [hash, setHash] = useState<string>(``);

  const cxHash = () => {
    copy(hash);

    setHash("");
  };

  const [rdialog, revokeDialog] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [ref, setRefresh] = useState("");

  useEffect(() => {
    const init = async () => {

      const ux = await "user".get("*", true);

      setUserX(ux);

      setLoading(false);
      
    };

    if (isAuthenticated !== undefined && router.isReady) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        init();
      }
    }

  }, [isAuthenticated, slug, router.isReady, hash, rdialog, router, ref]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Head>
            <title>Wallets by Breew</title>
            <meta
              name="description"
              content={`You go to wallet management service`}
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          {Boolean(hash.length) && (
            <>
              <Modal
                open={Boolean(hash.length)}
                sx={{
                  "&& .MuiBackdrop-root": {
                    backdropFilter: "blur(5px)",
                  },
                }}
                onClose={cxHash}
                className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
                aria-labelledby="Generate New Api Key"
                aria-describedby="Generate Api"
              >
                <Box
                  className="sm:w-full h-fit 3mdd:px-[2px]"
                  sx={{
                    minWidth: 300,
                    width: "70%",
                    maxWidth: 800,
                    borderRadius: 6,
                    outline: "none",
                    p: 4,
                    position: "relative",
                    margin: "auto",
                  }}
                >
                  <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                          New API Key
                        </h2>
                        <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                          Generate Key, to secure waas api
                        </span>
                      </div>

                      <IconButton size={"medium"} onClick={cxHash}>
                        <MdClose
                          size={20}
                          color={"rgb(32,33,36)"}
                          className="cursor-pointer"
                        />
                      </IconButton>
                    </div>

                    <div className="w-full items-center rounded-md flex justify-center bg-[#2020200e] py-2 px-3">
                      <span className="text-[#838383] font-[600] text-center text-[1.2rem] h-fit">
                        {hash}
                      </span>
                    </div>

                    <span className="text-[#7c7c7c] mt-3 block font-[500] text-[14px]">
                      <b>Note: </b> You will not be able to view this key again
                      once you close this window, so be sure to record it,
                      Clicking the generate button would generate a new key
                      invalidating older keys.
                    </span>
                  </div>

                  <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                    <div className="flex items-center">
                      <Button
                        onClick={cxHash}
                        className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !bg-[#8036de] !border !border-solid !border-[rgb(200,200,220)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                      >
                        <BiCopy className={"mr-2"} size={23} /> Copy and Close
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </>
          )}

          {rdialog && (
            <>
              <Modal
                open={rdialog}
                sx={{
                  "&& .MuiBackdrop-root": {
                    backdropFilter: "blur(5px)",
                  },
                }}
                onClose={() => revokeDialog(false)}
                className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
                aria-labelledby="Generate New Api Key"
                aria-describedby="Generate Api"
              >
                <Box
                  className="sm:w-full h-fit 3mdd:px-[2px]"
                  sx={{
                    minWidth: 300,
                    width: "70%",
                    maxWidth: 800,
                    borderRadius: 6,
                    outline: "none",
                    p: 4,
                    position: "relative",
                    margin: "auto",
                  }}
                >
                  <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.4rem]">
                          Revoke API key
                        </h2>
                      </div>

                      <IconButton
                        size={"medium"}
                        onClick={() => revokeDialog(false)}
                      >
                        <MdClose
                          size={20}
                          color={"rgb(32,33,36)"}
                          className="cursor-pointer"
                        />
                      </IconButton>
                    </div>

                    <span className="text-[#7c7c7c] mt-3 block font-[600] text-[18px] text-center ">
                      Are you sure you want to revoke API key?
                    </span>
                  </div>

                  <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                    <div className="flex items-center">
                      <Button
                        onClick={async () => {
                          setRLoader(true);

                          revokeDialog(false);

                          try {
                            await post_request(`/generate/waas/revoke`, {});

                            setRLoader(false);

                            setRefresh("rev");
                          } catch (err) {
                            const errx = err as any;

                            // console.log(errx, "ee");

                            if (errx.response) {
                              setError("Something went wrong, please try again");
                            } else {
                              setError("Failed, Check your internet access");
                            }

                            setRLoader(false);
                          }
                        }}
                        className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !min-w-[100px] mr-1 !text-white !bg-[#8036de] !border !border-solid !border-[rgb(200,200,220)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                      >
                        <FiThumbsUp className={"mr-2"} size={23} /> Yes
                      </Button>

                      <Button
                        onClick={() => revokeDialog(false)}
                        className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !min-w-[100px] ml-1 !text-white !bg-[#8036de] !border !border-solid !border-[rgb(200,200,220)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                      >
                        <FiThumbsDown className={"mr-2"} size={23} /> No
                      </Button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </>
          )}

          <Page>
            <div className="h-full transition-all delay-500 pt-[75px] dash w-full bg-[#fff]">
              <h1 className="text-[rgb(32,33,36)] capitalize font-bold text-[25px] mt-[14px] mb-3 flex leading-[2.45rem] px-3 max-w-[861px] mx-auto w-full relative">
                Wallets
              </h1>

              <div
                style={{
                  maxWidth: !sidebar?.openPage ? "1031px" : "861px",
                }}
                className="m-auto px-3 gridTemplate transition-all delay-500 grid gap-6 grid-flow-dense"
              >
                <div className="border-[rgb(200,200,220)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    {
                      <>
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-[400] z-[1] text-[1.375rem] leading-[1.75rem] ">
                            Generate API key
                          </h2>

                          <div className="font-[400] relative z-30 text-[1.0rem] leading-[1.75rem]">
                            {error.length
                              ? error
                              : userx.waas
                              ? "Secured"
                              : ""}
                          </div>
                        </div>

                        <div className="z-0 right-0 flex items-center top-[32px] bottom-0 m-auto absolute">
                          <div className="absolute z-0 h-[117%] w-[100px] bg-overlay"></div>
                          <IoWalletOutline size={180} color={"#8036de33"} />
                        </div>

                        <div className="w-full z-10 relative items-center flex text-[rgb(95,99,104)] h-[100px]">
                          Generate new API key, to authorize wallets on your
                          application
                        </div>
                      </>
                    }
                  </div>
                  <div className="text-[#8036de] font-bold justify-between flex items-center transition-all relative bg-white delay-150">
                    <div
                      onClick={async () => {
                        if (gLoader) {
                          return;
                        }

                        setGLoader(true);

                        try {
                          const ax = await post_request(
                            `/generate/waas/key`,
                            {}
                          );

                          if (ax?.data.hash) {
                            setHash(ax?.data.hash);
                            setGLoader(false);
                            setRefresh("gen");
                          }
                        } catch (err) {
                          const errx = err as any;

                          // console.log(errx, "ee");

                          if (errx.response) {
                            setError(errx.response.data.message);
                          } else {
                            setError("Failed, Check your internet access");
                          }

                          setGLoader(false);
                        }
                      }}
                      className="cursor-pointer border-t pl-6 p-3 border-solid border-[rgb(200,200,220)] hover:bg-[#f5f5ff] flex items-center transition-all delay-150 w-full"
                    >
                      {gLoader ? (
                        <>
                          <div className="mr-3 h-[20px] text-[#fff]">
                            <CircularProgress
                              color={"inherit"}
                              className="!w-[20px] text-[#8036de] !h-[20px]"
                            />
                          </div>{" "}
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate new key</span>
                        </>
                      )}
                    </div>

                    {userx.waas && (
                      <Tooltip
                        arrow
                        title="Remove api key, this would render this link api open to public use"
                      >
                        <div
                          onClick={() => {
                            if (rLoader) {
                              return;
                            }

                            revokeDialog(true);

                          }}
                          className="cursor-pointer min-w-[140px] flex items-center border-t pr-6 transition-all delay-150 p-3 border-solid border-[rgb(200,200,220)] hover:bg-[#f5f5ff]"
                        >
                          {rLoader ? (
                            <>
                              <div className="mr-3 h-[20px] text-[#fff]">
                                <CircularProgress
                                  color={"inherit"}
                                  className="!w-[20px] text-[#8036de] !h-[20px]"
                                />
                              </div>{" "}
                              <span>Revoking...</span>
                            </>
                          ) : (
                            <>
                              <span>Revoke Key</span>
                            </>
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>

                <div className="border-[rgb(200,200,220)] rounded-[8px] border bg-white overflow-hidden border-solid">
                  <div className="px-6 pt-6 relative pb-3">
                    {
                      <>
                        <div className="flex justify-between mb-[16px] items-center">
                          <h2 className="font-[400] z-[1] text-[1.375rem] leading-[1.75rem] ">
                            Documentation
                          </h2>

                          <span className="font-[400] text-[1.0rem] leading-[1.75rem]"></span>
                        </div>

                        <div className="z-0 right-0 flex items-center top-[32px] bottom-0 m-auto absolute">
                          <div className="absolute z-0 h-[117%] w-[100px] bg-overlay"></div>
                          <BiBook size={180} color={"#8036de33"} />
                        </div>

                        <div className="w-full z-10 relative items-center flex text-[rgb(95,99,104)] h-[100px]">
                          Get API documentation, to integrate in your site /
                          application
                        </div>
                      </>
                    }
                  </div>
                  <Link href={`https://docs.cryptea.me/#`}>
                    <a className="border-t px-6 p-3 border-solid border-[rgb(200,200,220)] text-[#8036de] cursor-pointer block font-bold hover:bg-[#f5f5ff] transition-all relative bg-white delay-150">
                      Go to Documentation
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Page>
        </>
      )}
    </>
  );
};

export default Wallets;
