// components/ActivityHeatmap.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faCrosshairs, 
  faFire, 
  faSmile, 
  faMeh, 
  faTired, 
  faArrowTrendUp,
  faChartBar,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';

interface ActivityHeatmapProps {
  data: Array<{
    date: string;
    score: number;
    achievements: number;
    mood: string;
  }>;
  onDateClick?: (date: string) => void;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data, onDateClick }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    score: number;
    achievements: number;
    mood: string;
    x: number;
    y: number;
  } | null>(null);

  // Generate 365 days from today backwards
  const generateYearData = () => {
    const result = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find data for this date or default to 0
      const dayData = data.find(d => d.date === dateStr) || {
        date: dateStr,
        score: 0,
        achievements: 0,
        mood: 'neutral'
      };
      
      result.push({
        ...dayData,
        dayOfWeek: date.getDay(),
        week: Math.floor(i / 7)
      });
    }
    
    return result;
  };

  const yearData = generateYearData();
  const weeks = Math.ceil(365 / 7);

  // Color intensity based on productivity score
  const getIntensityColor = (score: number) => {
    if (score === 0) return 'rgba(255,255,255,0.08)'; // Empty
    if (score <= 3) return 'rgba(255,179,71,0.2)';    // Level 1
    if (score <= 5) return 'rgba(255,179,71,0.4)';    // Level 2
    if (score <= 7) return 'rgba(255,179,71,0.6)';    // Level 3
    if (score <= 9) return 'rgba(255,179,71,0.8)';    // Level 4
    return 'rgba(255,179,71,1)';                       // Level 5 (max)
  };

  const getBorderColor = (score: number) => {
    if (score === 0) return 'rgba(255,255,255,0.1)';
    if (score >= 8) return 'rgba(255,215,0,0.8)'; // Gold border for high scores
    return 'rgba(255,179,71,0.4)';
  };

  const handleCellHover = (dayData: any, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredCell({
      ...dayData,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMoodEmoji = (mood: string): React.ReactNode => {
    if (mood.includes('😊') || mood.includes('😄')) return <FontAwesomeIcon icon={faSmile} />;
    if (mood.includes('😌') || mood.includes('👍')) return <FontAwesomeIcon icon={faSmile} />;
    if (mood.includes('😐') || mood.includes('🤔')) return <FontAwesomeIcon icon={faMeh} />;
    if (mood.includes('😓') || mood.includes('😰')) return <FontAwesomeIcon icon={faTired} />;
    return <FontAwesomeIcon icon={faMeh} />;
  };

  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30,30,30,0.9), rgba(40,40,40,0.9))',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(255,179,71,0.2)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          color: '#ffb347',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.5rem' }} /> 365-Day Activity Heatmap
        </h3>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#ffffff'
        }}>
          <span>Less</span>
          {[0, 3, 5, 7, 10].map((score, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: getIntensityColor(score),
                border: `1px solid ${getBorderColor(score)}`
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Month Labels */}
      <div style={{
        display: 'flex',
        marginBottom: '0.5rem',
        paddingLeft: '2rem'
      }}>
        {monthLabels.map((month, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${100/12}%`,
              fontSize: '0.7rem',
              color: '#888',
              fontFamily: 'monospace'
            }}
          >
            {month}
          </div>
        ))}
      </div>

      {/* Main Heatmap Grid */}
      <div style={{
        display: 'flex',
        gap: '2px'
      }}>
        {/* Day Labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          marginRight: '0.5rem'
        }}>
          {dayLabels.map((day, i) => (
            <div
              key={i}
              style={{
                height: '12px',
                fontSize: '0.7rem',
                color: '#888',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                minWidth: '24px'
              }}
            >
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>

        {/* Weeks Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks}, 12px)`,
          gap: '2px'
        }}>
          {yearData.map((dayData, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: getIntensityColor(dayData.score),
                border: `1px solid ${getBorderColor(dayData.score)}`,
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                gridColumn: Math.floor(index / 7) + 1,
                gridRow: (index % 7) + 1
              }}
              onMouseEnter={(e) => handleCellHover(dayData, e)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => onDateClick?.(dayData.date)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.zIndex = '10';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,179,71,0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = '1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          style={{
            position: 'fixed',
            left: hoveredCell.x,
            top: hoveredCell.y,
            transform: 'translateX(-50%) translateY(-100%)',
            background: 'rgba(24,24,24,0.95)',
            color: '#ffffff',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            border: '1px solid rgba(255,179,71,0.3)',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ fontWeight: 'bold', color: '#ffb347', marginBottom: '0.3rem' }}>
            {formatDate(hoveredCell.date)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div>
              <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '0.5rem' }} /> Score: <span style={{ color: '#ffb347' }}>{hoveredCell.score}/10</span>
            </div>
            <div>
              <FontAwesomeIcon icon={faTrophy} style={{ marginRight: '0.5rem' }} /> Achievements: <span style={{ color: '#00ff88' }}>{hoveredCell.achievements}</span>
            </div>
            <div>
              {getMoodEmoji(hoveredCell.mood)} Mood: <span style={{ color: '#ffd700' }}>{hoveredCell.mood || 'No data'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem'
      }}>
        {[
          { label: 'Active Days', value: data.filter(d => d.score > 0).length, icon: <FontAwesomeIcon icon={faFire} /> },
          { label: 'Best Streak', value: '7 days', icon: <FontAwesomeIcon icon={faFire} /> },
          { label: 'Avg Score', value: (data.reduce((acc, d) => acc + d.score, 0) / data.length || 0).toFixed(1), icon: <FontAwesomeIcon icon={faArrowTrendUp} /> },
          { label: 'Total Work', value: `${data.reduce((acc, d) => acc + d.achievements, 0)} items`, icon: <FontAwesomeIcon icon={faCrosshairs} /> }
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,179,71,0.1)',
              border: '1px solid rgba(255,179,71,0.2)',
              borderRadius: '8px',
              padding: '0.8rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffb347' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
