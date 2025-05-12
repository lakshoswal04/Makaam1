import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}

export default Home