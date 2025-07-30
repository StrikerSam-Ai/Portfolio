import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const ServicesSection: React.FC = () => {
  return (
    <section className="services-section" id="services">
      <h2 className="services-title">My Skillset</h2>
      <div className="services-content">
        <div className="services-list services-card">
          <h3><FontAwesomeIcon icon={faRocket} style={{ marginRight: '0.5rem' }} /> Web Development</h3>
          <ul>
            <li>Building interactive UIs with React & TypeScript</li>
            <li>Creating responsive and modern web applications</li>
            <li>Integrating with APIs and handling frontend data</li>
            <li>Utilizing modern tools like Vite for efficient development</li>
            <li>Focusing on clean, component-based architecture</li>
          </ul>
        </div>
        <div className="services-expertise services-card">
          <h3>📊 Data Analytics & Visualization</h3>
          <ul>
            <li>Developing dashboards to display complex data (Chart.js)</li>
            <li>Performing exploratory data analysis and visualization</li>
            <li>Automating data processing tasks with scripts (Node.js)</li>
            <li>Parsing and processing data from various sources (Markdown)</li>
            <li>Focusing on clear and insightful data representation</li>
          </ul>
        </div>
        <div className="services-process services-card">
          <h3>🤖 Machine Learning (Learning & Aspiring)</h3>
          <ul>
            <li>Understanding core ML concepts and algorithms</li>
            <li>Exploring Natural Language Processing (NLP) concepts</li>
            <li>Hands-on experience with data preprocessing and feature engineering</li>
            <li>Building and evaluating simple predictive models</li>
            <li>Eager to apply theoretical knowledge to real-world projects</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;