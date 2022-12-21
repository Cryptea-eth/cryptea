
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
            
            if (!Boolean(e.email_verified_at) && Boolean(e.email)) {

            get_request(`/verify/mail/${hash}`, {}, undefined, false)
              .then((e) => {
                Router.push('/dashboard');

              })
              .catch((err) => {
                console.log(err);

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
      <title>Verification link invalid | Cryptea</title>
      <meta
        name="description"
        content="Cryptea - Receive Payments Instantly With Ease."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div className="w-full h-fit flex flex-col justify-items-center px-5 my-8">
      <Image src={emailImg} width={200} height={222} alt={"Email error"} />

      <h2 className="text-[#F57059] font-[400] 2md:text-2xl text-4xl mx-auto mt-24">
        Verification Failed, please try again
      </h2>

      <span className="text-[#7e7e7e] block font-semibold text-lg mx-auto mt-12">
        Something went wrong, try resending the link or checking your internet
        access, if all doesnt work, contact us.
      </span>
    </div>
  </div>
);

}

export default EmailHash;