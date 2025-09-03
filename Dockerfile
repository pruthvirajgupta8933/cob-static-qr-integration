# Multi-stage Dockerfile for COB QR Solution
# This Dockerfile sets up both frontend and backend with all dependencies

# Stage 1: Base Node.js image
FROM node:16-alpine AS base
WORKDIR /app
# Install required system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Stage 2: Backend dependencies
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Frontend dependencies
FROM base AS frontend-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 4: Frontend build
FROM frontend-deps AS frontend-build
WORKDIR /app
COPY public ./public
COPY src ./src
COPY .env* ./
RUN npm run build

# Stage 5: Production image
FROM node:16-alpine AS production
WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache tini

# Copy backend
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend

# Copy frontend build
COPY --from=frontend-build /app/build ./build

# Create data directory for QR storage
RUN mkdir -p /app/data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_PORT=3001
ENV REACT_APP_API_URL=http://localhost:3001/api
ENV REACT_APP_ENABLE_QR_FEATURE=true

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start both frontend and backend
CMD ["sh", "-c", "cd backend && node server.js & npx serve -s build -l 3000"]