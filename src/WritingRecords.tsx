import React, { useState } from 'react';
import './App.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { browserProgressReader as progressReader, type ParsedProgressReport } from './utils/browserProgressReader';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faChartLine, 
  faTrophy, 
  faAward, 
  faCrosshairs, 
  faGraduationCap, 
  faFire, 
  faRocket,
  faSmile,
  faMeh,
  faAngry,
  faTired,
  faArrowTrendUp,
  faArrowTrendDown,
  faArrowRight,
  faLightbulb,
  faExclamationTriangle,
  faStar,
  faHourglass,
  faEdit,
  faRobot,
  faFileAlt,
  faClipboard,
  faSync,
  faCheckCircle,
  faClock,
  faBook,
  faThermometerHalf
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

// Add icons to library
library.add(
  faCalendarDays, 
  faChartLine, 
  faTrophy, 
  faAward, 
  faCrosshairs, 
  faGraduationCap, 
  faFire, 
  faRocket,
  faSmile,
  faMeh,
  faAngry,
  faTired,
  faArrowTrendUp,
  faArrowTrendDown,
  faArrowRight,
  faLightbulb,
  faExclamationTriangle,
  faStar,
  faHourglass,
  faEdit,
  faRobot,
  faFileAlt,
  faClipboard,
  faSync,
  faCheckCircle,
  faClock,
  faBook,
  faThermometerHalf
);
import { Doughnut, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Dynamic content with timestamps for automatic sorting
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
    url: "https://medium.com/@shashwatmishra0369/pushovers-finish-last-learn-to-say-no-79bb882a8801", 
    snippet: "Why saying no is a superpower for your career and life.", 
    image: "https://miro.medium.com/v2/resize:fit:1100/format:webp/0*wCIOsoK3MY3o49iU",
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
    author: "Future Work", 
    year: "2025", 
    image: "https://via.placeholder.com/300x200?text=Coming+Soon",
    publishedDate: new Date(),
    journal: "Stay Tuned",
    status: 'upcoming'
  }
];

const TABS = [
  { key: 'blog', label: 'Blog Posts' },
  { key: 'progress', label: 'Progress Reports' },
  { key: 'research', label: 'Research & Publications' },
];

