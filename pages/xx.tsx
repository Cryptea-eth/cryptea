import { useEffect } from "react";
import { get_request } from "../app/contexts/Cryptea/requests";

const XX = () => {

    useEffect(() => {
  
         get_request('/time', { params: {
            'timezone': 'Africa/Lagos'
         }}).then(e => {
            console.log(e);
         });
    }, [])

    return <></>

}

export default XX;