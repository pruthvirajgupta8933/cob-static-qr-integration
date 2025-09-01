# Static QR Feature - Production Deployment Checklist

## Pre-Deployment Configuration Updates

### 1. Environment Variables - Frontend (.env.production)
```bash
# API URLs (Using existing SabPaisa infrastructure)
REACT_APP_API_URL=https://cobawsapi.sabpaisa.in
REACT_APP_WEBHOOK_URL=https://cobawsapi.sabpaisa.in
REACT_APP_HDFC_ENV=PRODUCTION
REACT_APP_DEFAULT_MERCHANT=SRS Live Technologies
REACT_APP_USE_TUNNEL=false
NODE_ENV=production
```

### 2. Environment Variables - Backend (.env.production)
```bash
NODE_ENV=production
PORT=3001

# Database Configuration
DATABASE_URL=postgresql://[username]:[password]@[host]:5432/sabpaisa_prod

# HDFC Configuration
HDFC_MERCHANT_KEY=ef880fed3abe10d54102a24e05e41ca2
HDFC_MERCHANT_ID=HDFC000010380443
HDFC_WEBHOOK_SECRET=[TO_BE_PROVIDED_BY_HDFC]

# CORS Configuration
CORS_ORIGIN=https://merchantonboarding.sabpaisa.in

# Socket.io Configuration
SOCKET_IO_ORIGIN=https://merchantonboarding.sabpaisa.in
```

### 3. Update Configuration Files

#### src/config/webhook.config.js
```javascript
const WEBHOOK_CONFIG = {
    // Production URL - Update this with actual production endpoint
    PRODUCTION_WEBHOOK_URL: 'https://cobawsapi.sabpaisa.in/api/hdfc/webhook',
    
    // Staging URL for testing
    STAGING_WEBHOOK_URL: 'https://stgcobapi.sabpaisa.in/api/hdfc/webhook',
    
    // Local development URL
    LOCAL_WEBHOOK_URL: 'http://localhost:3001/api/hdfc/webhook',
};
```

#### src/services/socket.service.js
```javascript
// Update line 14
const SOCKET_URL = process.env.REACT_APP_WEBHOOK_URL || 'https://cobawsapi.sabpaisa.in';
```

#### src/services/localTransactionService.js
```javascript
// Update line 5
this.baseURL = process.env.REACT_APP_WEBHOOK_URL || 'https://cobawsapi.sabpaisa.in';
```

## URLs to Register with HDFC

### Production Webhook URL
```
URL: https://cobawsapi.sabpaisa.in/api/hdfc/webhook
Method: POST
Content-Type: application/json
Headers: 
  - X-Merchant-Id: HDFC000010380443
  - X-Webhook-Secret: [TO_BE_CONFIGURED]
```

### UAT/Staging Webhook URL (for testing)
```
URL: https://stgcobapi.sabpaisa.in/api/hdfc/webhook
Method: POST
Content-Type: application/json
```

## Code Changes Required Before Deployment

### 1. Remove Debug Logs
```bash
# Find and remove all console.log statements
grep -r "console.log" src/ --include="*.js" --include="*.jsx"

# Files to clean:
- src/utilities/vpaGenerator.js (remove lines 17, 29, 52, 67, 77)
- src/slices/sabqr/sabqrSlice.js (remove lines 57-58, 80-85)
```

### 2. Update API Endpoints
- [ ] Verify all API calls use production URLs
- [ ] Remove any hardcoded localhost references
- [ ] Ensure webhook URLs are environment-specific

### 3. Database Schema for Production
```sql
-- Create database
CREATE DATABASE sabpaisa_prod;

-- Transactions table
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
    tip_amount DECIMAL(10, 2) DEFAULT 0,
    convenience_fee DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2),
    checksum VARCHAR(255),
    raw_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QR codes table
CREATE TABLE qr_codes (
    id SERIAL PRIMARY KEY,
    qr_identifier VARCHAR(10) UNIQUE NOT NULL,
    merchant_id VARCHAR(50),
    merchant_name VARCHAR(255),
    merchant_prefix VARCHAR(3),
    reference_name VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    vpa VARCHAR(255) UNIQUE,
    qr_data TEXT,
    qr_image TEXT,
    max_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_qr_id ON transactions(qr_id);
CREATE INDEX idx_merchant_name ON transactions(merchant_name);
CREATE INDEX idx_status ON transactions(status);
CREATE INDEX idx_created_at ON transactions(created_at);
CREATE INDEX idx_qr_identifier ON qr_codes(qr_identifier);
CREATE INDEX idx_qr_merchant_id ON qr_codes(merchant_id);
CREATE INDEX idx_qr_vpa ON qr_codes(vpa);
```

