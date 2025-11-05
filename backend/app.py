"""
Fake News Detection API
A FastAPI backend for detecting fake news using machine learning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
from typing import Dict, Any
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Fake News Detection API",
    description="API for detecting fake news using machine learning",
    version="1.0.0"
)

# CORS configuration - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class NewsArticle(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Article title")
    text: str = Field(..., min_length=10, max_length=10000, description="Article text content")
    source: str = Field(..., min_length=1, max_length=200, description="Article source")

# Response model
class PredictionResponse(BaseModel):
    label: str
    probability: float
    confidence: str
    explanation: str
    features: Dict[str, Any]

# Load ML model and vectorizer
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "fake_news_model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "models", "vectorizer.pkl")

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    logger.info("Model and vectorizer loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None
    vectorizer = None

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Fake News Detection API",
        "version": "1.0.0",
        "endpoints": {
            "/predict": "POST - Predict if news is fake or real",
            "/health": "GET - Health check"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "not loaded"
    return {
        "status": "healthy",
        "model_status": model_status
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_news(article: NewsArticle):
    """
    Predict if a news article is fake or real
    
    Args:
        article: NewsArticle object containing title, text, and source
        
    Returns:
        PredictionResponse with label, probability, and explanation
    """
    try:
        # Check if model is loaded
        if model is None or vectorizer is None:
            raise HTTPException(
                status_code=503,
                detail="Model not available. Please ensure the model files are present."
            )
        
        # Combine features for prediction
        combined_text = f"{article.title} {article.text}"
        
        # Vectorize the text
        text_vectorized = vectorizer.transform([combined_text])
        
        # Make prediction
        prediction = model.predict(text_vectorized)[0]
        probability = model.predict_proba(text_vectorized)[0]
        
        # Get probability for the predicted class
        fake_prob = probability[1] if len(probability) > 1 else probability[0]
        real_prob = probability[0] if len(probability) > 1 else 1 - probability[0]
        
        # Determine label
        label = "Fake" if prediction == 1 else "Real"
        confidence_score = fake_prob if label == "Fake" else real_prob
        
        # Determine confidence level
        if confidence_score >= 0.8:
            confidence = "High"
        elif confidence_score >= 0.6:
            confidence = "Medium"
        else:
            confidence = "Low"
        
        # Generate explanation
        explanation = generate_explanation(
            label, confidence_score, article.title, article.text, article.source
        )
        
        # Extract feature importance
        features = extract_features(article.title, article.text, article.source)
        
        return PredictionResponse(
            label=label,
            probability=round(float(confidence_score), 4),
            confidence=confidence,
            explanation=explanation,
            features=features
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing prediction: {str(e)}"
        )

def generate_explanation(label: str, probability: float, title: str, text: str, source: str) -> str:
    """Generate human-readable explanation for the prediction"""
    
    explanations = []
    
    # Base explanation
    if label == "Fake":
        explanations.append(
            f"This article has been classified as FAKE NEWS with {probability*100:.1f}% confidence."
        )
    else:
        explanations.append(
            f"This article has been classified as REAL NEWS with {probability*100:.1f}% confidence."
        )
    
    # Add factors
    factors = []
    
    # Check for sensational language
    sensational_words = ['shocking', 'unbelievable', 'amazing', 'incredible', 'you won\'t believe']
    if any(word in title.lower() for word in sensational_words):
        factors.append("sensational language in title")
    
    # Check text length
    if len(text.split()) < 50:
        factors.append("very short article content")
    
    # Check for all caps
    if title.isupper():
        factors.append("title in all capitals")
    
    # Check source credibility indicators
    credible_indicators = ['.com', '.org', '.gov', '.edu']
    if not any(indicator in source.lower() for indicator in credible_indicators):
        factors.append("unusual source format")
    
    if factors:
        explanations.append(f"Factors considered: {', '.join(factors)}.")
    
    # Add disclaimer
    explanations.append(
        "Note: This is an automated prediction and should not be the sole basis for determining authenticity. "
        "Always verify news from multiple credible sources."
    )
    
    return " ".join(explanations)

def extract_features(title: str, text: str, source: str) -> Dict[str, Any]:
    """Extract and return relevant features from the article"""
    
    return {
        "title_length": len(title),
        "text_length": len(text),
        "word_count": len(text.split()),
        "source": source,
        "has_sensational_title": any(
            word in title.lower() 
            for word in ['shocking', 'unbelievable', 'amazing', 'incredible']
        ),
        "title_has_caps": title.isupper()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
