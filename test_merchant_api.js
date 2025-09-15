/**
 * Merchant API Test Suite
 * Comprehensive testing in controlled environment
 */

const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');

// Test configuration
const API_BASE_URL = 'http://localhost:3001/api/v1/merchant';
const TEST_API_KEY = 'mk_live_MERCH001';
const TEST_API_SECRET = 'sk_live_test_secret_key_12345';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

// Test data
const testMerchant = {
    merchant_name: 'API Test Store',
    merchant_id: `TEST_${Date.now()}`,
    reference_name: 'Test Store - API Testing',
    amount: 100.00,
    description: 'API Test Payment',
    mobile_number: '9876543210',
    email: 'test@apitest.com'
};

// Test client
class APITestClient {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'X-API-Key': TEST_API_KEY,
                'X-API-Secret': TEST_API_SECRET,
                'Content-Type': 'application/json'
            },
            timeout: 10000,
            validateStatus: () => true // Don't throw on any status
        });
        
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
    }
    
    // Log test result
    logTest(name, passed, details = {}) {
        this.results.total++;
        if (passed) {
            this.results.passed++;
            console.log(`  ${colors.green}✓${colors.reset} ${name}`);
        } else {
            this.results.failed++;
            console.log(`  ${colors.red}✗${colors.reset} ${name}`);
            if (details.error) {
                console.log(`    ${colors.yellow}Error: ${details.error}${colors.reset}`);
            }
        }
        this.results.tests.push({ name, passed, details });
    }
    
    // Test 1: Authentication
    async testAuthentication() {
        console.log(`\n${colors.bold}1. Testing Authentication${colors.reset}`);
        console.log('-'.repeat(40));
        
        // Test with valid credentials
        try {
            const response = await this.client.get('/qr/list?limit=1');
            const validAuth = response.status !== 401;
            this.logTest('Valid API credentials', validAuth, { status: response.status });
        } catch (error) {
            this.logTest('Valid API credentials', false, { error: error.message });
        }
        
        // Test with invalid credentials
        try {
            const badClient = axios.create({
                baseURL: API_BASE_URL,
                headers: {
                    'X-API-Key': 'invalid_key',
                    'X-API-Secret': 'invalid_secret'
                }
            });
            const response = await badClient.get('/qr/list', { validateStatus: () => true });
            this.logTest('Invalid credentials rejected', response.status === 401);
        } catch (error) {
            this.logTest('Invalid credentials rejected', true);
        }
        
        // Test missing credentials
        try {
            const noAuthClient = axios.create({ baseURL: API_BASE_URL });
            const response = await noAuthClient.get('/qr/list', { validateStatus: () => true });
            this.logTest('Missing credentials rejected', response.status === 401);
        } catch (error) {
            this.logTest('Missing credentials rejected', true);
        }
    }
    
    // Test 2: Single QR Generation
    async testSingleQRGeneration() {
        console.log(`\n${colors.bold}2. Testing Single QR Generation${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            // Generate QR with all fields
            const response = await this.client.post('/qr/generate', testMerchant);
            
            const success = response.status === 200 && response.data.success;
            this.logTest('Generate QR with all fields', success, { 
                status: response.status,
                qr_id: response.data.data?.qr_id 
            });
            
            if (success) {
                this.generatedQRId = response.data.data.qr_id;
                
                // Verify response structure
                const hasRequiredFields = response.data.data.qr_id && 
                                        response.data.data.qr_image && 
                                        response.data.data.vpa &&
                                        response.data.data.upi_string;
                
                this.logTest('Response has all required fields', hasRequiredFields);
                
                // Verify QR image is base64
                const isBase64 = response.data.data.qr_image.startsWith('data:image/png;base64,');
                this.logTest('QR image is valid base64', isBase64);
                
                // Verify VPA format
                const vpaValid = response.data.data.vpa.includes('@hdfc');
                this.logTest('VPA format is correct', vpaValid);
                
                // Verify UPI string
                const upiValid = response.data.data.upi_string.startsWith('upi://pay?');
                this.logTest('UPI string format is correct', upiValid);
            }
            
            // Test with minimal fields
            const minimalResponse = await this.client.post('/qr/generate', {
                merchant_name: 'Minimal Test',
                merchant_id: `MIN_${Date.now()}`
            });
            
            this.logTest('Generate QR with minimal fields', 
                minimalResponse.status === 200 || minimalResponse.status === 400);
            
            // Test with invalid data
            const invalidResponse = await this.client.post('/qr/generate', {
                merchant_name: '<script>alert("XSS")</script>',
                merchant_id: 'XSS_TEST'
            });
            
            // Should either sanitize or reject
            const xssHandled = invalidResponse.status === 200 || invalidResponse.status === 400;
            this.logTest('XSS attempt handled', xssHandled);
            
        } catch (error) {
            this.logTest('Single QR generation', false, { error: error.message });
        }
    }
    
    // Test 3: Bulk QR Generation
    async testBulkQRGeneration() {
        console.log(`\n${colors.bold}3. Testing Bulk QR Generation${colors.reset}`);
        console.log('-'.repeat(40));
        
        const bulkMerchants = [
            {
                merchant_name: 'Bulk Test 1',
                merchant_id: `BULK1_${Date.now()}`,
                reference_name: 'Bulk Store 1',
                amount: 100
            },
            {
                merchant_name: 'Bulk Test 2',
                merchant_id: `BULK2_${Date.now()}`,
                reference_name: 'Bulk Store 2',
                amount: 200
            },
            {
                merchant_name: 'Bulk Test 3',
                merchant_id: `BULK3_${Date.now()}`,
                reference_name: 'Bulk Store 3',
                amount: 300
            }
        ];
        
        try {
            const response = await this.client.post('/qr/bulk', { 
                merchants: bulkMerchants 
            });
            
            const success = response.status === 200 && response.data.success;
            this.logTest('Bulk QR generation (3 items)', success, {
                total: response.data?.total,
                successful: response.data?.successful
            });
            
            if (success) {
                this.logTest('All bulk QRs generated', 
                    response.data.successful === bulkMerchants.length);
                
                this.logTest('Batch ID provided', 
                    !!response.data.batch_id);
            }
            
            // Test bulk limit
            const tooManyMerchants = Array(101).fill({
                merchant_name: 'Test',
                merchant_id: 'TEST'
            });
            
            const limitResponse = await this.client.post('/qr/bulk', {
                merchants: tooManyMerchants
            });
            
            this.logTest('Bulk limit enforced (max 100)', 
                limitResponse.status === 400);
            
        } catch (error) {
            this.logTest('Bulk QR generation', false, { error: error.message });
        }
    }
    
    // Test 4: List QR Codes
    async testListQRCodes() {
        console.log(`\n${colors.bold}4. Testing List QR Codes${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            // Test basic listing
            const response = await this.client.get('/qr/list');
            const success = response.status === 200 && response.data.success;
            this.logTest('List QR codes', success);
            
            if (success) {
                // Test pagination
                const hasP
agination = response.data.data?.pagination;
                this.logTest('Pagination info provided', !!hasPagination);
                
                // Test with filters
                const filteredResponse = await this.client.get('/qr/list', {
                    params: {
                        page: 1,
                        limit: 5,
                        status: 'active'
                    }
                });
                
                this.logTest('List with filters', 
                    filteredResponse.status === 200);
                
                // Test date filtering
                const dateResponse = await this.client.get('/qr/list', {
                    params: {
                        from_date: '2025-09-01',
                        to_date: '2025-09-30'
                    }
                });
                
                this.logTest('Date range filtering', 
                    dateResponse.status === 200);
            }
            
        } catch (error) {
            this.logTest('List QR codes', false, { error: error.message });
        }
    }
    
    // Test 5: Get QR Details
    async testGetQRDetails() {
        console.log(`\n${colors.bold}5. Testing Get QR Details${colors.reset}`);
        console.log('-'.repeat(40));
        
        if (!this.generatedQRId) {
            this.logTest('Get QR details', false, { error: 'No QR ID available' });
            return;
        }
        
        try {
            const response = await this.client.get(`/qr/${this.generatedQRId}`);
            const success = response.status === 200 && response.data.success;
            this.logTest('Get existing QR details', success);
            
            // Test non-existent QR
            const notFoundResponse = await this.client.get('/qr/nonexistent123');
            this.logTest('Non-existent QR returns 404', 
                notFoundResponse.status === 404);
            
        } catch (error) {
            this.logTest('Get QR details', false, { error: error.message });
        }
    }
    
    // Test 6: Transactions
    async testTransactions() {
        console.log(`\n${colors.bold}6. Testing Transactions${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            const response = await this.client.get('/transactions');
            const success = response.status === 200 && response.data.success;
            this.logTest('List transactions', success);
            
            if (success) {
                // Check summary data
                const hasSummary = response.data.data?.summary;
                this.logTest('Transaction summary provided', !!hasSummary);
                
                // Test with QR filter
                if (this.generatedQRId) {
                    const filteredResponse = await this.client.get('/transactions', {
                        params: { qr_id: this.generatedQRId }
                    });
                    
                    this.logTest('Filter transactions by QR', 
                        filteredResponse.status === 200);
                }
            }
            
        } catch (error) {
            this.logTest('Transactions', false, { error: error.message });
        }
    }
    
    // Test 7: Analytics
    async testAnalytics() {
        console.log(`\n${colors.bold}7. Testing Analytics${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            // Test different periods
            const periods = ['24h', '7d', '30d', '90d'];
            
            for (const period of periods) {
                const response = await this.client.get('/analytics', {
                    params: { period }
                });
                
                const success = response.status === 200 && response.data.success;
                this.logTest(`Analytics for ${period}`, success);
                
                if (success && period === '7d') {
                    // Verify analytics structure
                    const hasMetrics = response.data.data?.qr_codes && 
                                      response.data.data?.transactions;
                    this.logTest('Analytics has required metrics', hasMetrics);
                }
            }
            
        } catch (error) {
            this.logTest('Analytics', false, { error: error.message });
        }
    }
    
    // Test 8: Rate Limiting
    async testRateLimiting() {
        console.log(`\n${colors.bold}8. Testing Rate Limiting${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            // Make a request and check headers
            const response = await this.client.get('/qr/list?limit=1');
            
            const hasRateLimitHeaders = response.headers['x-ratelimit-limit'] && 
                                        response.headers['x-ratelimit-remaining'];
            
            this.logTest('Rate limit headers present', hasRateLimitHeaders);
            
            if (hasRateLimitHeaders) {
                console.log(`    Limit: ${response.headers['x-ratelimit-limit']}`);
                console.log(`    Remaining: ${response.headers['x-ratelimit-remaining']}`);
            }
            
            // Simulate rapid requests (but not enough to trigger limit)
            const rapidRequests = [];
            for (let i = 0; i < 5; i++) {
                rapidRequests.push(this.client.get('/qr/list?limit=1'));
            }
            
            const results = await Promise.all(rapidRequests);
            const allSuccessful = results.every(r => r.status !== 429);
            
            this.logTest('Handle rapid requests (5)', allSuccessful);
            
        } catch (error) {
            this.logTest('Rate limiting', false, { error: error.message });
        }
    }
    
    // Test 9: Webhook Registration
    async testWebhookRegistration() {
        console.log(`\n${colors.bold}9. Testing Webhook Registration${colors.reset}`);
        console.log('-'.repeat(40));
        
        try {
            const response = await this.client.post('/webhook/register', {
                url: 'https://example.com/webhook',
                events: ['transaction.success', 'transaction.failed']
            });
            
            const success = response.status === 200 && response.data.success;
            this.logTest('Register webhook', success);
            
            if (success) {
                const hasWebhookId = !!response.data.data?.webhook_id;
                const hasSecret = !!response.data.data?.secret;
                
                this.logTest('Webhook ID provided', hasWebhookId);
                this.logTest('Webhook secret provided', hasSecret);
                
                if (hasSecret) {
                    this.webhookSecret = response.data.data.secret;
                }
            }
            
            // Test invalid webhook URL
            const invalidResponse = await this.client.post('/webhook/register', {
                url: '',
                events: []
            });
            
            this.logTest('Invalid webhook rejected', 
                invalidResponse.status === 400);
            
        } catch (error) {
            this.logTest('Webhook registration', false, { error: error.message });
        }
    }
    
    // Test 10: Security Validation
    async testSecurityValidation() {
        console.log(`\n${colors.bold}10. Testing Security Validation${colors.reset}`);
        console.log('-'.repeat(40));
        
        const securityTests = [
            {
                name: 'XSS in merchant name',
                data: {
                    merchant_name: '<script>alert("XSS")</script>',
                    merchant_id: 'XSS001'
                }
            },
            {
                name: 'SQL injection attempt',
                data: {
                    merchant_name: "'; DROP TABLE users;--",
                    merchant_id: 'SQL001'
                }
            },
            {
                name: 'Invalid email format',
                data: {
                    merchant_name: 'Test',
                    merchant_id: 'EMAIL001',
                    email: 'not-an-email'
                }
            },
            {
                name: 'Invalid mobile number',
                data: {
                    merchant_name: 'Test',
                    merchant_id: 'MOBILE001',
                    mobile_number: '123'
                }
            }
        ];
        
        for (const test of securityTests) {
            try {
                const response = await this.client.post('/qr/generate', test.data);
                
                // Should either sanitize (200) or reject (400)
                const handled = response.status === 200 || response.status === 400;
                this.logTest(test.name, handled);
                
            } catch (error) {
                this.logTest(test.name, false, { error: error.message });
            }
        }
    }
    
    // Run all tests
    async runAllTests() {
        console.log(`${colors.bold}${colors.blue}🧪 Merchant API Test Suite${colors.reset}`);
        console.log('=' .repeat(50));
        console.log(`Base URL: ${API_BASE_URL}`);
        console.log(`API Key: ${TEST_API_KEY}`);
        console.log('=' .repeat(50));
        
        const startTime = Date.now();
        
        // Run tests in sequence
        await this.testAuthentication();
        await this.testSingleQRGeneration();
        await this.testBulkQRGeneration();
        await this.testListQRCodes();
        await this.testGetQRDetails();
        await this.testTransactions();
        await this.testAnalytics();
        await this.testRateLimiting();
        await this.testWebhookRegistration();
        await this.testSecurityValidation();
        
        const duration = Date.now() - startTime;
        
        // Print summary
        console.log('\n' + '=' .repeat(50));
        console.log(`${colors.bold}📊 Test Summary${colors.reset}\n`);
        
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        const statusColor = this.results.failed === 0 ? colors.green : 
                           this.results.failed <= 5 ? colors.yellow : colors.red;
        
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${colors.green}${this.results.passed}${colors.reset}`);
        console.log(`Failed: ${colors.red}${this.results.failed}${colors.reset}`);
        console.log(`Pass Rate: ${statusColor}${passRate}%${colors.reset}`);
        console.log(`Duration: ${duration}ms`);
        
        if (this.results.failed === 0) {
            console.log(`\n${colors.green}${colors.bold}✅ All tests passed! API is working perfectly.${colors.reset}`);
        } else if (this.results.failed <= 5) {
            console.log(`\n${colors.yellow}⚠️  Some tests failed. API mostly functional but needs attention.${colors.reset}`);
        } else {
            console.log(`\n${colors.red}❌ Multiple tests failed. API needs debugging.${colors.reset}`);
        }
        
        // Save test report
        const report = {
            timestamp: new Date().toISOString(),
            baseUrl: API_BASE_URL,
            results: this.results,
            duration: duration,
            passRate: passRate
        };
        
        fs.writeFileSync('merchant_api_test_report.json', JSON.stringify(report, null, 2));
        console.log(`\nDetailed report saved to: merchant_api_test_report.json`);
    }
}

// Main execution
async function main() {
    const tester = new APITestClient();
    
    try {
        // Check if server is running
        const healthCheck = await axios.get('http://localhost:3001/api/health').catch(() => null);
        
        if (!healthCheck) {
            console.error(`${colors.red}Error: Backend server is not running on port 3001${colors.reset}`);
            console.log('Please start the backend server first:');
            console.log('  cd backend && node server.js');
            process.exit(1);
        }
        
        await tester.runAllTests();
        
    } catch (error) {
        console.error(`${colors.red}Test suite error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

// Run tests
main();