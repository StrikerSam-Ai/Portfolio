import React from 'react';

const PortfolioSection: React.FC = () => {
  return (
    <section className="portfolio-section" id="portfolio">
      <h2 className="portfolio-title">My Work</h2>
      <div className="portfolio-grid">
        {/* Example project card placeholder */}
        {[1, 2, 3].map((i) => (
          <div className="portfolio-card" key={i}>
            {/* Replace with: <img src="..." alt="Project thumbnail" className="portfolio-thumb" /> */}
            <div className="portfolio-thumb">[Thumbnail]</div>
            <h3 className="portfolio-project-title">Project Title {i}</h3>
            <p className="portfolio-description">[Short project description goes here]</p>
            <div className="portfolio-tech">[Tech stack]</div>
            <div className="portfolio-links">
              <a href="#" className="portfolio-link">Live Demo</a>
              <a href="#" className="portfolio-link">GitHub</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection; 