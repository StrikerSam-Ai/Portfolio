import React, { useState, useEffect, useRef } from 'react';
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

const AboutSection: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(getStoredSkills());
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<number[]>(skills.map((s: Skill) => s.value));
  const [editLabels, setEditLabels] = useState<string[]>(skills.map((s: Skill) => s.label));
  const chartRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  // Heartbeat wave animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const chart = chartRef.current;
      console.log('Chart ref:', chart);
      
      // Backup method: Find canvas by DOM selector
      const chartContainer = document.querySelector('.skills-spider-chart');
      const canvasElement = chartContainer?.querySelector('canvas');
      
      console.log('Backup method:', { chartContainer, canvasElement });
      
      // Try different ways to access the chart instance
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
        // Use DOM-found canvas as fallback
        canvas = canvasElement;
        console.log('Using DOM-found canvas');
      }
      
      console.log('Final canvas:', canvas);
      
      if (canvas) {
        const parentContainer = canvas.parentElement;
        
        console.log('Canvas found:', { canvas, parentContainer });
        
        if (!parentContainer) {
          console.log('No parent container found');
          return;
        }
        
        // Get the actual chart center and radius
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let maxRadius = Math.min(canvas.width, canvas.height) / 2 - 50;
        
        // Try to get exact chart dimensions from Chart.js instance
        if (chartInstance && chartInstance.scales && chartInstance.scales.r) {
          const scale = chartInstance.scales.r;
          centerX = scale.xCenter;
          centerY = scale.yCenter;
          maxRadius = scale.drawingArea - 15; // Subtract 15px to stay comfortably within chart boundary
          console.log('Using Chart.js scale:', { centerX, centerY, maxRadius });
        } else {
          // Fallback: calculate based on typical radar chart layout
          const padding = 90; // Increased padding to account for labels and ensure we stay within bounds
          centerX = canvas.width / 2;
          centerY = canvas.height / 2;
          maxRadius = Math.min(canvas.width, canvas.height) / 2 - padding;
          console.log('Using fallback dimensions:', { centerX, centerY, maxRadius });
        }
        
        // Create overlay canvas for heartbeat waves
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.zIndex = '9999';
        
        parentContainer.appendChild(overlayCanvas);
        console.log('Overlay canvas created and appended');
        
        const ctx = overlayCanvas.getContext('2d');
        if (!ctx) {
          console.log('Failed to get canvas context');
          return;
        }
        
        let waveRadius = 0;
        let animationId: number;
        
        // Helper function to draw polygon wave matching radar chart shape
        const drawPolygonWave = (radius: number, opacity: number, lineWidth: number) => {
          const numPoints = editLabels.length; // Match number of chart data points
          const angleStep = (2 * Math.PI) / numPoints;
          const startAngle = -Math.PI / 2; // Start from top like radar chart
          
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#33876a';
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          
          // Draw polygon by connecting points around the circle
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
          // Clear canvas
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          
          // Draw heartbeat waves with polygon shape matching radar chart
          if (waveRadius > 0 && waveRadius <= maxRadius) {
            // Main wave - bright and bold
            const mainOpacity = Math.max(0.1, 0.9 * (1 - waveRadius / maxRadius));
            drawPolygonWave(waveRadius, mainOpacity, 4);
            
            // Fade trail 1 - slightly behind and fainter
            if (waveRadius > 15) {
              const trail1Radius = waveRadius - 15;
              if (trail1Radius <= maxRadius) {
                const trail1Opacity = Math.max(0.05, 0.6 * (1 - trail1Radius / maxRadius));
                drawPolygonWave(trail1Radius, trail1Opacity, 3);
              }
            }
            
            // Fade trail 2 - further behind and even fainter
            if (waveRadius > 30) {
              const trail2Radius = waveRadius - 30;
              if (trail2Radius <= maxRadius) {
                const trail2Opacity = Math.max(0.02, 0.3 * (1 - trail2Radius / maxRadius));
                drawPolygonWave(trail2Radius, trail2Opacity, 2);
              }
            }
            
            // Fade trail 3 - most behind and very faint
            if (waveRadius > 45) {
              const trail3Radius = waveRadius - 45;
              if (trail3Radius <= maxRadius) {
                const trail3Opacity = Math.max(0.01, 0.15 * (1 - trail3Radius / maxRadius));
                drawPolygonWave(trail3Radius, trail3Opacity, 1);
              }
            }
          }
          
          waveRadius += 2.5; // Smooth wave expansion
          
          // Reset wave when it reaches the chart boundary
          if (waveRadius > maxRadius + 10) {
            waveRadius = 0;
            // Pause between heartbeats for realistic rhythm
            setTimeout(() => {
              animationId = requestAnimationFrame(animate);
            }, 1000); // 1 second pause between heartbeats
          } else {
            animationId = requestAnimationFrame(animate);
          }
        };
        
        // Start animation
        console.log('Starting heartbeat animation');
        animate();
        
        return () => {
          console.log('Cleanup heartbeat animation');
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          if (overlayCanvas && parentContainer.contains(overlayCanvas)) {
            parentContainer.removeChild(overlayCanvas);
          }
        };
      } else {
        console.log('No canvas found at all!');
      }
    }, 3000); // Increased delay to 3 seconds
    
    return () => clearTimeout(timer);
  }, [skills]);

  // Gradient fill for radar
  const getGradient = (ctx: { chart: Chart<'radar'> & { ctx: CanvasRenderingContext2D; chartArea?: ChartArea } }) => {
    const chart = ctx.chart;
    const { ctx: c, chartArea } = chart;
    if (!chartArea) return '#33876a';
    const gradient = c.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(51,135,106,0.7)');
    gradient.addColorStop(1, 'rgba(159,188,198,0.25)');
    return gradient;
  };

  const data = {
    labels: editLabels,
    datasets: [
      {
        label: 'Skill Level',
        data: editValues,
        backgroundColor: (ctx: any) => getGradient(ctx),
        borderColor: '#33876a',
        pointBackgroundColor: '#33876a',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#33876a',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        titleColor: '#fff',
        bodyColor: '#E3EEF3',
        borderColor: '#33876a',
        borderWidth: 1,
        padding: 12,
        caretSize: 7,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        angleLines: { color: '#9FBCC6' },
        grid: { color: 'rgba(159,188,198,0.25)' },
        pointLabels: {
          color: '#E3EEF3',
          font: { size: 15, family: 'Inter, sans-serif', weight: 'bold' as const },
          padding: 32,
          display: true,
        },
        clip: false,
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          color: '#B0C4CE',
          stepSize: 20,
          backdropColor: 'transparent',
          font: { size: 13 },
        },
      },
    },
  };

  // Admin edit mode: double-click chart area
  const handleChartDoubleClick = () => setEditMode((v) => !v);
  const handleInputChange = (i: number, val: string) => {
    const newVals = [...editValues];
    newVals[i] = Math.max(0, Math.min(100, Number(val)));
    setEditValues(newVals);
  };
  const handleLabelChange = (i: number, val: string) => {
    const newLabels = [...editLabels];
    newLabels[i] = val;
    setEditLabels(newLabels);
  };
  const handleSave = () => {
    setSkills(editLabels.map((label: string, i: number) => ({ label, value: editValues[i] })));
    setEditMode(false);
  };
  const handleReset = () => {
    setEditLabels(defaultSkills.map((s: Skill) => s.label));
    setEditValues(defaultSkills.map((s: Skill) => s.value));
    setSkills(defaultSkills);
    setEditMode(false);
  };

  return (
    <section className="about-section" id="about">
      <h2 className="about-title">About Me</h2>
      <div className="about-content">
        {/* Replace with: <img src="..." alt="Your professional photo" className="about-photo" /> */}
        <div className="about-bio">
          <p>[Your professional biography goes here. Briefly introduce yourself, your background, and your passion for AI engineering.]</p>
        </div>
        <div className="about-skills">
          <h3>Skills Overview</h3>
          <div
            className="skills-spider-chart"
            style={{
              background: 'rgba(47,71,79,0.18)',
              borderRadius: '1.5rem',
              marginTop: '1rem',
              position: 'relative',
              minHeight: 420,
              boxShadow: '0 8px 32px 0 rgba(47,71,79,0.18)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255,255,255,0.10)',
              padding: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            onDoubleClick={handleChartDoubleClick}
            title="Double-click to edit (admin only)"
          >
            {/* Wrapper for chart */}
            <div style={{ position: 'relative', width: '100%', height: 420 }}>
              <Radar
                ref={chartRef}
                data={data}
                options={options}
                width={520}
                height={420}
                style={{ zIndex: 1, position: 'relative' }}
              />
            </div>
              {editMode && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(47,71,79,0.96)',
                  borderRadius: '1.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10000,
                  padding: 24,
                }}>
                  <h4 style={{ color: '#fff', marginBottom: 12 }}>Edit Skills</h4>
                  {editLabels.map((label: string, i: number) => (
                    <div key={i} style={{ marginBottom: 8, color: '#E3EEF3', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={label}
                        onChange={e => handleLabelChange(i, e.target.value)}
                        style={{ width: 110, borderRadius: 6, border: '1px solid #9FBCC6', padding: 4, fontSize: 14, marginRight: 8 }}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={editValues[i]}
                        onChange={e => handleInputChange(i, e.target.value)}
                        style={{ width: 60, borderRadius: 6, border: '1px solid #9FBCC6', padding: 4, fontSize: 14 }}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button onClick={handleSave} style={{ background: '#33876a', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={handleReset} style={{ background: '#9FBCC6', color: '#1A2238', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
                  </div>
                </div>
              )}
          </div>
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