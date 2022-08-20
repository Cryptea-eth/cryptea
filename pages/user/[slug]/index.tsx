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
           const temp = await initD(String(linkUser));

            setTemplate(template)

      }

      if(router.isReady){
        init()
      }

   }, [linkUser, router.isReady]);


  //  useEffect(() => {
  //    const init = async () => {
  //      const PQ = Moralis.Object.extend("link");

  //      const QP = new Moralis.Query(PQ);

  //      QP.equalTo("link", String(linkUser).toLowerCase());

  //      const linkDt = await QP.first();

  //      if (linkDt?.get("template_data") !== undefined) {
  //        const { name } = JSON.parse(linkDt?.get("template_data"));

        
  //      }
  //    };

  //    if (isInitialized && router.isReady) {
  //      init();
  //    }
  //  }, [
  //    isAuthenticated,
  //    isInitialized,
  //    Moralis.Object,
  //    Moralis.Query,
  //    linkUser,
  //    router.isReady,
  //  ]);




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