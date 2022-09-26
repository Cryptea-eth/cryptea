import '../styles/globals.css'
import '../styles/Home.css';
import '../styles/Dash.css';
import '../styles/Auth.css';
import '../styles/Sett.css';
import type { AppProps } from 'next/app'
import React from 'react'
import { GenProvider } from '../app/contexts/GenContext';
import { HomeProvider } from '../app/contexts/HomeContext';
import '../app/contexts/Cryptea/types.d.ts';
import { AuthGlob, CrypteaProvider } from "../app/contexts/Cryptea/Auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <CrypteaProvider>
        <GenProvider>
          <HomeProvider>
            <AuthGlob>
          <Component {...pageProps} />
          </AuthGlob>
          </HomeProvider>
        </GenProvider>
      </CrypteaProvider>
  );
}

export default MyApp
