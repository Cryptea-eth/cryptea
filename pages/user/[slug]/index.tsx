import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Loader from "../../../app/components/elements/loader";
import {
  initD,
  template,
} from "../../../app/components/elements/dashboard/link/data";
import { PaymentProvider } from '../../../app/contexts/PaymentContext';
import { time } from '../../../app/contexts/Cryptea/DB';

const User = () => {

   const router = useRouter();

   let linkUser = router.query["slug"];

   const [Template, setTemplate] = useState<React.ComponentType<{}>>();

   useEffect(() => {
      const init = async () => {
        const {
          link: { id: linkId },
        } = await initD(String(linkUser)) || { link: { id: undefined } };

        const mainT:number = await time();
        const cache = localStorage.getItem('blockexpiry');

        if((cache === null || mainT > Number(cache))){
          
          if(linkId !== undefined){

         await(`views/${linkId}`).save({});

         localStorage.setItem('blockexpiry', String(mainT + 600000));

          }

        }
        
        setTemplate(template);

        if (template() === undefined) {
          router.push("/404");
        }
      }

      if(router.isReady){
        init()
      }

   }, [linkUser, router.isReady, router]);


  return (
    <PaymentProvider editMode={false}>
      {Template !== undefined ? (
        <Suspense fallback={<Loader />}>
          <Template />
        </Suspense>
      ) : (
        <Loader />
      )}
    </PaymentProvider>
  );
}

export default User;