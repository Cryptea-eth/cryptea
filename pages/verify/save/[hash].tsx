import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Nav from "../../../app/components/elements/Nav";
import Head from 'next/head';
import Loader from "../../../app/components/elements/loader";
import Image from "next/image";
import emailImg from "../../../public/images/email_fail.svg";
import axios, { AxiosError } from "axios";
import { useCryptea } from "../../../app/contexts/Cryptea";

const VerifyHash = () => {

    const router = useRouter();

    const [isLoading, setLoading] = useState<boolean>(true);

    const hash = router.query['hash'];

    const { isAuthenticated } = useCryptea();

    useEffect(() => {
      
      if (hash !== undefined && isAuthenticated !== undefined) {
        if(!isAuthenticated){
        axios.post(
            `https://ab.cryptea.me/verify/user?tz=${window.jstz
              .determine()
              .name()}`,
            {
              hash: String(hash),
            }
          )
          .then((userx) => {
            const {
              email,
              img,
              accounts,
              username,
              id,
              email_verified_at,
              settlement,
            }: {
              username: string;
              img: string;
              email: string;
              accounts: string[];
              settlement: any[];
              id: number | string;
              email_verified_at: any;
            } = userx.data.data;

            let user = {
              id,
              email,
              username,
              settlement,
              accounts,
              img,
              email_verified_at,
            };

            localStorage.setItem("user", JSON.stringify(user));

            localStorage.setItem("userToken", userx.data.token);

            if (accounts[0] == "null" && !Boolean(settlement ? settlement.length : 0)) {
              router.push("/signup");
            } else {
              router.push("/dashboard/settings");
            }
          })
          .catch((err) => {
            const error = err as AxiosError;

            setLoading(false);
          });

        }else{
            router.push('/dashboard/settings')
        }
    }

    }, [hash, isAuthenticated])


return isLoading ? (
  <Loader />
) : (
  <div className="h-screen">
    <Head>
      <title>Something&rsquo;s wrong with verification link | Cryptea</title>
      <meta
        name="description"
        content="Cryptea - Receive Payments Instantly With Ease."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div className="w-full h-[calc(100vh-100px)] flex flex-col justify-center items-center px-5 my-8">
      <Image src={emailImg} width={100} height={122} alt={"Email error"} />

      <h2 className="text-[#F57059] font-[400] 2md:text-2xl text-4xl mx-auto mt-10">
        Link validation Failed, please try again
      </h2>

      <span className="text-[#7e7e7e] block px-4 font-semibold text-lg mx-auto mt-5">
        Something went wrong it could be the link is expired or incorrect, try checking your internet access and reload the page
      </span>

      
    </div>
  </div>
);

}

export default VerifyHash;