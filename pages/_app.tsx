import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.MORALIS_APPLICATION_ID || ''}
      serverUrl={process.env.MORALIS_SERVER_ID || ''}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  )
}

export default MyApp
