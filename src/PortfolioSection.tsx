import React from 'react';
import logoSvg from './assets/logo.svg';
import elderHubLogo from './assets/elderhub-logo.png';
import tactikLogo from './assets/tactik-logo.png';

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
    title: "Personal Portfolio & Progress Tracker",
    description: "Dynamic portfolio website with integrated progress tracking system, activity heatmap visualization, and comprehensive analytics dashboard. Features real-time content management and interactive data visualization.",
    tech: ["React", "TypeScript", "Chart.js", "Vite", "CSS3"],
    image: logoSvg,
    github: "https://github.com/StrikerSam-Ai/Portfolio"
  },
  {
    id: 2,
    title: "ElderHub - Senior Care Platform",
    description: "Comprehensive healthcare platform designed for elderly care management. Features appointment scheduling, health monitoring, medication reminders, and family connectivity tools to enhance senior living experience.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Healthcare APIs","Groq AI"],
    image: elderHubLogo,
    github: "https://github.com/StrikerSam-Ai/Team-Elevate-HH2025"
  },
  {
    id: 3,
    title: "TacTik",
    description: "Smart CLI-based study planner that prioritizes subjects with spaced repetition, dual input modes, scientific scoring, and animated colored output.",
    tech: ["TypeScript", "Node.js", "CLI", "Spaced Repetition", "Cross-Platform"],
    image: tactikLogo,
    github: "https://github.com/StrikerSam-Ai/TacTik"
  },
];

const PortfolioSection: React.FC = () => {
  return (
    <section className="portfolio-section" id="portfolio">
      <h2 className="portfolio-title">Featured Projects</h2>
      <div className="portfolio-grid">
        {projects.map((project) => (
          <div className="portfolio-card" key={project.id}>
            <div className="portfolio-thumb">
              {project.image.endsWith('.svg') || project.image.startsWith('/') || project.image.startsWith('http') ? (
                <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span className="project-emoji">{project.image}</span>
              )}
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