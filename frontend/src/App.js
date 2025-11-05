import React, { useState, useEffect } from 'react';
import './App.css';
import NewsForm from './components/NewsForm';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [showAbout, setShowAbout] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowAbout(false);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze the article');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the article');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setShowAbout(true);
  };

  return (
    <div className="App">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="main-content">
        <div className="container">
          {showAbout && <About />}
          
          <NewsForm 
            onSubmit={handleSubmit} 
            loading={loading}
            onReset={handleReset}
          />
          
          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-text">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Analyzing article...</p>
            </div>
          )}
          
          {result && !loading && (
            <ResultDisplay result={result} onReset={handleReset} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
