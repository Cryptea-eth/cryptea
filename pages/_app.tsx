import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { MoralisProvider } from 'react-moralis'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId='HOLbs0aJ1TAL3lSC9HT35iUimn2EAOoJyGyikYBk'
      serverUrl='https://rsa1f2e38vjg.usemoralis.com:2053/server'
    >
      <Component {...pageProps} />
    </MoralisProvider>
  )
}

export default MyApp
