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


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ""}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER || ""}
    >
      <GenProvider>
        <Component {...pageProps} />
      </GenProvider>
    </MoralisProvider>
  );
}

export default MyApp
