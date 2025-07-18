import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter, faMedium } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Shashwat Mishra. All rights reserved.</span>
        <div className="footer-socials">
          <a href="https://linkedin.com/in/shashwat-mishra" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/shashwat-mishra" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://twitter.com/shashwat_ml" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a href="https://medium.com/@shashwat-mishra" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faMedium} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 