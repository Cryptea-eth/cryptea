
import Nav from "../../../app/components/elements/Nav";
import Head from "next/head";
import {useRouter} from "next/router";
import Loader from "../../../app/components/elements/loader";
import { useState, useEffect } from "react";
import emailImg from "../../../public/images/email_fail.svg";
import Image from "next/image";
import { get_request } from "../../../app/contexts/Cryptea/requests";

const EmailHash = () => {

    const [isLoading, setLoading] = useState<boolean>(true);

    const Router = useRouter();

    const hash = Router.query['hash'];

    useEffect(() => {

        if (hash) {

          "user".get("*", true).then(async (e: any) => {
            
            if (!Boolean(e.isEmailVerified) && Boolean(e.email)) {

            get_request(`/verify/mail/${hash}`, {}, undefined, false)
              .then((e) => {
                Router.push('/dashboard');

              })
              .catch((err) => {
                // console.log(err);

                setLoading(false);
                
              });  
            }else{
                 Router.push("/dashboard");
            } 
        })

        }

    }, [hash])


return isLoading ? (
  <Loader />
) : (
  <div className="h-screen">
    <Head>
      <title>Verification link invalid | Breew</title>
      <meta
        name="description"
        content="Breew - Receive Payments Instantly With Ease."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div className="flex flex-col justify-center items-center h-[calc(100vh-75px)]">
    <div className="w-full h-fit flex flex-col justify-items-center px-5 my-8">
      <Image src={emailImg} width={70} height={82} alt={"Email error"} />

      <h2 className="text-[#8036de] font-[400] 2md:text-2xl text-4xl mx-auto mt-8">
        Verification Failed, please try again
      </h2>

      <span className="text-[#7e7e7e] block font-semibold text-lg mx-auto mt-6">
        Something went wrong, try resending the link or checking your internet
        access, if all doesnt work, contact us.
      </span>
    </div>
    </div>
  </div>
);

}

export default EmailHash;