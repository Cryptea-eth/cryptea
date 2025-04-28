import "../styles/globals.css";
import "../styles/Home.css";
import "../styles/Dash.css";
import "../styles/Auth.css";
import "../styles/Sett.css";
import "@rainbow-me/rainbowkit/styles.css";

import type { AppProps } from "next/app";
import React from "react";
import { GenProvider } from "../app/contexts/GenContext";
import { HomeProvider } from "../app/contexts/HomeContext";
import "../app/contexts/Cryptea/types.d.ts";
import { CrypteaProvider } from "../app/contexts/Cryptea/Auth";
import { stylesCon } from '../app/contexts/Cryptea/icon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import analytics from "../analytics";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  
  const once = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (once.current) {
      once.current = false;

      console.log(`%c Pay with Breew😊`, stylesCon);
    }
  }, []);

  analytics.page()

  analytics.track('onClick')

  // analytics.identify()

  return (
    <QueryClientProvider client={queryClient}>
      <CrypteaProvider>
        <GenProvider>
          <HomeProvider>
            <Component {...pageProps} />
          </HomeProvider>
        </GenProvider>
      </CrypteaProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
