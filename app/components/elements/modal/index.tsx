import { useCryptea } from "../../../contexts/Cryptea";
import { useState, useContext, useEffect } from 'react';
import { HomeContext } from "../../../contexts/HomeContext";
import Image from 'next/image';
import LogoSpace from "../logo";
import meta from "../../../../public/images/metamask.png";
import wallcon from "../../../../public/images/walletconnect.png";
import { CircularProgress, Box } from "@mui/material";
import Router, { useRouter } from "next/router";
import { supported } from "../../../contexts/Cryptea/connectors";
import UAuth from "@uauth/js";

const uauth = new UAuth({
  clientID: "76943570-6aaa-43d2-b826-e6bb87736e09",
  redirectUri: "http://localhost:3000",
  scope: "openid wallet",
})

const Ulogin = async () => {
  try {
    const authorization = await uauth.loginWithPopup()

    console.log(authorization)
    console.log(authorization.idToken)
    console.log(authorization.accessToken)
    console.log(authorization.idToken.wallet_address)
    console.log(authorization.idToken.sub)
    console.log(authorization.idToken.proof.signature)

  } catch (error) {
    console.error(error)
  }
}

const AuthModal = ({ message, blur = true, openM = false, userAuth = true }: { message?: string, userAuth?: boolean, blur?: boolean, openM?: boolean }) => {

  const router = useRouter();

  const modal = useContext(HomeContext);

  const {
    isAuthenticated,
    authenticateUser,
    connectWall,
    connectors,
    chainId,
    logout,
    user,
    update,
  } = useCryptea();


  const { pathname } = router;


  const [authError, updAuthError] = useState<string>("");
  const [isNotSupported, setSupport] = useState<boolean>(false);

  const [isAuth, setIsAuth] = useState<{
    [ix: string]: boolean;
  }>({
    metamask: false,
    coinbase: false,
    walletconnect: false,
  });

  const useclose = () => {
    if (modal.close !== undefined) modal?.close();

    updAuthError("");
  };

  const actionAuth = (email?: string) => {
    if (pathname == "/") {
      if (email === undefined) {
        router.push("/signup");
      } else {
        if (String(email).length) {
          router.push("/signup");
        } else {
          router.push("/dashboard");
        }
      }
    } else if (pathname == '/auth') {
      if (Boolean(email)) {

        const paths = Object.keys(Router.router?.components !== undefined ? Router.router?.components : {});

        if (paths.length > 2) {

          router.back();

        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/signup');
      }
    } else {
      setIsAuth({ metamask: false, coinbase: false, walletconnect: false });
      useclose();
    }
  }

  useEffect(() => {

    if (isAuthenticated) {
      if (isNotSupported) {
        logout();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isNotSupported, user]);


  const login = async () => {
    updAuthError("");
    setIsAuth({ ...isAuth, metamask: true });

    if (!isAuthenticated) {
      setSupport(false);
      try {
        let isAuthing: any;
        if (userAuth) {
          isAuthing = await authenticateUser({
            signMessage: message ?? "Welcome to Cryptea",
            type: connectors[2],
          });
        } else {
          isAuthing = await connectWall(connectors[2]);
        }

        if (supported.includes(chainId ? Number(chainId) : 137)) {

          console.log(chainId)

          if (isAuthing !== undefined) {

            if (userAuth) {
              const email = await "user".get("email");

              setIsAuth({ ...isAuth, metamask: false });
              if (update) {

                update(isAuthing);

              }

              actionAuth(String(email));

            } else {
              setIsAuth({ metamask: false, coinbase: false, walletconnect: false });
              useclose();
            }
          } else {
            updAuthError("Something went wrong please try again1");
            setIsAuth({ ...isAuth, metamask: false });
          }

        } else {
          setSupport(true);
          throw "Only Polygon network is supported";
        }
      } catch (err) {
        const error = err as Error;
        console.log(error)
        updAuthError("Something went wrong please try again");
        setIsAuth({ ...isAuth, metamask: false });
      }
    } else {
      updAuthError("Please refresh the page");

      setIsAuth({ ...isAuth, metamask: false });
    }
  };


  const walletconnect = async () => {
    updAuthError("");
    setIsAuth({ ...isAuth, walletconnect: true });

    if (!isAuthenticated) {
      setSupport(false);
      try {
        let isAuthing: any;
        if (userAuth) {
          isAuthing = await authenticateUser({
            signMessage: message ?? "Welcome to Cryptea",
            type: connectors[1],
          });
        } else {
          isAuthing = await connectWall(connectors[1]);
        }

        if (supported.includes(chainId ? Number(chainId) : 137)) {
          if (isAuthing !== undefined) {
            if (userAuth) {
              const email = await "user".get("email");

              setIsAuth({ ...isAuth, walletconnect: false });

              if (update) {
                update(isAuthing);
              }

              actionAuth(String(email));
            } else {
              setIsAuth({
                walletconnect: false,
                coinbase: false,
                metamask: false,
              });
              useclose();
            }
          } else {
            updAuthError("Something went wrong please try again");
            setIsAuth({ ...isAuth, walletconnect: false });
          }
        } else {
          setSupport(true);
          throw "Only Polygon network is supported";
        }
      } catch (err) {
        const error = err as Error;
        console.log(error);
        updAuthError("Something went wrong please try again");
        setIsAuth({ ...isAuth, walletconnect: false });
      }
    } else {
      setIsAuth({ ...isAuth, walletconnect: false });
    }
  };

  return (
    <>
      {(Boolean(modal.show) || openM) && (
        <div
          className={`justify-center bg-[rgba(255,255,255,.4)] items-center flex overflow-x-hidden z-[100000000] overflow-y-auto ${!blur ? "backdrop-blur" : "backdrop-blur-[2px]"
            } fixed inset-0 z-50 outline-none focus:outline-none`}
        >
          <div className="relative max-w-[1500px] w-[80%] 4sm:w-[60%] min-w-[340px]">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-center justify-center py-5 border-solid rounded-t">
                <LogoSpace />
              </div>

              <div className="flex items-center justify-center pb-2 pt-3 border-solid rounded-t">
                <h2
                  style={{ fontFamily: "inherit" }}
                  className="text-[18px] font-bold"
                >
                  Connect Wallet
                </h2>
              </div>
              {/*body*/}
              {Boolean(authError?.length) && (
                <div className="transition-all rounded-md delay-500 border-[#F57059] text-[rgb(245,112,89)] items-center font-bold text-[16px] border-[1px] mx-6 my-2 w-[calc(100%-48px)] p-3">
                  {authError}
                </div>
              )}

              <div className="relative p-6 flex flex-col justify-center 4zsm:flex-row">
                <button
                  onClick={login}
                  style={{
                    fontFamily: "inherit",
                    borderColor: isAuth["metamask"] ? "#f57059" : undefined,
                    color: isAuth["metamask"] ? "#f57059" : undefined,
                  }}
                  className="transition-all rounded-md delay-500 hover:border-[#F57059] hover:text-[#F57059] items-center text-[16px] flex justify-between border-[1px] 4zsm:mr-2 text-[#575757] mb-2 w-full py-4 px-4"
                >
                  <div className="flex items-center">
                    {isAuth["metamask"] && (
                      <Box className="mr-2 h-[22px] text-[#F57059]">
                        <CircularProgress
                          className="!w-[22px] !h-[22px]"
                          color="inherit"
                        />
                      </Box>
                    )}
                    Metamask
                  </div>
                  <Image src={meta} alt="Metamask" width={40} height={40} />
                </button>
                <button
                  onClick={walletconnect}
                  style={{
                    fontFamily: "inherit",
                    borderColor: isAuth["walletconnect"]
                      ? "#f57059"
                      : undefined,
                    color: isAuth["walletconnect"] ? "#f57059" : undefined,
                  }}
                  className="transition-all rounded-md items-center delay-500 4zsm:ml-2  text-[16px] hover:border-[#F57059] hover:text-[#F57059] border-[1px] flex justify-between text-[#575757] mb-2 w-full py-4 px-4"
                >
                  <div className="flex items-center">
                    {isAuth["walletconnect"] && (
                      <Box className="mr-2 h-[22px] text-[#F57059]">
                        <CircularProgress
                          className="!w-[22px] !h-[22px]"
                          color="inherit"
                        />
                      </Box>
                    )}
                    Walletconnect
                  </div>

                  <Image
                    src={wallcon}
                    alt="Wallet Connect"
                    width={40}
                    height={40}
                  />
                </button>
                <button
                  onClick={Ulogin}
                  style={{
                    fontFamily: "inherit",
                    borderColor: isAuth["walletconnect"]
                      ? "#f57059"
                      : undefined,
                    color: isAuth["walletconnect"] ? "#f57059" : undefined,
                  }}
                  className="transition-all rounded-md items-center delay-500 4zsm:ml-2  text-[16px] hover:border-[#F57059] hover:text-[#F57059] border-[1px] flex justify-between text-[#575757] mb-2 w-full py-4 px-4"
                >
                  <div className="flex items-center">
                    {isAuth["walletconnect"] && (
                      <Box className="mr-2 h-[22px] text-[#F57059]">
                        <CircularProgress
                          className="!w-[22px] !h-[22px]"
                          color="inherit"
                        />
                      </Box>
                    )}
                    Login With Unstoppable Domains
                  </div>

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
                  onClick={useclose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthModal;