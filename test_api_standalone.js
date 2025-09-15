/**
 * Standalone API Testing - Non-invasive test suite
 * This tests the existing APIs without modifying any code
 */

const axios = require('axios');
const fs = require('fs');

// Test configuration - using existing test keys from apiAuth.js
const API_BASE_URL = 'http://localhost:3001/api/v1/merchant';

// Colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

class APITester {
    constructor() {
        // These test keys are already defined in apiAuth.js
        this.testCredentials = [
            {
                name: 'Test Merchant 1',
                apiKey: 'mk_live_MERCH001',
                apiSecret: null, // Will be fetched from the middleware
                permissions: 'full'
            },
            {
                name: 'Test Merchant 2',
                apiKey: 'mk_test_MERCH002',
                apiSecret: null,
                permissions: 'limited'
            }
        ];
        
        this.results = [];
    }
    
    // Get the test API keys from the server
    async getTestKeys() {
        console.log(`${colors.blue}Fetching test API credentials...${colors.reset}`);
        
        // Since we can't access the keys directly, we'll test with mock keys
        // The middleware will generate them on first use
        this.testCredentials[0].apiSecret = 'sk_live_test_secret_key';
        this.testCredentials[1].apiSecret = 'sk_test_test_secret_key';
        
        return true;
    }
    
    // Test basic connectivity
    async testConnectivity() {
        console.log(`\n${colors.bold}1. Testing API Connectivity${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            // Test without auth (should fail)
            const response = await axios.get(API_BASE_URL + '/qr/list', {
                validateStatus: () => true
            });
            
            if (response.status === 401) {
                console.log(`  ${colors.green}✓${colors.reset} API endpoint accessible`);
                console.log(`  ${colors.green}✓${colors.reset} Authentication required (401 returned)`);
                return true;
            } else if (response.status === 404) {
                console.log(`  ${colors.red}✗${colors.reset} API endpoint not found`);
                console.log(`    The merchant API routes may not be registered`);
                return false;
            } else {
                console.log(`  ${colors.yellow}⚠${colors.reset} Unexpected response: ${response.status}`);
                return false;
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log(`  ${colors.red}✗${colors.reset} Cannot connect to backend server`);
                console.log(`    Please ensure backend is running on port 3001`);
                return false;
            }
            console.log(`  ${colors.red}✗${colors.reset} Connection error: ${error.message}`);
            return false;
        }
    }
    
    // Test with mock authentication
    async testWithMockAuth() {
        console.log(`\n${colors.bold}2. Testing with Mock Authentication${colors.reset}`);
        console.log('-'.repeat(40));
        
        const client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'X-API-Key': 'mk_live_MERCH001',
                'X-API-Secret': 'sk_live_test_key',
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });
        
        try {
            // Try to list QR codes
            const response = await client.get('/qr/list?limit=1');
            
            if (response.status === 200) {
                console.log(`  ${colors.green}✓${colors.reset} Authentication successful`);
                console.log(`  ${colors.green}✓${colors.reset} API is working`);
                
                // Check for rate limit headers
                if (response.headers['x-ratelimit-limit']) {
                    console.log(`  ${colors.green}✓${colors.reset} Rate limiting active`);
                    console.log(`    Rate limit: ${response.headers['x-ratelimit-limit']} req/min`);
                }
                
                return true;
            } else if (response.status === 401) {
                console.log(`  ${colors.yellow}⚠${colors.reset} Authentication failed`);
                console.log(`    The API keys may need to be initialized in the middleware`);
                return false;
            } else {
                console.log(`  ${colors.yellow}⚠${colors.reset} Unexpected response: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.log(`  ${colors.red}✗${colors.reset} Request failed: ${error.message}`);
            return false;
        }
    }
    
    // Test existing bulk QR endpoint (which we know works)
    async testExistingBulkQR() {
        console.log(`\n${colors.bold}3. Testing Existing Bulk QR Endpoint${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            const response = await axios.post('http://localhost:3001/api/bulk-qr/generate', {
                merchants: [{
                    merchant_name: 'API Test Store',
                    merchant_id: `APITEST_${Date.now()}`,
                    reference_name: 'Test Store',
                    mobile_number: '9876543210'
                }]
            }, {
                validateStatus: () => true
            });
            
            if (response.status === 200 && response.data.success) {
                console.log(`  ${colors.green}✓${colors.reset} Bulk QR endpoint working`);
                console.log(`  ${colors.green}✓${colors.reset} Generated ${response.data.successful} QR codes`);
                return true;
            } else {
                console.log(`  ${colors.yellow}⚠${colors.reset} Bulk QR endpoint returned: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.log(`  ${colors.red}✗${colors.reset} Bulk QR test failed: ${error.message}`);
            return false;
        }
    }
    
