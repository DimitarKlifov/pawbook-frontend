import Navbar from './components/layout/Navbar'
import HeroSection from './components/hero/HeroSection'
import AboutSection from './components/about/AboutSection'
import GallerySection from './components/gallery/GallerySection'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
    </div>
  )
}

export default App