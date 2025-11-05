import React, { useState } from 'react';
import './NewsForm.css';

function NewsForm({ onSubmit, loading, onReset }) {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    source: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClear = () => {
    setFormData({
      title: '',
      text: '',
      source: ''
    });
    onReset();
  };

  const isFormValid = formData.title.trim() && 
                       formData.text.trim().length >= 10 && 
                       formData.source.trim();

  return (
    <div className="news-form-container">
      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the article title"
            className="form-input"
            maxLength={500}
            required
            disabled={loading}
          />
          <span className="form-hint">
            {formData.title.length}/500 characters
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="text" className="form-label">
            Article Content *
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Paste the full article text here (minimum 10 characters)"
            className="form-textarea"
            rows={8}
            maxLength={10000}
            required
            disabled={loading}
          />
          <span className="form-hint">
            {formData.text.length}/10000 characters
            {formData.text.length > 0 && formData.text.length < 10 && 
              <span className="hint-warning"> (minimum 10 required)</span>
            }
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="source" className="form-label">
            Source *
          </label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g., nytimes.com, bbc.co.uk"
            className="form-input"
            maxLength={200}
            required
            disabled={loading}
          />
          <span className="form-hint">
            Enter the website or publication name
          </span>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid || loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Article'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewsForm;
