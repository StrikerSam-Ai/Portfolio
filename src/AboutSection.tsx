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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  // Draw a static blue polygon at half the chart's radius for debug
  useEffect(() => {
    // Find the radar chart's bounding rect for absolute positioning
    const chart = chartRef.current && chartRef.current.chartInstance ? chartRef.current.chartInstance : chartRef.current?.ctx?.chart;
    const canvas = canvasRef.current;
    let rect = { left: 0, top: 0, width: 0, height: 0 };
    if (chart && chart.canvas) {
      rect = chart.canvas.getBoundingClientRect();
    } else if (canvas && canvas.parentElement) {
      rect = canvas.parentElement.getBoundingClientRect();
    }
    if (canvas) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.position = 'fixed';
      canvas.style.left = rect.left + 'px';
      canvas.style.top = rect.top + 'px';
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      canvas.style.zIndex = '99999';
      canvas.style.pointerEvents = 'auto';
      canvas.style.opacity = '1';
      console.log('Fixed canvas at', rect);
    }
    if (chart && canvas && chart.scales && chart.scales.r) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw fully opaque green rectangle
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'lime';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      // Draw thick yellow border
      ctx.save();
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 8;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      // Draw a small blue circle at the calculated center
      const scale = chart.scales.r;
      const centerX = scale.xCenter;
      const centerY = scale.yCenter;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#4FC3F7';
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.restore();
      // Draw visible text label
      ctx.save();
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = 'black';
      ctx.fillText('CANVAS VISIBLE', 32, 48);
      ctx.restore();
      console.log('Canvas debug:', { canvasW: canvas.width, canvasH: canvas.height, centerX, centerY });
    }
  }, [editLabels.length]);

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
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 900,
      easing: 'easeOutQuart' as const,
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
            {/* Wrapper for stacking context */}
            <div style={{ position: 'relative', width: '100%', height: 420 }}>
              <Radar
                ref={chartRef}
                data={data}
                options={options}
                width={520}
                height={420}
                style={{ zIndex: 1, position: 'relative' }}
              />
              {/* Overlay canvas absolutely positioned at root for debug */}
              <canvas ref={canvasRef} />
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