import './App.css'
import NavBar from './NavBar'
import AboutSection from './AboutSection'
import PortfolioSection from './PortfolioSection'
import ServicesSection from './ServicesSection'
import ContactSection from './ContactSection'
import ScrollToTopButton from './ScrollToTopButton'
import Footer from './Footer'

function App() {
  return (
    <div className="main-content">
      <NavBar />
      <main className="hero-section" id="hero">
        {/* Placeholder for your professional photo or avatar */}
        <div className="hero-photo">[Your Photo]</div>
        <h1 className="hero-name">Shashwat Mishra</h1>
        <h2 className="hero-title">AI Engineer</h2>
        {/* Placeholder for tagline/value proposition */}
        <p className="hero-tagline">[Your compelling tagline goes here]</p>
        {/* Call-to-action button */}
        <button className="hero-cta">Contact Me</button>
        {/* Brief description */}
        <p className="hero-description">[Brief description of what you do]</p>
      </main>
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <ContactSection />
      <ScrollToTopButton />
      <Footer />
    </div>
  )
}

export default App
