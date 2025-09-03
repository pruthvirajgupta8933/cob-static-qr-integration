# Docker Setup Guide for COB QR Solution

## 📋 Overview

This Docker setup provides a complete containerized environment for the COB QR Solution, including:
- React Frontend (with Static QR and Bulk QR features)
- Node.js Backend API (with QR generation and security)
- Nginx Reverse Proxy (optional)
- Redis Cache (optional, for future enhancements)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Browser       │────▶│  Nginx:80/443   │
└─────────────────┘     └─────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
            ┌──────────────┐     ┌──────────────┐
            │Frontend:3000 │     │Backend:3001  │
            │  (React)     │────▶│  (Node.js)   │
            └──────────────┘     └──────────────┘
                                        │
                                 ┌──────▼──────┐
                                 │  QR Data    │
                                 │  Storage    │
                                 └─────────────┘
```

## 🚀 Quick Start

### 1. Basic Setup (Development)

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001/api
```

### 2. Production Setup

```bash
# Build for production
docker-compose -f docker-compose.yml up -d --build

# Scale backend for high load
docker-compose up -d --scale backend=3
```

### 3. Individual Container Commands

```bash
# Build frontend only
docker build -f Dockerfile.frontend -t cob-qr-frontend .

# Build backend only
docker build -f Dockerfile.backend -t cob-qr-backend .

# Run frontend
docker run -p 3000:3000 -e REACT_APP_API_URL=http://localhost:3001/api cob-qr-frontend

# Run backend
docker run -p 3001:3001 -v $(pwd)/data:/app/data cob-qr-backend
```

## 🔧 Configuration

### Environment Variables

#### Frontend Environment
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENABLE_QR_FEATURE=true
NODE_ENV=production
```

#### Backend Environment
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=http://localhost:3000
HDFC_WEBHOOK_URL=https://api.sabpaisa.in/api/hdfc/webhook
MAX_QR_BULK_SIZE=100
QR_STORAGE_PATH=/app/data
```

### Modifying Configuration

1. **Change API URL**: Edit `REACT_APP_API_URL` in docker-compose.yml
2. **Disable QR Feature**: Set `REACT_APP_ENABLE_QR_FEATURE=false`
3. **Change Ports**: Modify port mappings in docker-compose.yml
4. **Add SSL**: Mount SSL certificates in nginx container

## 📁 File Structure

```
COB-Frontend-cob-nf-production/
├── Dockerfile                 # Multi-stage build (all-in-one)
├── Dockerfile.frontend        # Frontend specific
├── Dockerfile.backend         # Backend specific
├── docker-compose.yml         # Orchestration config
├── nginx.conf                 # Nginx configuration
├── docker-entrypoint.sh       # Runtime env substitution
├── .dockerignore             # Exclude files from build
│
├── src/                      # Frontend source
│   └── components/
│       ├── bulkQR/          # Bulk QR component
│       └── staticQR/        # Static QR component
│
└── backend/                  # Backend source
    ├── routes/
    │   └── bulkQR.js        # QR API endpoints
    └── utils/
        └── security.js      # Security utilities
```

## 📊 Key Features in Docker

### 1. **Multi-Stage Builds**
   - Reduces image size
   - Separates build and runtime dependencies
   - Frontend: ~100MB, Backend: ~150MB

### 2. **Health Checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
     interval: 30s
   ```

### 3. **Persistent Storage**
   ```yaml
   volumes:
     - qr-data:/app/data  # QR codes persist across restarts
   ```

### 4. **Security Headers** (via Nginx)
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Content-Security-Policy

### 5. **Auto-Restart**
   ```yaml
   restart: unless-stopped
   ```

## 🛠️ Development Workflow

### Hot Reload Development
```bash
# Use volume mounts for live code updates
docker-compose -f docker-compose.dev.yml up
```

### Testing in Container
```bash
# Run tests inside container
docker exec -it cob-qr-backend npm test
docker exec -it cob-qr-frontend npm test
```

### Debugging
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Access container shell
docker exec -it cob-qr-backend sh
docker exec -it cob-qr-frontend sh

# Check health
curl http://localhost:3001/api/health
```

## 📈 Performance Optimization

### 1. **Build Optimization**
   - Uses Alpine Linux (smaller base image)
   - Multi-stage builds remove build tools
   - Production dependencies only

### 2. **Runtime Optimization**
   - Nginx serves static files
   - Gzip compression enabled
   - Cache headers for assets

### 3. **Scaling Options**
   ```bash
   # Horizontal scaling
   docker-compose up -d --scale backend=3
   
   # Add load balancer in docker-compose.yml
   ```

## 🔒 Security Best Practices

1. **Non-root User**: Containers run as non-root
2. **Read-only Filesystems**: Source mounted as read-only
3. **Secret Management**: Use Docker secrets for sensitive data
4. **Network Isolation**: Services on isolated network
5. **Health Checks**: Automatic container restart on failure

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "3010:3000"  # Use 3010 instead
   ```

2. **Permission Errors**
   ```bash
   # Fix permissions
   chmod +x docker-entrypoint.sh
   ```

3. **Build Failures**
   ```bash
   # Clean rebuild
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up
   ```

4. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop > Preferences > Resources
   ```

## 📝 Deployment Checklist

- [ ] Set production environment variables
- [ ] Configure SSL certificates
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure backup for QR data volume
- [ ] Set resource limits in docker-compose
- [ ] Enable log rotation
- [ ] Set up health check alerts
- [ ] Configure firewall rules
- [ ] Test disaster recovery

## 🌐 Production Deployment Options

### 1. **Docker Swarm**
```bash
docker swarm init
docker stack deploy -c docker-compose.yml cob-qr
```

### 2. **Kubernetes**
```bash
# Convert to Kubernetes manifests
kompose convert -f docker-compose.yml
kubectl apply -f .
```

### 3. **Cloud Platforms**
- **AWS ECS**: Use Fargate for serverless containers
- **Google Cloud Run**: Deploy containers without managing infrastructure
- **Azure Container Instances**: Quick deployment option

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Best Practices for Node.js Docker](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [React Docker Best Practices](https://mherman.org/blog/dockerizing-a-react-app/)

## 💡 Tips for Team

1. **Use Docker for consistent environments** - Eliminates "works on my machine" issues
2. **Version control Docker files** - Track infrastructure as code
3. **Use .env files for local development** - Don't commit sensitive data
4. **Monitor container health** - Set up alerts for production
5. **Regular security updates** - Keep base images updated

---

*This Docker setup ensures the QR solution runs consistently across all environments with proper isolation, security, and scalability.*