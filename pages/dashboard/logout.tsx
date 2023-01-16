import { useEffect, useContext, useRef } from 'react';
import { useCryptea } from '../../app/contexts/Cryptea';
import { useRouter } from 'next/router'
import { DashContext, dash } from '../../app/contexts/GenContext';
import Loader from '../../app/components/elements/loader';

const Logout = () => {

    const { logout, authenticate, isAuthenticated } = useCryptea();

    const router = useRouter();

    const { logout: { update } }: dash = useContext(DashContext);

    const once = useRef<boolean>(true);

    useEffect(() => {

      if(isAuthenticated !== undefined){

        if(isAuthenticated){

        if(once.current){

            once.current = false;

          logout().then(() => {
             authenticate(false);

             update?.(true);

             router.push("/");
        });
    }
  }else{
    router.push('/')
  }
}

    }, []);

    return (<Loader/>)
}

export default Logout