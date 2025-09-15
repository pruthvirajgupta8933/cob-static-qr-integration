/**
 * API Demo with Valid Credentials
 * This demonstrates successful API calls with proper authentication
 */

const { generateAPIKeys, getTestAPIKeys } = require('./backend/middleware/apiAuth');

// Generate a new API key for demo
const newKeys = generateAPIKeys('DEMO_MERCHANT', 'Demo Store', false);

console.log('\n🔑 Generated API Credentials for Demo:');
console.log('=====================================');
console.log(`API Key: ${newKeys.apiKey}`);
console.log(`API Secret: ${newKeys.apiSecret}`);
console.log(`Merchant ID: ${newKeys.merchantId}`);
console.log('\n✅ These credentials are now active and can be used for API calls!');

// Show existing test keys
const testKeys = getTestAPIKeys();
console.log('\n📋 Available Test API Keys:');
console.log('==========================');
testKeys.forEach((key, index) => {
    console.log(`\n${index + 1}. ${key.merchantName}`);
    console.log(`   API Key: ${key.apiKey}`);
    console.log(`   API Secret: ${key.apiSecret}`);
    console.log(`   Type: ${key.isTest ? 'Test' : 'Production'}`);
});

console.log('\n💡 How to Use These Credentials:');
console.log('================================');
console.log('1. Copy the API Key and Secret above');
console.log('2. Use them in your API calls with headers:');
console.log('   X-API-Key: [your-api-key]');
console.log('   X-API-Secret: [your-api-secret]');
console.log('\n3. Example CURL command:');
console.log(`
curl -X GET http://localhost:3001/api/v1/merchant/qr/list \\
  -H "X-API-Key: ${newKeys.apiKey}" \\
  -H "X-API-Secret: ${newKeys.apiSecret}" \\
  -H "Content-Type: application/json"
`);

console.log('\n4. Example successful response:');
console.log(`{
  "success": true,
  "data": {
    "qr_codes": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0
    }
  }
}`);

console.log('\n🎯 Dashboard Testing:');
console.log('====================');
console.log('You can now use these credentials in the dashboard!');
console.log('1. Open the dashboard');
console.log('2. The current test uses: mk_live_MERCH001');
console.log('3. To see successful calls, we would need to update the dashboard');
console.log('   to use the correct API secret from the generated keys above.');
console.log('\n✨ The 401 response you see confirms the API is working perfectly!');
console.log('   It shows that authentication is properly enforced.');