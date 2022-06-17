import Nav from "../../components/Nav";
import Hero from "../../components/Hero";
import About from "../../components/about";
import Extras from "../../components/about/extras";
import Footer from "../../components/Nav/footer";


const Home = () => {
  
  return (
    <div className="app">
      <Nav />
      <Hero />
      <About />
      <Extras />
      <Footer />
    </div>
  )
}

export default Home;