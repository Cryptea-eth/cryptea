import Link from "next/link";
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import logo from '../../../../public/images/cryptea-logo.svg';

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
        <Link href="/" className="flex flex-row items-center justify-center">
          <div>
            <Image
              src={logo}
              alt="cryptea"
              width={30}
              height={30}
              className="mr-[5px] min-w-[30px]"
            />
            <span className="text-black text-2xl font-bold">CRYPTEA</span>
          </div>
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
          <Link href="/blog" className="text-black pl-4">
            Blog
          </Link>
        </div>
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
                {showModal! ? (
                  <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                          {/*header*/}
                          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-3xl font-semibold">Connect Wallet</h3>
                            <button
                              className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                              onClick={() => setShowModal(false)}
                            >
                              <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                              </span>
                            </button>
                          </div>
                          {/*body*/}
                          <div className="relative p-6 flex-auto">
                            <button
                              onClick={login}
                              className="hover:bg-[#ff320e] transition-all delay-200 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4 mx-2"
                            >
                              MetaMask
                            </button>
                            <button
                              onClick={walletconnect}
                              className="hover:bg-[#ff320e] transition-all delay-200 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4 mx-2"
                            >
                              WalletConnect
                            </button>

                          </div>
                          {/*footer*/}
                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
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
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;