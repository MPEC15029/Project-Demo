"""
Train a simple fake news detection model
This script creates a basic model for demonstration purposes
"""

import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import numpy as np

def create_sample_model():
    """
    Create a sample trained model for fake news detection
    In production, this would be trained on a real dataset like LIAR or FakeNewsNet
    """
    
    # Sample training data (in production, use a real dataset)
    # These are simplified examples for demonstration
    fake_news_samples = [
        "SHOCKING: You won't believe what happened next! Click here now!",
        "BREAKING: Unbelievable discovery that scientists don't want you to know!",
        "AMAZING: This one weird trick will change everything forever!",
        "INCREDIBLE: Secret revealed that will shock the world!",
        "UNBELIEVABLE: They don't want you to see this information!",
        "ALERT: Massive conspiracy uncovered! Share before it's deleted!",
        "URGENT: This will blow your mind! Act now before it's too late!",
        "EXPOSED: The truth they've been hiding from you all along!",
    ]
    
    real_news_samples = [
        "Local government announces new infrastructure development plan for the city center.",
        "Research team publishes findings on climate change effects in peer-reviewed journal.",
        "Stock market shows moderate gains following economic policy announcement.",
        "University researchers develop new method for renewable energy storage.",
        "City council approves budget for public transportation improvements.",
        "Health officials report seasonal flu vaccination campaign results.",
        "Technology company releases quarterly earnings report showing steady growth.",
        "International summit addresses global trade and economic cooperation.",
    ]
    
    # Combine samples
    X_train = fake_news_samples + real_news_samples
    y_train = [1] * len(fake_news_samples) + [0] * len(real_news_samples)  # 1 = Fake, 0 = Real
    
    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words='english',
        min_df=1,
        max_df=0.9
    )
    
    # Fit vectorizer
    X_vectorized = vectorizer.fit_transform(X_train)
    
    # Train Logistic Regression model
    model = LogisticRegression(
        random_state=42,
        max_iter=1000,
        C=1.0
    )
    model.fit(X_vectorized, y_train)
    
    # Create models directory if it doesn't exist
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    # Save model and vectorizer
    model_path = os.path.join(models_dir, "fake_news_model.pkl")
    vectorizer_path = os.path.join(models_dir, "vectorizer.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    print(f"Model saved to: {model_path}")
    print(f"Vectorizer saved to: {vectorizer_path}")
    print(f"Training accuracy: {model.score(X_vectorized, y_train):.2%}")
    
    # Test the model
    test_samples = [
        "SHOCKING NEWS: You won't believe this!",
        "Government announces new policy changes."
    ]
    
    test_vectorized = vectorizer.transform(test_samples)
    predictions = model.predict(test_vectorized)
    probabilities = model.predict_proba(test_vectorized)
    
    print("\nTest predictions:")
    for i, (sample, pred, prob) in enumerate(zip(test_samples, predictions, probabilities)):
        label = "Fake" if pred == 1 else "Real"
        confidence = prob[pred]
        print(f"{i+1}. '{sample[:50]}...' -> {label} ({confidence:.2%} confidence)")

if __name__ == "__main__":
    print("Creating sample fake news detection model...")
    create_sample_model()
    print("\nModel creation complete!")
