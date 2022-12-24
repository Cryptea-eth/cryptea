import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

const Xx = () => {

 const router = useRouter();


 useEffect(() => {

 }, [router.isReady, router]);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;