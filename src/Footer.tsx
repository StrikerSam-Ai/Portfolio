import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Shashwat Mishra. All rights reserved.</span>
        <div className="footer-socials">
          <a href="https://linkedin.com/in/shashwat-mishra" className="footer-link" rel="noopener noreferrer" target="_blank">
            LinkedIn
          </a>
          <a href="https://github.com/shashwat-mishra" className="footer-link" rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
          <a href="https://twitter.com/shashwat_ml" className="footer-link" rel="noopener noreferrer" target="_blank">
            Twitter
          </a>
          <a href="https://medium.com/@shashwat-mishra" className="footer-link" rel="noopener noreferrer" target="_blank">
            Medium
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 