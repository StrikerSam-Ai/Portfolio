import './App.css'
import NavBar from './NavBar'
import AboutSection from './AboutSection'
import PortfolioSection from './PortfolioSection'
import ServicesSection from './ServicesSection'
import ContactSection from './ContactSection'
import ScrollToTopButton from './ScrollToTopButton'
import Footer from './Footer'
import { useState, useEffect } from 'react'
import WritingRecords from './WritingRecords';
import { Routes, Route } from 'react-router-dom';
import logoSvg from './assets/logo.svg';
import portraitPng from './assets/portrait.png';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <img src={logoSvg} alt="Shashwat Mishra" className="loading-logo-image" />
          </div>
          <div className="loading-text">Shashwat Mishra</div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="main-content">
            <div className="particles-background">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="particle" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}></div>
              ))}
            </div>
            <NavBar />
            <section className="hero-section hero-flex" id="hero">
              <div className="hero-portrait-wrapper">
                <img src={portraitPng} alt="Shashwat Mishra Portrait" className="hero-portrait-gradient" />
              </div>
              <div className="hero-content">
                <h1 className="hero-name">Shashwat Mishra</h1>
                <h2 className="hero-title">Aspiring AI Engineer </h2>
                <p className="hero-tagline">Eager learner passionate about deep learning, defence tech, and AI innovation. Growing through impactful research, creative projects, and collaborations.</p>
                <button className="btn-grad" onClick={scrollToContact}>Let's Build Something Amazing</button>
                <p className="hero-description">
                  Passionate about developing AI-powered applications, building scalable ML systems, 
                  and creating innovative solutions to real life problems. Dedicated to deepening my expertise in the domain of MLOps, Computer Vision, NLP and applying my knowledge to impactful, collaborative projects.
                </p>
              </div>
            </section>
            <AboutSection />
            <PortfolioSection />
            <ServicesSection />
            <ContactSection />
            <ScrollToTopButton />
            <Footer />
          </div>
        }
      />
      <Route path="/writing-records" element={<WritingRecords />} />
    </Routes>
  )
}

export default App
