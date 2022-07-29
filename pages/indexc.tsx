import type { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../app/components/elements/Nav'
import HeroWaitlist from '../app/components/elements/Hero/HeroWaitlist'
import AboutWaitlist from '../app/components/elements/About/indexWaitlist'
import Extras from '../app/components/elements/Extras'
import Footer from '../app/components/elements/Footer'
import { HomeProvider } from '../app/contexts/HomeContext'

const Home: NextPage = () => {
  return (
    <HomeProvider>
      <div>
        <Head>
          <title>Cryptea</title>
          <meta
            name="description"
            content="Receive tips/donations on another level"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className="app">
            <Nav />
            <HeroWaitlist />
            <AboutWaitlist />
            <Extras />
          </div>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </HomeProvider>
  );
}

export default Home
