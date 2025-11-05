# Deployment Guide

Complete guide for deploying the Fake News Detector application.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Cloud Platforms](#cloud-platforms)
3. [Manual Deployment](#manual-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Security Considerations](#security-considerations)

## Docker Deployment

### Local Development

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Production Docker

Update `docker-compose.yml` for production:

```yaml
services:
  backend:
    environment:
      - ENVIRONMENT=production
    restart: always
    
  frontend:
    environment:
      - REACT_APP_API_URL=https://your-api-domain.com
    restart: always
```

## Cloud Platforms

### AWS Deployment

#### Option 1: EC2 with Docker

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and run
git clone <your-repo>
cd fake-news-detector
docker-compose up -d
```

#### Option 2: ECS (Elastic Container Service)

1. Push images to ECR
2. Create ECS task definitions
3. Create ECS service
4. Configure load balancer

#### Option 3: Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p docker fake-news-detector

# Create environment
eb create production

# Deploy
eb deploy
```

### Google Cloud Platform

#### Cloud Run

```bash
# Backend
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/fake-news-api
gcloud run deploy fake-news-api --image gcr.io/PROJECT_ID/fake-news-api --platform managed

# Frontend
cd frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/fake-news-frontend
gcloud run deploy fake-news-frontend --image gcr.io/PROJECT_ID/fake-news-frontend --platform managed
```

### Microsoft Azure

#### Azure Container Instances

```bash
# Create resource group
az group create --name fake-news-rg --location eastus

# Backend
az container create \
  --resource-group fake-news-rg \
  --name fake-news-backend \
  --image your-registry/fake-news-backend \
  --dns-name-label fake-news-api \
  --ports 8000

# Frontend
az container create \
  --resource-group fake-news-rg \
  --name fake-news-frontend \
  --image your-registry/fake-news-frontend \
  --dns-name-label fake-news-app \
  --ports 80
```

### DigitalOcean

#### App Platform

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

#### Droplet with Docker

```bash
# Create droplet with Docker pre-installed
# SSH into droplet
ssh root@your-droplet-ip

# Clone repository
git clone <your-repo>
cd fake-news-detector

# Run with Docker Compose
docker-compose up -d

# Setup Nginx reverse proxy (optional)
sudo apt install nginx
# Configure nginx for domain
```

### Heroku

#### Backend

```bash
cd backend
heroku create fake-news-api
heroku container:push web
heroku container:release web
heroku open
```

#### Frontend

Deploy to Netlify or Vercel (better for React apps)

### Vercel (Frontend)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

Update environment variable:
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Netlify (Frontend)

```bash
cd frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Railway (Full Stack)

1. Connect GitHub repository
2. Railway auto-detects Dockerfile
3. Set environment variables
4. Deploy

## Manual Deployment

### Backend (Ubuntu/Debian)

```bash
# Install Python
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip

# Setup application
cd /var/www/fake-news-detector/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train_model.py

# Install Gunicorn
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/fake-news-api.service
```

Service file content:
```ini
[Unit]
Description=Fake News Detection API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/fake-news-detector/backend
Environment="PATH=/var/www/fake-news-detector/backend/venv/bin"
ExecStart=/var/www/fake-news-detector/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start fake-news-api
sudo systemctl enable fake-news-api
```

### Frontend (Nginx)

```bash
# Build frontend
cd frontend
npm install
npm run build

# Copy to web root
sudo cp -r build/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/fake-news
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/fake-news /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Configuration

### Production Environment Variables

**Backend (.env):**
```env
ENVIRONMENT=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://your-frontend-domain.com
```

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://your-api-domain.com
```

## Security Considerations

### SSL/TLS Certificate

#### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Security Headers

Add to Nginx configuration:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Rate Limiting

Add to FastAPI app:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/predict")
@limiter.limit("10/minute")
async def predict_news(request: Request, article: NewsArticle):
    # ... existing code
```

## Monitoring

### Health Checks

```bash
# Backend health
curl https://your-api-domain.com/health

# Frontend health
curl https://your-frontend-domain.com
```

### Logging

**Backend logs:**
```bash
# Docker
docker-compose logs -f backend

# Systemd
sudo journalctl -u fake-news-api -f
```

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake
- AWS CloudWatch

## Backup

### Database (if added)

```bash
# Backup
docker exec fake-news-db pg_dump -U user dbname > backup.sql

# Restore
docker exec -i fake-news-db psql -U user dbname < backup.sql
```

### Model Files

```bash
# Backup models
tar -czf models-backup.tar.gz backend/models/

# Restore
tar -xzf models-backup.tar.gz
```

## Troubleshooting

### Common Issues

1. **CORS errors**: Check CORS_ORIGINS in backend
2. **API connection failed**: Verify REACT_APP_API_URL
3. **Model not found**: Run `python train_model.py`
4. **Port already in use**: Change port in docker-compose.yml

### Debug Mode

```bash
# Backend debug
docker-compose logs backend

# Frontend debug
docker-compose logs frontend

# Check container status
docker-compose ps
```

## Scaling

### Horizontal Scaling

Use load balancer with multiple backend instances:

```yaml
services:
  backend:
    deploy:
      replicas: 3
```

### Vertical Scaling

Increase resources in docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

---

For more information, see the main [README.md](README.md)
