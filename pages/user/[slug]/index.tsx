import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Loader from "../../../app/components/elements/loader";
import {
  initD,
  template,
} from "../../../app/components/elements/dashboard/link/data";


const User = () => {

   const router = useRouter();

   let linkUser = router.query["slug"];

   const [Template, setTemplate] = useState<React.ComponentType<{}>>();
  
   useEffect(() => {
      const init = async () => {
           await initD(String(linkUser));

            setTemplate(template)
            
            if(template() === undefined){
                router.push("/404");
            }
      }

      if(router.isReady){
        init()
      }

   }, [linkUser, router.isReady, router]);



  return (
    <>
      {Template !== undefined ? (
        <Suspense fallback={<Loader />}>
          <Template />
        </Suspense>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default User;