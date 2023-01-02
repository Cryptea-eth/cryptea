import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button, CircularProgress } from "@mui/material";
import Nav from "../../../../app/components/elements/Nav";
import { initD } from "../../../../app/components/elements/dashboard/link/data";
import Loader from "../../../../app/components/elements/loader";
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { get_request } from "../../../../app/contexts/Cryptea/requests";

const Unsubscribe = () => {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);

  const [mLoader, setMloader] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { id, link } = router.query;

  useEffect(() => {
    
    const init = async () => {

        const {
          link: lQ,
          renew
        } = await initD(String(link).toLowerCase(), undefined, id as string);

        if (lQ['id'] !== undefined && renew !== null) {
            setLoading(false);
        }else{
            router.push('/404');
        }
      }

    if (link !== undefined) {
        init();
    }

  }, [router.isReady, link, router]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="h-screen">
      <Head>
        <title>Unsubscribe from link reminder | Cryptea</title>
        <meta
          name="description"
          content="Cryptea - Receive Payments Instantly With Ease."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      {success ?
      (<div className="w-[400px] 4sm:w-[800px] 3md:w-[320px] items-center h-[calc(100vh-104px)] flex flex-col justify-center mx-auto text-center my-8">
        <h2 className="text-[#F57059] text-center font-bold 2sm:text-2xl text-4xl mx-auto">
          Successfully Unsubscribed 
        </h2>

        <div className="mt-3 mx-auto">
          <span className="text-[#7e7e7e] text-center font-semibold text-lg mx-auto mt-12">
            If you have any troubles, please contact us <a href="mailto:hello@cryptea.me" className="underline">here</a>
          </span>
        </div>

      </div>) :
      <div className="w-[400px] 4sm:w-[800px] 3md:w-[320px] items-center h-[calc(100vh-104px)] flex flex-col justify-center mx-auto text-center my-8">
        <h2 className="text-[#F57059] text-center font-[400] 2sm:text-2xl text-4xl mx-auto">
          Are you sure you want to unsubscribe??
        </h2>

        <div className="mt-3 mx-auto">
          <span className="text-[#7e7e7e] text-center font-semibold text-lg mx-auto mt-12">
            This unsubscribes you from receiving mails reminding you to renew
            your current subscription to{" "}
            <span
              onClick={() => router.push(`https://app.cryptea.me/pay/${link}`)}
              className="underline cursor-pointer"
            >
              {link}
            </span>{" "}
            link.
          </span>
        </div>

        <div className="mx-auto mt-8">
          <Button
            onClick={async () => {
              if (mLoader) return;

              setMloader(true);

              await get_request(`/unsubscribe/${id}`);

              setMloader(false);

              setSuccess(true);
            }}
            className="!ml-2 hover:!bg-[#ff320e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-3 !px-4 !mx-auto"
          >
            {mLoader ? (
              <>
                <div className="mr-3 h-[20px] text-[#fff]">
                  <CircularProgress
                    color={"inherit"}
                    className="!w-[20px] text-white !h-[20px]"
                  />
                </div>{" "}
                <span>Just a sec..</span>
              </>
            ) : (
              <>
                <FiThumbsDown size={22} className="mr-1" /> Yes
              </>
            )}
          </Button>

          <Button
            onClick={() => router.push("https://cryptea.me")}
            className="!ml-2 hover:!bg-[#ff320e] !transition-all !delay-500 !text-sm !capitalize !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-3 !px-4 !mx-auto"
          >
            <FiThumbsUp size={22} className="mr-1" /> No
          </Button>
        </div>
      </div>}
    </div>
  );
};

export default Unsubscribe;
