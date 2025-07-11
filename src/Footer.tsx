import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} Shashwat Mishra</span>
        <div className="footer-socials">
          <a href="#" className="footer-link" rel="noopener noreferrer" target="_blank">LinkedIn</a>
          <a href="#" className="footer-link" rel="noopener noreferrer" target="_blank">GitHub</a>
          <a href="#" className="footer-link" rel="noopener noreferrer" target="_blank">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 