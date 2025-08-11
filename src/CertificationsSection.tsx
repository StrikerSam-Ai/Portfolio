import React, { useState } from 'react';
import PdfThumbnail from './components/PdfThumbnail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faTimes, faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  thumbnail: string;
  pdfUrl: string;
  category: string;
  description: string;
}

const certifications: Certification[] = [
  {
    id: 1,
    title: '16th ICCCNT Research Conference at IIT Indore',
    issuer: 'ICCCNT',
    date: 'Jul 2025',
    thumbnail: '/certificates/icccnt-2025-thumb.svg',
    pdfUrl: '/certificates/icccnt-2025.pdf',
    category: 'Research',
    description: 'Accepted research presentation at the 16th International Conference on Computing, Communication and Networking Technologies.'
  },
  {
    id: 2,
    title: 'Machine Learning with ChatGPT: Image Classification Model',
    issuer: 'Coursera Project Network',
    date: 'Jun 2025',
    thumbnail: '/certificates/ml-chatgpt-image-classification-thumb.svg',
    pdfUrl: '/certificates/ml-chatgpt-image-classification.pdf',
    category: 'Machine Learning',
    description: 'Hands-on guided project to build an image classification model with ChatGPT assistance. Credential ID: 1DLDMX2Q0QH2.'
  }
];

const CertificationsSection: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const openPdf = (certification: Certification) => {
    setSelectedCert(certification);
    setIsPdfOpen(true);
  };

  const closePdf = () => {
    setIsPdfOpen(false);
    setSelectedCert(null);
  };

  const downloadPdf = (pdfUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  return (
    <section className="certifications-section" id="certifications">
      <h2 className="certifications-title">
        Professional Certifications
      </h2>
      
      <div className="certifications-content">
        <div className="certifications-intro">
          <p>
            Continuous learning is at the heart of my professional journey. Here are the certifications 
            I've earned to validate my skills and knowledge in various domains.
          </p>
        </div>

        <div className="certifications-grid">
          {certifications.map((certification) => (
            <div 
              className="certification-card" 
              key={certification.id}
              onClick={() => openPdf(certification)}
            >
              <div className="certification-thumbnail">
                <PdfThumbnail
                  pdfUrl={certification.pdfUrl}
                  alt={certification.title}
                  className="certification-image"
                />
                <div className="certification-overlay">
                  <FontAwesomeIcon icon={faCertificate} className="overlay-icon" />
                  <span>Click to View</span>
                </div>
              </div>
              
              <div className="certification-info">
                <h3 className="certification-title">{certification.title}</h3>
                <p className="certification-issuer">{certification.issuer}</p>
                <p className="certification-date">{certification.date}</p>
                <span className="certification-category">{certification.category}</span>
                <p className="certification-description">{certification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Modal */}
      {isPdfOpen && selectedCert && (
        <div className="pdf-modal-overlay" onClick={closePdf}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>{selectedCert.title}</h3>
              <div className="pdf-modal-actions">
                <button 
                  className="pdf-action-btn download-btn"
                  onClick={() => downloadPdf(selectedCert.pdfUrl, selectedCert.title)}
                  title="Download PDF"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button 
                  className="pdf-action-btn external-btn"
                  onClick={() => window.open(selectedCert.pdfUrl, '_blank')}
                  title="Open in New Tab"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </button>
                <button 
                  className="pdf-action-btn close-btn"
                  onClick={closePdf}
                  title="Close"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            
            <div className="pdf-modal-content">
              <iframe
                src={`${selectedCert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={selectedCert.title}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificationsSection; 