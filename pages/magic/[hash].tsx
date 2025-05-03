import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../../app/components/elements/loader";
import Head from 'next/head';
import Nav from "../../app/components/elements/Nav";
import Image from "next/image";
import emailImg from "../../public/images/email_fail.svg";
import Link from 'next/link';
import { Button } from '@mui/material';
import { BiSync } from "react-icons/bi";
import { AxiosError } from "axios";
import type { IconType } from 'react-icons';
import http from "../../utils/http";

const VerifyHash = () => {

    const router = useRouter();

    const [isLoading, setLoading] = useState<boolean>(true);

    const hash = router.query['hash'];

    useEffect(() => {
      
      if (hash !== undefined) {
        http
          .post(
            `/login/magic?tz=${window.jstz
              .determine()
              .name()}`,
            {
              magic: String(hash),
            }
          )
          .then((userx) => {
            const {
              email,
              img,
              accounts,
              username,
              id,
              isEmailVerified,
              settlement
            }: {
              username: string;
              img: string;
              email: string;
              accounts: string[];
              id: number | string;
              settlement: any[];
              isEmailVerified: boolean;
            } = userx.data.data;

            let user = {
              id,
              email,
              username,
              accounts,
              settlement,
              img,
              isEmailVerified,
            };

            localStorage.setItem("user", JSON.stringify(user));

            localStorage.setItem("userToken", userx.data.token);

            
            if (accounts[0] == 'null' && !Boolean(settlement ? settlement.length : 0)) {
              router.push('/signup');
            }else {
              router.push("/dashboard");
            }
          })
          .catch((err) => {
            const error = err as AxiosError;

            // console.log(error);

            setLoading(false);
          });

        }

    }, [hash])


return isLoading ? (
  <Loader />
) : (
  <div className="h-screen">
    <Head>
      <title>Something&rsquo;s wrong with magic link | Breew</title>
      <meta
        name="description"
        content="Breew - Receive Payments Instantly With Ease."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div className="w-full h-[calc(100vh-100px)] flex flex-col justify-center items-center px-5 my-8">
      <Image src={emailImg} width={100} height={122} alt={"Email error"} />

      <h2 className="text-[#8036de] font-[400] 2md:text-2xl text-4xl mx-auto mt-10">
        Link validation Failed, please try again
      </h2>

      <span className="text-[#7e7e7e] block px-4 font-semibold text-lg mx-auto mt-5">
        Something went wrong it could be the link is expired or incorrect, try checking your internet
        access and reload the page, click the button below
        to request new link.
      </span>

      <Link href={'/magic'}>
        <a className="flex items-center justify-center mt-3">
        <Button
            className="hover:!bg-[#4a168e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#8036de] !text-white !font-semibold !py-3 !px-4"
          >
            {(BiSync as IconType)({ size: 22, className: "mr-1" })} Request Link
          </Button>
        </a>
      </Link>
    </div>
  </div>
);

}

export default VerifyHash;