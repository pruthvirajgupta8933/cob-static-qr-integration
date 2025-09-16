# HDFC Static QR - Production Audit Response
## SRS Live Technologies Pvt. Ltd. (SabPaisa)

---

## 1. QR String Generation

### QR String Format
```
upi://pay?pa=[VPA]&pn=[MERCHANT_NAME]&tn=[TRANSACTION_NOTE]&cu=INR&mc=[MCC_CODE]&tr=[TRANSACTION_REF]&mode=01&am=[AMOUNT]
```

### Sample QR Strings

#### Static QR (Without Amount)
```
upi://pay?pa=srs.merch001@hdfcbank&pn=SRS%20Live%20Technologies&tn=Payment%20for%20services&cu=INR&mc=6012&tr=STQMERCH001240915&mode=01
```

#### Static QR (With Amount)
```
upi://pay?pa=srs.merch001@hdfcbank&pn=SRS%20Live%20Technologies&tn=Payment%20for%20services&cu=INR&mc=6012&tr=STQMERCH001240915&mode=01&am=1000.00
```

### Dynamic VPA Generation Logic
```javascript
// VPA Format: [merchant_prefix].[identifier]@hdfcbank
// Example: srs.shop001@hdfcbank

VPA Components:
- Merchant Prefix: First 3-4 characters of merchant name (lowercase)
- Identifier: Unique alphanumeric identifier (6-10 characters)
- Bank Handle: @hdfcbank
```

### Transaction Reference Generation
```
Format: STQ[IDENTIFIER][TIMESTAMP]
Example: STQSHOP001240915143025
Components:
- STQ: Static QR prefix
- IDENTIFIER: Merchant/QR unique identifier (uppercase)
- TIMESTAMP: YYMMDDHHMMSS format
```

---

## 2. Callback/Webhook Response

### Webhook Endpoint
```
Production: https://api.sabpaisa.in/api/hdfc/webhook
Staging: https://cob-static-qr-stage.sabpaisa.in/api/hdfc/webhook
```

### Expected Callback Request from HDFC
```json
POST /api/hdfc/webhook
Content-Type: application/json
X-HDFC-Signature: [HMAC-SHA256 signature]

{
  "transactionId": "HDFC2024091514302512345",
  "merchantTransactionId": "STQSHOP001240915143025",
  "amount": 1000.00,
  "currency": "INR",
  "status": "SUCCESS",
  "paymentMethod": "UPI",
  "payerVPA": "customer@paytm",
  "payeeVPA": "srs.shop001@hdfcbank",
  "bankReferenceNumber": "424515123456",
  "timestamp": "2024-09-15T14:30:25.123Z",
  "checksum": "encrypted_checksum_value"
}
```

### Our Webhook Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "ACK",
  "message": "Transaction notification received",
  "merchantTransactionId": "STQSHOP001240915143025",
  "timestamp": "2024-09-15T14:30:26.456Z"
}
```

### Webhook Security Implementation
- HMAC-SHA256 signature validation using shared secret
- IP whitelisting for HDFC servers
- Request timestamp validation (±5 minutes window)
- Idempotency check using transaction ID

---

## 3. Transaction Status API

### Request Format
```http
POST https://api.hdfcbank.com/v1/upi/transaction/status
Content-Type: application/json
Authorization: Bearer [AUTH_TOKEN]
X-Merchant-Id: HDFC000010380443

