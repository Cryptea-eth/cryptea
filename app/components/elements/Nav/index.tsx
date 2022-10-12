import Link from "next/link";
import { useContext, useState } from "react";
import { HomeContext } from "../../../contexts/HomeContext";
import { useRouter } from "next/router";
import LogoSpace from "../logo";
import { useCryptea } from "../../../contexts/Cryptea";
import AuthModal from "../modal";

function Nav() {
  const router = useRouter();

  const { authenticate, user, isAuthenticated } =
    useCryptea();


  // const walletconnect = async () => {
  //   updAuthError("");
  //   setIsAuth({ ...isAuth, walletconnect: true });
  //   if (!isAuthenticated) {
  //     setSupport(false);
  //     await authenticate({
  //       signingMessage: "Welcome to Cryptea",
  //       provider: "walletConnect",
  //     })
  //       .then(function (user) {
          
  //         setIsAuth({ ...isAuth, walletconnect: false });

  //         if(supported.includes(chainId ? Number(chainId) : 137)){
  //         if (user!.get("email") === undefined) {
  //           window.location.href = "/signup";
  //         } else {
  //           if (!user!.get("email").length) {
  //             window.location.href = "/signup";
  //           } else {
  //             window.location.href = "/dashboard";
  //           }
  //         }
  //       }else{
  //         setSupport(true);
  //         throw 'Only Polygon network is supported';
  //       }
  //       })
  //       .catch(function (error) {
  //         updAuthError(error);
  //         setIsAuth({ ...isAuth, walletconnect: false });
  //       });
  //   }else {
  //     setIsAuth({ ...isAuth, walletconnect: false });
  //   }
  // };

  return (
    <div className="nav relative ml-[30px] 2sm:ml-1 z-10">
      <div className="flex flex-row justify-between items-center px-14 pt-5 2sm:px-7">
        <LogoSpace />
        <div className="text-black flex flex-row font-medium text-lg">
          <div
            onClick={() => {
              document.querySelector("#about")?.scrollIntoView();
            }}
            className="text-black cursor-pointer pr-4"
          >
            About
          </div>
          <Link href="/blog">
            <a className="text-black pl-4">Blog</a>
          </Link>
        </div>

       <AuthModal />

        <div className="right mmd:hidden">
          <div>
            {isAuthenticated! ? (
              <Link href={"/dashboard"}>
              <a 
                className="hover:bg-[#ff320e] transition-all delay-200 text-sm rounded-lg bg-[#F57059] block text-white font-semibold py-4 px-4"
              >
                Dashboard
              </a>
              </Link>
            ) : (
              <div>
                <button
                  className="hover:bg-[#ff320e] transition-all delay-200 text-sm rounded-lg bg-[#F57059] text-white font-semibold py-4 px-4 mx-2"
                  type="button"
                  onClick={() => authenticate(true)}
                >
                  Launch App
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
