import React, { useState } from 'react';

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar${open ? ' open' : ''}`}> 
      <div className="navbar-logo">Shashwat</div>
      <div className="navbar-spacer" />
      <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <span className="navbar-hamburger"></span>
      </button>
      <ul className="navbar-links">
        <li><a href="#hero" onClick={e => handleNavClick(e, 'hero')}>Home</a></li>
        <li><a href="#about" onClick={e => handleNavClick(e, 'about')}>About</a></li>
        <li><a href="#portfolio" onClick={e => handleNavClick(e, 'portfolio')}>Portfolio</a></li>
        <li><a href="#services" onClick={e => handleNavClick(e, 'services')}>Services</a></li>
        <li><a href="#contact" onClick={e => handleNavClick(e, 'contact')}>Contact</a></li>
      </ul>
    </nav>
  );
};

export default NavBar; 