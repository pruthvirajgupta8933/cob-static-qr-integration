# SabQR Backend API Documentation

## Overview
The SabQR API provides comprehensive QR code generation and payment management functionality for B2B merchants with automated reconciliation through unique VPAs.

## Base URL
- Production: `https://cobawsapi.sabpaisa.in/api/merchant`
- Staging: `https://stgcobapi.sabpaisa.in/api/merchant`

## Authentication
All endpoints require JWT authentication via the existing merchant authentication middleware.
```
Headers:
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## API Endpoints

### 1. QR Code Management

#### 1.1 Create QR Code
```http
POST /qr-codes
```

**Request Body:**
```json
{
  "reference_name": "Store Counter 1",
  "description": "Main billing counter",
  "category": "retail",
  "max_amount_per_transaction": 50000,
  "design_template": "professional",
  "design_config": {
    "logo_url": "https://...",
    "brand_color": "#007bff",
    "template": "professional"
  },
  "customer_info": {
    "required_fields": ["mobile", "email"],
    "optional_fields": ["name"]
  },
  "notes": "Primary collection point"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "qr_identifier": "A7B2C",
    "full_vpa": "sabpaisa.A7B2C@okhdfcbank",
    "reference_name": "Store Counter 1",
    "qr_image_url": "https://cdn.sabpaisa.in/qr/A7B2C.png",
    "qr_string": "upi://pay?pa=sabpaisa.A7B2C@okhdfcbank&pn=Store%20Counter%201",
    "status": "active",
    "created_at": "2024-01-28T10:00:00Z"
  },
  "message": "QR code created successfully"
}
```

#### 1.2 List QR Codes
```http
GET /qr-codes
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 10, max: 100)
- `status` (string): Filter by status (active/inactive/all)
- `search` (string): Search by name or identifier
- `category` (string): Filter by category
- `from_date` (string): Filter from date (YYYY-MM-DD)
- `to_date` (string): Filter to date (YYYY-MM-DD)
- `sort_by` (string): Sort field (created_at/total_collections/transaction_count)
- `sort_order` (string): Sort order (asc/desc)

**Response:**
```json
{
  "status": "success",
  "data": {
    "qr_codes": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 95,
      "items_per_page": 10
    },
    "summary": {
      "total_active": 85,
      "total_inactive": 10,
      "total_collections": 1250000.00,
      "total_transactions": 3450
    }
  }
}
```

#### 1.3 Get QR Code Details
```http
GET /qr-codes/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-here",
    "qr_identifier": "A7B2C",
    "full_vpa": "sabpaisa.A7B2C@okhdfcbank",
    "reference_name": "Store Counter 1",
    "description": "Main billing counter",
    "category": "retail",
    "status": "active",
    "design_config": {...},
    "qr_image_url": "https://...",
    "total_collections": 125000.00,
    "transaction_count": 234,
    "last_payment_at": "2024-01-28T09:30:00Z",
    "recent_transactions": [...],
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```

#### 1.4 Update QR Code
```http
PUT /qr-codes/:id
```

**Request Body:**
```json
{
  "reference_name": "Updated Name",
  "description": "Updated description",
  "category": "retail",
  "max_amount_per_transaction": 100000,
  "design_config": {...},
  "customer_info": {...},
  "notes": "Updated notes"
}
```

#### 1.5 Delete QR Code
```http
DELETE /qr-codes/:id
```

**Response:**
```json
{
  "status": "success",
  "message": "QR code deleted successfully"
}
```

#### 1.6 Toggle QR Status
```http
PUT /qr-codes/:id/status
```

**Request Body:**
```json
{
  "status": "active" // or "inactive"
}
```

#### 1.7 Validate QR Identifier
```http
POST /qr-codes/validate-identifier
```

**Request Body:**
```json
{
  "identifier": "A7B2C"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "available": true,
    "identifier": "A7B2C",
    "suggested_alternatives": ["A7B2D", "A7B2E", "A7B2F"]
  }
}
```

### 2. QR Image Generation

#### 2.1 Generate QR Image
```http
POST /qr-codes/:id/generate-image
```

**Request Body:**
```json
{
  "format": "png", // png, jpg, svg, pdf
  "size": "medium", // small, medium, large, xlarge
  "template": "professional", // classic, professional, minimal, branded
  "include_logo": true,
  "include_instructions": true,
  "brand_config": {
    "primary_color": "#007bff",
    "secondary_color": "#6c757d",
    "logo_position": "center", // center, top, bottom
    "text_color": "#333333"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "image_url": "https://cdn.sabpaisa.in/qr/generated/...",
    "download_url": "https://api.sabpaisa.in/download/qr/...",
    "expires_at": "2024-01-28T11:00:00Z"
  }
}
```

