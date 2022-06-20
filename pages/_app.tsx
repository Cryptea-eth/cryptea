import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ''}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER || ''}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  )
}

export default MyApp
