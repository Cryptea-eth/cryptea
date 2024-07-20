import AuthModal from "../../app/components/elements/modal";
import { useEffect, useState } from "react";
import { useCryptea } from "../../app/contexts/Cryptea";
import Router from 'next/router';
import Loader from "../../app/components/elements/loader";

const Auth = () => {

    const { isAuthenticated, logout } = useCryptea();

    const [ loader, setLoader ] = useState<boolean>(true);

    useEffect(() => {

        if (isAuthenticated !== undefined) {
            if (isAuthenticated) {
                Router.back()
            }else{ 
                setLoader(false);
            }
        }

    }, [isAuthenticated]);

    return (loader ? <Loader /> : <div className="h-screen w-screen flex bg-pattern2 items-center">
        <AuthModal blur={false} openM={true} message={"Welcome to Breew"}/>    
    </div>)
}

export default Auth;