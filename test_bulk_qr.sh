#!/bin/bash

echo "Testing Bulk QR Generation Feature"
echo "===================================="

# Test backend endpoint
echo -e "\n1. Testing backend bulk QR endpoint:"
curl -X POST http://localhost:3001/api/bulk-qr/generate \
  -H "Content-Type: application/json" \
  -d '{
    "merchants": [
      {
        "merchant_name": "Test Store 1",
        "merchant_id": "TEST001",
        "reference_name": "Test Store Main",
        "description": "Payment for services",
        "amount": "1000",
        "mobile_number": "9876543210",
        "email": "test1@example.com",
        "address": "123 Test Street"
      },
      {
        "merchant_name": "Test Store 2",
        "merchant_id": "TEST002",
        "reference_name": "Test Store Branch",
        "description": "Payment for products",
        "amount": "2000",
        "mobile_number": "9876543211",
        "email": "test2@example.com",
        "address": "456 Test Avenue"
      }
    ]
  }' | python3 -m json.tool

echo -e "\n\n2. Frontend is running at: http://localhost:3000"
echo "3. Navigate to: http://localhost:3000/dashboard/bulk-qr"
echo "4. Test CSV file created at: test_bulk_qr.csv"
echo ""
echo "Manual Testing Steps:"
echo "---------------------"
echo "1. Open http://localhost:3000 in browser"
echo "2. Login with your credentials"
echo "3. Navigate to 'Bulk QR' from sidebar"
echo "4. Download CSV template"
echo "5. Upload test_bulk_qr.csv"
echo "6. Click 'Generate QR Codes'"
echo "7. Download generated QRs as ZIP"