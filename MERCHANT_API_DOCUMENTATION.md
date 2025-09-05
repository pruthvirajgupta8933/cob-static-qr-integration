# Merchant API Documentation

## Overview
The COB QR Merchant API allows merchants to integrate QR code generation and transaction tracking into their own dashboards and systems. This RESTful API provides complete access to QR functionality with secure authentication.

## Base URL
```
Production: https://api.sabpaisa.in/api/v1/merchant
Staging: https://staging-api.sabpaisa.in/api/v1/merchant
Development: http://localhost:3001/api/v1/merchant
```

## Authentication

All API requests require authentication using API keys.

### Headers Required
```http
X-API-Key: mk_live_YOURMERCHANTID
X-API-Secret: sk_live_your_secret_key_here
```

### Test Credentials
```javascript
// Test Merchant 1
X-API-Key: mk_live_MERCH001
X-API-Secret: sk_live_[contact support for secret]

// Test Merchant 2 (Limited permissions)
X-API-Key: mk_test_MERCH002
X-API-Secret: sk_test_[contact support for secret]
```

## Rate Limiting

- **Production**: 100 requests per minute
- **Test Mode**: 50 requests per minute

Rate limit information is returned in response headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-09-03T10:30:00Z
```

## API Endpoints

### 1. Generate Single QR Code

**Endpoint:** `POST /qr/generate`

**Description:** Generate a single QR code for payment collection.

**Request Body:**
```json
{
  "merchant_name": "ABC Electronics Store",
  "merchant_id": "MERCH001",
  "reference_name": "ABC Electronics - Main Branch",
  "amount": 1500.00,
  "description": "Payment for Order #12345",
  "mobile_number": "9876543210",
  "email": "merchant@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_id": "a1b2c3d4e5f6",
    "qr_image": "data:image/png;base64,iVBORw0KGgoAAAA...",
    "vpa": "abcelectr.merch001@hdfc",
    "upi_string": "upi://pay?pa=abcelectr.merch001@hdfc&pn=ABC%20Electronics&tn=Payment&cu=INR&am=1500.00",
    "transaction_ref": "APIMERCH001123456",
    "amount": 1500.00
  }
}
```

### 2. Generate Bulk QR Codes

**Endpoint:** `POST /qr/bulk`

**Description:** Generate multiple QR codes in a single request (max 100).

**Request Body:**
```json
{
  "merchants": [
    {
      "merchant_name": "Store 1",
      "merchant_id": "STORE001",
      "reference_name": "Store 1 - Downtown",
      "amount": 500.00,
      "mobile_number": "9876543210"
    },
    {
      "merchant_name": "Store 2",
      "merchant_id": "STORE002",
      "reference_name": "Store 2 - Mall",
      "amount": 750.00,
      "mobile_number": "9876543211"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "batch_id": "BATCH_API_1234567890",
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [
    {
      "merchant_id": "STORE001",
      "qr_id": "abc123",
      "status": "generated"
    },
    {
      "merchant_id": "STORE002",
      "qr_id": "def456",
      "status": "generated"
    }
  ],
  "errors": []
}
```

### 3. List QR Codes

**Endpoint:** `GET /qr/list`

**Description:** Get a paginated list of QR codes for your merchant account.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `status` - Filter by status (active/inactive)
- `from_date` - Filter from date (YYYY-MM-DD)
- `to_date` - Filter to date (YYYY-MM-DD)

**Example Request:**
```
GET /qr/list?page=1&limit=10&status=active&from_date=2025-09-01
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_codes": [
      {
        "qr_id": "abc123",
        "merchant_id": "MERCH001",
        "merchant_name": "ABC Electronics",
        "amount": 1500.00,
        "status": "active",
        "created_at": "2025-09-03T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

### 4. Get QR Code Details

**Endpoint:** `GET /qr/:qr_id`

**Description:** Get detailed information about a specific QR code.

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_id": "abc123",
    "merchant_id": "MERCH001",
    "merchant_name": "ABC Electronics",
    "reference_name": "ABC Electronics - Main",
    "amount": 1500.00,
    "vpa": "abcelectr.merch001@hdfc",
    "transaction_ref": "APIMERCH001123456",
    "qr_image": "data:image/png;base64,iVBORw0KGgoAAAA...",
    "upi_string": "upi://pay?pa=...",
    "status": "active",
    "created_at": "2025-09-03T10:00:00Z"
  }
}
```

### 5. List Transactions

**Endpoint:** `GET /transactions`

**Description:** Get transaction history for your QR codes.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `qr_id` - Filter by specific QR code
- `status` - Filter by status (SUCCESS/FAILED/PENDING)
- `from_date` - Start date
- `to_date` - End date

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "transaction_id": "TXN123456",
        "qr_id": "abc123",
        "amount": 1500.00,
        "status": "SUCCESS",
        "payer_vpa": "customer@paytm",
        "payer_name": "John Doe",
        "transaction_date": "2025-09-03T11:30:00Z",
        "bank_rrn": "123456789012"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    },
    "summary": {
      "total_amount": 45000.00,
      "successful_count": 140,
      "failed_count": 10
    }
  }
}
```

### 6. Get Analytics

**Endpoint:** `GET /analytics`

**Description:** Get analytics and insights for your QR codes and transactions.

**Query Parameters:**
- `period` - Time period (24h/7d/30d/90d)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "qr_codes": {
      "total": 25,
      "active": 20,
      "created_in_period": 5
    },
    "transactions": {
      "total": 250,
      "successful": 230,
      "failed": 20,
      "total_amount": 125000.00,
      "average_amount": 500.00
    },
    "top_performing_qr": [
      {
        "qr_id": "abc123",
        "merchant_name": "Store 1",
        "transaction_count": 45,
        "total_amount": 22500.00
      }
    ]
  }
}
```

### 7. Deactivate QR Code

**Endpoint:** `PUT /qr/:qr_id/deactivate`

**Description:** Deactivate a QR code to stop accepting payments.

**Response:**
```json
{
  "success": true,
  "message": "QR code deactivated successfully"
}
```

### 8. Register Webhook

**Endpoint:** `POST /webhook/register`

**Description:** Register a webhook URL to receive real-time transaction notifications.

**Request Body:**
```json
{
  "url": "https://your-domain.com/webhook/payments",
  "events": ["transaction.success", "transaction.failed", "qr.created"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "webhook_id": "wh_123456",
    "url": "https://your-domain.com/webhook/payments",
    "events": ["transaction.success", "transaction.failed"],
    "secret": "wh_secret_abc123xyz",
    "status": "active"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_MISSING` | API credentials not provided |
| `AUTH_INVALID` | Invalid API key or secret |
| `RATE_LIMITED` | Rate limit exceeded |
| `VALIDATION_ERROR` | Input validation failed |
| `NOT_FOUND` | Resource not found |
| `FORBIDDEN` | Access denied to resource |
| `GENERATION_ERROR` | QR generation failed |
| `LIMIT_EXCEEDED` | Bulk limit exceeded |

## Error Response Format
```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Webhook Events

### Transaction Success
```json
{
  "event": "transaction.success",
  "timestamp": "2025-09-03T12:00:00Z",
  "data": {
    "transaction_id": "TXN123456",
    "qr_id": "abc123",
    "merchant_id": "MERCH001",
    "amount": 1500.00,
    "payer_vpa": "customer@paytm",
    "payer_name": "John Doe",
    "bank_rrn": "123456789012"
  }
}
```

### Webhook Signature Verification
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}
```

## Client Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.sabpaisa.in/api/v1/merchant',
  headers: {
    'X-API-Key': 'mk_live_YOURMERCHANTID',
    'X-API-Secret': 'sk_live_your_secret_key'
  }
});

// Generate QR Code
async function generateQR() {
  try {
    const response = await client.post('/qr/generate', {
      merchant_name: 'My Store',
      merchant_id: 'STORE001',
      amount: 500.00,
      description: 'Payment for order'
    });
    
    console.log('QR Generated:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Python
```python
import requests
import json

base_url = 'https://api.sabpaisa.in/api/v1/merchant'
headers = {
    'X-API-Key': 'mk_live_YOURMERCHANTID',
    'X-API-Secret': 'sk_live_your_secret_key',
    'Content-Type': 'application/json'
}

def generate_qr():
    payload = {
        'merchant_name': 'My Store',
        'merchant_id': 'STORE001',
        'amount': 500.00,
        'description': 'Payment for order'
    }
    
    response = requests.post(
        f'{base_url}/qr/generate',
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        data = response.json()
        print('QR Generated:', data['data']['qr_id'])
        return data['data']['qr_image']
    else:
        print('Error:', response.json())
```

### PHP
```php
<?php
$apiKey = 'mk_live_YOURMERCHANTID';
$apiSecret = 'sk_live_your_secret_key';

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://api.sabpaisa.in/api/v1/merchant/qr/generate',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'merchant_name' => 'My Store',
        'merchant_id' => 'STORE001',
        'amount' => 500.00,
        'description' => 'Payment for order'
    ]),
    CURLOPT_HTTPHEADER => [
        'X-API-Key: ' . $apiKey,
        'X-API-Secret: ' . $apiSecret,
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($curl);
$data = json_decode($response, true);

if ($data['success']) {
    echo 'QR Generated: ' . $data['data']['qr_id'];
} else {
    echo 'Error: ' . $data['error'];
}

curl_close($curl);
?>
```

### cURL
```bash
curl -X POST https://api.sabpaisa.in/api/v1/merchant/qr/generate \
  -H "X-API-Key: mk_live_YOURMERCHANTID" \
  -H "X-API-Secret: sk_live_your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_name": "My Store",
    "merchant_id": "STORE001",
    "amount": 500.00,
    "description": "Payment for order"
  }'
```

## SDKs

Official SDKs are available for:
- Node.js: `npm install @sabpaisa/qr-sdk`
- Python: `pip install sabpaisa-qr`
- PHP: `composer require sabpaisa/qr-sdk`
- Java: Maven dependency available

## Best Practices

1. **Store API secrets securely** - Never commit secrets to version control
2. **Implement retry logic** - Handle network failures gracefully
3. **Validate webhook signatures** - Always verify webhook authenticity
4. **Monitor rate limits** - Implement backoff when approaching limits
5. **Cache QR images** - Store generated QR codes locally to reduce API calls
6. **Use webhooks** - Implement webhooks for real-time transaction updates
7. **Test in sandbox** - Use test API keys before going live

## Support

- **Email**: api-support@sabpaisa.in
- **Documentation**: https://docs.sabpaisa.in/api
- **Status Page**: https://status.sabpaisa.in
- **Developer Portal**: https://developers.sabpaisa.in

## Changelog

### Version 1.0.0 (2025-09-03)
- Initial release
- QR generation endpoints
- Transaction tracking
- Analytics API
- Webhook support

---

*This API documentation is for the COB QR Merchant API v1.0*