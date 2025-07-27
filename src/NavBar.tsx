import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import logoSvg from './assets/logo.svg';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' }
];

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setOpen(false);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar${open ? ' open' : ''}`}>
      <div className="navbar-logo">
        <img src={logoSvg} alt="Shashwat Mishra" className="logo-image" />
      </div>
      <div className="navbar-spacer" />
      
      <button className="navbar-toggle" onClick={() => setOpen(!open)}>
        <span className="navbar-hamburger"></span>
      </button>
      
      <ul className="navbar-links">
        {navItems.map(({ id, label }) => {
          return (
            <li key={id}>
              <a 
                href={`#${id}`}
                onClick={e => handleNavClick(e, id)}
              >
                {label}
              </a>
            </li>
          )
        })}
        <li>
          <Link to="/writing-records" className="navbar-link-writing-records">
            Writing Records
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;