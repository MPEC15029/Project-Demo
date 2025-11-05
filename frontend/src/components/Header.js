import React from 'react';
import './Header.css';

function Header({ theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <h1 className="header-title">
            <span className="header-icon">🔍</span>
            Fake News Detector
          </h1>
          <p className="header-subtitle">
            AI-Powered News Verification
          </p>
        </div>
        
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

export default Header;
