import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import Loader from '../app/components/elements/loader';
import AuthModal from '../app/components/elements/modal';
import { useCryptea } from '../app/contexts/Cryptea';
import Router from 'next/router';

const Home: NextPage = () => {

  const { isAuthenticated, logout } = useCryptea();

  const [loader, setLoader] = useState<boolean>(true);



  return (
    <div className="overflow-hidden">
      <Head>
        <title>Launch App | Cryptea</title>
        <meta
          name="description"
          content="Receive Payments Instantly With Ease"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className="h-screen w-screen flex bg-pattern2 items-center">
          <AuthModal blur={false} openM={true} message={"Welcome to Cryptea"} />
        </div>
    </div>
  );
}

export default Home
