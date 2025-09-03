/**
 * Security Test Suite for Bulk QR Generation
 * Tests all security fixes implemented for XSS, SQL injection, and input validation
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3001/api/bulk-qr';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

// Generate unique IDs to avoid duplicates
const timestamp = Date.now().toString().slice(-4);

// Test cases for security vulnerabilities  
const securityTestCases = [
    {
        category: 'XSS Prevention',
        tests: [
            {
                name: 'Script tag in merchant name',
                data: {
                    merchant_name: '<script>alert("XSS")</script>Store',
                    merchant_id: `XSS${timestamp}1`,
                    reference_name: 'Test Store',
                    mobile_number: '9876543210'
                },
                expectation: 'Should sanitize and remove script tags'
            },
            {
                name: 'Event handler in description',
                data: {
                    merchant_name: 'Safe Store',
                    merchant_id: `XSS${timestamp}2`,
                    reference_name: 'Test Store',
                    description: '<img onerror="alert(\'XSS\')" src="x">',
                    mobile_number: '9876543211'
                },
                expectation: 'Should remove HTML tags and event handlers'
            },
            {
                name: 'Encoded XSS attempt',
                data: {
                    merchant_name: 'Test Store',
                    merchant_id: `XSS${timestamp}3`,
                    reference_name: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
                    mobile_number: '9876543212'
                },
                expectation: 'Should handle encoded HTML entities'
            }
        ]
    },
    {
        category: 'SQL Injection Prevention',
        tests: [
            {
                name: 'DROP TABLE attempt',
                data: {
                    merchant_name: 'Store"; DROP TABLE users;--',
                    merchant_id: `SQL${timestamp}1`,
                    reference_name: 'Test Store',
                    mobile_number: '9876543213'
                },
                expectation: 'Should remove SQL keywords and special characters'
            },
            {
                name: 'UNION SELECT injection',
                data: {
                    merchant_name: 'Store',
                    merchant_id: `SQL${timestamp}2`,
                    reference_name: "' UNION SELECT * FROM users--",
                    mobile_number: '9876543214'
                },
                expectation: 'Should sanitize SQL injection patterns'
            },
            {
                name: 'OR 1=1 injection',
                data: {
                    merchant_name: 'Store',
                    merchant_id: `SQL${timestamp}3`,
                    reference_name: 'Test',
                    description: "' OR '1'='1",
                    mobile_number: '9876543215'
                },
                expectation: 'Should remove OR conditions'
            }
        ]
    },
    {
        category: 'Email Validation',
        tests: [
            {
                name: 'Invalid email format',
                data: {
                    merchant_name: 'Email Test Store',
                    merchant_id: `EMAIL${timestamp}1`,
                    reference_name: 'Test Store',
                    email: 'notanemail',
                    mobile_number: '9876543216'
                },
                expectation: 'Should reject invalid email format'
            },
            {
                name: 'Email with XSS',
                data: {
                    merchant_name: 'Email Test Store 2',
                    merchant_id: `EMAIL${timestamp}2`,
                    reference_name: 'Test Store',
                    email: 'test<script>@example.com',
                    mobile_number: '9876543217'
                },
                expectation: 'Should reject email with special characters'
            },
            {
                name: 'Valid email',
                data: {
                    merchant_name: 'Email Test Store 3',
                    merchant_id: `EMAIL${timestamp}3`,
                    reference_name: 'Test Store',
                    email: 'valid.email@example.com',
                    mobile_number: '9876543218'
                },
                expectation: 'Should accept valid email'
            }
        ]
    },
    {
        category: 'Mobile Number Validation',
        tests: [
            {
                name: 'Invalid mobile - too short',
                data: {
                    merchant_name: 'Mobile Test Store',
                    merchant_id: `MOB${timestamp}1`,
                    reference_name: 'Test Store',
                    mobile_number: '12345'
                },
                expectation: 'Should reject mobile with less than 10 digits'
            },
            {
                name: 'Invalid mobile - wrong prefix',
                data: {
                    merchant_name: 'Mobile Test Store 2',
                    merchant_id: `MOB${timestamp}2`,
                    reference_name: 'Test Store',
                    mobile_number: '1234567890'
                },
                expectation: 'Should reject mobile not starting with 6-9'
            },
            {
                name: 'Valid mobile',
                data: {
                    merchant_name: 'Mobile Test Store 3',
                    merchant_id: `MOB${timestamp}3`,
                    reference_name: 'Test Store',
                    mobile_number: '9876543210'
                },
                expectation: 'Should accept valid 10-digit mobile'
            }
        ]
    },
    {
        category: 'Merchant ID Validation',
        tests: [
            {
                name: 'Merchant ID with special chars',
                data: {
                    merchant_name: 'ID Test Store',
                    merchant_id: `MERCH${timestamp}1!@#`,
                    reference_name: 'Test Store',
                    mobile_number: '9876543219'
                },
                expectation: 'Should sanitize special characters from merchant ID'
            },
            {
                name: 'Lowercase merchant ID',
                data: {
                    merchant_name: 'ID Test Store 2',
                    merchant_id: `merch${timestamp}1`,
                    reference_name: 'Test Store',
                    mobile_number: '9876543220'
                },
                expectation: 'Should convert to uppercase'
            }
        ]
    },
    {
        category: 'Amount Validation',
        tests: [
            {
                name: 'Negative amount',
                data: {
                    merchant_name: 'Amount Test Store',
                    merchant_id: `AMT${timestamp}1`,
                    reference_name: 'Test Store',
                    amount: -100,
                    mobile_number: '9876543221'
                },
                expectation: 'Should reject negative amounts'
            },
            {
                name: 'Amount with excessive decimals',
                data: {
                    merchant_name: 'Amount Test Store 2',
                    merchant_id: `AMT${timestamp}2`,
                    reference_name: 'Test Store',
                    amount: 100.12345,
                    mobile_number: '9876543222'
                },
                expectation: 'Should limit to 2 decimal places'
            },
            {
                name: 'Valid amount',
                data: {
                    merchant_name: 'Amount Test Store 3',
                    merchant_id: `AMT${timestamp}3`,
                    reference_name: 'Test Store',
                    amount: 1500.50,
                    mobile_number: '9876543223'
                },
                expectation: 'Should accept valid amount'
            }
        ]
    }
];

// Function to run a single test
async function runTest(test, categoryName) {
    try {
        const response = await axios.post(`${API_BASE_URL}/generate`, {
            merchants: [test.data]
        });

        const result = response.data;
        const merchantResult = result.results[0] || result.errors[0];
        
        return {
            name: test.name,
            category: categoryName,
            passed: false,
            details: merchantResult,
            expectation: test.expectation,
            actualResult: result
        };
    } catch (error) {
        return {
            name: test.name,
            category: categoryName,
            passed: false,
            error: error.response?.data?.error || error.message,
            expectation: test.expectation
        };
    }
}

// Analyze test results
function analyzeResults(testResult) {
    const { name, category, details, actualResult, expectation } = testResult;
    let passed = false;
    let message = '';

    // Check based on category
    if (category === 'XSS Prevention') {
        if (actualResult.successful === 1) {
            const sanitized = details.merchant_name || details.reference_name || details.description;
            passed = !sanitized.includes('<script>') && !sanitized.includes('alert');
            message = passed ? 'XSS successfully prevented' : 'XSS not properly sanitized';
        } else {
            // If it was rejected, that's also acceptable for XSS attempts
            passed = true;
            message = 'XSS attempt properly rejected';
        }
    } else if (category === 'SQL Injection Prevention') {
        if (actualResult.successful === 1) {
            const fields = [details.merchant_name, details.reference_name, details.description].filter(Boolean).join(' ');
            passed = !fields.match(/(DROP|DELETE|INSERT|UPDATE|UNION|SELECT|--|;)/gi);
            message = passed ? 'SQL injection prevented' : 'SQL patterns not properly sanitized';
        } else {
            passed = true;
            message = 'SQL injection attempt properly rejected';
        }
    } else if (category === 'Email Validation') {
        if (name.includes('Valid email')) {
            passed = actualResult.successful === 1;
            message = passed ? 'Valid email accepted' : 'Valid email wrongly rejected';
        } else {
            passed = actualResult.successful === 0;
            message = passed ? 'Invalid email properly rejected' : 'Invalid email not rejected';
        }
    } else if (category === 'Mobile Number Validation') {
        if (name.includes('Valid mobile')) {
            passed = actualResult.successful === 1;
            message = passed ? 'Valid mobile accepted' : 'Valid mobile wrongly rejected';
        } else {
            passed = actualResult.successful === 0;
            message = passed ? 'Invalid mobile properly rejected' : 'Invalid mobile not rejected';
        }
    } else if (category === 'Merchant ID Validation') {
        if (actualResult.successful === 1) {
            passed = details.merchant_id === details.merchant_id.toUpperCase().replace(/[^A-Z0-9_]/g, '');
            message = passed ? 'Merchant ID properly sanitized' : 'Merchant ID not properly sanitized';
        } else {
            passed = false;
            message = 'Valid merchant ID rejected';
        }
    } else if (category === 'Amount Validation') {
        if (name.includes('Valid amount')) {
            passed = actualResult.successful === 1 && details.amount === '1500.50';
            message = passed ? 'Valid amount accepted' : 'Valid amount not handled correctly';
        } else {
            passed = actualResult.successful === 0;
            message = passed ? 'Invalid amount properly rejected' : 'Invalid amount not rejected';
        }
    }

    return { ...testResult, passed, message };
}

// Main test runner
async function runSecurityTests() {
    console.log(`${colors.bold}${colors.blue}🔒 Running Security Test Suite for Bulk QR Generation${colors.reset}\n`);
    console.log('=' .repeat(70));
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        byCategory: {}
    };

    for (const category of securityTestCases) {
        console.log(`\n${colors.bold}Testing: ${category.category}${colors.reset}`);
        console.log('-'.repeat(50));
        
        results.byCategory[category.category] = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };

        for (const test of category.tests) {
            process.stdout.write(`  Running: ${test.name}... `);
            
            const testResult = await runTest(test, category.category);
            const analyzedResult = analyzeResults(testResult);
            
            results.total++;
            results.byCategory[category.category].total++;
            
            if (analyzedResult.passed) {
                console.log(`${colors.green}✓ PASSED${colors.reset} - ${analyzedResult.message}`);
                results.passed++;
                results.byCategory[category.category].passed++;
            } else {
                console.log(`${colors.red}✗ FAILED${colors.reset} - ${analyzedResult.message}`);
                results.failed++;
                results.byCategory[category.category].failed++;
            }
            
            results.byCategory[category.category].tests.push(analyzedResult);
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bold}📊 Test Summary${colors.reset}\n`);
    
    for (const [category, categoryResults] of Object.entries(results.byCategory)) {
        const passRate = ((categoryResults.passed / categoryResults.total) * 100).toFixed(1);
        const statusColor = categoryResults.failed === 0 ? colors.green : colors.yellow;
        
        console.log(`${colors.bold}${category}:${colors.reset}`);
        console.log(`  Total: ${categoryResults.total} | Passed: ${statusColor}${categoryResults.passed}${colors.reset} | Failed: ${colors.red}${categoryResults.failed}${colors.reset} | Pass Rate: ${passRate}%`);
    }
    
    console.log('\n' + '-'.repeat(50));
    const overallPassRate = ((results.passed / results.total) * 100).toFixed(1);
    const finalColor = results.failed === 0 ? colors.green : results.failed <= 2 ? colors.yellow : colors.red;
    
    console.log(`${colors.bold}Overall Results:${colors.reset}`);
    console.log(`  Total Tests: ${results.total}`);
    console.log(`  Passed: ${colors.green}${results.passed}${colors.reset}`);
    console.log(`  Failed: ${colors.red}${results.failed}${colors.reset}`);
    console.log(`  Pass Rate: ${finalColor}${overallPassRate}%${colors.reset}`);
    
    if (results.failed === 0) {
        console.log(`\n${colors.green}${colors.bold}✅ All security tests passed! The application is secure.${colors.reset}`);
    } else {
        console.log(`\n${colors.yellow}⚠️  Some tests failed. Review the results above for details.${colors.reset}`);
    }
    
    // Save detailed results to file
    const reportPath = path.join(__dirname, 'security_test_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);
}

// Run the tests
runSecurityTests().catch(error => {
    console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
    process.exit(1);
});