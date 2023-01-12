import "../styles/globals.css";
import "../styles/Home.css";
import "../styles/Dash.css";
import "../styles/Auth.css";
import "../styles/Sett.css";

import type { AppProps } from "next/app";
import React from "react";
import { GenProvider } from "../app/contexts/GenContext";
import { HomeProvider } from "../app/contexts/HomeContext";
import "../app/contexts/Cryptea/types.d.ts";
import { CrypteaProvider } from "../app/contexts/Cryptea/Auth";
import { crypteaCon, stylesCon } from "../app/contexts/Cryptea/icon";
import analytics from "../analytics";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  const once = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (once.current) {
      once.current = false;

      console.log(`${crypteaCon} \n\n   %c Pay with Cryptea😊`, stylesCon);
    }
  }, []);

  analytics.page()

  analytics.track('onClick')

  // analytics.identify()

  return (
    <>
      <CrypteaProvider>
        <GenProvider>
          <HomeProvider>
            <Component {...pageProps} />
          </HomeProvider>
        </GenProvider>
      </CrypteaProvider>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
`,
        }}
      />
    </>
  );
}

export default MyApp;
