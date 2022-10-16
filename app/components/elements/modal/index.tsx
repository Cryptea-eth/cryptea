import { useCryptea } from "../../../contexts/Cryptea";
import { useState, useContext, useEffect } from "react";
import { HomeContext } from "../../../contexts/HomeContext";
import Image from "next/image";
import LogoSpace from "../logo";
import meta from "../../../../public/images/metamask.png";
import wallcon from "../../../../public/images/walletconnect.png";
import unstop from "../../../../public/images/unstoppable.svg";
import { CircularProgress, Box } from "@mui/material";
import Router, { useRouter } from "next/router";
import {
  supported,
  uauth_connector,
} from "../../../contexts/Cryptea/connectors";
import { DashContext } from "../../../contexts/GenContext";

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

  const modal = useContext(HomeContext);

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

  const [isAuth, setIsAuth] = useState<{
    [ix: string]: boolean;
  }>({
    metamask: false,
    uauth: false,
    coinbase: false,
    walletconnect: false,
  });

  const useclose = () => {
    if (modal.close !== undefined) modal?.close();

    updAuthError("");
  };

  const isMainAuth = () => {
    let b: boolean = true;
    for (let a in isAuth) {
      if (isAuth[a]) {
        b = false;
      }
    }

    return b;
  };

  const blurAuth = (index: string) => {
    if (!isMainAuth()) {
      if (isAuth[index]) {
        return {
          cursor: "default",
        };
      } else {
        return {
          cursor: "default",
          opacity: 0.5,
          color: "#575757 !important",
          borderColor: "#575757 !important",
        };
      }
    } else {
      return {};
    }
  };

  const actionAuth = (email?: string) => {
    updateLogin?.(false);

    if (pathname == "/") {
        console.log(router.isReady)
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
    } else {
      setIsAuth(defaultIsAuth);
      useclose();
    }
  };


  const methods = ["metaauth", "walletconnectauth" , "uauth"];

  const storeAuth = (authMethod: string) => {
    const cache = localStorage.getItem('auths');

    let list: string[] = [];

    if (cache !== null) {

      cache.split(",").forEach((e: string) => {
        if (methods.indexOf(e) != -1 && e !== authMethod) list.push(e);
      });

    } else {
      
      methods.forEach((e: string) => {
        if (e !== authMethod) list.push(e);
      });

    }

    list.push(authMethod);

    localStorage.setItem("auths", list.join(","));

  };

  useEffect(() => {
    if (isAuthenticated) {
      if (isNotSupported) {
        logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, connected, isNotSupported, user, router.isReady]);

  const Ulogin = async () => {
    if (isMainAuth()) {
      updAuthError("");
  
      if (!isAuthenticated) {

        setIsAuth({ ...isAuth, uauth: true });

        setSupport(false);
        try {

          const authorization = await uauth_connector.loginWithPopup();

          if (Boolean(authorization)) {
            const { signature, message } =
              authorization.idToken.verified_addresses[1].proof;

            const main = await AuthAddress({
              signature,
              message,
              address: authorization.idToken.wallet_address as string,
            });

            if (Boolean(main)) {
              if (userAuth) {
                storeAuth("uauth");

                const email = await "user".get("email");

                setIsAuth({ ...isAuth, uauth: false });

                update?.(main);
              
                actionAuth(email as string);
              }
            }
          } else {
            updAuthError("Something went wrong please try again");
            setIsAuth({ ...isAuth, uauth: false });
          }
        } catch (error) {
          console.log(error);
          updAuthError("Something went wrong please try again");
          setIsAuth({ ...isAuth, uauth: false });
        }
      }else{
        console.log('here authenticated', isAuthenticated, localStorage.getItem('userToken'))
      }
    }
  };

  const login = async () => {
    if (isMainAuth()) {
      updAuthError("");
      setIsAuth({ ...isAuth, metamask: true });

      if (!isAuthenticated || !userAuth) {
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

          storeAuth("metaauth");

          if (supported.includes(chainId ? Number(chainId) : 137)) {
            console.log(chainId);

            if (isAuthing !== undefined) {
              if (userAuth) {
                const email = await "user".get("email");

                setIsAuth({ ...isAuth, metamask: false });
                if (update) {
                  update(isAuthing);
                }

                actionAuth(email as string);
              } else {
                
                setIsAuth({ ...isAuth, metamask: false });

                useclose();
              }
            } else {
              updAuthError("Something went wrong please try again");
              setIsAuth({ ...isAuth, metamask: false });
            }
          } else {
            setSupport(true);
            setIsAuth({ ...isAuth, metamask: false });
            throw "Only Polygon network is supported";
          }
        } catch (err) {
          const error = err as Error;
          console.log(error);
          updAuthError("Something went wrong please try again");
          setIsAuth({ ...isAuth, metamask: false });
        }
      } else {
        updAuthError("Please refresh the page");

        setIsAuth({ ...isAuth, metamask: false });
      }
    }
  };

  const walletconnect = async () => {
    if (isMainAuth()) {
      updAuthError("");
      setIsAuth({ ...isAuth, walletconnect: true });

      if (!isAuthenticated || !userAuth) {
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

          storeAuth("walletconnectauth");
          if (supported.includes(chainId ? Number(chainId) : 137)) {
            if (isAuthing !== undefined) {
              if (userAuth) {
                const email = await "user".get("email");

                setIsAuth({ ...isAuth, walletconnect: false });

                if (update) {
                  update(isAuthing);
                }

                actionAuth(email as string);
              } else {
                setIsAuth({...defaultIsAuth});
                useclose();
              }
            } else {
              updAuthError("Something went wrong please try again");
              setIsAuth({ ...isAuth, walletconnect: false });
            }
          } else {
            setIsAuth({ ...isAuth, walletconnect: false });
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
        updAuthError("Please refresh the page");

        setIsAuth({ ...isAuth, walletconnect: false });
      }
    }
  };

  const [arrange, setArrange] = useState<(JSX.Element | boolean)[]>([]);



  useEffect(() => {

      const buttons: {
        [index: string]: JSX.Element | boolean;
      } = {
        metaauth: (
          <button
            onClick={login}
            key={0}
            style={{
              fontFamily: "inherit",
              borderColor: isAuth["metamask"] ? "#f57059" : undefined,
              color: isAuth["metamask"] ? "#f57059" : undefined,
              ...blurAuth("metamask"),
            }}
            className="transition-all rounded-md delay-500 hover:border-[#F57059] hover:text-[#F57059] items-center text-[16px] flex justify-between border-[1px] text-[#575757] w-full py-4 min-w-[320px] px-4"
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
        ),
        walletconnectauth: (
          <button
            onClick={walletconnect}
            key={1}
            style={{
              fontFamily: "inherit",
              borderColor: isAuth["walletconnect"] ? "#f57059" : undefined,
              color: isAuth["walletconnect"] ? "#f57059" : undefined,
              ...blurAuth("walletconnect"),
            }}
            className="transition-all rounded-md items-center delay-500 text-[16px] hover:border-[#F57059] hover:text-[#F57059] border-[1px] min-w-[320px] flex justify-between text-[#575757] w-full py-4 px-4"
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

            <Image src={wallcon} alt="Wallet Connect" width={40} height={40} />
          </button>
        ),
        uauth: userAuth && (
          <button
            onClick={Ulogin}
            key={2}
            style={{
              fontFamily: "inherit",
              borderColor: isAuth["uauth"] ? "#f57059" : undefined,
              color: isAuth["uauth"] ? "#f57059" : undefined,
              ...blurAuth("uauth"),
            }}
            className="transition-all rounded-md items-center delay-500 text-[16px] hover:border-[#F57059] hover:text-[#F57059] border-[1px] min-w-[320px] flex justify-between text-[#575757] w-full py-4 px-4"
          >
            <div className="flex items-center">
              {isAuth["uauth"] && (
                <Box className="mr-2 h-[22px] text-[#F57059]">
                  <CircularProgress
                    className="!w-[22px] !h-[22px]"
                    color="inherit"
                  />
                </Box>
              )}
              Login With Unstoppable
            </div>

            <Image
              src={unstop}
              alt="Unstoppable Wallet Connect"
              width={40}
              height={40}
            />
          </button>
        ),
      };

    const auths = Object.keys(buttons);

    const cache = localStorage.getItem('auths');

    const list: (JSX.Element | boolean)[] = []

    if (cache !== null) {
        cache.split(',').forEach((ix: string) => {
            if (auths.indexOf(ix) != -1) {
                list.push(buttons[ix])
            }
        });

        setArrange(list)

    }else{

      setArrange(Object.values(buttons));

    }
    
  }, [isAuth, userAuth, isAuthenticated]);

  return (
    <>
      {(Boolean(modal.show) || openM) && (
        <div
          className={`justify-center bg-[rgba(255,255,255,.4)] items-center flex overflow-x-hidden z-[100000000] overflow-y-auto ${
            !blur ? "backdrop-blur" : "backdrop-blur-[2px]"
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

              <div
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                }}
                className="relative p-6 grid gap-2 grid-flow-dense"
              >
                {arrange}
              </div>
              {/*footer*/}

              {pathname != "/auth" && (
                <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={useclose}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
