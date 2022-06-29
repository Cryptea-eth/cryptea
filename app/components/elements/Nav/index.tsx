import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import logo from '../../../../public/images/cryptea-logo.svg';

import meta from '../../../../public/images/metamask.png';
import wallcon from '../../../../public/images/walletconnect.png';

function Nav() {
  const { isAuthenticated, user, authenticate, logout, chainId, isWeb3EnableLoading, isWeb3Enabled, enableWeb3 } = useMoralis();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Logged in user:", user!.get("ethAddress"));
    } else {
      console.log("Not logged in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Welcome to Cryptea" })
        .then(function (user) {
          if (user!.get("email") === undefined) {
            window.location.href = "/signup";
          } else {
            if (!user!.get("email").length) {
              window.location.href = "/signup";
            } else {
              window.location.href = "/dashboard";
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const walletconnect = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Welcome to Cryptea", provider: "walletConnect" })
        .then(function (user) {
          if (user!.get("email") === undefined) {
            window.location.href = "/signup";
          } else {
            if (!user!.get("email").length) {
              window.location.href = "/signup";
            } else {
              window.location.href = "/dashboard";
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const logOut = async (redirect = false) => {
    if (isAuthenticated) {
      logout();

    }
  };

  return (
    <div className="nav relative ml-[30px] 2sm:ml-1 z-10">
      <div className="flex flex-row justify-between items-center px-14 pt-5 2sm:px-7">
        <Link href="/">
          <a className="flex flex-row items-center justify-center">
            <Image
              src={logo}
              alt="cryptea"
              width={30}
              height={30}
              className="min-w-[30px]"
            />
            <span className="text-black text-xl ml-[5px] font-[600]">CRYPTEA</span>
          </a>
        </Link>
        {/* <Link to="/" className="text-black text-2xl font-bold">
          CRYPTEA
        </Link> */}
        <div className="text-black flex flex-row font-medium text-lg">
          <div
            onClick={() => {
              document.querySelector("#about")?.scrollIntoView()
            }}
            className="text-black pr-4"
          >
            About
          </div>
          <Link href="/blog">
            <a className="text-black pl-4">
              Blog
            </a>
          </Link>
        </div>

          {showModal! ? (
                    <div className="justify-center bg-[rgba(255,255,255,.4)] items-center flex overflow-x-hidden overflow-y-auto backdrop-blur fixed inset-0 z-50 outline-none focus:outline-none">

                      <div className="relative max-w-[1200px] mmd:w-[90%] w-[60%] min-w-[340px]">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                          {/*header*/}
                          <div className="flex items-center justify-center py-5 border-solid rounded-t">
                             <Image
                                src={logo}
                                alt="cryptea"
                                width={30}
                                height={30}
                                className="min-w-[30px]"
                              /> 
                              <span className="text-black text-xl ml-[5px] font-[600]">CRYPTEA</span>
                          </div>

                          <div className="flex items-center justify-center pb-2 pt-3 border-solid rounded-t">
                             <h2 style={{ fontFamily: 'inherit' }} className="text-[18px] font-bold">Connect Wallet</h2>
                          </div>
                          {/*body*/}
                          <div className="relative p-6 flex flex-col justify-center 4sm:flex-row">

                            <button
                            style={{fontFamily:"inherit"}}
                              onClick={login}
                              className="transition-all rounded-md delay-500 hover:border-[#F57059] hover:text-[#F57059] items-center text-[16px] flex justify-between border-[1px] 4sm:mr-2 text-[#575757] mb-2 w-full py-4 px-4"
                            >
                              Metamask

                              <Image 
                                src={meta}
                                alt="Metamask"
                                width={40}
                                height={40}
                              />
                            </button>
                            <button
                              onClick={walletconnect}
                              style={{fontFamily:"inherit"}}
                              className="transition-all rounded-md items-center delay-500 4sm:ml-2 text-[16px] hover:border-[#F57059] hover:text-[#F57059] border-[1px] flex justify-between text-[#575757] mb-2 w-full py-4 px-4"
                            >
                              Walletconnect

                              <Image 
                                src={wallcon}
                                alt="Wallet Connect"
                                width={40}
                                height={40}
                              />
                              </button>
                          </div>
                          {/*footer*/}
                          <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                            <button
                              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
             
                ) : null}

        <div className="right mmd:hidden">
          <div>
            {isAuthenticated! ? (
              <button
                onClick={logout}
                className="hover:bg-[#ff320e] transition-all delay-200 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4"
              >
                {user!.get('ethAddress').substring(0, 5) + "...." + user!.get('ethAddress').substring(user!.get('ethAddress').length - 5)}
                {""}
              </button>
            ) : (
              <div>
                <button
                  className="hover:bg-[#ff320e] transition-all delay-200 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4 mx-2"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                    Connect Wallet
                </button>
                
              </div>
            )}
          </div>
        </div>

          

      </div>
    </div>
  );
}

export default Nav;