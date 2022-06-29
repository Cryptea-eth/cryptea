import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import { useRouter } from "next/router";
const Extras = () => {
  const { authenticate, isAuthenticated, isAuthenticating, user, account } =
    useMoralis();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Logged in user:", user.get("ethAddress"));
    } else {
      console.log("Not logged in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Welcome to Cryptea" })
        .then(function (user) {
          window.location.href = "/signup";
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
router.replace("/");        });
    } else {
      window.location.href = "/signup";
    }
  };

  return (
    <div className="mt-40 mb-10 h-[660px] mmd:h-fit w-full bg-cover bg-no-repeat flex justify-center items-center relative">
      <div className="w-full absolute h-full z-[-1]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 698"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1440 281.43V0L718.5 81L-3 0V281.43C-3 359.089 44.2608 428.931 116.351 457.807L711.063 696.021C715.837 697.933 721.163 697.933 725.937 696.021L1320.65 457.807C1392.74 428.931 1440 359.089 1440 281.43Z"
            fill="#F5F8FF"
          />
        </svg>
      </div>
      <div className="text-center w-[300px]">
        <span className="uppercase text-[#F57059] font-semibold text-[14px]">
          receive tips easily
        </span>

        <h1 className="text-black w-fit mb-4 font-bold text-[29px] mt-1">
          All you need do is ‘Connect Wallet’
        </h1>

        <span className="block mb-3 text-[#64607D]">
          And receive tips while you sip tea
        </span>

        <button
          onClick={login}
          className="text-sm hover:bg-[#ff320e] transition-all delay-500 rounded-[6rem] bg-[#F57059] mt-2 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Extras;
