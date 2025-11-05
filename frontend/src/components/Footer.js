import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {currentYear} Fake News Detector. Built with React and FastAPI.
          </p>
          <p className="footer-privacy">
            🔒 Your privacy is protected. No data is stored or shared.
          </p>
        </div>
        
        <div className="footer-links">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <span className="footer-separator">•</span>
          <a 
            href="https://fastapi.tiangolo.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            FastAPI
          </a>
          <span className="footer-separator">•</span>
          <a 
            href="https://react.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            React
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
