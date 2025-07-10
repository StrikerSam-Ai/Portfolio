import React from 'react';

const ServicesSection: React.FC = () => {
  return (
    <section className="services-section" id="services">
      <h2 className="services-title">Services</h2>
      <div className="services-content">
        <div className="services-list services-card">
          <h3>What I Offer</h3>
          <ul>
            <li>[Service 1 placeholder]</li>
            <li>[Service 2 placeholder]</li>
            <li>[Service 3 placeholder]</li>
          </ul>
        </div>
        <div className="services-expertise services-card">
          <h3>Areas of Expertise</h3>
          <ul>
            <li>[Expertise 1 placeholder]</li>
            <li>[Expertise 2 placeholder]</li>
            <li>[Expertise 3 placeholder]</li>
          </ul>
        </div>
        <div className="services-process services-card">
          <h3>My Process</h3>
          <p>[Describe your process or methodology here]</p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 