## Deployment Steps

### Step 1: Frontend Build & Deploy
```bash
# Clean install and build
rm -rf node_modules package-lock.json
npm install
npm run build

# Deploy to existing SabPaisa infrastructure
# Copy build files to production server
scp -r build/* user@production-server:/var/www/merchantonboarding/
```

### Step 2: Backend Deployment
```bash
# On production server
cd /opt/sabpaisa/backend
git pull origin production
npm install --production

# Run database migrations
psql -U sabpaisa_user -d sabpaisa_prod -f schema.sql

# Restart services
pm2 restart sabpaisa-backend
pm2 save
```

### Step 3: Nginx Configuration
```nginx
# Add to existing nginx config
location /api/hdfc {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Socket.io support
location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## Testing Checklist

### Pre-Production Testing
- [ ] Test QR generation with different merchant names
- [ ] Verify VPA uniqueness (merchant prefix working)
- [ ] Test with HDFC QA application
- [ ] Verify webhook receives callbacks
- [ ] Check transaction persistence to database
- [ ] Test Socket.io real-time updates
- [ ] Verify localStorage persistence
- [ ] Test with multiple concurrent users

### Post-Deployment Verification
- [ ] Frontend loads at https://merchantonboarding.sabpaisa.in
- [ ] Backend health check: `curl https://cobawsapi.sabpaisa.in/api/health`
- [ ] Webhook endpoint accessible: `curl -X POST https://cobawsapi.sabpaisa.in/api/hdfc/webhook`
- [ ] Database connectivity verified
- [ ] Socket.io connection established
- [ ] Generate test QR and verify VPA format
- [ ] Perform test transaction with HDFC QA app

## Rollback Plan

### Quick Rollback Steps
```bash
# Frontend rollback
cd /var/www/merchantonboarding/
git checkout previous-release-tag
npm install
npm run build

# Backend rollback
cd /opt/sabpaisa/backend
git checkout previous-release-tag
npm install
pm2 restart sabpaisa-backend

# Database rollback (if needed)
psql -U sabpaisa_user -d sabpaisa_prod -f rollback.sql
```

## Critical Files to Backup
- [ ] Current production build folder
- [ ] Database backup
- [ ] Environment configuration files
- [ ] Nginx configuration

## HDFC Integration Requirements

### Information to Send to HDFC Team
1. **Production Webhook URL**: https://cobawsapi.sabpaisa.in/api/hdfc/webhook
2. **Staging Webhook URL**: https://stgcobapi.sabpaisa.in/api/hdfc/webhook
3. **Merchant ID**: HDFC000010380443
4. **VPA Format**: sabpaisa.{merchantPrefix}{identifier}@hdfcbank
   - Example: sabpaisa.srswin25@hdfcbank
5. **IP Whitelist** (if required): [Your production server IPs]

### Expected from HDFC
1. Webhook secret key for signature validation
2. Production API endpoints
3. Production PSP handle confirmation (@hdfcbank or @okhdfcbank)
4. Rate limits and throttling information
5. Production merchant key (if different from UAT)

## Monitoring Setup

### Application Monitoring
```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Setup alerts
pm2 install pm2-slack
pm2 set pm2-slack:slack_url YOUR_SLACK_WEBHOOK_URL
```

### Database Monitoring
```sql
-- Monitor transaction volume
SELECT DATE(created_at), COUNT(*), SUM(amount) 
FROM transactions 
GROUP BY DATE(created_at) 
ORDER BY DATE(created_at) DESC;

-- Monitor QR generation
SELECT DATE(created_at), COUNT(*) 
FROM qr_codes 
GROUP BY DATE(created_at) 
ORDER BY DATE(created_at) DESC;
```

## Security Checklist

- [ ] SSL certificates valid and properly configured
- [ ] Environment variables secured and not in repository
- [ ] Database credentials encrypted
- [ ] API rate limiting configured
- [ ] CORS properly restricted to production domain
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection headers configured
- [ ] Webhook signature validation implemented
- [ ] Audit logging enabled

## Support Information

### Internal Contacts
- **DevOps Team**: For deployment and infrastructure
- **Database Team**: For database setup and optimization
- **Security Team**: For security review and approval

### External Contacts
- **HDFC Technical Support**: [Contact details to be added]
- **HDFC Integration Manager**: [Contact details to be added]

## Sign-off Required From

- [ ] Development Team Lead
- [ ] QA Team Lead
- [ ] Security Team
- [ ] DevOps Team
- [ ] Product Manager
- [ ] HDFC Integration Team

---

**Document Version**: 1.0  
**Last Updated**: 2025-09-01  
**Next Review Date**: Before production deployment