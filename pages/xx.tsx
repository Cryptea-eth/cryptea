import { useEffect } from "react";
import { get_request } from "../app/contexts/Cryptea/requests";


const Xx = () => {

  useEffect(() => {
    
    get_request("/time").then((e) => {
      console.log(e);
    });

  }, [])

  return (<>
  
  </>)
}

export default Xx;