import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="about-section" id="about">
      <h2 className="about-title">About Me</h2>
      <div className="about-content">
        <div className="about-bio">
          <p>[Your professional biography goes here. Briefly introduce yourself, your background, and your passion for AI engineering.]</p>
        </div>
        <div className="about-skills">
          <h3>Skills Overview</h3>
          {/* Placeholder for spider/radar chart */}
          <div className="skills-spider-chart">[Spider Chart Placeholder]</div>
        </div>
        <div className="about-timeline">
          <h3>Work Experience</h3>
          <ul>
            <li>[Experience timeline placeholder]</li>
          </ul>
        </div>
        <div className="about-education">
          <h3>Education</h3>
          <ul>
            <li>[Education background placeholder]</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 