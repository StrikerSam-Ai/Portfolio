import React from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveDemo?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Chatbot",
    description: "Developed an intelligent chatbot using transformer models and NLP techniques. Features include sentiment analysis, intent recognition, and multi-language support.",
    tech: ["Python", "TensorFlow", "NLP", "FastAPI", "React"],
    image: "🤖",
    liveDemo: "https://chatbot-demo.com",
    github: "https://github.com/shashwat/ai-chatbot"
  },
  {
    id: 2,
    title: "Computer Vision System",
    description: "Built a real-time object detection system using YOLO and OpenCV. Processes video streams and provides accurate object recognition with 95%+ accuracy.",
    tech: ["Python", "OpenCV", "YOLO", "Docker", "AWS"],
    image: "👁️",
    liveDemo: "https://vision-demo.com",
    github: "https://github.com/shashwat/computer-vision"
  },
  {
    id: 3,
    title: "ML Model Pipeline",
    description: "End-to-end machine learning pipeline with automated training, model versioning, and deployment. Includes monitoring and A/B testing capabilities.",
    tech: ["Python", "MLflow", "Kubernetes", "Prometheus", "Grafana"],
    image: "⚙️",
    github: "https://github.com/shashwat/ml-pipeline"
  },
  {
    id: 4,
    title: "Recommendation Engine",
    description: "Personalized recommendation system using collaborative filtering and content-based approaches. Handles millions of user interactions with sub-second response times.",
    tech: ["Python", "Scikit-learn", "Redis", "PostgreSQL", "Flask"],
    image: "🎯",
    liveDemo: "https://recommendations-demo.com",
    github: "https://github.com/shashwat/recommendation-engine"
  },
  {
    id: 5,
    title: "Sentiment Analysis API",
    description: "RESTful API for real-time sentiment analysis of text data. Supports multiple languages and provides confidence scores with detailed analysis.",
    tech: ["Python", "BERT", "FastAPI", "Docker", "Nginx"],
    image: "📊",
    liveDemo: "https://sentiment-api.com",
    github: "https://github.com/shashwat/sentiment-api"
  },
  {
    id: 6,
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for visualizing complex ML model performance metrics and business insights. Real-time updates with WebSocket connections.",
    tech: ["React", "D3.js", "Python", "WebSocket", "MongoDB"],
    image: "📈",
    liveDemo: "https://dashboard-demo.com",
    github: "https://github.com/shashwat/ml-dashboard"
  }
];

const PortfolioSection: React.FC = () => {
  return (
    <section className="portfolio-section" id="portfolio">
      <h2 className="portfolio-title">Featured Projects</h2>
      <div className="portfolio-grid">
        {projects.map((project) => (
          <div className="portfolio-card" key={project.id}>
            <div className="portfolio-thumb">
              <span className="project-emoji">{project.image}</span>
            </div>
            <h3 className="portfolio-project-title">{project.title}</h3>
            <p className="portfolio-description">{project.description}</p>
            <div className="portfolio-tech">
              {project.tech.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="portfolio-links">
              {project.liveDemo && (
                <a href={project.liveDemo} className="portfolio-link" target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} className="portfolio-link" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection; 