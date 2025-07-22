import React, { useState } from 'react';
import './App.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const blogPosts = [
  { title: "A World without lies", url: "https://medium.com/@shashwatmishra0369/the-world-without-lies-8b241f55b55b", snippet: "Ever thought? How would a world without lies look like ?", image: "https://miro.medium.com/v2/resize:fit:4800/format:webp/0*S_vQvDibV2e3Lc-5" },
  { title: "Pushovers Finish Last — Learn to Say No", url: "https://medium.com/@shashwat-mishra/pushovers-finish-last-learn-to-say-no", snippet: "Why saying no is a superpower for your career and life.", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example2.png" },
  { title: "The Thought Process Behind My Learning Plan", url: "https://medium.com/@shashwat-mishra/the-thought-process-behind-my-learning-plan", snippet: "How I structure my learning for maximum growth.", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example3.png" },
  { title: "Math For Machine Learning [Resources]", url: "https://medium.com/@shashwat-mishra/math-for-machine-learning-resources", snippet: "Essential math resources for aspiring ML engineers.", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example4.png" },
  { title: "You Are NOT Dumb, You Just Lack the Prerequisites", url: "https://medium.com/@shashwat-mishra/you-are-not-dumb-you-just-lack-the-prerequisites", snippet: "Why background knowledge matters more than you think.", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example5.png" },
  { title: "Why I Started Documenting My Grind—and Why You Might Consider It Too", url: "https://medium.com/@shashwat-mishra/why-i-started-documenting-my-grind-and-why-you-might-consider-it-too", snippet: "The power of public learning and sharing your journey.", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example6.png" },
  { title: "From Marketing to Code: Why I Made the Switch", url: "https://medium.com/@shashwat-mishra/from-marketing-to-code-why-i-made-the-switch", snippet: "My journey from marketing to software engineering.", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*example7.png" },
];

const progressReports = [
  { title: "Progress Report: Day 196-197", url: "https://medium.com/@shashwat-mishra/progress-report-day-196-197", date: "Sep 23, 2024", snippet: "Highlights and learnings from days 196-197." },
  { title: "Progress Report: Day 194-195", url: "https://medium.com/@shashwat-mishra/progress-report-day-194-195", date: "Sep 21, 2024", snippet: "Milestones and challenges for days 194-195." },
  { title: "Progress Report: Day 173-193", url: "https://medium.com/@shashwat-mishra/progress-report-day-173-193", date: "Sep 19, 2024", snippet: "A summary of two weeks of progress." },
  { title: "Progress Report: Day 198-199", url: "https://medium.com/@shashwat-mishra/progress-report-day-198-199", date: "Sep 19, 2024", snippet: "Wrapping up the 199th day with key takeaways." },
  { title: "Progress Report: Day 162-172", url: "https://medium.com/@shashwat-mishra/progress-report-day-162-172", date: "Aug 28, 2024", snippet: "A look back at days 162-172." },
  { title: "Progress Report: Day 146-161", url: "https://medium.com/@shashwat-mishra/progress-report-day-146-161", date: "Aug 17, 2024", snippet: "Major breakthroughs and lessons learned." },
  { title: "Progress Report: Day 140-145", url: "https://medium.com/@shashwat-mishra/progress-report-day-140-145", date: "Aug 10, 2024", snippet: "Short-term goals and results." },
];

const researchPublications = [
  { title: "Research Paper 1", url: "https://medium.com/@shashwat-mishra/research-paper-1", author: "S. Mishra", year: "2024", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*research1.png" },
  { title: "Research Paper 2", url: "https://medium.com/@shashwat-mishra/research-paper-2", author: "S. Mishra", year: "2023", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*research2.png" },
  { title: "Research Paper 3", url: "https://medium.com/@shashwat-mishra/research-paper-3", author: "S. Mishra", year: "2022", image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*research3.png" },
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
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['blog', 'progress', 'research'].includes(tab) && tab !== selectedTab) {
      setSelectedTab(tab);
    }
  }, [location.search]);

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
                }}>📄</div>
                
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
                    <span>🚀</span> Open in New Tab
                  </button>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(modalUrl);
                      // Show copied feedback
                      const button = document.activeElement as HTMLButtonElement;
                      const originalText = button.innerHTML;
                      button.innerHTML = '✅ Copied!';
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
                    <span>📋</span> Copy Link
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
                    <span>🔄</span> Try Again
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
          <button onClick={() => openPost(blogPosts[featuredIdx].url, blogPosts[featuredIdx])} style={{ background: 'var(--color-primary)', color: '#181818', border: 'none', borderRadius: 8, padding: '0.7rem 1.3rem', fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem', cursor: 'pointer' }}>Read Full Post</button>
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

  // Progress Timeline Layout
  const ProgressTimeline = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '1.5rem 0' }}>
      <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: 32, position: 'relative', width: '100%', maxWidth: 600 }}>
        {progressReports.map((report, idx) => (
          <div key={idx} style={{ position: 'relative', marginBottom: 36 }}>
            <div style={{ position: 'absolute', left: -41, top: 0, width: 24, height: 24, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#181818', fontWeight: 700, fontSize: 14, border: '3px solid #181818' }}>{progressReports.length - idx}</div>
            <div style={{ background: 'rgba(40,40,40,0.92)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.1rem 1.3rem', cursor: 'pointer', transition: 'box-shadow 0.2s', borderLeft: '4px solid var(--color-secondary)' }}
              onClick={() => openPost(report.url, report)}
            >
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: 4 }}>{report.title}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '0.98rem', fontFamily: 'monospace', marginBottom: 2 }}>{report.date}</div>
              <div style={{ color: 'var(--color-secondary)', fontSize: '1rem', fontFamily: 'monospace' }}>{report.snippet}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
        {/* Section Content */}
        <div style={{ width: '100%', minHeight: 400 }}>
          {selectedTab === 'blog' && <BlogMagazine />}
          {selectedTab === 'progress' && <ProgressTimeline />}
          {selectedTab === 'research' && <ResearchBookshelf />}
        </div>
      </div>
      <EnhancedModal />
    </div>
  );
};

export default WritingRecords; 