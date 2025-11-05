# 🔍 Fake News Detector

A complete, production-ready web application for detecting fake news using machine learning. Built with React, FastAPI, and scikit-learn.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **🤖 Machine Learning**: Logistic Regression model with TF-IDF vectorization
- **⚡ Real-time Analysis**: Instant predictions with confidence scores
- **🎨 Modern UI**: Responsive design with light/dark mode
- **📊 Detailed Results**: Probability scores, explanations, and feature analysis
- **🔒 Privacy-First**: No data storage or tracking
- **🐳 Docker Ready**: Complete containerization with Docker Compose
- **📱 Mobile Friendly**: Fully responsive design for all devices
- **🔌 REST API**: Well-documented FastAPI backend

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **scikit-learn**: Machine learning library for model training and inference
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation using Python type annotations

### Frontend
- **React 18**: Modern UI library with hooks
- **CSS3**: Custom styling with CSS variables for theming
- **Fetch API**: For backend communication

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Production web server for frontend

## 📁 Project Structure

```
fake-news-detector/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── train_model.py         # Model training script
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container config
│   └── models/               # Trained ML models (generated)
│       ├── fake_news_model.pkl
│       └── vectorizer.pkl
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── NewsForm.js
│   │   │   ├── NewsForm.css
│   │   │   ├── ResultDisplay.js
│   │   │   ├── ResultDisplay.css
│   │   │   ├── About.js
│   │   │   ├── About.css
│   │   │   ├── Footer.js
│   │   │   └── Footer.css
│   │   ├── App.js            # Main application component
│   │   ├── App.css
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Node dependencies
│   ├── Dockerfile           # Frontend container config
│   └── nginx.conf           # Nginx configuration
├── docker-compose.yml        # Multi-container setup
├── .dockerignore
├── .gitignore
└── README.md                 # This file
```

## 🚀 Quick Start

### Using Docker (Recommended)

The fastest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd fake-news-detector

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

That's it! The application will be running with both frontend and backend.

## 💻 Installation

### Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **Docker & Docker Compose** (optional, for containerized deployment)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py

# Run the backend server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 📖 Usage

### Web Interface

1. **Open the application** in your browser at `http://localhost:3000`
2. **Fill in the form** with:
   - Article Title
   - Article Content (minimum 10 characters)
   - Source (website or publication name)
3. **Click "Analyze Article"** to get predictions
4. **View results** including:
   - Label (Real/Fake)
   - Confidence score
   - Detailed explanation
   - Article features analysis

### API Usage

#### Health Check

```bash
curl http://localhost:8000/health
```

#### Predict News Authenticity

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking News: Major Discovery",
    "text": "Scientists have announced a significant breakthrough in renewable energy technology...",
    "source": "sciencedaily.com"
  }'
```

**Response:**

```json
{
  "label": "Real",
  "probability": 0.8234,
  "confidence": "High",
  "explanation": "This article has been classified as REAL NEWS with 82.3% confidence...",
  "features": {
    "title_length": 32,
    "text_length": 156,
    "word_count": 24,
    "source": "sciencedaily.com",
    "has_sensational_title": false,
    "title_has_caps": false
  }
}
```

## 📚 API Documentation

### Interactive API Docs

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

#### `GET /`
Root endpoint with API information.

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_status": "loaded"
}
```

#### `POST /predict`
Predict if a news article is fake or real.

**Request Body:**
```json
{
  "title": "string (1-500 chars)",
  "text": "string (10-10000 chars)",
  "source": "string (1-200 chars)"
}
```

**Response:**
```json
{
  "label": "Fake" | "Real",
  "probability": 0.0-1.0,
  "confidence": "Low" | "Medium" | "High",
  "explanation": "string",
  "features": {
    "title_length": "number",
    "text_length": "number",
    "word_count": "number",
    "source": "string",
    "has_sensational_title": "boolean",
    "title_has_caps": "boolean"
  }
}
```

## 🚢 Deployment

### Docker Deployment

#### Production Build

```bash
# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
PYTHONUNBUFFERED=1

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

### Cloud Deployment

#### AWS EC2 / DigitalOcean / Azure VM

1. **Install Docker and Docker Compose** on your VM
2. **Clone the repository**
3. **Update environment variables** for production
4. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```
5. **Configure reverse proxy** (Nginx/Apache) for domain mapping

#### Heroku

**Backend:**
```bash
cd backend
heroku create fake-news-api
heroku container:push web
heroku container:release web
```

**Frontend:**
```bash
cd frontend
# Update REACT_APP_API_URL to your backend URL
npm run build
# Deploy build folder to Netlify/Vercel
```

#### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
cd frontend
vercel --prod
```

**Backend on Railway:**
- Connect your GitHub repository
- Railway will auto-detect the Dockerfile
- Set environment variables in Railway dashboard

### Manual Deployment

#### Backend (Production)

```bash
cd backend
pip install -r requirements.txt
python train_model.py
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend (Production)

```bash
cd frontend
npm install
npm run build
# Serve the build folder with Nginx or any static server
```

## 🔧 Development

### Backend Development

```bash
cd backend

# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Run tests (if you add them)
pytest
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Model Training

The current model is a simple demonstration. For production use:

1. **Obtain a real dataset** (e.g., LIAR, FakeNewsNet, ISOT)
2. **Update `train_model.py`** with proper data loading and preprocessing
3. **Train with more features**:
   - Named Entity Recognition
   - Sentiment analysis
   - Source credibility scores
   - Writing style analysis
4. **Evaluate thoroughly** with cross-validation
5. **Save the trained model** to the `models/` directory

### Adding Features

**Backend:**
- Add new endpoints in `app.py`
- Implement additional ML models
- Add data validation and error handling

**Frontend:**
- Create new components in `src/components/`
- Add new pages or routes
- Enhance UI/UX with animations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is designed for educational and research purposes. The predictions are based on machine learning models and should not be the sole basis for determining news authenticity. Always verify information from multiple credible sources and use critical thinking when evaluating news content.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React team for the amazing UI library
- scikit-learn for machine learning tools
- The open-source community

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using React and FastAPI**