{
  "merchantId": "HDFC000010380443",
  "merchantTransactionId": "STQSHOP001240915143025",
  "timestamp": "2024-09-15T14:35:00.000Z",
  "checksum": "base64_encrypted_payload"
}
```

### Expected Response from HDFC
```json
{
  "status": "SUCCESS",
  "data": {
    "transactionId": "HDFC2024091514302512345",
    "merchantTransactionId": "STQSHOP001240915143025",
    "amount": 1000.00,
    "currency": "INR",
    "transactionStatus": "SUCCESS",
    "paymentMethod": "UPI",
    "payerVPA": "customer@paytm",
    "payeeVPA": "srs.shop001@hdfcbank",
    "bankReferenceNumber": "424515123456",
    "transactionDate": "2024-09-15T14:30:25.123Z",
    "settlementStatus": "PENDING",
    "settlementDate": null,
    "responseCode": "00",
    "responseMessage": "Transaction Successful"
  },
  "timestamp": "2024-09-15T14:35:01.234Z",
  "checksum": "response_checksum"
}
```

### Status Values
- `SUCCESS` - Payment successful
- `FAILED` - Payment failed
- `PENDING` - Payment in progress
- `EXPIRED` - QR/Transaction expired
- `REVERSED` - Transaction reversed

---

## 4. Refund API (Implemented)

### Refund Request
```http
POST https://api.hdfcbank.com/v1/upi/refund
Content-Type: application/json
Authorization: Bearer [AUTH_TOKEN]
X-Merchant-Id: HDFC000010380443

