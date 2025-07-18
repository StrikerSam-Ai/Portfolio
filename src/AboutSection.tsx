import React, { useEffect, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import type { Chart, ChartArea } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Skill = { label: string; value: number };

const defaultSkills: Skill[] = [
  { label: 'Python', value: 95 },
  { label: 'Machine Learning', value: 90 },
  { label: 'Deep Learning', value: 85 },
  { label: 'NLP', value: 80 },
  { label: 'Data Science', value: 88 },
  { label: 'MLOps', value: 75 },
  { label: 'Web Dev', value: 70 }
];

const getStoredSkills = (): Skill[] => {
  try {
    const stored = localStorage.getItem('skills');
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultSkills;
};

const progressReports = [
  {
    title: 'Q4 2024 - AI Model Optimization',
    desc: 'Improved model accuracy by 15% while reducing inference time by 40% through advanced optimization techniques.',
    url: 'https://progress-reports.com/q4-2024'
  },
  {
    title: 'Q3 2024 - MLOps Implementation',
    desc: 'Successfully deployed automated ML pipeline reducing deployment time from 2 weeks to 2 hours.',
    url: 'https://progress-reports.com/q3-2024'
  },
  {
    title: 'Q2 2024 - NLP System Enhancement',
    desc: 'Enhanced sentiment analysis system achieving 94% accuracy across multiple languages.',
    url: 'https://progress-reports.com/q2-2024'
  }
];

const blogs = [
  {
    title: 'Building Scalable ML Pipelines with Kubernetes',
    desc: 'Medium - 15K+ views, Featured in AI Engineering Weekly',
    url: 'https://medium.com/@shashwat-mishra/building-scalable-ml-pipelines-with-kubernetes-123456'
  },
  {
    title: 'The Future of MLOps: Best Practices for 2024',
    desc: 'Towards Data Science - 8K+ views, Top 10 trending article',
    url: 'https://towardsdatascience.com/the-future-of-mlops-best-practices-2024-abcdef'
  },
  {
    title: 'Optimizing Transformer Models for Production',
    desc: 'AI Engineering Blog - 12K+ views, Featured on LinkedIn',
    url: 'https://aiengineeringblog.com/optimizing-transformers-production'
  }
];

const publications = [
  {
    title: 'Efficient Attention Mechanisms for Large Language Models',
    desc: 'ICML 2024 - Co-authored with Stanford AI Lab',
    url: 'https://icml.cc/efficient-attention-2024'
  },
  {
    title: 'Multi-Modal Learning for Computer Vision Applications',
    desc: 'CVPR 2023 - Presented at Computer Vision Conference',
    url: 'https://cvpr2023.org/multimodal-learning'
  },
  {
    title: 'Scalable MLOps: A Comprehensive Framework',
    desc: 'IEEE Transactions on AI - Impact Factor: 8.5',
    url: 'https://ieeexplore.ieee.org/scalable-mlops-framework'
  }
];

const AboutSection: React.FC = () => {
  const skills = getStoredSkills();
  const editValues = skills.map((s: Skill) => s.value);
  const editLabels = skills.map((s: Skill) => s.label);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  // Heartbeat wave animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const chart = chartRef.current;
      // Find the radar chart canvas
      const chartContainer = document.querySelector('.skills-spider-chart');
      const canvasElement = chartContainer?.querySelector('canvas');
      let chartInstance = null;
      let canvas = null;
      if (chart && chart.chartInstance) {
        chartInstance = chart.chartInstance;
        canvas = chartInstance.canvas;
      } else if (chart && chart.chart) {
        chartInstance = chart.chart;
        canvas = chartInstance.canvas;
      } else if (chart) {
        chartInstance = chart;
        canvas = chart.canvas;
      } else if (canvasElement) {
        canvas = canvasElement;
      }
      if (canvas && chartContainer) {
        // Remove any existing overlay canvases
        chartContainer.querySelectorAll('.heartbeat-overlay-canvas').forEach(el => el.remove());
        // Create overlay canvas for heartbeat waves
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
        overlayCanvas.className = 'heartbeat-overlay-canvas';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = canvas.style.top || '0';
        overlayCanvas.style.left = canvas.style.left || '0';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.zIndex = '10';
        // Append overlay to the .skills-spider-chart container
        chartContainer.appendChild(overlayCanvas);
        const ctx = overlayCanvas.getContext('2d');
        if (!ctx) return;
        let waveRadius = 0;
        let animationId: number;
        // Get chart center and radius
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let maxRadius = Math.min(canvas.width, canvas.height) / 2 - 50;
        if (chartInstance && chartInstance.scales && chartInstance.scales.r) {
          const scale = chartInstance.scales.r;
          centerX = scale.xCenter;
          centerY = scale.yCenter;
          maxRadius = scale.drawingArea - 15;
        }
        const drawPolygonWave = (radius: number, opacity: number, lineWidth: number) => {
          const numPoints = editLabels.length;
          const angleStep = (2 * Math.PI) / numPoints;
          const startAngle = -Math.PI / 2;
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#ffb347';
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          for (let i = 0; i <= numPoints; i++) {
            const angle = startAngle + (i * angleStep);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.stroke();
        };
        const animate = () => {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          if (waveRadius > 0 && waveRadius <= maxRadius) {
            const mainOpacity = Math.max(0.1, 0.9 * (1 - waveRadius / maxRadius));
            drawPolygonWave(waveRadius, mainOpacity, 4);
            if (waveRadius > 15) {
              const trail1Radius = waveRadius - 15;
              if (trail1Radius <= maxRadius) {
                const trail1Opacity = Math.max(0.05, 0.6 * (1 - trail1Radius / maxRadius));
                drawPolygonWave(trail1Radius, trail1Opacity, 3);
              }
            }
            if (waveRadius > 30) {
              const trail2Radius = waveRadius - 30;
              if (trail2Radius <= maxRadius) {
                const trail2Opacity = Math.max(0.02, 0.3 * (1 - trail2Radius / maxRadius));
                drawPolygonWave(trail2Radius, trail2Opacity, 2);
              }
            }
            if (waveRadius > 45) {
              const trail3Radius = waveRadius - 45;
              if (trail3Radius <= maxRadius) {
                const trail3Opacity = Math.max(0.01, 0.15 * (1 - trail3Radius / maxRadius));
                drawPolygonWave(trail3Radius, trail3Opacity, 1);
              }
            }
          }
          waveRadius += 2.5;
          if (waveRadius > maxRadius + 10) {
            waveRadius = 0;
            setTimeout(() => {
              animationId = requestAnimationFrame(animate);
            }, 1000);
          } else {
            animationId = requestAnimationFrame(animate);
          }
        };
        animate();
        return () => {
          if (animationId) cancelAnimationFrame(animationId);
          if (overlayCanvas && overlayCanvas.parentElement) overlayCanvas.parentElement.removeChild(overlayCanvas);
        };
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [skills, editLabels]);

  // Gradient fill for radar
  const getGradient = (ctx: { chart: Chart<'radar'> & { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return '#ffb347';
    const gradient = c.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(255,179,71,0.7)');
    gradient.addColorStop(1, 'rgba(255,226,159,0.25)');
    return gradient;
  };

  const data = {
    labels: editLabels,
    datasets: [
      {
        label: 'Skill Level',
        data: editValues,
        backgroundColor: (ctx: any) => getGradient(ctx),
        borderColor: '#ffb347', // Orange border to match theme
        pointBackgroundColor: '#ffb347', // Orange points
        pointBorderColor: '#ffffff', // White border for points
        pointHoverBackgroundColor: '#ffffff', // White on hover
        pointHoverBorderColor: '#ffb347', // Orange border on hover
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 0, // Disable animations
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed.r;
            let level = 'Beginner';
            if (val >= 90) level = 'Expert';
            else if (val >= 75) level = 'Advanced';
            else if (val >= 50) level = 'Intermediate';
            return `${ctx.label}: ${val}/100 – ${level}`;
          }
        },
        backgroundColor: 'rgba(47,71,79,0.95)',
        titleColor: '#ffffff', // White title
        bodyColor: '#ffffff', // White body text
        borderColor: '#ffb347', // Orange border to match theme
        borderWidth: 1,
        padding: 12,
        caretSize: 7,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        angleLines: { color: '#ffffff' }, // White angle lines for better visibility
        grid: { color: 'rgba(255,255,255,0.3)' }, // White grid lines with transparency
        pointLabels: {
          color: '#ffffff', // White labels for better visibility on dark background
          font: { size: 15, family: 'Inter, sans-serif', weight: 'bold' as const },
          padding: 32,
          display: true,
        },
        clip: false,
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          color: '#ffffff', // White tick labels
          stepSize: 20,
          backdropColor: 'transparent',
          font: { size: 13 },
        },
      },
    },
  };

  // Only show 2 most recent for each
  const recentProgress = progressReports.slice(0, 2);
  const recentBlogs = blogs.slice(0, 2);
  const recentPubs = publications.slice(0, 2);

  return (
    <section className="about-section" id="about">
      <h2 className="about-title">About Me</h2>
      <div className="about-content about-custom-grid">
        <div className="about-bio">{/* grid-area: bio */}
          <p>
          I’m an AI engineering student with a passion for building intelligent and scalable machine learning systems.
          My journey in AI started in computer science, where I discovered the excitement of applying cutting-edge technology to solve real-world challenges.
          </p>
          <p>
          I’m an AI engineering student with a passion for building intelligent and scalable machine learning systems. 
          My journey in AI started in computer science, where I discovered the excitement of applying cutting-edge technology to solve real-world challenges.
          </p>
          <p>
          Beyond coursework, I love sharing ideas in open-source communities, writing about new tech, and working with fellow learners to create meaningful AI solutions.
          </p>
        </div>
        <div className="about-skills">{/* grid-area: skills */}
          <h3>Skills Overview</h3>
          <div className="skills-spider-chart" style={{ minHeight: 420 }}>
            <Radar
              ref={chartRef}
              data={data}
              options={options}
              width={520}
              height={420}
            />
          </div>
        </div>
        <div className="about-timeline">{/* grid-area: work */}
          <h3>Work Experience</h3>
          <ul>
            <li>
              <strong>Senior AI Engineer</strong> - TechCorp Inc. (2022-Present)
              <br />
              <span className="timeline-detail">Leading ML initiatives, developing production-ready AI models, and mentoring junior engineers.</span>
            </li>
            <li>
              <strong>Machine Learning Engineer</strong> - DataFlow Solutions (2020-2022)
              <br />
              <span className="timeline-detail">Built recommendation systems and NLP applications serving 1M+ users.</span>
            </li>
          </ul>
        </div>
        <div className="about-education">{/* grid-area: education */}
          <h3>Education</h3>
          <ul>
            <li>
              <strong>Master of Science in Computer Science</strong>
              <br />
              <span className="timeline-detail">Stanford University - Specialization in AI & Machine Learning</span>
            </li>
            <li>
              <strong>Bachelor of Engineering in Computer Science</strong>
              <br />
              <span className="timeline-detail">MIT - Graduated with Honors</span>
            </li>
          </ul>
        </div>
        <div className="about-publications">{/* grid-area: publications */}
          <h3>📚 Publications & Research</h3>
          <ul>
            {recentPubs.map((pub, i) => (
              <li key={i}>
                <strong>{pub.title}</strong>
                <br />
                <span className="timeline-detail">{pub.desc}</span>
              </li>
            ))}
          </ul>
          <Link to="/writing-records?tab=research" className="about-viewall-btn">View All Publications</Link>
        </div>
        <div className="about-progress">{/* grid-area: progress */}
          <h3>📈 Recent Progress Reports</h3>
          <ul>
            {recentProgress.map((pr, i) => (
              <li key={i}>
                <strong>{pr.title}</strong>
                <br />
                <span className="timeline-detail">{pr.desc}</span>
              </li>
            ))}
          </ul>
          <Link to="/writing-records?tab=progress" className="about-viewall-btn">View All Progress Reports</Link>
        </div>
        <div className="about-blogs">{/* grid-area: blogs */}
          <h3>📝 Recent Blogs & Articles</h3>
          <ul>
            {recentBlogs.map((blog, i) => (
              <li key={i}>
                <strong>{blog.title}</strong>
                <br />
                <span className="timeline-detail">{blog.desc}</span>
              </li>
            ))}
          </ul>
          <Link to="/writing-records?tab=blog" className="about-viewall-btn">View All Blogs</Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 