    // Test health check
    async testHealthCheck() {
        console.log(`\n${colors.bold}4. Testing Health Check${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            const response = await axios.get('http://localhost:3001/api/health');
            
            if (response.status === 200) {
                console.log(`  ${colors.green}✓${colors.reset} Health check passed`);
                console.log(`    Status: ${response.data.status}`);
                console.log(`    Uptime: ${response.data.uptime}s`);
                return true;
            }
        } catch (error) {
            console.log(`  ${colors.red}✗${colors.reset} Health check failed`);
            return false;
        }
    }
    
    // Check if merchant routes are accessible
    async checkMerchantRoutes() {
        console.log(`\n${colors.bold}5. Checking Merchant API Routes${colors.reset}`);
        console.log('-'.repeat(40));
        
        const endpoints = [
            { path: '/qr/generate', method: 'POST', name: 'Generate QR' },
            { path: '/qr/bulk', method: 'POST', name: 'Bulk QR' },
            { path: '/qr/list', method: 'GET', name: 'List QRs' },
            { path: '/transactions', method: 'GET', name: 'Transactions' },
            { path: '/analytics', method: 'GET', name: 'Analytics' },
            { path: '/webhook/register', method: 'POST', name: 'Webhooks' }
        ];
        
        for (const endpoint of endpoints) {
            try {
                const options = {
                    method: endpoint.method,
                    url: API_BASE_URL + endpoint.path,
                    validateStatus: () => true
                };
                
                if (endpoint.method === 'POST') {
                    options.data = {};
                }
                
                const response = await axios(options);
                
                // We expect 401 (auth required) if the route exists
                if (response.status === 401) {
                    console.log(`  ${colors.green}✓${colors.reset} ${endpoint.name}: Endpoint exists (auth required)`);
                } else if (response.status === 404) {
                    console.log(`  ${colors.red}✗${colors.reset} ${endpoint.name}: Endpoint not found`);
                } else {
                    console.log(`  ${colors.yellow}⚠${colors.reset} ${endpoint.name}: Status ${response.status}`);
                }
            } catch (error) {
                console.log(`  ${colors.red}✗${colors.reset} ${endpoint.name}: Error`);
            }
        }
    }
    
    // Run all tests
    async runTests() {
        console.log(`${colors.bold}${colors.blue}🧪 API Testing Suite (Non-invasive)${colors.reset}`);
        console.log('=' .repeat(50));
        console.log('This test will NOT modify any existing code');
        console.log('=' .repeat(50));
        
        let passed = 0;
        let failed = 0;
        
        // Test 1: Connectivity
        if (await this.testConnectivity()) {
            passed++;
        } else {
            failed++;
            console.log(`\n${colors.yellow}Note: The merchant API may not be properly registered.${colors.reset}`);
            console.log('The routes were added but may need server restart.');
        }
        
        // Test 2: Mock Authentication
        if (await this.testWithMockAuth()) {
            passed++;
        } else {
            failed++;
        }
        
        // Test 3: Existing Bulk QR
        if (await this.testExistingBulkQR()) {
            passed++;
        } else {
            failed++;
        }
        
        // Test 4: Health Check
        if (await this.testHealthCheck()) {
            passed++;
        } else {
            failed++;
        }
        
        // Test 5: Check routes
        await this.checkMerchantRoutes();
        
        // Summary
        console.log('\n' + '=' .repeat(50));
        console.log(`${colors.bold}📊 Test Summary${colors.reset}\n`);
        
        console.log(`Tests Run: ${passed + failed}`);
        console.log(`Passed: ${colors.green}${passed}${colors.reset}`);
        console.log(`Failed: ${colors.red}${failed}${colors.reset}`);
        
        if (failed === 0) {
            console.log(`\n${colors.green}${colors.bold}✅ All systems operational!${colors.reset}`);
        } else {
            console.log(`\n${colors.yellow}⚠️  Some components need attention${colors.reset}`);
            console.log('\nPossible issues:');
            console.log('1. The merchant API routes may need server restart');
            console.log('2. API authentication middleware may need initialization');
            console.log('3. Ensure all dependencies are installed');
            
            console.log('\nTo fix:');
            console.log('1. Restart the backend server:');
            console.log('   Kill current process and run: cd backend && node server.js');
            console.log('2. Check that merchant routes are registered in server.js');
        }
        
        // Save report
        const report = {
            timestamp: new Date().toISOString(),
            tests: {
                connectivity: passed > 0,
                authentication: passed > 1,
                bulkQR: passed > 2,
                healthCheck: passed > 3
            },
            passed,
            failed,
            notes: 'Non-invasive test - no code modified'
        };
        
        fs.writeFileSync('api_test_report.json', JSON.stringify(report, null, 2));
        console.log(`\nReport saved to: api_test_report.json`);
    }
}

// Main execution
async function main() {
    const tester = new APITester();
    
    try {
        // Check if server is running
        const health = await axios.get('http://localhost:3001/api/health').catch(() => null);
        
        if (!health) {
            console.error(`${colors.red}Error: Backend server is not responding${colors.reset}`);
            console.log('\nPlease ensure the backend is running:');
            console.log('  cd backend && node server.js');
            process.exit(1);
        }
        
        await tester.runTests();
        
    } catch (error) {
        console.error(`${colors.red}Test error: ${error.message}${colors.reset}`);
    }
}

// Run the tests
main();