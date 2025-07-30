// components/MarkdownRenderer.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrosshairs, 
  faCheckCircle, 
  faLightbulb, 
  faEdit, 
  faExclamationTriangle,
  faTag
} from '@fortawesome/free-solid-svg-icons';

interface MarkdownRendererProps {
  content: string;
  style?: React.CSSProperties;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, style }) => {
  const renderMarkdown = (text: string) => {
    // Split content into lines for processing
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentSection = '';
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={index} style={{ 
            color: '#ffb347', 
            fontSize: '2rem', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            {trimmed.substring(2)}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        const headerText = trimmed.substring(3);
        currentSection = headerText;
        elements.push(
          <h2 key={index} style={{ 
            color: '#ffffff', 
            fontSize: '1.4rem', 
            marginTop: '2rem',
            marginBottom: '1rem',
            borderBottom: '2px solid rgba(255,179,71,0.3)',
            paddingBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {getHeaderIcon(headerText)}
            {headerText}
          </h2>
        );
      } 
      // Bold text
      else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        elements.push(
          <p key={index} style={{ 
            color: '#ffb347', 
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            fontSize: '1.1rem'
          }}>
            {trimmed.replace(/\*\*/g, '')}
          </p>
        );
      }
      // List items
      else if (trimmed.startsWith('- ')) {
        const listContent = trimmed.substring(2);
        elements.push(
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.8rem',
            marginBottom: '0.8rem',
            backgroundColor: getSectionColor(currentSection),
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: `1px solid ${getSectionBorderColor(currentSection)}`
          }}>
            <span style={{ 
              color: getSectionAccentColor(currentSection),
              fontSize: '1.2rem',
              marginTop: '0.1rem'
            }}>
              {getSectionIcon(currentSection)}
            </span>
            <span style={{ 
              color: '#ffffff',
              lineHeight: '1.4',
              fontSize: '1rem'
            }}>
              {listContent}
            </span>
          </div>
        );
      }
      // Tags
      else if (trimmed.startsWith('**Tags:**')) {
        const tagsText = trimmed.replace('**Tags:**', '').trim();
        const tags = tagsText.match(/`[^`]+`/g) || [];
        elements.push(
          <div key={index} style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              color: '#ffb347', 
              fontSize: '1.2rem', 
              marginBottom: '1rem' 
            }}>
              <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.5rem' }} /> Tags
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tags.map((tag, tagIndex) => (
                <span key={tagIndex} style={{
                  background: 'linear-gradient(135deg, rgba(255,179,71,0.2), rgba(255,140,0,0.2))',
                  color: '#ffb347',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,179,71,0.3)',
                  fontFamily: 'monospace'
                }}>
                  {tag.replace(/`/g, '')}
                </span>
              ))}
            </div>
          </div>
        );
      }
      // Regular paragraphs
      else if (trimmed && !trimmed.startsWith('**Date:**')) {
        elements.push(
          <p key={index} style={{ 
            color: '#cccccc', 
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            {trimmed}
          </p>
        );
      }
    });
    
    return elements;
  };

  const getHeaderIcon = (header: string): React.ReactNode => {
    if (header.includes('Done')) return <FontAwesomeIcon icon={faCheckCircle} />;
    if (header.includes('Challenges')) return <FontAwesomeIcon icon={faExclamationTriangle} />;
    if (header.includes('Learned')) return <FontAwesomeIcon icon={faLightbulb} />;
    if (header.includes('Tomorrow')) return <FontAwesomeIcon icon={faCrosshairs} />;
    return <FontAwesomeIcon icon={faEdit} />;
  };

  const getSectionIcon = (section: string): React.ReactNode => {
    if (section.includes('Done')) return <FontAwesomeIcon icon={faCheckCircle} />;
    if (section.includes('Challenges')) return <FontAwesomeIcon icon={faExclamationTriangle} />;
    if (section.includes('Learned')) return <FontAwesomeIcon icon={faLightbulb} />;
    if (section.includes('Tomorrow')) return <FontAwesomeIcon icon={faCrosshairs} />;
    return '•';
  };

  const getSectionColor = (section: string) => {
    if (section.includes('Done')) return 'rgba(0,255,136,0.1)';
    if (section.includes('Challenges')) return 'rgba(255,107,107,0.1)';
    if (section.includes('Learned')) return 'rgba(255,215,0,0.1)';
    if (section.includes('Tomorrow')) return 'rgba(138,43,226,0.1)';
    return 'rgba(255,255,255,0.05)';
  };

  const getSectionBorderColor = (section: string) => {
    if (section.includes('Done')) return 'rgba(0,255,136,0.3)';
    if (section.includes('Challenges')) return 'rgba(255,107,107,0.3)';
    if (section.includes('Learned')) return 'rgba(255,215,0,0.3)';
    if (section.includes('Tomorrow')) return 'rgba(138,43,226,0.3)';
    return 'rgba(255,255,255,0.1)';
  };

  const getSectionAccentColor = (section: string) => {
    if (section.includes('Done')) return '#00ff88';
    if (section.includes('Challenges')) return '#ff6b6b';
    if (section.includes('Learned')) return '#ffd700';
    if (section.includes('Tomorrow')) return '#8a2be2';
    return '#ffffff';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30,30,30,0.9), rgba(40,40,40,0.9))',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(255,179,71,0.2)',
      maxWidth: '100%',
      lineHeight: '1.6',
      ...style
    }}>
      {renderMarkdown(content)}
    </div>
  );
};
