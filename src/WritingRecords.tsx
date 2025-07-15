import React, { useState } from 'react';
import './WritingRecords.css';

interface BlogPost {
  title: string;
  date: string;
  description?: string;
  url?: string;
}

interface ProgressReport {
  title: string;
  date: string;
  description?: string;
  url?: string;
}

interface Publication {
  title: string;
  date: string;
  description?: string;
  url?: string;
}

const WritingRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'progress-reports' | 'about'>('progress-reports');

  const progressReports: ProgressReport[] = [
    {
      title: "Progress Report: Day 196-197",
      date: "Sep 23, 2024",
      description: "Latest developments in AI model optimization and deployment strategies.",
      url: "#"
    },
    {
      title: "Progress Report: Day 194-195", 
      date: "Sep 21, 2024",
      description: "Breakthrough in neural network architecture design and performance improvements.",
      url: "#"
    },
    {
      title: "Progress Report: Day 173-193",
      date: "Sep 19, 2024", 
      description: "Extended research period focusing on MLOps implementation and scalability.",
      url: "#"
    },
    {
      title: "Progress Report: Day 198-199",
      date: "Sep 19, 2024",
      description: "Integration of advanced monitoring systems and performance analytics.",
      url: "#"
    },
    {
      title: "Progress Report: Day 162-172",
      date: "Aug 28, 2024",
      description: "Deep dive into computer vision applications and real-time processing.",
      url: "#"
    },
    {
      title: "Progress Report: Day 146-161",
      date: "Aug 17, 2024",
      description: "Collaborative research initiatives and open-source contributions.",
      url: "#"
    },
    {
      title: "Progress Report: Day 140-145",
      date: "Aug 15, 2024",
      description: "Focus on natural language processing and transformer architectures.",
      url: "#"
    },
    {
      title: "Progress Report: Day 53-54",
      date: "May 1, 2024",
      description: "Early stage research into AI ethics and responsible development.",
      url: "#"
    },
    {
      title: "Progress Report: Day 51-52",
      date: "Apr 29, 2024",
      description: "Foundation work in machine learning pipeline optimization.",
      url: "#"
    },
    {
      title: "Progress Report: Day 49-50", 
      date: "Apr 26, 2024",
      description: "Experimental approaches to data augmentation and model training.",
      url: "#"
    },
    {
      title: "Progress Report: Day 47-48",
      date: "Apr 24, 2024",
      description: "Investigation into transfer learning and domain adaptation techniques.",
      url: "#"
    },
    {
      title: "Progress Report: Day 45-46",
      date: "Apr 21, 2024", 
      description: "Development of automated testing frameworks for ML models.",
      url: "#"
    },
    {
      title: "Progress Report: Day 43-44",
      date: "Apr 19, 2024",
      description: "Research into distributed computing for large-scale AI training.",
      url: "#"
    },
    {
      title: "Progress Report: Day 42",
      date: "Apr 17, 2024",
      description: "Initial exploration of reinforcement learning applications.",
      url: "#"
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      title: "Building Scalable ML Pipelines with Kubernetes",
      date: "Dec 15, 2024",
      description: "A comprehensive guide to deploying and managing machine learning pipelines at scale using Kubernetes orchestration.",
      url: "#"
    },
    {
      title: "The Future of MLOps: Best Practices for 2024",
      date: "Nov 28, 2024", 
      description: "Exploring emerging trends and methodologies in MLOps that are shaping the future of AI deployment.",
      url: "#"
    },
    {
      title: "Optimizing Transformer Models for Production",
      date: "Oct 10, 2024",
      description: "Techniques and strategies for deploying large language models efficiently in production environments.",
      url: "#"
    },
    {
      title: "Understanding Neural Network Architectures",
      date: "Sep 05, 2024",
      description: "Deep dive into modern neural network designs and their applications in real-world scenarios.",
      url: "#"
    }
  ];

  const publications: Publication[] = [
    {
      title: "Efficient Attention Mechanisms for Large Language Models",
      date: "ICML 2024",
      description: "Co-authored research paper on optimizing attention mechanisms for improved computational efficiency.",
      url: "#"
    },
    {
      title: "Multi-Modal Learning for Computer Vision Applications", 
      date: "CVPR 2023",
      description: "Research on integrating multiple data modalities for enhanced computer vision performance.",
      url: "#"
    },
    {
      title: "Scalable MLOps: A Comprehensive Framework",
      date: "IEEE Transactions on AI",
      description: "Comprehensive framework for implementing MLOps practices at enterprise scale.",
      url: "#"
    }
  ];

  const renderProgressReports = () => (
    <div className="writing-content">
      <div className="writing-header">
        <h1>Progress Reports 📊</h1>
        <p>For latest updates, follow me on <a href="#" className="social-link">X</a></p>
      </div>
      <div className="reports-grid">
        <div className="reports-column">
          {progressReports.slice(0, Math.ceil(progressReports.length / 2)).map((report, index) => (
            <div key={index} className="report-item">
              <h3 className="report-title">
                <a href={report.url}>{report.title}</a>
              </h3>
              <p className="report-date">{report.date}</p>
              {report.description && <p className="report-description">{report.description}</p>}
            </div>
          ))}
        </div>
        <div className="reports-column">
          {progressReports.slice(Math.ceil(progressReports.length / 2)).map((report, index) => (
            <div key={index} className="report-item">
              <h3 className="report-title">
                <a href={report.url}>{report.title}</a>
              </h3>
              <p className="report-date">{report.date}</p>
              {report.description && <p className="report-description">{report.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="writing-content">
      <div className="writing-header">
        <h1>Blog Posts 📝</h1>
        <p>Technical articles and insights on AI and machine learning</p>
      </div>
      <div className="reports-grid">
        <div className="reports-column">
          {blogPosts.slice(0, Math.ceil(blogPosts.length / 2)).map((post, index) => (
            <div key={index} className="report-item">
              <h3 className="report-title">
                <a href={post.url}>{post.title}</a>
              </h3>
              <p className="report-date">{post.date}</p>
              {post.description && <p className="report-description">{post.description}</p>}
            </div>
          ))}
        </div>
        <div className="reports-column">
          {blogPosts.slice(Math.ceil(blogPosts.length / 2)).map((post, index) => (
            <div key={index} className="report-item">
              <h3 className="report-title">
                <a href={post.url}>{post.title}</a>
              </h3>
              <p className="report-date">{post.date}</p>
              {post.description && <p className="report-description">{post.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPublications = () => (
    <div className="writing-content">
      <div className="writing-header">
        <h1>Research & Publications 🔬</h1>
        <p>Academic research papers and scientific publications</p>
      </div>
      <div className="reports-grid">
        <div className="reports-column">
          {publications.map((pub, index) => (
            <div key={index} className="report-item">
              <h3 className="report-title">
                <a href={pub.url}>{pub.title}</a>
              </h3>
              <p className="report-date">{pub.date}</p>
              {pub.description && <p className="report-description">{pub.description}</p>}
            </div>
          ))}
        </div>
        <div className="reports-column">
          {/* Space for future publications */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="writing-records-page">
      {/* Header with background image */}
      <div className="writing-header-section">
        <div className="header-image"></div>
        <nav className="writing-nav">
          <button 
            className={activeTab === 'blog' ? 'active' : ''}
            onClick={() => setActiveTab('blog')}
          >
            Blog
          </button>
          <button 
            className={activeTab === 'progress-reports' ? 'active' : ''}
            onClick={() => setActiveTab('progress-reports')}
          >
            Progress Reports
          </button>
          <button 
            className={activeTab === 'about' ? 'active' : ''}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <div className="theme-toggle">🌙</div>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'progress-reports' && renderProgressReports()}
      {activeTab === 'blog' && renderBlog()}
      {activeTab === 'about' && renderPublications()}
    </div>
  );
};

export default WritingRecords;
