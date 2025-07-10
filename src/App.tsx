import './App.css'
import AboutSection from './AboutSection'
import PortfolioSection from './PortfolioSection'

function App() {
  return (
    <div className="main-content">
      <main className="hero-section">
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
        {/* SVG Wave Transition */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C480,160 960,0 1440,80 L1440,120 L0,120 Z" fill="#fff" />
          </svg>
        </div>
      </main>
      <AboutSection />
      <PortfolioSection />
    </div>
  )
}

export default App
