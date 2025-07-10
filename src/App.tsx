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
      </main>
      <AboutSection />
      <PortfolioSection />
    </div>
  )
}

export default App
