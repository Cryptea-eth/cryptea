import Page from "../../../app/components/elements/dashboard";
import Head from 'next/head';

const Wallets = () => {

    return (
      <Page>
        <Head>
          <title>Wallets by Cryptea</title>
          <meta
            name="description"
            content={`You go to wallet management service`}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="pt-[75px] px-5 relative z-[1]">
          <h2 className="font-bold text-[25px] mt-[14px] mb-3">Wallets</h2>

                   
        </div>
      </Page>
    );

}

export default Wallets