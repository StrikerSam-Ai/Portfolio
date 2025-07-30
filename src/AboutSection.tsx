import React, { useState, useEffect, useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartArea } from 'chart.js';
import { Link } from 'react-router-dom';
import { browserProgressReader, type ParsedProgressReport } from './utils/browserProgressReader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowTrendUp, faEdit } from '@fortawesome/free-solid-svg-icons';


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

// Dynamic content with timestamps for automatic sorting (same as WritingRecords)
const blogPosts = [
  { 
    title: "A World without lies", 
    url: "https://medium.com/@shashwatmishra0369/the-world-without-lies-8b241f55b55b", 
    snippet: "Ever thought? How would a world without lies look like ?", 
    image: "https://miro.medium.com/v2/resize:fit:4800/format:webp/0*S_vQvDibV2e3Lc-5",
    publishedDate: new Date('2025-07-20'),
    category: 'Philosophy'
  },
  { 
    title: "Pushovers Finish Last — Learn to Say No", 
    url: "https://medium.com/@shashwat-mishra/pushovers-finish-last-learn-to-say-no", 
    snippet: "Why saying no is a superpower for your career and life.", 
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example2.png",
    publishedDate: new Date('2025-07-18'),
    category: 'Career'
  },
  { 
    title: "The Thought Process Behind My Learning Plan", 
    url: "https://medium.com/@shashwat-mishra/the-thought-process-behind-my-learning-plan", 
    snippet: "How I structure my learning for maximum growth.", 
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example3.png",
    publishedDate: new Date('2025-07-15'),
    category: 'Learning'
  },
  { 
    title: "Math For Machine Learning [Resources]", 
    url: "https://medium.com/@shashwat-mishra/math-for-machine-learning-resources", 
    snippet: "Essential math resources for aspiring ML engineers.", 
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example4.png",
    publishedDate: new Date('2025-07-10'),
    category: 'Resources'
  },
  { 
    title: "You Are NOT Dumb, You Just Lack the Prerequisites", 
    url: "https://medium.com/@shashwat-mishra/you-are-not-dumb-you-just-lack-the-prerequisites", 
    snippet: "Why background knowledge matters more than you think.", 
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example5.png",
    publishedDate: new Date('2025-07-05'),
    category: 'Learning'
  },
  { 
    title: "Why I Started Documenting My Grind—and Why You Might Consider It Too", 
    url: "https://medium.com/@shashwat-mishra/why-i-started-documenting-my-grind-and-why-you-might-consider-it-too", 
    snippet: "The power of public learning and sharing your journey.", 
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example6.png",
    publishedDate: new Date('2025-06-28'),
    category: 'Personal'
  },
  { 
    title: "From Marketing to Code: Why I Made the Switch", 
    url: "https://medium.com/@shashwat-mishra/from-marketing-to-code-why-i-made-the-switch", 
    snippet: "My journey from marketing to software engineering.", 
    image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example7.png",
    publishedDate: new Date('2025-06-20'),
    category: 'Career'
  },
].sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()); // Sort by most recent

const researchPublications = [
  { 
    title: "Research Publications Coming Soon", 
    url: "#", 
    author: "", 
    year: "2024", 
    image: "",
    publishedDate: new Date(),
    journal: "Stay tuned for upcoming research publications",
    status: 'coming soon'
  }
].sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()); // Sorting preserved for future additions

const AboutSection: React.FC = () => {
  const [recentProgress, setRecentProgress] = useState<ParsedProgressReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const skills = getStoredSkills();
  const editValues = skills.map((s: Skill) => s.value);
  const editLabels = skills.map((s: Skill) => s.label);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const reports = await browserProgressReader.getRecentReports(3);
        console.log('Fetched reports in AboutSection:', reports);
        setRecentProgress(reports);
      } catch (error) {
        console.error("Failed to load progress reports:", error);
        setRecentProgress([]); // Clear progress on error
      }
      setIsLoading(false);
    };
    fetchProgress();
  }, []);

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
  const getGradient = (ctx: { chart: ChartJS<'radar'> & { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
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

  // Only show 2 most recent for each category (automatically sorted by publishedDate)
  const recentBlogs = blogPosts.slice(0, 2).map(blog => ({
    title: blog.title,
    desc: `${blog.category} - ${blog.snippet}`,
    url: blog.url
  }));
  const recentPubs = researchPublications.slice(0, 2).map(pub => ({
    title: pub.title,
    desc: `${pub.journal || pub.year} - ${pub.status || 'Published'}`,
    url: pub.url
  }));

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
              <strong>Vice President</strong> - Robotics Club @AVV Amaravati (2024-current)
              <br />
              <span className="timeline-detail">Leading the Robotics Club in organizing events and workshops.</span>
            </li>
            <li>
              <strong>Executive Promotions</strong> - MSA AVV Amaravati (2024-current)
              <br />
              <span className="timeline-detail">Volunteering in the Campus Microsoft Student Ambassadors Team as Promotions Executive spreading information amongst peers.</span>
            </li>
            <li>
              <strong>Research & Policy Analyst</strong> - Encode India (2024-current)
              <br />
              <span className="timeline-detail">Conducted research and analysis on AI policies and their societal impacts.</span>
            </li>
          </ul>
        </div>
        <div className="about-education">{/* grid-area: education */}
          <h3>Education</h3>
          <ul>
            <li>
              <strong>Pursuing Bachelor's of Technology in Computer Science Engineering</strong>
              <br />
              <span className="timeline-detail">Amrita Vishwa Vidyapeetham University - Specialization in AI & Machine Learning [2024-2028]</span>
            </li>
            <li>
              <strong>Schooling</strong>
              <br />
              <span className="timeline-detail">St. Xavier's High School - Completed Secondary Education in 2023.</span>
            </li>
          </ul>
        </div>
        <div className="about-publications">{/* grid-area: publications */}
          <h3><FontAwesomeIcon icon={faBook} style={{ marginRight: '0.5rem' }} /> Publications & Research</h3>
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
          <h3><FontAwesomeIcon icon={faArrowTrendUp} style={{ marginRight: '0.5rem' }} /> Recent Progress Reports</h3>
          <ul>
            {isLoading ? (
              <li>Loading...</li>
            ) : (
              recentProgress.map((pr, i) => (
                <li key={i}>
                  <strong>{pr.title}</strong>
                  <br />
                  <span className="timeline-detail">
                    Day {pr.day} - {pr.date} | Mood: {pr.mood} 
                    {pr.productivityScore && ` | Score: ${pr.productivityScore}/10`}
                    {pr.achievements && pr.achievements.length > 0 && ` | ${pr.achievements.length} achievements`}
                  </span>
                </li>
              ))
            )}
          </ul>
          <Link to="/writing-records?tab=progress" className="about-viewall-btn">View All Progress Reports</Link>
        </div>
        <div className="about-blogs">{/* grid-area: blogs */}
          <h3><FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5rem' }} /> Recent Blogs & Articles</h3>
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