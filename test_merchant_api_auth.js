/**
 * Test Merchant API with correct authentication
 */

const axios = require('axios');

// Get the test keys from the apiAuth middleware
const { getTestAPIKeys } = require('./backend/middleware/apiAuth');

async function testMerchantAPI() {
    // Get the generated test keys
    const testKeys = getTestAPIKeys();
    
    if (testKeys.length === 0) {
        console.log('No API keys found. Keys should be initialized in apiAuth.js');
        return;
    }
    
    const firstKey = testKeys[0];
    console.log('\n=== Testing Merchant API Authentication ===');
    console.log(`Using API Key: ${firstKey.apiKey}`);
    console.log(`Using API Secret: ${firstKey.apiSecret.substring(0, 10)}...`);
    
    try {
        const response = await axios.get('http://localhost:3001/api/v1/merchant/qr/list', {
            headers: {
                'X-API-Key': firstKey.apiKey,
                'X-API-Secret': firstKey.apiSecret,
                'Content-Type': 'application/json'
            },
            params: {
                page: 1,
                limit: 5
            }
        });
        
        console.log('\n✅ Authentication successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        // Check rate limit headers
        if (response.headers['x-ratelimit-limit']) {
            console.log('\n📊 Rate Limiting Info:');
            console.log(`  Limit: ${response.headers['x-ratelimit-limit']} requests/minute`);
            console.log(`  Remaining: ${response.headers['x-ratelimit-remaining']}`);
            console.log(`  Reset: ${response.headers['x-ratelimit-reset']}`);
        }
        
    } catch (error) {
        if (error.response) {
            console.log('\n❌ API Error:', error.response.data);
            console.log('Status:', error.response.status);
        } else {
            console.log('\n❌ Connection Error:', error.message);
        }
    }
    
    // Test generating a QR code
    console.log('\n=== Testing QR Generation ===');
    try {
        const qrResponse = await axios.post('http://localhost:3001/api/v1/merchant/qr/generate', {
            merchant_name: 'Test Merchant via API',
            merchant_id: `API_TEST_${Date.now()}`,
            reference_name: 'API Test Store',
            amount: 100.00,
            mobile_number: '9876543210'
        }, {
            headers: {
                'X-API-Key': firstKey.apiKey,
                'X-API-Secret': firstKey.apiSecret,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ QR Code generated successfully!');
        console.log(`  QR ID: ${qrResponse.data.data.qr_id}`);
        console.log(`  UPI Link: ${qrResponse.data.data.upi_link}`);
        
    } catch (error) {
        if (error.response) {
            console.log('❌ QR Generation Error:', error.response.data);
        } else {
            console.log('❌ Connection Error:', error.message);
        }
    }
}

// Run the test
testMerchantAPI();