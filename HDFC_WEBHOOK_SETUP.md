# HDFC Webhook Integration Setup Guide

## Current Status: ✅ 90% Complete

### ✅ What's Implemented

1. **Frontend Components**
   - QR Generation with proper VPA format
   - Transaction tracking with Redux
   - LocalStorage persistence
   - Payment Simulator for testing
   - Socket.io client for real-time updates
   - WebhookHandler component

2. **Backend Infrastructure**
   - Complete webhook endpoint (`/api/hdfc/webhook`)
   - AES-128 ECB encryption/decryption
   - 21-field callback parsing
   - Database schema and connection
   - Socket.io server for real-time events
   - Test webhook simulator

3. **Security Features**
   - Checksum validation
   - Duplicate transaction prevention
   - Environment-based configuration
   - Error logging

### 🔴 What's Missing for Production

1. **HDFC Registration** (CRITICAL)
   - Register webhook URL with HDFC: `https://api.sabpaisa.in/api/hdfc/webhook`
   - Provide static IP address to HDFC for whitelisting
   - Complete UAT testing with HDFC QA app

2. **Backend Deployment** (CRITICAL)
   - Deploy backend server to production
   - Configure SSL certificate
   - Setup database on production server
   - Configure firewall rules

## Quick Start Guide

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Edit `backend/.env` and set your database credentials:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sabpaisa_qr
DB_USER=root
DB_PASSWORD=yourpassword
```

### 3. Start Backend Server
```bash
cd backend
npm start
```
You should see:
```
===========================================
HDFC Webhook Server running on port 3001
Environment: development
Webhook URL: http://localhost:3001/api/hdfc/webhook
===========================================
```

### 4. Test Webhook Integration
In a new terminal:
```bash
cd backend
node test-webhook.js success
```

This will simulate an HDFC payment callback.

### 5. Verify Real-time Updates
1. Open the frontend app (http://localhost:3000)
2. Navigate to QR Solutions > Static QR > Transactions
3. Run the test webhook command
4. You should see the transaction appear in real-time

## How It Works

### Payment Flow
1. Customer scans QR code and makes payment
2. HDFC sends encrypted callback to webhook URL
3. Backend decrypts and validates the callback
4. Transaction is saved to database
5. Socket.io emits real-time event
6. Frontend receives event and updates UI
7. Transaction appears instantly in dashboard

### Data Flow
```
HDFC Payment → Webhook Endpoint → Decrypt → Validate → Database
                                                ↓
Frontend ← Socket.io ← Real-time Event ← Process Transaction
```

## Testing Checklist

### Local Testing
- [x] Generate QR code
- [x] Save QR data to localStorage
- [x] Add test transaction via Payment Simulator
- [x] Verify transaction persists after refresh
- [ ] Start backend server
- [ ] Test webhook with simulator
- [ ] Verify real-time updates work

### UAT Testing with HDFC
- [ ] Install HDFC QA application
- [ ] Scan generated QR code
- [ ] Make test payment
- [ ] Verify webhook receives callback
- [ ] Check transaction appears in dashboard

## Production Deployment

### 1. Backend Server Setup
```bash
# On production server
git clone [repository]
cd backend
npm install --production
```

### 2. Environment Configuration
Create `backend/.env.production`:
```env
NODE_ENV=production
WEBHOOK_PORT=3001
WEBHOOK_BASE_URL=https://api.sabpaisa.in
FRONTEND_URL=https://yourfrontend.com

# Use production database
DB_TYPE=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=sabpaisa_production
DB_USER=prod_user
DB_PASSWORD=secure_password

# HDFC Production credentials
HDFC_MERCHANT_ID=[Production ID from HDFC]
HDFC_MERCHANT_KEY=[Production Key from HDFC]
HDFC_VPA=[Production VPA from HDFC]
```

### 3. Process Management
Use PM2 for production:
```bash
npm install -g pm2
pm2 start backend/server.js --name hdfc-webhook
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```nginx
location /api/hdfc/webhook {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## HDFC Registration Process

### Information to Provide to HDFC

1. **Webhook URL**: `https://api.sabpaisa.in/api/hdfc/webhook`
2. **Server IP**: [Your production server IP]
3. **SSL Certificate**: Ensure valid SSL certificate
4. **Contact Email**: [Technical contact email]
5. **Contact Phone**: [Technical contact phone]

### HDFC Will Provide

1. Production Merchant ID
2. Production Merchant Key
3. Production VPA format
4. IP addresses to whitelist
5. Go-live date

## Troubleshooting

### Issue: Webhook not receiving callbacks
**Solution**: 
- Check if backend server is running
- Verify webhook URL is registered with HDFC
- Check firewall rules
- Review webhook logs in database

### Issue: Transactions not appearing in real-time
**Solution**:
- Check Socket.io connection in browser console
- Verify REACT_APP_WEBHOOK_URL is correct
- Check if backend server Socket.io is running
- Review browser console for errors

### Issue: Payment failing in HDFC QA app
**Solution**:
- Ensure VPA is lowercase
- Verify mode parameter is '01' not '01S'
- Check MCC code is '6012' for UAT
- Confirm merchant credentials are correct

## Support Contacts

### HDFC Technical Support
- Email: [HDFC support email]
- Phone: [HDFC support phone]
- UAT Testing: [HDFC UAT contact]

### Internal Support
- Backend Issues: [Your backend team]
- Frontend Issues: [Your frontend team]
- Database Issues: [Your DBA team]

## Security Considerations

1. **Never commit** `.env` files to repository
2. **Always validate** webhook checksums
3. **Implement rate limiting** in production
4. **Use IP whitelisting** for webhook endpoints
5. **Monitor webhook failures** and set up alerts
6. **Encrypt sensitive data** in database
7. **Regular security audits** of webhook handling

## Next Steps

1. ✅ Complete backend server setup
2. ✅ Test webhook integration locally
3. ⏳ Deploy backend to staging environment
4. ⏳ Complete UAT testing with HDFC
5. ⏳ Deploy to production
6. ⏳ Register production webhook URL with HDFC
7. ⏳ Go-live with HDFC approval

---

*Last Updated: January 2025*
*Version: 1.0*