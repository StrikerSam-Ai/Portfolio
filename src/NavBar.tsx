import React, { useState, useEffect } from 'react';

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setOpen(false);
    setActiveSection(id);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('light-theme');
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'portfolio', 'services', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar${open ? ' open' : ''}`}> 
      <div className="navbar-logo">Shashwat</div>
      <div className="navbar-spacer" />
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {isDarkTheme ? '🌙' : '☀️'}
      </button>
      <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <span className="navbar-hamburger"></span>
      </button>
      <ul className="navbar-links">
        <li>
          <a 
            href="#hero" 
            onClick={e => handleNavClick(e, 'hero')}
            className={activeSection === 'hero' ? 'active' : ''}
          >
            Home
          </a>
        </li>
        <li>
          <a 
            href="#about" 
            onClick={e => handleNavClick(e, 'about')}
            className={activeSection === 'about' ? 'active' : ''}
          >
            About
          </a>
        </li>
        <li>
          <a 
            href="#portfolio" 
            onClick={e => handleNavClick(e, 'portfolio')}
            className={activeSection === 'portfolio' ? 'active' : ''}
          >
            Portfolio
          </a>
        </li>
        <li>
          <a 
            href="#services" 
            onClick={e => handleNavClick(e, 'services')}
            className={activeSection === 'services' ? 'active' : ''}
          >
            Services
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            onClick={e => handleNavClick(e, 'contact')}
            className={activeSection === 'contact' ? 'active' : ''}
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar; 