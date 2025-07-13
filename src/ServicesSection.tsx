import React from 'react';

const ServicesSection: React.FC = () => {
  return (
    <section className="services-section" id="services">
      <h2 className="services-title">Services & Expertise</h2>
      <div className="services-content">
        <div className="services-list services-card">
          <h3>🤖 AI Development</h3>
          <ul>
            <li>Custom AI model development and training</li>
            <li>Natural Language Processing (NLP) solutions</li>
            <li>Computer Vision and image recognition systems</li>
            <li>Recommendation engines and personalization</li>
            <li>Chatbot and conversational AI development</li>
            <li>Predictive analytics and forecasting models</li>
          </ul>
        </div>
        <div className="services-expertise services-card">
          <h3>⚙️ MLOps & Infrastructure</h3>
          <ul>
            <li>End-to-end ML pipeline development</li>
            <li>Model deployment and containerization</li>
            <li>Automated training and retraining systems</li>
            <li>Model monitoring and performance tracking</li>
            <li>Scalable ML infrastructure on cloud platforms</li>
            <li>CI/CD for machine learning workflows</li>
          </ul>
        </div>
        <div className="services-process services-card">
          <h3>📊 Data Science & Analytics</h3>
          <ul>
            <li>Data preprocessing and feature engineering</li>
            <li>Exploratory data analysis and visualization</li>
            <li>Statistical modeling and hypothesis testing</li>
            <li>Big data processing and optimization</li>
            <li>Real-time data streaming and processing</li>
            <li>Business intelligence and reporting solutions</li>
          </ul>
        </div>
        <div className="services-consulting services-card">
          <h3>💡 AI Strategy & Consulting</h3>
          <ul>
            <li>AI feasibility assessment and roadmap planning</li>
            <li>Technology stack recommendations</li>
            <li>Team training and knowledge transfer</li>
            <li>Performance optimization and cost reduction</li>
            <li>Ethical AI implementation guidance</li>
            <li>Compliance and security best practices</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 