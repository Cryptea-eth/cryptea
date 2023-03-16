import { useEffect, useState } from "react";


const Xx = () => {

 useEffect(() => {

    console.log('Welcome')  

 }, []);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;