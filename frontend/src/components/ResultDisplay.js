import React from 'react';
import './ResultDisplay.css';

function ResultDisplay({ result, onReset }) {
  const isFake = result.label === 'Fake';
  const confidencePercentage = (result.probability * 100).toFixed(1);

  return (
    <div className="result-container">
      <div className={`result-card ${isFake ? 'fake' : 'real'}`}>
        <div className="result-header">
          <div className="result-icon">
            {isFake ? '⚠️' : '✓'}
          </div>
          <div className="result-label-container">
            <h2 className="result-label">{result.label} News</h2>
            <p className="result-confidence">
              {result.confidence} Confidence ({confidencePercentage}%)
            </p>
          </div>
        </div>

        <div className="confidence-bar-container">
          <div className="confidence-bar">
            <div 
              className={`confidence-fill ${isFake ? 'fake' : 'real'}`}
              style={{ width: `${confidencePercentage}%` }}
            />
          </div>
          <div className="confidence-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="result-explanation">
          <h3 className="section-title">Analysis</h3>
          <p className="explanation-text">{result.explanation}</p>
        </div>

        {result.features && (
          <div className="result-features">
            <h3 className="section-title">Article Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-label">Title Length:</span>
                <span className="feature-value">{result.features.title_length} chars</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Word Count:</span>
                <span className="feature-value">{result.features.word_count} words</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Text Length:</span>
                <span className="feature-value">{result.features.text_length} chars</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Source:</span>
                <span className="feature-value">{result.features.source}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Sensational Title:</span>
                <span className={`feature-badge ${result.features.has_sensational_title ? 'warning' : 'success'}`}>
                  {result.features.has_sensational_title ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="feature-item">
                <span className="feature-label">All Caps Title:</span>
                <span className={`feature-badge ${result.features.title_has_caps ? 'warning' : 'success'}`}>
                  {result.features.title_has_caps ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="result-disclaimer">
          <p>
            <strong>Disclaimer:</strong> This tool uses machine learning to provide predictions 
            and should not be the sole basis for determining news authenticity. Always verify 
            information from multiple credible sources and use critical thinking.
          </p>
        </div>

        <button className="btn btn-reset" onClick={onReset}>
          Analyze Another Article
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
