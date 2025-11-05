import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 className="about-title">About This Tool</h2>
        <p className="about-text">
          This fake news detection tool uses machine learning to analyze news articles 
          and predict their authenticity. The system examines various features including 
          article content, writing style, and source credibility indicators.
        </p>
        
        <div className="about-features">
          <div className="about-feature">
            <span className="feature-icon">🤖</span>
            <div>
              <h3>AI-Powered Analysis</h3>
              <p>Uses advanced machine learning algorithms trained on news data</p>
            </div>
          </div>
          
          <div className="about-feature">
            <span className="feature-icon">⚡</span>
            <div>
              <h3>Instant Results</h3>
              <p>Get predictions in seconds with detailed explanations</p>
            </div>
          </div>
          
          <div className="about-feature">
            <span className="feature-icon">🔒</span>
            <div>
              <h3>Privacy First</h3>
              <p>No data is stored or shared. All analysis happens in real-time</p>
            </div>
          </div>
        </div>

        <div className="about-notice">
          <h3>Important Notice</h3>
          <p>
            This tool is designed to assist in identifying potentially misleading content, 
            but it should not be your only source of verification. Always:
          </p>
          <ul>
            <li>Cross-reference information with multiple credible sources</li>
            <li>Check the original source and publication date</li>
            <li>Look for author credentials and citations</li>
            <li>Be aware of your own biases when evaluating news</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