#### 2.2 Upload Logo
```http
POST /qr-codes/upload-logo
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'logo' field

**Response:**
```json
{
  "status": "success",
  "data": {
    "logo_url": "https://cdn.sabpaisa.in/logos/...",
    "thumbnail_url": "https://cdn.sabpaisa.in/logos/thumb/..."
  }
}
```

### 3. Dashboard & Analytics

#### 3.1 Dashboard Summary
```http
GET /qr-codes/dashboard
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "total_qr_codes": 95,
      "active_qr_codes": 85,
      "inactive_qr_codes": 10,
      "total_collections": 1250000.00,
      "today_collections": 45000.00,
      "total_transactions": 3450,
      "today_transactions": 125,
      "average_transaction_value": 362.32
    },
    "collection_trend": [
      {
        "date": "2024-01-21",
        "amount": 35000.00,
        "transactions": 95
      },
      // ... last 7 days
    ],
    "top_performing_qrs": [
      {
        "qr_identifier": "A7B2C",
        "reference_name": "Store Counter 1",
        "total_collections": 250000.00,
        "transaction_count": 450
      },
      // ... top 5
    ],
    "recent_payments": [
      {
        "payment_id": "PAY123",
        "qr_identifier": "A7B2C",
        "amount": 1500.00,
        "payment_time": "2024-01-28T09:45:00Z",
        "customer_vpa": "customer@paytm"
      },
      // ... last 10
    ]
  }
}
```

### 4. Payment Management

#### 4.1 List QR Payments
```http
GET /qr-payments
```

**Query Parameters:**
- `qr_id` (string): Filter by QR code ID
- `qr_identifier` (string): Filter by QR identifier
- `from_date` (string): Start date
- `to_date` (string): End date
- `status` (string): Payment status (success/failed/pending)
- `min_amount` (number): Minimum amount
- `max_amount` (number): Maximum amount
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "payments": [
      {
        "id": "payment-uuid",
        "qr_code_id": "qr-uuid",
        "qr_identifier": "A7B2C",
        "reference_name": "Store Counter 1",
        "payment_id": "UPI123456789",
        "amount": 1500.00,
        "status": "success",
        "payment_method": "UPI",
        "utr_number": "UTR123456",
        "customer_vpa": "customer@paytm",
        "customer_info": {
          "mobile": "9876543210",
          "email": "customer@email.com"
        },
        "payment_time": "2024-01-28T09:45:00Z"
      }
    ],
    "pagination": {...},
    "summary": {
      "total_amount": 125000.00,
      "total_transactions": 234,
      "success_rate": 98.5
    }
  }
}
```

#### 4.2 Export Payments
```http
POST /qr-payments/export
```

**Request Body:**
```json
{
  "format": "excel", // excel, csv, pdf
  "filters": {
    "from_date": "2024-01-01",
    "to_date": "2024-01-28",
    "qr_identifiers": ["A7B2C", "D8E9F"],
    "status": "success"
  },
  "include_summary": true
}
```

### 5. Bulk Operations

#### 5.1 Bulk Create QR Codes
```http
POST /qr-codes/bulk-create
```

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field (Excel file)

**Response:**
```json
{
  "status": "success",
  "data": {
    "job_id": "JOB123456",
    "status": "processing",
    "total_records": 50,
    "message": "Bulk creation job initiated"
  }
}
```

#### 5.2 Get Bulk Job Status
```http
GET /bulk-jobs/:jobId
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "job_id": "JOB123456",
    "status": "completed", // processing, completed, failed, partial
    "total_records": 50,
    "processed_records": 50,
    "successful_records": 48,
    "failed_records": 2,
    "progress_percentage": 100,
    "errors": [
      {
        "row": 15,
        "error": "Duplicate reference name",
        "data": {...}
      }
    ],
    "result_file_url": "https://...",
    "started_at": "2024-01-28T10:00:00Z",
    "completed_at": "2024-01-28T10:02:30Z"
  }
}
```

#### 5.3 Download Bulk Template
```http
GET /qr-codes/bulk-template
```

**Response:**
- Binary Excel file download

### 6. Webhook Endpoints

#### 6.1 Payment Webhook (Internal)
```http
POST /webhooks/qr-payment
```

**Headers:**
```
X-Webhook-Signature: <signature>
X-Webhook-Timestamp: <timestamp>
```

**Request Body:**
```json
{
  "event_type": "payment.success",
  "payment_id": "PAY123456",
  "merchant_vpa": "sabpaisa.A7B2C@okhdfcbank",
  "amount": 1500.00,
  "customer_vpa": "customer@paytm",
  "utr_number": "UTR123456",
  "payment_method": "UPI",
  "timestamp": "2024-01-28T10:30:00Z",
  "additional_info": {...}
}
```

## Error Response Format

All errors follow this format:
```json
{
  "status": "error",
  "error": {
    "code": "QR_001",
    "message": "QR identifier already exists",
    "details": {
      "field": "qr_identifier",
      "value": "A7B2C"
    }
  },
  "timestamp": "2024-01-28T10:00:00Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| QR_001 | QR identifier already exists |
| QR_002 | Invalid VPA format |
| QR_003 | QR code not found |
| QR_004 | Maximum QR limit reached |
| QR_005 | Invalid design template |
| QR_006 | File upload failed |
| QR_007 | Bulk operation failed |
| QR_008 | Payment webhook verification failed |
| QR_009 | Export generation failed |
| QR_010 | Unauthorized access |

## Rate Limits

- QR Creation: 10 per minute per merchant
- Bulk Upload: 1 per 5 minutes per merchant
- Image Generation: 20 per minute per merchant
- API Calls: 100 per minute per merchant

## WebSocket Events (Real-time Updates)

Connect to: `wss://stage-notification.sabpaisa.in/qr-updates`

### Events:
```javascript
// Payment received
{
  "event": "payment.received",
  "data": {
    "qr_identifier": "A7B2C",
    "amount": 1500.00,
    "payment_id": "PAY123456"
  }
}

// QR status changed
{
  "event": "qr.status_changed",
  "data": {
    "qr_identifier": "A7B2C",
    "old_status": "active",
    "new_status": "inactive"
  }
}

// Bulk job completed
{
  "event": "bulk.job_completed",
  "data": {
    "job_id": "JOB123456",
    "status": "completed",
    "successful": 48,
    "failed": 2
  }
}
```