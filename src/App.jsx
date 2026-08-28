import Navbar from './components/layout/Navbar'
import HeroSection from './components/hero/HeroSection'
import AboutSection from './components/about/AboutSection'
import ServicesSection from './components/services/ServicesSection'
import GallerySection from './components/gallery/GallerySection'
import Footer from './components/layout/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <Footer />
    </div>
  )
}

export default App