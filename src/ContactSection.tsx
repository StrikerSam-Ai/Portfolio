import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faCheckCircle, faExclamationCircle, faEnvelope, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // helper to URL-encode form data
  const encode = (data: Record<string, string>) =>
    Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // POST form data to Netlify without redirect
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...formData })
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      // Clear status after delay
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = formData.name.trim() && isValidEmail(formData.email) && formData.message.trim();

  return (
    <section className="contact-section" id="contact">
      <h2 className="contact-title">Get In Touch</h2>
      <div className="contact-content">
        <form name="contact" method="POST" data-netlify="true" className="contact-form" onSubmit={handleSubmit}>
          {/* Netlify form handling */}
          <input type="hidden" name="form-name" value="contact" />
          <h3>Send me a message</h3>
          <input 
            type="text" 
            name="name"
            placeholder="Your Name" 
            className="contact-input" 
            aria-label="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input 
            type="email" 
            name="email"
            placeholder="Your Email" 
            className="contact-input" 
            aria-label="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea 
            name="message"
            placeholder="Your Message" 
            className="contact-input" 
            rows={5} 
            aria-label="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          
          {submitStatus === 'success' && (
            <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '0.5rem' }} /> Thank you! Your message has been sent successfully.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '0.5rem' }} /> Something went wrong. Please try again.
            </div>
          )}
          
          <button 
            type="submit" 
            className="contact-submit btn-grad" 
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        
        <div className="contact-info contact-card">
          <h3>Let's Connect</h3>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
              <div>
                <strong>Email:</strong>
                <a href="mailto:shashwatmishra0369@gmail.com" className="contact-link">
                  shashwatmishra0369@gmail.com
                </a>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
              <div>
                <strong>Location:</strong>
                <span>Remote / Worldwide</span>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon"><FontAwesomeIcon icon={faClock} /></span>
              <div>
                <strong>Availability:</strong>
                <span>Open to new opportunities</span>
              </div>
            </div>
          </div>
          
          <div className="contact-socials">
            <h4>Follow me on:</h4>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/sam140706/" className="contact-link social-link" target="_blank" rel="noopener noreferrer">
                <span className="social-icon"><FontAwesomeIcon icon={faLinkedin} /></span> LinkedIn
              </a>
              <a href="https://github.com/StrikerSam-Ai" className="contact-link social-link" target="_blank" rel="noopener noreferrer">
                <span className="social-icon"><FontAwesomeIcon icon={faGithub} /></span> GitHub
              </a>
              <a href="https://x.com/SHASHWATMI67916" className="contact-link social-link" target="_blank" rel="noopener noreferrer">
                <span className="social-icon"><FontAwesomeIcon icon={faXTwitter} /></span> Twitter
              </a>
              <a href="https://medium.com/@shashwatmishra0369" className="contact-link social-link" target="_blank" rel="noopener noreferrer">
                <span className="social-icon"><FontAwesomeIcon icon={faMedium} /></span> Medium
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;