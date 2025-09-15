# Repository Split Strategy for DevOps

## Current Issue
The frontend and backend are currently in a single repository, making CI/CD pipeline configuration complex and inefficient.

## Recommended Repository Structure

### 🎯 Repository 1: `sabpaisa-qr-frontend`
**Purpose**: React Frontend Application

```
sabpaisa-qr-frontend/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Frontend CI pipeline
│       └── deploy.yml       # Frontend deployment
├── public/
├── src/
│   ├── components/
│   │   ├── bulkQR/
│   │   ├── merchant/
│   │   └── sabqr/
│   ├── store/
│   │   └── slices/
│   ├── services/
│   └── utils/
├── __tests__/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── Dockerfile
└── docker-compose.yml
```

### 🔧 Repository 2: `sabpaisa-qr-backend`
**Purpose**: Node.js Backend API

```
sabpaisa-qr-backend/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Backend CI pipeline
│       └── deploy.yml       # Backend deployment
├── routes/
│   ├── api/
│   │   └── v1/
│   │       └── merchant.js
│   ├── hdfc.webhook.js
│   └── bulkQR.js
├── services/
│   └── LocalTransactionStore.js
├── middleware/
│   └── apiAuth.js
├── utils/
│   └── security.js
├── config/
│   └── database.js
├── data/              # JSON storage (dev only)
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── README.md
├── Dockerfile
└── docker-compose.yml
```

### 📚 Repository 3: `sabpaisa-qr-docs` (Optional)
**Purpose**: API Documentation & Examples

```
sabpaisa-qr-docs/
├── api-documentation/
├── examples/
│   └── merchant-api-client.js
├── postman-collections/
├── swagger/
└── README.md
```

## Migration Steps

### Step 1: Create New Repositories
```bash
# Create frontend repo
mkdir ~/Desktop/sabpaisa-qr-frontend
cd ~/Desktop/sabpaisa-qr-frontend
git init

# Create backend repo
mkdir ~/Desktop/sabpaisa-qr-backend
cd ~/Desktop/sabpaisa-qr-backend
git init
```

### Step 2: Copy Frontend Files
```bash
# Frontend files to copy
- src/
- public/
- __tests__/
- package.json (frontend dependencies only)
- .gitignore
- README.md (frontend specific)
```

### Step 3: Copy Backend Files
```bash
# Backend files to copy
- backend/ → root of new repo
- database/
- data/ (if using JSON storage)
- examples/ (API examples)
```

## CI/CD Pipeline Configuration

### Frontend Pipeline (.github/workflows/ci.yml)
```yaml
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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker build -t sabpaisa-frontend .
      - run: docker push ${{ secrets.DOCKER_REGISTRY }}/sabpaisa-frontend
```

### Backend Pipeline (.github/workflows/ci.yml)
```yaml
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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker build -t sabpaisa-backend .
      - run: docker push ${{ secrets.DOCKER_REGISTRY }}/sabpaisa-backend
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://api.sabpaisa.in
REACT_APP_WEBHOOK_URL=wss://api.sabpaisa.in
REACT_APP_ENV=production
```

### Backend (.env)
```
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost/sabpaisa
FRONTEND_URL=https://app.sabpaisa.in
HDFC_API_KEY=xxx
HDFC_API_SECRET=xxx
```

## Docker Configuration

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
```

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │
│  (React App)    │     │   (Node.js)     │
│   Port 80/443   │     │   Port 3001     │
└─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│     CDN         │     │    Database     │
│  (CloudFront)   │     │  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘
```

## Benefits of Separation

1. **Independent Deployments**: Frontend and backend can be deployed separately
2. **Scalability**: Each service can scale independently
3. **Team Autonomy**: Frontend and backend teams can work independently
4. **CI/CD Simplicity**: Simpler pipeline configuration
5. **Resource Optimization**: Different resource requirements for each service
6. **Technology Freedom**: Can use different tech stacks if needed

## Migration Checklist

- [ ] Create new repositories
- [ ] Move frontend code to sabpaisa-qr-frontend
- [ ] Move backend code to sabpaisa-qr-backend
- [ ] Update package.json files
- [ ] Configure CI/CD pipelines
- [ ] Update environment variables
- [ ] Test deployments
- [ ] Update documentation
- [ ] Notify team members
- [ ] Archive old monorepo (keep for reference)

## Quick Start Commands

```bash
# Clone and run frontend
git clone https://github.com/yourorg/sabpaisa-qr-frontend
cd sabpaisa-qr-frontend
npm install
npm start

# Clone and run backend (separate terminal)
git clone https://github.com/yourorg/sabpaisa-qr-backend
cd sabpaisa-qr-backend
npm install
npm start

# Or use Docker Compose
docker-compose up
```

## Contact
For questions about the migration, contact the DevOps team.