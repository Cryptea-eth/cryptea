import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { get_request } from "../app/contexts/Cryptea/requests";

const Xx = () => {

 const router = useRouter();

 useEffect(() => {

  get_request(
    "/notifications",
    {
      params: {
        page: 4,
      },
    },
    undefined,
    false
  ).then((e: any) => {
    // console.log(Object.values(e.data.data));
  });

 }, [router.isReady, router]);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;