#!/bin/bash

# Repository Migration Script
# This script splits the monorepo into separate frontend and backend repositories

set -e

echo "🚀 Starting Repository Migration..."
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directories
CURRENT_DIR="$(pwd)"
PARENT_DIR="$(dirname "$CURRENT_DIR")"
FRONTEND_REPO="$PARENT_DIR/sabpaisa-qr-frontend"
BACKEND_REPO="$PARENT_DIR/sabpaisa-qr-backend"

echo -e "${BLUE}Current directory: $CURRENT_DIR${NC}"
echo -e "${BLUE}Frontend will be created at: $FRONTEND_REPO${NC}"
echo -e "${BLUE}Backend will be created at: $BACKEND_REPO${NC}"

# Confirm with user
read -p "Do you want to proceed with the migration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 1
fi

# Create Frontend Repository
echo -e "\n${GREEN}Step 1: Creating Frontend Repository${NC}"
echo "----------------------------------------"

if [ -d "$FRONTEND_REPO" ]; then
    echo -e "${YELLOW}Frontend repo already exists. Removing...${NC}"
    rm -rf "$FRONTEND_REPO"
fi

mkdir -p "$FRONTEND_REPO"
cd "$FRONTEND_REPO"
git init

# Copy frontend files
echo "Copying frontend files..."
cp -r "$CURRENT_DIR/src" .
cp -r "$CURRENT_DIR/public" .
cp "$CURRENT_DIR/package.json" .
cp "$CURRENT_DIR/.gitignore" .

# Copy test files if they exist
if [ -d "$CURRENT_DIR/__tests__" ]; then
    cp -r "$CURRENT_DIR/__tests__" .
fi

# Create frontend-specific package.json
echo "Creating frontend package.json..."
cat > package.json << 'EOF'
{
  "name": "sabpaisa-qr-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.4.0",
    "bootstrap": "^5.3.0",
    "jszip": "^3.10.1",
    "papaparse": "^5.4.1",
    "qrcode": "^1.5.3",
    "react": "^17.0.2",
    "react-bootstrap": "^2.8.0",
    "react-dom": "^17.0.2",
    "react-redux": "^8.1.1",
    "react-router-dom": "^6.14.1",
    "react-scripts": "5.0.1",
    "socket.io-client": "^4.5.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Create frontend README
echo "Creating frontend README..."
cat > README.md << 'EOF'
# SabPaisa QR Frontend

React-based frontend application for SabPaisa QR payment system.

## Features
- Static QR Code Generation
- Bulk QR Code Generation
- Merchant Dashboard
- Real-time Payment Updates
- Transaction History

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

## Docker

```bash
docker build -t sabpaisa-frontend .
docker run -p 3000:80 sabpaisa-frontend
```
EOF

# Create frontend Dockerfile
echo "Creating frontend Dockerfile..."
cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx config
cat > nginx.conf << 'EOF'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:3001;
    }
}
EOF

# Create .env.example
cat > .env.example << 'EOF'
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
EOF

echo -e "${GREEN}✓ Frontend repository created${NC}"

# Create Backend Repository
echo -e "\n${GREEN}Step 2: Creating Backend Repository${NC}"
echo "----------------------------------------"

if [ -d "$BACKEND_REPO" ]; then
    echo -e "${YELLOW}Backend repo already exists. Removing...${NC}"
    rm -rf "$BACKEND_REPO"
fi

mkdir -p "$BACKEND_REPO"
cd "$BACKEND_REPO"
git init

# Copy backend files
echo "Copying backend files..."
cp -r "$CURRENT_DIR/backend/"* .
mkdir -p data database

# Copy database files if they exist
if [ -d "$CURRENT_DIR/database" ]; then
    cp -r "$CURRENT_DIR/database/"* database/
fi

# Copy data files if they exist
if [ -d "$CURRENT_DIR/data" ]; then
    cp -r "$CURRENT_DIR/data/"* data/ 2>/dev/null || true
fi

# Create backend package.json
echo "Creating backend package.json..."
cat > package.json << 'EOF'
{
  "name": "sabpaisa-qr-backend",
  "version": "1.0.0",
  "description": "Backend API for SabPaisa QR payment system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "socket.io": "^4.5.1",
    "dotenv": "^16.3.1",
    "axios": "^1.4.0",
    "qrcode": "^1.5.3",
    "uuid": "^9.0.0",
    "mysql2": "^3.5.1",
    "pg": "^8.11.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0"
  }
}
EOF