const WritingRecords: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('blog');
  const [featuredIdx, setFeaturedIdx] = useState<number>(0);
  const [modalUrl, setModalUrl] = useState<string>('');
  const [modalData, setModalData] = useState<any>(null);
  const [iframeError, setIframeError] = useState<boolean>(false);
  
  const [fileReports, setFileReports] = useState<ParsedProgressReport[]>([]);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [progressStats, setProgressStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'dashboard' | 'calendar'>('timeline');
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['blog', 'progress', 'research'].includes(tab) && tab !== selectedTab) {
      setSelectedTab(tab);
    }
  }, [location.search]);

  // Load file-based progress reports
  useEffect(() => {
    const loadFileReports = async () => {
      setLoading(true);
      try {
        const reports = await progressReader.getRecentReports(20);
        const stats = await progressReader.getStats();
        setFileReports(reports);
        setProgressStats(stats);
      } catch (error) {
        console.warn('Could not load file reports, using fallback data:', error);
        // Fallback to sample data if file reading fails
      }
      setLoading(false);
    };

    if (selectedTab === 'progress') {
      loadFileReports();
    }
  }, [selectedTab]);

  // Helper functions for mood processing
  const getMoodColorFromText = (moodText: string): string => {
    const mood = moodText.toLowerCase().replace(/[^a-z]/g, '');
    switch (mood) {
      case 'excellent': return '#00cc66'; // Darker green
      case 'good': return '#3e1919ff'; // Darker orange 
      case 'okay': return '#ccaa00'; // Darker yellow
      case 'challenging': return '#cc6600'; // Darker orange-red
      case 'tough': return '#cc4444'; // Darker red
      default: return '#ff9500ff'; // Darker orange default
    }
  };

  const getMoodEmojiFromText = (moodText: string): React.ReactNode => {
    const mood = moodText.toLowerCase().replace(/[^a-z]/g, '');
    switch (mood) {
      case 'excellent': return <FontAwesomeIcon icon={faRocket} />;
      case 'good': return <FontAwesomeIcon icon={faSmile} />;
      case 'okay': return <FontAwesomeIcon icon={faMeh} />;
      case 'challenging': return <FontAwesomeIcon icon={faAngry} />;
      case 'tough': return <FontAwesomeIcon icon={faTired} />;
      default: return <FontAwesomeIcon icon={faSmile} />;
    }
  };

  // Enhanced Analytics Helper Functions
  const calculateTrend = (data: number[]): 'up' | 'down' | 'stable' => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3);
    const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previous = data.slice(-6, -3);
    if (previous.length === 0) return 'stable';
    const prevAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    
    if (avg > prevAvg + 0.5) return 'up';
    if (avg < prevAvg - 0.5) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable'): React.ReactNode => {
    switch (trend) {
      case 'up': return <FontAwesomeIcon icon={faArrowTrendUp} />;
      case 'down': return <FontAwesomeIcon icon={faArrowTrendDown} />;
      case 'stable': return <FontAwesomeIcon icon={faArrowRight} />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up': return '#00cc66'; // Darker green
      case 'down': return '#cc4444'; // Darker red
      case 'stable': return '#ccaa00'; // Darker yellow
    }
  };

  const generateProductivityTrendData = () => {
  if (!fileReports || fileReports.length === 0) return null;
  
  // Use actual reports instead of fake 14 days
  const actualReports = fileReports
    .sort((a, b) => a.day - b.day) // Sort by day ascending
    .map(report => ({
      date: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: report.productivityScore || 0,
      mood: report.mood || 'good'
    }));

  return {
    labels: actualReports.map(d => d.date),
    datasets: [
      {
        label: 'Productivity Score',
        data: actualReports.map(d => d.score),
        borderColor: '#cc8c37', // Darker orange
        backgroundColor: 'rgba(204, 140, 55, 0.1)', // Darker orange with transparency
        borderWidth: 3,
        pointBackgroundColor: actualReports.map(d => getMoodColorFromText(d.mood)),
        pointBorderColor: '#cc8c37', // Darker orange
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      }
    ]
  };
};

  const generateMoodRadarData = () => {
    if (!progressStats?.moodDistribution) return null;

    const moodLabels = ['Excellent', 'Good', 'Okay', 'Challenging', 'Tough'];
    const moodData = moodLabels.map(mood => 
      progressStats?.moodDistribution?.[mood.toLowerCase()] || 0
    );

    return {
      labels: moodLabels,
      datasets: [
        {
          label: 'Mood Distribution',
          data: moodData,
          backgroundColor: 'rgba(204, 140, 55, 0.2)', // Darker orange with transparency
          borderColor: '#cc8c37', // Darker orange
          borderWidth: 2,
          pointBackgroundColor: '#cc8c37', // Darker orange
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#cc8c37' // Darker orange
        }
      ]
    };
  };

  // Enhanced Progress Dashboard Component
  const ProgressDashboard = () => {
    // Add null check for progressStats
    if (!progressStats) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          color: '#ffb347',
          fontSize: '1.2rem',
          fontFamily: 'monospace'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FontAwesomeIcon icon={faChartLine} /></div>
            <div>Loading dashboard...</div>
          </div>
        </div>
      );
    }
    if (!progressStats) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FontAwesomeIcon icon={faChartLine} /></div>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Loading your analytics...</p>
          <div style={{ 
            width: '60px', 
            height: '4px', 
            background: 'rgba(255,179,71,0.3)', 
            borderRadius: '2px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '30px',
              height: '100%',
              background: 'var(--color-primary)',
              borderRadius: '2px',
              animation: 'loading 1.5s infinite'
            }} />
          </div>
          <style>
            {`
              @keyframes loading {
                0% { transform: translateX(-30px); }
                100% { transform: translateX(60px); }
              }
            `}
          </style>
        </div>
      );
    }

    // Calculate advanced metrics
    const productivityScores = fileReports?.map(r => r.productivityScore || 0) || [];
    const productivityTrend = calculateTrend(productivityScores);
    const streak = progressStats?.currentStreak || 0;
    const longestStreak = streak; // For now, same as current streak since you just started
    const achievementVelocity = (progressStats?.totalDays || 0) > 0 
      ? ((progressStats?.totalAchievements || 0) / (progressStats?.totalDays || 1)).toFixed(1)
      : '0.0';

    // Generate chart data
    const productivityTrendData = generateProductivityTrendData();
    const moodRadarData = generateMoodRadarData();

    // Chart options
    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(24,24,24,0.95)',
          titleColor: '#ffb347',
          bodyColor: '#ffffff',
          borderColor: '#ffb347',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255,179,71,0.1)'
          },
          ticks: {
            color: '#ffffff',
            font: { family: 'monospace' }
          }
        },
        y: {
          min: 0,
          max: 10,
          grid: {
            color: 'rgba(255,179,71,0.1)'
          },
          ticks: {
            color: '#ffffff',
            font: { family: 'monospace' }
          }
        }
      }
    };

    const radarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255,179,71,0.2)'
          },
          pointLabels: {
            color: '#ffffff',
            font: { family: 'monospace', size: 12 }
          },
          ticks: {
            color: 'rgba(255,179,71,0.6)',
            font: { family: 'monospace' },
            backdropColor: 'transparent'
          }
        }
      }
    };

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: '#ffffff',
            font: { family: 'monospace', size: 11 },
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(24,24,24,0.95)',
          titleColor: '#ffb347',
          bodyColor: '#ffffff',
          borderColor: '#ffb347',
          borderWidth: 1
        }
      },
      cutout: '60%'
    };

    // Prepare mood chart data with enhanced styling
    const moodChartData = {
      labels: Object.keys(progressStats?.moodDistribution || {}).map(mood => 
        mood.charAt(0).toUpperCase() + mood.slice(1)
      ),
      datasets: [{
        data: Object.values(progressStats?.moodDistribution || {}),
        backgroundColor: [
          '#00cc66', // excellent - darker green
          '#cc8c37', // good - darker orange  
          '#ccaa00', // okay - darker yellow
          '#cc6600', // challenging - darker orange-red
          '#cc4444'  // tough - darker red
        ],
        borderWidth: 3,
        borderColor: '#181818',
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff'
      }]
    };

    return (
      <div style={{ padding: '2rem 0', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Enhanced KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '1.5rem',
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem auto'
        }}>
          {/* Smart Streak Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(50,50,50,0.9) 100%)',
            borderRadius: 20,
            padding: '2rem',
            border: '1px solid rgba(255,179,71,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              fontSize: '1.5rem'
            }}>
              {getTrendIcon(productivityTrend)}
            </div>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}><FontAwesomeIcon icon={faFire} /></div>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              margin: '0 0 0.5rem 0', 
              fontSize: '2.2rem',
              fontWeight: 700
            }}>
              {streak}
            </h3>
            <p style={{ 
              color: 'var(--color-secondary)', 
              margin: '0 0 1rem 0', 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              Day Streak
            </p>
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-muted)',
              fontFamily: 'monospace'
            }}>
              Longest: {longestStreak} days
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${getTrendColor(productivityTrend)} ${(streak / longestStreak) * 100}%, 
                transparent 100%)`
            }} />
          </div>

          {/* Enhanced Productivity Score */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(50,50,50,0.9) 100%)',
            borderRadius: 20,
            padding: '2rem',
            border: '1px solid rgba(255,179,71,0.3)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}><FontAwesomeIcon icon={faChartLine} /></div>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              margin: '0 0 0.5rem 0', 
              fontSize: '2.2rem',
              fontWeight: 700
            }}>
              {progressStats?.averageProductivity || 0}
              <span style={{ fontSize: '1.2rem', color: 'var(--color-muted)' }}>/10</span>
            </h3>
            <p style={{ 
              color: 'var(--color-secondary)', 
              margin: '0 0 1rem 0', 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              Avg Productivity
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: getTrendColor(productivityTrend),
              fontFamily: 'monospace'
            }}>
              {getTrendIcon(productivityTrend)}
              <span>
                {productivityTrend === 'up' ? 'Improving' : 
                 productivityTrend === 'down' ? 'Declining' : 'Stable'}
              </span>
            </div>
          </div>

          {/* Achievement Velocity */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(50,50,50,0.9) 100%)',
            borderRadius: 20,
            padding: '2rem',
            border: '1px solid rgba(255,179,71,0.3)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}><FontAwesomeIcon icon={faTrophy} /></div>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              margin: '0 0 0.5rem 0', 
              fontSize: '2.2rem',
              fontWeight: 700
            }}>
              {progressStats?.totalAchievements || 0}
            </h3>
            <p style={{ 
              color: 'var(--color-secondary)', 
              margin: '0 0 1rem 0', 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              Total Achievements
            </p>
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-muted)',
              fontFamily: 'monospace'
            }}>
              Velocity: {achievementVelocity}/day
            </div>
          </div>

          {/* Learning Progress */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(50,50,50,0.9) 100%)',
            borderRadius: 20,
            padding: '2rem',
            border: '1px solid rgba(255,179,71,0.3)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}><FontAwesomeIcon icon={faGraduationCap} /></div>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              margin: '0 0 0.5rem 0', 
              fontSize: '2.2rem',
              fontWeight: 700
            }}>
              {progressStats?.totalDays || 0}
            </h3>
            <p style={{ 
              color: 'var(--color-secondary)', 
              margin: '0 0 1rem 0', 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              Learning Days
            </p>
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-muted)',
              fontFamily: 'monospace'
            }}>
              Consistency: {Math.round((streak / (progressStats?.totalDays || 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* Activity Heatmap Section */}
        <div style={{ marginBottom: '3rem' }}>
          <ActivityHeatmap 
            data={fileReports.map(report => ({
              date: report.date,
              score: report.productivityScore || 0,
              achievements: report.achievements?.length || 0,
              mood: report.mood || 'neutral'
            }))}
            onDateClick={(date) => {
              // Find and highlight the report for this date
              const report = fileReports.find(r => r.date === date);
              if (report) {
                setExpandedReport(`${report.day}-${report.date}`);
                // Scroll to timeline view
                setViewMode('timeline');
              }
            }}
          />
        </div>

        {/* Advanced Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Productivity Trend Line Chart */}
          {productivityTrendData && (
            <div style={{
              background: 'rgba(40,40,40,0.9)',
              borderRadius: 20,
              padding: '2rem',
              border: '1px solid rgba(255,179,71,0.2)',
              minHeight: '350px'
            }}>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '1.5rem', 
                textAlign: 'center',
                fontSize: '1.3rem',
                fontFamily: 'monospace'
              }}>
                <FontAwesomeIcon icon={faArrowTrendUp} style={{ marginRight: '0.5rem' }} /> Productivity Trend
              </h3>
              <div style={{ height: '280px', position: 'relative' }}>
                <Line data={productivityTrendData} options={lineChartOptions} />
              </div>
            </div>
          )}

          {/* Mood Intelligence Radar */}
          {moodRadarData && (
            <div style={{
              background: 'rgba(40,40,40,0.9)',
              borderRadius: 20,
              padding: '2rem',
              border: '1px solid rgba(255,179,71,0.2)',
              minHeight: '350px'
            }}>
              <h3 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '1.5rem', 
                textAlign: 'center',
                fontSize: '1.3rem',
                fontFamily: 'monospace'
              }}>
                <FontAwesomeIcon icon={faThermometerHalf} style={{ marginRight: '0.5rem' }} /> Mood Intelligence
              </h3>
              <div style={{ height: '280px', position: 'relative' }}>
                <Radar data={moodRadarData} options={radarChartOptions} />
              </div>
            </div>
          )}
        </div>

        {/* Secondary Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Enhanced Mood Distribution */}
          <div style={{
            background: 'rgba(40,40,40,0.9)',
            borderRadius: 20,
            padding: '2rem',
            border: '1px solid rgba(255,179,71,0.2)'
          }}>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              fontSize: '1.3rem',
              fontFamily: 'monospace'
            }}>
              <FontAwesomeIcon icon={faSmile} style={{ marginRight: '0.5rem' }} /> Emotional Patterns
            </h3>
            <div style={{ height: '280px', position: 'relative' }}>
              <Doughnut data={moodChartData} options={doughnutOptions} />
            </div>
          </div>

          {/* Enhanced Top Focus Areas */}
          <div style={{
            background: 'rgba(40,40,40,0.9)',
            borderRadius: 20,
            padding: '2rem',
            border: '1px solid rgba(255,179,71,0.2)'
          }}>
            <h3 style={{ 
              color: 'var(--color-primary)', 
              marginBottom: '1.5rem', 
              textAlign: 'center',
              fontSize: '1.3rem',
              fontFamily: 'monospace'
            }}>
              <FontAwesomeIcon icon={faCrosshairs} style={{ marginRight: '0.5rem' }} /> Learning Focus Areas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '280px', overflowY: 'auto' }}>
              {(progressStats?.topTags || []).slice(0, 10).map((tagData: any, i: number) => {
                const percentage = Math.round((tagData.count / (progressStats?.totalDays || 1)) * 100);
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.8rem',
                    background: 'rgba(255,179,71,0.05)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,179,71,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${percentage}%`,
                      background: 'linear-gradient(90deg, rgba(255,179,71,0.2), rgba(255,179,71,0.1))',
                      borderRadius: '12px 0 0 12px'
                    }} />
                    <span style={{ 
                      color: 'var(--color-secondary)', 
                      fontFamily: 'monospace',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      zIndex: 1,
                      position: 'relative'
                    }}>
                      #{tagData.tag}
                    </span>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      zIndex: 1,
                      position: 'relative'
                    }}>
                      <span style={{ 
                        color: 'var(--color-primary)', 
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {tagData.count}
                      </span>
                      <span style={{ 
                        color: 'var(--color-muted)', 
                        fontSize: '0.8rem',
                        fontFamily: 'monospace'
                      }}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Insights Panel */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(30,30,30,0.9) 100%)',
          borderRadius: 20,
          padding: '2rem',
          border: '1px solid rgba(255,179,71,0.2)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            color: 'var(--color-primary)', 
            marginBottom: '1.5rem',
            fontSize: '1.3rem',
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            <FontAwesomeIcon icon={faRobot} style={{ marginRight: '0.5rem' }} /> AI-Powered Insights
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Performance Analysis */}
            <div style={{
              background: 'rgba(50,50,50,0.6)',
              borderRadius: 12,
              padding: '1.5rem',
              border: '1px solid rgba(255,179,71,0.1)'
            }}>
              <h4 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '0.5rem' }} /> Performance Analysis
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--color-secondary)' }}>
                <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {productivityTrend === 'up' 
                    ? <><FontAwesomeIcon icon={faRocket} style={{ marginRight: '0.5rem' }} /> Your productivity is trending upward!</>
                    : productivityTrend === 'down' 
                    ? <><FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '0.5rem' }} /> Consider adjusting your approach</> 
                    : <><FontAwesomeIcon icon={faStar} style={{ marginRight: '0.5rem' }} /> Maintaining consistent performance</>
                  }
                </li>
                <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: '0.5rem' }} /> Peak performance: {Math.max(...productivityScores)}/10
                </li>
                <li style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  <FontAwesomeIcon icon={faCrosshairs} style={{ marginRight: '0.5rem' }} /> Achievement rate: {achievementVelocity} per day
                </li>
              </ul>
            </div>

            {/* Recommendations */}
            <div style={{
              background: 'rgba(50,50,50,0.6)',
              borderRadius: 12,
              padding: '1.5rem',
              border: '1px solid rgba(255,179,71,0.1)'
            }}>
              <h4 style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faCrosshairs} style={{ marginRight: '0.5rem' }} /> Smart Recommendations
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--color-secondary)' }}>
                <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {streak >= 7 
                    ? <><FontAwesomeIcon icon={faFire} style={{ marginRight: '0.5rem' }} /> Amazing streak! Keep the momentum going</>
                    : <><FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }} /> Focus on building consistency</>
                  }
                </li>
                <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  <FontAwesomeIcon icon={faBook} style={{ marginRight: '0.5rem' }} /> Top focus: {progressStats?.topTags?.[0]?.tag || 'Define your goals'}
                </li>
                <li style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem' }} /> Optimal for learning new skills
                </li>
              </ul>
            </div>

            {/* Latest Achievement */}
            {progressStats?.latestReport && (
              <div style={{
                background: 'rgba(50,50,50,0.6)',
                borderRadius: 12,
                padding: '1.5rem',
                border: '1px solid rgba(255,179,71,0.1)'
              }}>
                <h4 style={{ 
                  color: 'var(--color-primary)', 
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faAward} style={{ marginRight: '0.5rem' }} /> Recent Milestone
                </h4>
                <div style={{ color: 'var(--color-secondary)', fontFamily: 'monospace' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>{progressStats?.latestReport?.title}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }} />
                    {new Date(progressStats?.latestReport?.date || new Date()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Open post in modal with fallback options
  const openPost = (url: string, data: any) => {
    setModalUrl(url);
    setModalData(data);
    setIframeError(false);
  };

  // Close modal
  const closeModal = () => {
    setModalUrl('');
    setModalData(null);
    setIframeError(false);
  };

  // Open in new tab
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Enhanced Modal Component with fallback
  const EnhancedModal = () => {
    if (!modalUrl || !modalData) return null;

    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        background: 'rgba(0,0,0,0.85)', 
        zIndex: 9999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backdropFilter: 'blur(8px)' 
      }}>
        <div style={{ 
          width: '95vw', 
          maxWidth: 1000, 
          height: '90vh', 
          background: 'rgba(24,24,24,0.98)', 
          borderRadius: 16, 
          overflow: 'hidden', 
          position: 'relative', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,179,71,0.2)' 
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid rgba(255,179,71,0.2)',
            background: 'rgba(40,40,40,0.5)' 
          }}>
            <div style={{ 
              color: 'var(--color-primary)', 
              fontFamily: 'monospace', 
              fontWeight: 700, 
              fontSize: '1.2rem',
              maxWidth: '70%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {modalData.title}
            </div>
            <button 
              onClick={closeModal} 
              style={{ 
                background: 'rgba(255,179,71,0.1)', 
                border: '1px solid var(--color-primary)', 
                borderRadius: 8, 
                width: 40, 
                height: 40, 
                fontSize: 20, 
                cursor: 'pointer',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary)';
                e.currentTarget.style.color = '#181818';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,179,71,0.1)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column' }}>
            {!iframeError ? (
              // Try iframe first
              <>
                <iframe 
                  src={modalUrl} 
                  title={modalData.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    border: 'none', 
                    background: '#fff' 
                  }}
                  onError={() => setIframeError(true)}
                  onLoad={(e) => {
                    // Check if iframe loaded successfully
                    try {
                      const iframe = e.target as HTMLIFrameElement;
                      iframe.contentWindow?.document;
                    } catch (error) {
                      setIframeError(true);
                    }
                  }}
                />
                {/* Loading fallback after 3 seconds */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-in-out 3s forwards'
                }}>
                  <style>
                    {`
                      @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                      }
                    `}
                  </style>
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'var(--color-secondary)', 
                    fontFamily: 'monospace' 
                  }}>
                    <p>Having trouble loading? Try the options below:</p>
                    <button 
                      onClick={() => setIframeError(true)}
                      style={{
                        background: 'var(--color-primary)',
                        color: '#181818',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.5rem 1rem',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      Show Alternatives
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Fallback content when iframe fails
              <div style={{ 
                padding: '2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                textAlign: 'center' 
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  opacity: 0.7 
                }}><FontAwesomeIcon icon={faFileAlt} /></div>
                
                <h3 style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'monospace', 
                  marginBottom: '1rem',
                  fontSize: '1.3rem' 
                }}>
                  Content Protection Active
                </h3>
                
                <p style={{ 
                  color: 'var(--color-secondary)', 
                  fontFamily: 'monospace', 
                  marginBottom: '1.5rem',
                  maxWidth: '500px',
                  lineHeight: 1.6 
                }}>
                  This content cannot be embedded due to security policies. Choose an option below to read the full article:
                </p>

                {modalData.snippet && (
                  <div style={{ 
                    background: 'rgba(40,40,40,0.7)', 
                    padding: '1rem', 
                    borderRadius: 8, 
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    border: '1px solid rgba(255,179,71,0.2)' 
                  }}>
                    <p style={{ 
                      color: 'var(--color-secondary)', 
                      fontFamily: 'monospace', 
                      fontSize: '1rem',
                      fontStyle: 'italic',
                      margin: 0 
                    }}>
                      "{modalData.snippet}"
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    onClick={() => openInNewTab(modalUrl)}
                    style={{
                      background: 'var(--color-primary)',
                      color: '#181818',
                      border: 'none',
                      borderRadius: 8,
                      padding: '0.8rem 1.5rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FontAwesomeIcon icon={faRocket} style={{ marginRight: '0.5rem' }} /> Open in New Tab
                  </button>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(modalUrl);
                      // Show copied feedback
                      const button = document.activeElement as HTMLButtonElement;
                      const originalText = button.innerHTML;
                      button.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i> Copied!';
                      setTimeout(() => {
                        button.innerHTML = originalText;
                      }, 2000);
                    }}
                    style={{
                      background: 'rgba(255,179,71,0.1)',
                      color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 8,
                      padding: '0.8rem 1.5rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '0.5rem' }} /> Copy Link
                  </button>

                  <button 
                    onClick={() => setIframeError(false)}
                    style={{
                      background: 'rgba(100,100,100,0.2)',
                      color: 'var(--color-secondary)',
                      border: '1px solid rgba(100,100,100,0.5)',
                      borderRadius: 8,
                      padding: '0.8rem 1.5rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faSync} style={{ marginRight: '0.5rem' }} /> Try Again
                  </button>
                </div>

                {modalData.date && (
                  <div style={{ 
                    marginTop: '2rem', 
                    color: 'var(--color-muted)', 
                    fontFamily: 'monospace', 
                    fontSize: '0.9rem' 
                  }}>
                    Published: {modalData.date}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Blog Magazine Layout
  const BlogMagazine = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Featured Post */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(40,40,40,0.85)', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '2rem 1.5rem' }}>
        <img src={blogPosts[featuredIdx].image} alt={blogPosts[featuredIdx].title} style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 10, marginRight: 24 }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'var(--color-primary)', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}>{blogPosts[featuredIdx].title}</h2>
          <p style={{ color: 'var(--color-secondary)', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: 12 }}>{blogPosts[featuredIdx].snippet}</p>
          <button onClick={() => openPost(blogPosts[featuredIdx].url, blogPosts[featuredIdx])} style={{ background: 'var(--color-primary)', color: '#181818', border: 'none', borderRadius: 8, padding: '0.7rem 1.3rem', fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem', cursor: 'pointer', outline: 'none' }}>Read Full Post</button>
        </div>
      </div>
      {/* Other Posts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {blogPosts.map((post, idx) => idx !== featuredIdx && (
          <div key={idx} style={{ width: 220, background: 'rgba(30,30,30,0.98)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s' }}
            onClick={() => setFeaturedIdx(idx)}
          >
            <img src={post.image} alt={post.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'monospace', fontSize: '1.05rem', textAlign: 'center', marginBottom: 6 }}>{post.title}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.95rem', fontFamily: 'monospace', textAlign: 'center' }}>{post.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Enhanced Progress Timeline Layout
  const EnhancedProgressTimeline = () => {
    // Determine which data source to use
    const hasFileReports = fileReports.length > 0;
    const reportsToShow = hasFileReports ? fileReports : [];
    
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '400px',
          color: 'var(--color-secondary)',
          fontFamily: 'monospace'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}><FontAwesomeIcon icon={faHourglass} /></div>
          <p>Loading your progress reports...</p>
        </div>
      );
    }

    if (viewMode === 'dashboard') {
      return <ProgressDashboard />;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '1.5rem 0' }}>
        {/* Quick Stats Bar */}
        {progressStats && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'rgba(40,40,40,0.8)',
              padding: '0.8rem 1.2rem',
              borderRadius: 10,
              border: '1px solid rgba(255,179,71,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faFire} style={{ marginRight: '0.5rem' }} /> {progressStats?.currentStreak || 0}
              </div>
              <div style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                Day Streak
              </div>
            </div>
            
            <div style={{
              background: 'rgba(40,40,40,0.8)',
              padding: '0.8rem 1.2rem',
              borderRadius: 10,
              border: '1px solid rgba(255,179,71,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '0.5rem' }} /> {progressStats?.averageProductivity || 0}/10
              </div>
              <div style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                Avg Score
              </div>
            </div>
            
            <div style={{
              background: 'rgba(40,40,40,0.8)',
              padding: '0.8rem 1.2rem',
              borderRadius: 10,
              border: '1px solid rgba(255,179,71,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTrophy} style={{ marginRight: '0.5rem' }} /> {progressStats?.totalAchievements || 0}
              </div>
              <div style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                Achievements
              </div>
            </div>

            <div style={{
              background: 'rgba(40,40,40,0.8)',
              padding: '0.8rem 1.2rem',
              borderRadius: 10,
              border: '1px solid rgba(255,179,71,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5rem' }} /> {progressStats?.totalDays || 0}
              </div>
              <div style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                Total Days
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Timeline */}
        <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 32, position: 'relative', width: '100%', maxWidth: 700 }}>
          {reportsToShow.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--color-muted)', 
              fontFamily: 'monospace',
              padding: '3rem 1rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}><FontAwesomeIcon icon={faEdit} /></div>
              <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Start Your Progress Journey!</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Create your first daily report to track your learning progress.
              </p>
              <div style={{ 
                background: 'rgba(40,40,40,0.8)', 
                padding: '1.5rem', 
                borderRadius: 12,
                border: '1px solid rgba(255,179,71,0.2)',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Quick Start:</h4>
                <div style={{ textAlign: 'left', color: 'var(--color-secondary)' }}>
                  <p><strong>Terminal:</strong> <code>npm run quick-report</code></p>
                  <p><strong>VS Code:</strong> Ctrl+Shift+P → "Tasks: Run Task" → "<FontAwesomeIcon icon={faLightbulb} style={{ marginRight: '0.5rem' }} /> Quick Progress Report"</p>
                </div>
              </div>
            </div>
          ) : (
            reportsToShow.map((report) => (
              <div key={`${report.day}-${report.date}`} style={{ position: 'relative', marginBottom: 40 }}>
                {/* Timeline Marker */}
                <div style={{ 
                  position: 'absolute', 
                  left: -43, 
                  top: 0, 
                  width: 28, 
                  height: 28, 
                  background: getMoodColorFromText(report.mood || 'good'),
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 14,
                  border: '3px solid #181818',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  {getMoodEmojiFromText(report.mood || 'good')}
                </div>

                {/* Report Card */}
                <div style={{ 
                  background: 'rgba(40,40,40,0.92)', 
                  borderRadius: 12, 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)', 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: `4px solid ${getMoodColorFromText(report.mood || 'good')}`,
                  border: '1px solid rgba(255,179,71,0.1)'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onClick={() => {
                    // Toggle expanded view
                    setExpandedReport(expandedReport === `${report.day}-${report.date}` ? null : `${report.day}-${report.date}`);
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ 
                        color: 'var(--color-primary)', 
                        fontFamily: 'monospace', 
                        fontWeight: 700, 
                        fontSize: '1.2rem', 
                        marginBottom: '0.5rem',
                        margin: 0
                      }}>
                        {report.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-secondary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                        {report.productivityScore && (
                          <span style={{ 
                            background: 'rgba(255,179,71,0.2)', 
                            color: 'var(--color-primary)', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: 6, 
                            fontSize: '0.8rem',
                            fontFamily: 'monospace'
                          }}>
                            {report.productivityScore}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {report.achievements && report.achievements.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '0.5rem' }} /> Key Achievements
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {report.achievements.slice(0, 3).map((achievement, i) => (
                          <li key={i} style={{ 
                            color: 'var(--color-secondary)', 
                            fontFamily: 'monospace', 
                            fontSize: '0.9rem', 
                            marginBottom: '0.3rem' 
                          }}>
                            {achievement}
                          </li>
                        ))}
                        {report.achievements.length > 3 && (
                          <li style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                            +{report.achievements.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {report.tags && report.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {report.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} style={{
                          background: 'rgba(255,179,71,0.1)',
                          color: 'var(--color-primary)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 6,
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          border: '1px solid rgba(255,179,71,0.2)'
                        }}>
                          {tag}
                        </span>
                      ))}
                      {report.tags.length > 5 && (
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>
                          +{report.tags.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expand Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedReport(expandedReport === `${report.day}-${report.date}` ? null : `${report.day}-${report.date}`);
                      }}
                      style={{
                        background: 'rgba(255,179,71,0.2)',
                        color: '#ffb347',
                        border: '1px solid rgba(255,179,71,0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,179,71,0.3)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,179,71,0.2)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,179,71,0.5)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {expandedReport === `${report.day}-${report.date}` ? (
                        <><FontAwesomeIcon icon={faBook} style={{ marginRight: '0.5rem' }} /> Hide Details</>
                      ) : (
                        <><FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '0.5rem' }} /> Read Full Report</>
                      )}
                    </button>
                    
                    {report.filePath && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(report.filePath);
                          // You could add a toast notification here
                        }}
                        style={{
                          background: 'transparent',
                          color: '#888',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          outline: 'none'
                        }}
                        title="Copy file path"
                      >
                        <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '0.5rem' }} /> Copy Path
                      </button>
                    )}
                  </div>

                  {/* Expanded Content with MarkdownRenderer */}
                  {expandedReport === `${report.day}-${report.date}` && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,179,71,0.2)', paddingTop: '1.5rem' }}>
                      <MarkdownRenderer 
                        content={report.content} 
                        style={{ 
                          background: 'rgba(20,20,20,0.9)',
                          border: '1px solid rgba(255,179,71,0.3)',
                          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {reportsToShow.length >= 20 && (
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const moreReports = await progressReader.getRecentReports(fileReports.length + 10);
                setFileReports(moreReports);
              } catch (error) {
                console.error('Failed to load more reports:', error);
              }
              setLoading(false);
            }}
            style={{
              background: 'var(--color-primary)',
              color: '#181818',
              border: 'none',
              borderRadius: 8,
              padding: '0.8rem 1.5rem',
              fontFamily: 'monospace',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '2rem'
            }}
          >
            📖 Load More Reports
          </button>
        )}
      </div>
    );
  };

  // Research Bookshelf Layout
  const ResearchBookshelf = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.2rem', justifyContent: 'center', width: '100%', padding: '2rem 0' }}>
      {researchPublications.map((pub, idx) => (
        <div key={idx} style={{ width: 150, height: 220, background: 'linear-gradient(135deg, var(--color-primary) 60%, var(--color-secondary) 100%)', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer', position: 'relative', transition: 'transform 0.18s', overflow: 'hidden' }}
          onClick={() => openPost(pub.url, pub)}
        >
          <img src={pub.image} alt={pub.title} style={{ width: '100%', height: 110, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
          <div style={{ padding: '0.7rem 0.6rem 0.5rem 0.6rem', width: '100%', background: 'rgba(30,30,30,0.98)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.05rem', textAlign: 'center', marginBottom: 4 }}>{pub.title}</div>
            <div style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', fontFamily: 'monospace', textAlign: 'center' }}>{pub.author} ({pub.year})</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-gradient)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 0' }}>
      <div style={{ width: '95%', maxWidth: 1100, minHeight: 500, background: 'rgba(30,30,30,0.98)', borderRadius: 16, boxShadow: '0 2px 24px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '2rem 2rem' }}>
        {/* Tabs */}
        <nav style={{ display: 'flex', borderBottom: '1px solid var(--color-divider)', marginBottom: '2rem', background: 'rgba(24,24,24,0.98)' }}>
          <Link to="/" style={{ padding: '1rem 1.5rem', color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem', textDecoration: 'none', borderRight: '1px solid var(--color-divider)' }}>
            ← Portfolio
          </Link>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              style={{
                flex: 1,
                padding: '1rem 0.5rem',
                background: selectedTab === tab.key ? 'var(--color-bg-gradient)' : 'none',
                border: 'none',
                borderBottom: selectedTab === tab.key ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: selectedTab === tab.key ? 'var(--color-primary)' : 'var(--color-secondary)',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        
        {/* Enhanced View Mode Toggle for Progress Tab */}
        {selectedTab === 'progress' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '2rem',
            padding: '0 1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              background: 'rgba(24,24,24,0.95)',
              padding: '0.5rem',
              borderRadius: 16,
              border: '2px solid rgba(255,179,71,0.4)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)'
            }}>
              {/* Animated Background Slider */}
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                left: viewMode === 'timeline' ? '0.5rem' : 'calc(50% + 0.25rem)',
                width: 'calc(50% - 0.5rem)',
                height: 'calc(100% - 1rem)',
                background: 'linear-gradient(135deg, #ffb347 0%, #ff8c00 50%, #ffb347 100%)',
                borderRadius: '12px',
                transition: 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 1,
                boxShadow: '0 2px 8px rgba(255,179,71,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              }} />
              
              {/* Highlight Effect */}
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                left: viewMode === 'timeline' ? '0.5rem' : 'calc(50% + 0.25rem)',
                width: 'calc(50% - 0.5rem)',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                borderRadius: '12px 12px 0 0',
                transition: 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 2
              }} />
              
              {['timeline', 'dashboard'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  style={{
                    background: 'transparent',
                    color: viewMode === mode ? '#181818' : '#ffffff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '1rem 2.5rem',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    fontWeight: viewMode === mode ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    position: 'relative',
                    zIndex: 3,
                    minWidth: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    transform: viewMode === mode ? 'translateY(-1px)' : 'translateY(0)',
                    textShadow: viewMode === mode ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.6)',
                    letterSpacing: '0.5px',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== mode) {
                      e.currentTarget.style.color = '#ffb347';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== mode) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,179,71,0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ 
                    fontSize: '1.3rem',
                    filter: viewMode === mode ? 'none' : 'grayscale(0.3)'
                  }}>
                    {mode === 'timeline' ? <FontAwesomeIcon icon={faCalendarDays} /> : <FontAwesomeIcon icon={faChartLine} />}
                  </span>
                  <span>
                    {mode === 'timeline' ? 'Timeline' : 'Dashboard'}
                  </span>
                </button>
              ))}
              
              {/* Subtle Border Glow */}
              <div style={{
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                right: '-1px',
                bottom: '-1px',
                background: 'linear-gradient(45deg, rgba(255,179,71,0.3), rgba(255,140,0,0.2), rgba(255,179,71,0.3))',
                borderRadius: 16,
                zIndex: 0,
                opacity: 0.6
              }} />
            </div>
          </div>
        )}
        
        {/* Section Content */}
        <div style={{ width: '100%', minHeight: 400 }}>
          {selectedTab === 'blog' && <BlogMagazine />}
          {selectedTab === 'progress' && <EnhancedProgressTimeline />}
          {selectedTab === 'research' && <ResearchBookshelf />}
        </div>
      </div>
      <EnhancedModal />
    </div>
  );
};

export default WritingRecords; 