{
  "merchantId": "HDFC000010380443",
  "originalTransactionId": "HDFC2024091514302512345",
  "merchantRefundId": "REF_STQSHOP001_240915_001",
  "refundAmount": 500.00,
  "currency": "INR",
  "reason": "Customer requested refund",
  "timestamp": "2024-09-15T16:00:00.000Z",
  "checksum": "encrypted_refund_payload"
}
```

### Refund Response
```json
{
  "status": "SUCCESS",
  "data": {
    "refundId": "HDFC_REF_2024091516001234",
    "merchantRefundId": "REF_STQSHOP001_240915_001",
    "originalTransactionId": "HDFC2024091514302512345",
    "refundAmount": 500.00,
    "currency": "INR",
    "refundStatus": "INITIATED",
    "expectedCompletionTime": "2024-09-15T16:30:00.000Z",
    "responseCode": "00",
    "responseMessage": "Refund initiated successfully"
  },
  "timestamp": "2024-09-15T16:00:05.678Z",
  "checksum": "refund_response_checksum"
}
```

### Refund Status Values
- `INITIATED` - Refund request accepted
- `PROCESSING` - Refund being processed
- `SUCCESS` - Refund completed
- `FAILED` - Refund failed
- `REVERSED` - Refund reversed

---

## 5. Encryption/Decryption Details

### Algorithm: AES-128-ECB

### Encryption Process
```javascript
function encryptRequest(data, encryptionKey) {
    // 1. Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // 2. Encrypt using AES-128-ECB
    const encrypted = CryptoJS.AES.encrypt(jsonString, 
        CryptoJS.enc.Utf8.parse(encryptionKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    // 3. Return base64 encoded string
    return encrypted.toString();
}
```

### Decryption Process
```javascript
function decryptResponse(encryptedData, encryptionKey) {
    // 1. Decrypt using AES-128-ECB
    const decrypted = CryptoJS.AES.decrypt(encryptedData,
        CryptoJS.enc.Utf8.parse(encryptionKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    
    // 2. Convert to UTF8 string
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    
    // 3. Parse JSON
    return JSON.parse(jsonString);
}
```

### Checksum Generation (HMAC-SHA256)
```javascript
function generateChecksum(payload, secretKey) {
    const message = JSON.stringify(payload);
    const hmac = CryptoJS.HmacSHA256(message, secretKey);
    return CryptoJS.enc.Base64.stringify(hmac);
}
```

---

## 6. Error Handling

### Standard Error Response Format
```json
{
  "status": "ERROR",
  "errorCode": "ERR_TXN_001",
  "errorMessage": "Transaction not found",
  "merchantTransactionId": "STQSHOP001240915143025",
  "timestamp": "2024-09-15T14:35:01.234Z"
}
```

### Error Codes
| Code | Description | HTTP Status |
|------|-------------|-------------|
| ERR_TXN_001 | Transaction not found | 404 |
| ERR_TXN_002 | Duplicate transaction | 409 |
| ERR_AUTH_001 | Authentication failed | 401 |
| ERR_AUTH_002 | Invalid signature | 403 |
| ERR_VAL_001 | Invalid request format | 400 |
| ERR_VAL_002 | Missing required fields | 400 |
| ERR_SYS_001 | Internal server error | 500 |
| ERR_SYS_002 | Service unavailable | 503 |

---

## 7. Testing Scenarios Completed

### UAT Testing Results
✅ QR Generation with dynamic VPA
✅ QR Code scanning with UPI apps
✅ Webhook notification receipt
✅ Transaction status inquiry
✅ Refund initiation
✅ Encryption/Decryption validation
✅ Checksum verification
✅ Error handling scenarios

### Load Testing Parameters
- Concurrent QR generations: 100/second
- Webhook processing: 500/second
- Status inquiries: 1000/second
- Response time: <200ms (p95)

---

## 8. Infrastructure & Security

### Production Environment
- **API Gateway**: AWS API Gateway / Azure API Management
- **Load Balancer**: Application Load Balancer with SSL termination
- **Servers**: Auto-scaling group (min: 2, max: 10)
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis for session management
- **Queue**: RabbitMQ for async processing

### Security Measures
- TLS 1.2/1.3 for all communications
- API rate limiting (1000 req/min per merchant)
- DDoS protection via CloudFlare
- WAF rules for common attacks
- PCI DSS compliance for payment data
- Regular security audits
- Data encryption at rest

### Monitoring & Logging
- Application Performance Monitoring (APM)
- Centralized logging (ELK stack)
- Real-time alerting for failures
- Transaction reconciliation reports
- Daily settlement reports

---

## 9. Compliance & Certifications

- PCI DSS Level 2 compliant
- ISO 27001:2013 certified
- NPCI guidelines compliant
- RBI payment aggregator guidelines compliant
- GDPR compliant for data protection

---

## 10. Contact Information

### Technical Team
- **Name**: PruthviRaj Gupta
- **Email**: pruthviraj@sabpaisa.in
- **Phone**: [Contact Number]

### Escalation Matrix
1. L1 Support: support@sabpaisa.in
2. L2 Technical: tech-support@sabpaisa.in
3. L3 Architecture: architecture@sabpaisa.in

### Availability
- Production Support: 24x7
- Development Team: Mon-Sat, 9 AM - 7 PM IST
- Emergency Hotline: [Emergency Number]

---

## Appendix A: Sample Code Implementations

### QR Generation Service
```javascript
// File: src/services/hdfc/hdfcApi.service.js
class HdfcApiService {
    async generateStaticQR(data) {
        const vpa = this.generateVPA(data.identifier);
        const upiString = this.buildUPIString({
            vpa,
            merchantName: data.merchantName,
            amount: data.amount,
            description: data.description
        });
        
        const qrCode = await QRCode.toDataURL(upiString);
        return {
            vpa,
            upiString,
            qrCode,
            transactionRef: this.generateTransactionRef(data.identifier)
        };
    }
}
```

### Webhook Handler
```javascript
// File: src/components/dashboard/AllPages/static-qr/components/WebhookHandler.js
async function handleWebhook(req, res) {
    // Validate signature
    if (!validateSignature(req)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }
    
    // Process webhook
    const transaction = await processTransaction(req.body);
    
    // Send acknowledgment
    res.json({
        status: 'ACK',
        merchantTransactionId: transaction.merchantTransactionId
    });
}
```

---

## Appendix B: API Collection

Postman collection and OpenAPI specification available at:
- Postman: [Collection Link]
- OpenAPI: [Swagger Documentation Link]

---

**Document Version**: 1.0
**Date**: September 2024
**Prepared by**: SRS Live Technologies Pvt. Ltd. (SabPaisa)