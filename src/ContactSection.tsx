import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="contact-section" id="contact">
      <h2 className="contact-title">Contact</h2>
      <div className="contact-content">
        <form className="contact-form">
          <h3>Send me a message</h3>
          <input type="text" placeholder="Your Name" className="contact-input" />
          <input type="email" placeholder="Your Email" className="contact-input" />
          <textarea placeholder="Your Message" className="contact-input" rows={5}></textarea>
          <button type="submit" className="contact-submit">Send</button>
        </form>
        <div className="contact-info contact-card">
          <h3>Or reach me at</h3>
          <p>Email: <a href="mailto:your@email.com" className="contact-link">your@email.com</a></p>
          <div className="contact-socials">
            <a href="#" className="contact-link">LinkedIn</a>
            <a href="#" className="contact-link">GitHub</a>
            <a href="#" className="contact-link">Twitter</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 