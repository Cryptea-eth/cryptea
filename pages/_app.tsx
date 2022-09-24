import '../styles/globals.css'
import '../styles/Home.css';
import '../styles/Dash.css';
import '../styles/Auth.css';
import '../styles/Sett.css';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { MoralisProvider } from 'react-moralis'
import { GenProvider } from '../app/contexts/GenContext';
import { HomeProvider } from '../app/contexts/HomeContext';
import '../app/contexts/Cryptea/types.d.ts';
import { AuthGlob, CrypteaProvider } from "../app/contexts/Cryptea/Auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ""}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER || ""}
    >
      <CrypteaProvider>
        <GenProvider>
          <HomeProvider>
            <AuthGlob>
          <Component {...pageProps} />
          </AuthGlob>
          </HomeProvider>
        </GenProvider>
      </CrypteaProvider>
    </MoralisProvider>
  );
}

export default MyApp