# Create backend README
echo "Creating backend README..."
cat > README.md << 'EOF'
# SabPaisa QR Backend

Node.js backend API for SabPaisa QR payment system.

## Features
- RESTful Merchant API
- HDFC Bank Integration
- Webhook Support
- Rate Limiting
- API Authentication

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Documentation

### Base URL
```
http://localhost:3001/api/v1/merchant
```

### Authentication
All requests require:
- `X-API-Key`: Your merchant API key
- `X-API-Secret`: Your merchant API secret

### Endpoints
- `POST /qr/generate` - Generate single QR
- `POST /qr/bulk` - Generate bulk QRs
- `GET /qr/list` - List QR codes
- `GET /transactions` - Get transactions
- `GET /analytics` - Get analytics

## Environment Variables

Create a `.env` file:

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost/sabpaisa
```

## Docker

```bash
docker build -t sabpaisa-backend .
docker run -p 3001:3001 sabpaisa-backend
```
EOF

# Create backend Dockerfile
echo "Creating backend Dockerfile..."
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
EOF

# Create .env.example
cat > .env.example << 'EOF'
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost/sabpaisa
HDFC_API_KEY=
HDFC_API_SECRET=
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
*.log
data/*.json
dist/
build/
.DS_Store
EOF

echo -e "${GREEN}✓ Backend repository created${NC}"

# Create Docker Compose for both services
echo -e "\n${GREEN}Step 3: Creating Docker Compose Configuration${NC}"
echo "------------------------------------------------"

cd "$PARENT_DIR"
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    build: ./sabpaisa-qr-frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://backend:3001
    depends_on:
      - backend
    networks:
      - sabpaisa-network

  backend:
    build: ./sabpaisa-qr-backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - NODE_ENV=production
      - FRONTEND_URL=http://frontend
      - DATABASE_URL=postgresql://postgres:password@db:5432/sabpaisa
    depends_on:
      - db
    networks:
      - sabpaisa-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=sabpaisa
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sabpaisa-network

networks:
  sabpaisa-network:
    driver: bridge

volumes:
  postgres_data:
EOF

echo -e "${GREEN}✓ Docker Compose configuration created${NC}"

# Create CI/CD workflows
echo -e "\n${GREEN}Step 4: Creating CI/CD Workflows${NC}"
echo "-----------------------------------"

# Frontend CI/CD
mkdir -p "$FRONTEND_REPO/.github/workflows"
cat > "$FRONTEND_REPO/.github/workflows/ci.yml" << 'EOF'
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage --watchAll=false
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        run: |
          docker build -t sabpaisa-frontend:${{ github.sha }} .
          # Add your Docker registry push commands here
EOF

# Backend CI/CD
mkdir -p "$BACKEND_REPO/.github/workflows"
cat > "$BACKEND_REPO/.github/workflows/ci.yml" << 'EOF'
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        run: |
          docker build -t sabpaisa-backend:${{ github.sha }} .
          # Add your Docker registry push commands here
EOF

echo -e "${GREEN}✓ CI/CD workflows created${NC}"

# Initialize git repositories
echo -e "\n${GREEN}Step 5: Initializing Git Repositories${NC}"
echo "----------------------------------------"

cd "$FRONTEND_REPO"
git add .
git commit -m "Initial commit: Frontend repository setup"
echo -e "${GREEN}✓ Frontend repository initialized${NC}"

cd "$BACKEND_REPO"
git add .
git commit -m "Initial commit: Backend repository setup"
echo -e "${GREEN}✓ Backend repository initialized${NC}"

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Migration Complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${BLUE}Created Repositories:${NC}"
echo "1. Frontend: $FRONTEND_REPO"
echo "2. Backend: $BACKEND_REPO"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Review the migrated code in each repository"
echo "2. Install dependencies:"
echo "   cd $FRONTEND_REPO && npm install"
echo "   cd $BACKEND_REPO && npm install"
echo "3. Test both applications:"
echo "   Frontend: npm start (port 3000)"
echo "   Backend: npm start (port 3001)"
echo "4. Push to remote repositories:"
echo "   git remote add origin <your-frontend-repo-url>"
echo "   git push -u origin main"

echo -e "\n${BLUE}Docker Commands:${NC}"
echo "cd $PARENT_DIR"
echo "docker-compose up"

echo -e "\n${YELLOW}Note: The original monorepo at $CURRENT_DIR has not been modified.${NC}"