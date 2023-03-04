import { useCryptea } from "../../../contexts/Cryptea";
import { useState, useContext, useEffect } from "react";
import { Button } from '@mui/material';
import Image from "next/image";
import LogoSpace from "../logo";
import meta from "../../../../public/images/metamask.png";
import { CircularProgress, Box } from "@mui/material";
import Router, { useRouter } from "next/router";
import {
  supported,
  uauth_connector,
} from "../../../contexts/Cryptea/connectors";
import { DashContext } from "../../../contexts/GenContext";
import { post_request } from "../../../contexts/Cryptea/requests";
import analytics from "../../../../analytics";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { AuthContextMain } from "../../../contexts/Cryptea/Auth";
import logo from "../../../../public/images/cryptea-logo.svg";
import logo1 from "../../../../public/images/cryptea.png";


const AuthModal = ({
  message,
  blur = true,
  openM = false,
  userAuth = true,
}: {
  message?: string;
  userAuth?: boolean;
  blur?: boolean;
  openM?: boolean;
}) => {

  const router = useRouter();

  const auth = useContext(AuthContextMain);

  const { isConnected } = useAccount();

  const { openConnectModal } = useConnectModal();
  
  const [ isLoading, setLoading ] = useState<boolean>(true);

  
  let timer: any;

  const updateHead = () => {
    const elem = document.querySelector("#rk_connect_title");

    if (elem !== null) {
      elem.innerHTML = `<a class="flex flex-row max-w-[116px] min-w-[116px] items-center justify-between" href="/" style="transform: scale(0.7);left: -8px;margin-bottom: 2px;position: relative;"><span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"><span style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"><img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e" style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"></span><img alt="cryptea" src="${logo.src}" decoding="async" data-nimg="intrinsic" class="min-w-[30px]" srcset="${logo.src} 1x, ${logo.src} 2x" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></span><span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"><span style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"><img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2782%27%20height=%2715%27/%3e" style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"></span><img alt="cryptea" src="${logo1.src}" decoding="async" data-nimg="intrinsic" class="min-w-[30px]" srcset="${logo1.src} 1x, ${logo1.src} 2x" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></span></a> Launch App `;

      (
        document.querySelector("._1vwt0cg2") || {
          classList: { add: (xx: string) => {} },
        }
      )?.classList.add("cusscroller");

      
      clearTimeout(timer);
    } else {
      timer = setTimeout(updateHead, 50);
    }
  };

  const [mobile, setMobile] = useState<boolean>(false);




  const {
    logout: { update: updateLogin },
  } = useContext(DashContext);

  const {
    isAuthenticated,
    authenticateUser,
    connectWall,
    connectors,
    connected,
    chainId,
    AuthAddress,
    logout,
    user,
    update,
  } = useCryptea();

  const { pathname } = router;


  const [authError, updAuthError] = useState<string>("");
  const [isNotSupported, setSupport] = useState<boolean>(false);

  const defaultIsAuth = {
    metamask: false,
    uauth: true,
    coinbase: false,
    walletconnect: false
  };

  const actionAuth = (email?: string) => {
    updateLogin?.(false);

    if (pathname == "/") {
        // console.log(router.isReady)
      if (!Boolean(email)) {
        Router.push("/signup");
      } else {
        if (String(email).length) {
          router.push("/dashboard");
        } else {
          router.push("/signup");
        }
      }
    } else if (pathname == "/auth") {
      if (Boolean(email)) {
        const paths = Object.keys(
          Router.router?.components !== undefined
            ? Router.router?.components
            : {}
        );

        if (paths.length > 2) {
          router.back();
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/signup");
      }
    }
  };


    const login = async () => {

      updAuthError("");

      setLoading(true);

      if (!isAuthenticated) {
        try {

          let isAuthing: any;

        

          isAuthing = await authenticateUser({
            signMessage: message ?? "Welcome to Cryptea",
            type: connectors[2],
          });

          if (isAuthing !== undefined) {
            if (userAuth) {
              // drop here - metamask
              analytics.track("Auth");

              const email = await "user".get("email");


              actionAuth(email as string);

            }
          } else {

            console.log('ee')

            setLoading(false);
            updAuthError("Something went wrong please try again");
          }
        } catch (err) {
          const error = err as Error;
          console.log(error);
          setLoading(false);
          updAuthError("Something went wrong please try again");
        }
      } else {
        router.push("/dashboard");
      }
    };



    useEffect(() => {
      setMobile(Boolean(auth.mobile));

      if (isConnected && localStorage.getItem("userToken") !== null) {
        
        router.push("/dashboard");

      } else {
        if (!isConnected) {
          if (openConnectModal) {
            setLoading(false);
            openConnectModal();
            updateHead();
          }else{
            setLoading(true)
          }
        } else if (localStorage.getItem("userToken") === null && !isLoading) {
           login();
        }
      }
    }, [isConnected, router, openConnectModal, auth.mobile]);
    


  return (
    <>
      <div
        className={` justify-center bg-[#e5e5e5] ${
          !mobile ? "items-center" : "items-end"
        } flex overflow-x-hidden z-[100000000] overflow-y-auto ${
          !blur ? "backdrop-blur" : "backdrop-blur-[2px]"
        } fixed inset-0  outline-none focus:outline-none`}
      >
        <div
          className={`relative flex rounded-[25px] ${
            mobile
              ? "max-w-[480px] sxm:max-w-full sxm:rounded-t-[2rem] sxm:rounded-b-none w-full min-h-[440px]"
              : "sm:w-[336px] max-w-[720px] min-w-[350px] min-h-[468px]"
          }  flex-col items-center justify-center shadow-lg bg-white`}
        >
          {Boolean(authError?.length) && (
            <div className="transition-all rounded-md delay-500 border-[#F57059] text-[rgb(245,112,89)] items-center font-bold text-[16px] border-[1px] mx-6 mb-4 w-[calc(100%-48px)] p-3">
              {authError}
            </div>
          )}

          <div className="flex-col flex items-center justify-between h-[140px]">
            <LogoSpace className="scale-75" />

            <div className="flex flex-col justify-between h-[85px] items-center">
              <h2
                style={{ fontFamily: "inherit" }}
                className="text-[18px] text-[#121212] leading-[24px] font-bold"
              >
                Launching App...
              </h2>

              {!isLoading ? (
                <>
                  <div className="text-[14px] leading-[18px] font-[500] text-[rgba(60,66,66,0.6)] text-center">
                    Click the button below to retry
                  </div>

                  <button
                    onClick={() => {
                      if (!isConnected) {
                        openConnectModal?.();
                        updateHead();
                      } else {
                        login();
                      }
                    }}
                    className="uppercase text-white bg-[#f57059] transition-all py-1 leading-normal hover:bg-[#f05338] px-3 text-center h-auto rounded-[3rem] font-bold block cursor-pointer mx-auto"
                  >
                    Retry
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[14px] leading-[18px] font-[500] text-[rgba(60,66,66,0.6)] text-center">
                    Please just a sec...
                  </div>

                  <div className="mx-auto block mt-1 text-center">
                    <CircularProgress size={20} className="text-[rgba(60,66,66,0.6)]" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
