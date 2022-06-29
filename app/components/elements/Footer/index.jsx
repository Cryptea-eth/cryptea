import linked from "../../../../public/images/icon0.png";
import Image from "next/image";
import mess from "../../../../public/images/icon1.png";
import twitt from "../../../../public/images/icon2.png";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import { useRouter } from "next/router";
const Footer = () => {
  const date = new Date();
  const { authenticate, isAuthenticated, isAuthenticating, user, account } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Logged in user:", user.get("ethAddress"));
      console.log(user);
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
          router.replace("/");
        });
    } else {
      window.location.href = "/signup";
    }
  };

  return (
    <div>
      <div className="flex mx-[70px] md:mx-5 mmd:mx-[10px] border-solid border-b-[#E5E5EA] border-b-[1px] w-auto p-5 justify-between pb-12">
        <div className="w-[220px]">
          <h3 className="font-bold text-[18px] mb-2">Cryptea</h3>
          <span className="text-[#757095] ">
            Receive tips while you sip tea. Directly, and securely.
          </span>
          <div className="flex items-center mb-4 justify-between mt-[3pc] w-[200px]">
            <a className="mr-[5px]" href="https://linkedin.com">
              <Image alt="linkedIn" src={linked} />
            </a>
            <a className="mr-[5px]" href="https://messenger.com">
              <Image alt="Messenger" src={mess} />
            </a>
            <a className="mr-[5px]" href="https://twitter.com">
              <Image alt="Twitter" src={twitt} />
            </a>
          </div>
          <h3 className="font-bold hidden 2sm:block text-[18px] mb-2">
            Join Us
          </h3>
          <div className="hidden 2sm:flex items-center justify-between w-[200px]">
            <div className="mr-[5px] block">
              <button
                onClick={login}
                className="text-sm hover:bg-[#ff320e] transition-all delay-500 rounded-[6rem] bg-[#F57059] mt-2 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
              >
                Connect Wallet
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-bold hidden 2sm:block text-[18px] mt-5 mb-2">
              Company
            </h3>
            <div className="flex-col hidden 2md:flex w-[200px]">
              <a className="mr-[5px] mb-3" href="">
                About Us
              </a>
              <a className="mr-[5px] mb-3" href="">
                Careers
              </a>
              <a className="mr-[5px] mb-3" href="">
                Blog
              </a>
            </div>
          </div>
        </div>

        <div className="w-[220px] 2sm:hidden ssm:w-fit">
          <h3 className="font-bold text-[18px] mb-2">Company</h3>
          <div className="flex flex-col w-[200px] ssm:w-fit">
            <a className="mr-[5px] mb-3" href="">
              About Us
            </a>
            <a className="mr-[5px] mb-3" href="">
              Careers
            </a>
            <a className="mr-[5px] mb-3" href="">
              Blog
            </a>
          </div>
        </div>

        <div className="w-[220px] 2sm:hidden">
          <h3 className="font-bold text-[18px] mb-2">Join Us</h3>
          <div className="flex items-center justify-between w-[200px]">
            <div className="mr-[5px]">
              <button
                onClick={login}
                className="text-sm hover:bg-[#ff320e] transition-all delay-500 rounded-[6rem] bg-[#F57059] mt-2 mx-auto justify-self-center place-self-center object-center text-white font-normal py-[14px] px-8"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center font-semibold py-5">
        Copyright &copy; Cryptea {date.getFullYear()}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
