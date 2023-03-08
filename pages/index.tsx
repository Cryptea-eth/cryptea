import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import Loader from '../app/components/elements/loader';
import AuthModal from "../app/components/elements/modal";
import { useCryptea } from '../app/contexts/Cryptea';
import Router, { useRouter } from 'next/router';

const Home: NextPage = () => {

  const { isAuthenticated } = useCryptea();

  const [isLoading, setLoading] = useState(true);


  useEffect(() => {

    if (isAuthenticated !== undefined) {
      if (isAuthenticated && localStorage.getItem("userToken") !== null) {
        Router.push("/dashboard");
      } else {

        if (localStorage.getItem('defaultAuth') !== null) {

          if (localStorage.getItem("defaultAuth") == 'magicauth') {
            
              Router.push('/magic')
            
          }else{
            setLoading(false);
          }
          
        }else{
          setLoading(false);
        }
      }
  }

  }, [isAuthenticated])

  return (
    isLoading ? <Loader /> : <div className="overflow-hidden">
      <Head>
        <title>Launch App | Cryptea</title>
        <meta
          name="description"
          content="Receive Payments Instantly With Ease"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

          <AuthModal blur={false} openM={true} message={"Welcome to Cryptea"} />
       
      </div>

  );
}

export default Home
