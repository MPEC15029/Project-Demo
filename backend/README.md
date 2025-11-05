# Fake News Detection API

FastAPI backend for the Fake News Detector application.

## Features

- RESTful API with FastAPI
- Machine Learning model using scikit-learn
- TF-IDF vectorization for text processing
- Logistic Regression classifier
- Input validation with Pydantic
- CORS enabled for frontend integration
- Comprehensive error handling
- Health check endpoint

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py
```

## Running the Server

```bash
# Development mode with auto-reload
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### GET /
Root endpoint with API information.

### GET /health
Health check endpoint.

### POST /predict
Predict if news is fake or real.

**Request:**
```json
{
  "title": "Article title",
  "text": "Article content (min 10 chars)",
  "source": "Source name"
}
```

**Response:**
```json
{
  "label": "Fake" | "Real",
  "probability": 0.85,
  "confidence": "High",
  "explanation": "Detailed explanation...",
  "features": {
    "title_length": 50,
    "text_length": 500,
    "word_count": 100,
    "source": "example.com",
    "has_sensational_title": false,
    "title_has_caps": false
  }
}
```

## Model Training

The `train_model.py` script creates a simple demonstration model. For production:

1. Use a real fake news dataset (LIAR, FakeNewsNet, etc.)
2. Implement proper train/test split
3. Add cross-validation
4. Tune hyperparameters
5. Evaluate with multiple metrics

## Docker

```bash
# Build image
docker build -t fake-news-api .

# Run container
docker run -p 8000:8000 fake-news-api
```

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","text":"This is a test article","source":"test.com"}'
```
