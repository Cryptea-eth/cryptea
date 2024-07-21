import type { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../app/components/elements/Nav'
import HeroWaitlist from '../app/components/elements/Hero/HeroWaitlist'
import AboutWaitlist from '../app/components/elements/About/indexWaitlist'
import Extras from '../app/components/elements/Extras'
import Footer from '../app/components/elements/Footer'

const Home: NextPage = () => {
  return (
      <div>
        <Head>
          <title>Breew</title>
          <meta
            name="description"
            content="Receive Payments Instantly With Ease"
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
  );
}

export default Home
