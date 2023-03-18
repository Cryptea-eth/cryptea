import { useEffect, useState } from "react";


const Xx = () => {

 useEffect(() => {

    console.log(process.env.JSON)  

 }, []);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;