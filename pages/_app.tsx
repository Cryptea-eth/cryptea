import '../styles/globals.css';
import '../styles/Home.css';
import '../styles/Dash.css';
import '../styles/Auth.css';
import '../styles/Sett.css';

import type { AppProps } from 'next/app'
import React from 'react'
import { GenProvider } from '../app/contexts/GenContext';
import { HomeProvider } from '../app/contexts/HomeContext';
import '../app/contexts/Cryptea/types.d.ts';
import { CrypteaProvider } from "../app/contexts/Cryptea/Auth";
import { crypteaCon, stylesCon } from '../app/contexts/Cryptea/icon';

function MyApp({ Component, pageProps }: AppProps) {

  const once = React.useRef<boolean>(true)

  React.useEffect(() => {

    if(once.current){

      once.current = false;

      console.log(`${crypteaCon} \n\n   %c Pay with Cryptea😊`, stylesCon);

    }

  }, [])

  return (
      <CrypteaProvider>
        <GenProvider>
          <HomeProvider>
            <Component {...pageProps} />
          </HomeProvider>
        </GenProvider>
      </CrypteaProvider>
  );
}

export default MyApp;
