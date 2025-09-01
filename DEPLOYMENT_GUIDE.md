# Static QR Feature Deployment Guide

## Overview
This document provides comprehensive information for deploying the Static QR feature for the COB (Client On-Boarding) platform with HDFC UPI integration.

## Architecture Overview

### Frontend (React Application)
- **Framework**: React 17.0.2 with Redux Toolkit for state management
- **Port**: 3000 (development)
- **Build Command**: `npm run build`
- **Key Dependencies Added**: 
  - `qrcode`: For QR code generation
  - `socket.io-client`: For real-time webhook notifications
  - Existing dependencies used: `crypto-js` for encryption

### Backend (Node.js Server)
- **Framework**: Express.js
- **Port**: 3001
- **Runtime**: Node.js
- **Key Features**:
  - Webhook endpoint for HDFC callbacks
  - Local file-based transaction storage (development)
  - Socket.io for real-time updates
  - AES-128 ECB encryption/decryption

## New Files Created

### Frontend Files
```
src/
├── components/dashboard/AllPages/static-qr/
│   ├── QRGenerationEnhanced.js        # Main QR generation form
│   ├── QRPayments.js                   # QR management dashboard
│   ├── components/
│   │   ├── QRTemplateDesign.js        # QR template renderer
│   │   ├── QRPreviewModal.js          # QR preview component
│   │   ├── QRDesignCustomizer.js      # Design customization
│   │   └── WebhookHandler.js          # Webhook notification handler
├── slices/sabqr/
│   └── sabqrSlice.js                   # Redux slice for QR state
├── services/
│   ├── sabqr/sabqr.service.js         # QR service layer
│   └── localTransactionService.js      # Transaction management
├── utilities/
│   ├── encryption.js                   # HDFC encryption utilities
│   └── vpaGenerator.js                 # VPA generation with merchant prefix
└── config/
    ├── hdfc.config.js                  # HDFC configuration
    └── webhook.config.js               # Webhook URL configuration
```

### Backend Files
```
backend/
├── server.js                           # Express server with Socket.io
├── routes/
│   └── hdfc.webhook.js                # HDFC webhook endpoint
├── services/
│   └── LocalTransactionStore.js       # Local transaction storage
├── data/
│   └── transactions.json               # Transaction data file
└── simulate-hdfc-payment.js           # Payment simulator for testing
```

## Modified Files

### Critical Files Modified
1. **src/components/dashboard/sidebar.js** - Navigation menu reordering
2. **src/slices/sabqr/sabqrSlice.js** - Added localStorage persistence
3. **src/utilities/encryption.js** - Updated VPA generation logic

## API Endpoints

### Backend Endpoints

#### 1. Webhook Endpoint
```
POST /api/hdfc/webhook
Content-Type: application/json
Body: {
  "encryptedData": "AES-128-ECB encrypted string"
}
```

#### 2. Transaction Endpoints
```
GET /api/transactions          # Get all transactions
GET /api/transactions/:id      # Get specific transaction
POST /api/transactions/search  # Search transactions
```

#### 3. Health Check
```
GET /api/health                # Server health status
```

## Environment Variables Required

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_USE_TUNNEL=false
REACT_APP_DEFAULT_MERCHANT=SRS Live Technologies
REACT_APP_HDFC_ENV=UAT
```

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
HDFC_MERCHANT_KEY=ef880fed3abe10d54102a24e05e41ca2
HDFC_MERCHANT_ID=HDFC000010380443
HDFC_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=your_database_url  # For production
```

## Database Schema (For Production)

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    qr_id VARCHAR(50),
    merchant_name VARCHAR(255),
    merchant_txn_id VARCHAR(255),
    bank_rrn VARCHAR(255),
    amount DECIMAL(10, 2),
    status VARCHAR(50),
    payer_vpa VARCHAR(255),
    payer_name VARCHAR(255),
    mobile_number VARCHAR(20),
    transaction_date TIMESTAMP,
    settlement_amount DECIMAL(10, 2),
    settlement_date DATE,
    payment_mode VARCHAR(50),
    status_description TEXT,
    mcc VARCHAR(10),
    tip_amount DECIMAL(10, 2),
    convenience_fee DECIMAL(10, 2),
    net_amount DECIMAL(10, 2),
    checksum VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_qr_id ON transactions(qr_id);
CREATE INDEX idx_status ON transactions(status);
CREATE INDEX idx_created_at ON transactions(created_at);
```

### QR Codes Table
```sql
CREATE TABLE qr_codes (
    id SERIAL PRIMARY KEY,
    qr_identifier VARCHAR(10) UNIQUE NOT NULL,
    merchant_id VARCHAR(50),
    merchant_name VARCHAR(255),
    reference_name VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    vpa VARCHAR(255),
    qr_data TEXT,
    qr_image TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_qr_identifier ON qr_codes(qr_identifier);
CREATE INDEX idx_merchant_id ON qr_codes(merchant_id);
```

## Docker Configuration

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "backend/server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - HDFC_MERCHANT_KEY=${HDFC_MERCHANT_KEY}
    volumes:
      - ./backend/data:/app/backend/data

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=sabpaisa
      - POSTGRES_USER=sabpaisa_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Deployment Steps

### 1. Pre-deployment Checklist
- [ ] Remove all console.log statements
- [ ] Update environment variables for production
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure webhook URL with HDFC

### 2. Build Process
```bash
# Frontend
npm install
npm run build

# Backend
cd backend
npm install
```

### 3. Database Migration
```bash
# Run migrations (if using migration tool)
npm run migrate:production
```

### 4. Start Services
```bash
# Using PM2 (recommended)
pm2 start backend/server.js --name "sabpaisa-backend"
pm2 save
pm2 startup

# Or using Docker
docker-compose up -d
```

## Security Considerations

1. **Encryption Keys**: Store HDFC merchant key securely in environment variables
2. **CORS**: Configure proper CORS settings for production domain
3. **Rate Limiting**: Implement rate limiting on webhook endpoint
4. **Input Validation**: All inputs are validated before processing
5. **HTTPS**: Ensure all endpoints use HTTPS in production
6. **Checksum Validation**: Verify checksums on all HDFC callbacks

## Monitoring & Logging

1. **Application Logs**: 
   - Frontend: Browser console (development)
   - Backend: PM2 logs or Docker logs

2. **Transaction Logs**: Stored in database with full audit trail

3. **Error Tracking**: Implement error tracking service (e.g., Sentry)

## Testing Checklist

- [ ] QR Generation with various inputs
- [ ] VPA uniqueness across merchants
- [ ] Webhook callback processing
- [ ] Transaction persistence
- [ ] Real-time updates via Socket.io
- [ ] Payment processing with HDFC QA app
- [ ] Error handling scenarios

## Rollback Plan

1. Keep previous version backup
2. Database backup before deployment
3. Feature flag to disable static QR if needed
4. Rollback commands:
```bash
# Revert to previous version
git checkout <previous-tag>
npm install
npm run build
pm2 restart sabpaisa-backend
```

## Support Contacts

- **HDFC Integration Team**: For webhook configuration
- **DevOps Team**: For deployment assistance
- **Development Team**: For feature clarifications

## Notes

1. The VPA format has been updated to include merchant prefix for uniqueness
2. Local file storage is only for development; production must use database
3. Webhook URL must be configured with HDFC before going live
4. The system supports multi-merchant architecture

---
Generated: 2025-09-01
Version: 1.0.0
Feature: Static QR with HDFC Integration