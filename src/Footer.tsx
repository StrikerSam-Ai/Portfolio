import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter, faMedium } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Shashwat Mishra. All rights reserved.</span>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/sam140706/" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/StrikerSam-Ai" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://x.com/SHASHWATMI67916" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a href="https://medium.com/@shashwatmishra0369" className="footer-link" rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faMedium} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 