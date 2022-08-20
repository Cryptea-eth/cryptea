import LinkOverview from "../../../app/components/elements/dashboard/link/overview";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import Router from "next/router";
import Loader from "../../../app/components/elements/loader";


const Overview = () => {

    const { isAuthenticated, isInitialized } = useMoralis();

    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      if (isInitialized) {
        if (!isAuthenticated) {
          Router.push("/");
        }else{
            setLoading(false);
        }
      }
    }, [isAuthenticated, isInitialized]);
    
        return (
            <>
            {isLoading ? <Loader /> : <LinkOverview />}
            </>
        )
}

export default Overview;