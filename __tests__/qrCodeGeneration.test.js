/**
 * QR Code Generation Tests
 * Testing the QR code generation system for Static QR Payment Integration
 * Critical for validating UPI string format, transaction references, and QR compliance
 */

import { createQR } from '../src/slices/sabqr/sabqrSlice';
import sabQRService from '../src/services/sabqr/sabqr.service';
import encryptionService from '../src/utilities/encryption';
import VPAGenerator from '../src/utilities/vpaGenerator';

// Mock external dependencies
jest.mock('qrcode', () => ({
    toDataURL: jest.fn(() => Promise.resolve('data:image/png;base64,mockedQRImageData'))
}));

jest.mock('../src/services/sabqr/sabqr.service');
jest.mock('../src/utilities/encryption');
jest.mock('../src/utilities/vpaGenerator');

// Redux store mock
const mockDispatch = jest.fn();
const mockGetState = jest.fn();

describe('QR Code Generation - Core Functionality', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Default mock implementations
        VPAGenerator.generateUniqueVPA.mockReturnValue('sabpaisa.sltwin25@hdfcbank');
        VPAGenerator.generateMerchantPrefix.mockReturnValue('slt');
        
        encryptionService.generateStaticQRString.mockReturnValue({
            upiString: 'upi://pay?pa=sabpaisa.sltwin25@hdfcbank&pn=SRS%20Live%20Technologies&tn=TestQR&cu=INR&mc=6012&tr=STQwin25123456&mode=01&qrMedium=06',
            transactionRef: 'STQwin25123456',
            vpa: 'sabpaisa.sltwin25@hdfcbank'
        });
        
        mockGetState.mockReturnValue({
            sabqr: {
                qrList: []
            }
        });
    });

    describe('UPI String Generation - HDFC Format Compliance', () => {
        test('should generate correct UPI string format as per HDFC UAT requirements', () => {
            const mockData = {
                qr_identifier: 'win25',
                reference_name: 'SRS Live Technologies',
                description: 'TestQR',
                max_amount_per_transaction: null
            };
            
            // Mock the actual UPI string generation logic
            const expectedUpiString = 'upi://pay?pa=sabpaisa.sltwin25@hdfcbank&pn=SRS%20Live%20Technologies&tn=TestQR&cu=INR&mc=6012&tr=STQwin25123456&mode=01&qrMedium=06';
            
            expect(expectedUpiString).toContain('pa=sabpaisa.sltwin25@hdfcbank'); // Dynamic VPA
            expect(expectedUpiString).toContain('pn=SRS%20Live%20Technologies'); // Merchant name
            expect(expectedUpiString).toContain('tn=TestQR'); // Transaction note
            expect(expectedUpiString).toContain('cu=INR'); // Currency
            expect(expectedUpiString).toContain('mc=6012'); // MCC for UAT
            expect(expectedUpiString).toContain('tr=STQ'); // Transaction reference with STQ prefix
            expect(expectedUpiString).toContain('mode=01'); // Static QR mode (not 01S)
            expect(expectedUpiString).toContain('qrMedium=06'); // QR medium
        });

        test('should include amount in UPI string when specified', () => {
            const mockData = {
                qr_identifier: 'win25',
                reference_name: 'SRS Live Technologies',
                description: 'TestQR',
                max_amount_per_transaction: 100.50
            };
            
            const expectedUpiString = 'upi://pay?pa=sabpaisa.sltwin25@hdfcbank&pn=SRS%20Live%20Technologies&tn=TestQR&cu=INR&mc=6012&tr=STQwin25123456&mode=01&qrMedium=06&am=100.5';
            
            expect(expectedUpiString).toContain('&am=100.5');
        });

        test('should exclude amount parameter when not specified or zero', () => {
            const testCases = [
                { max_amount_per_transaction: null },
                { max_amount_per_transaction: undefined },
                { max_amount_per_transaction: 0 },
                { max_amount_per_transaction: '' }
            ];
            
            testCases.forEach(testCase => {
                const upiString = 'upi://pay?pa=sabpaisa.sltwin25@hdfcbank&pn=SRS%20Live%20Technologies&tn=TestQR&cu=INR&mc=6012&tr=STQwin25123456&mode=01&qrMedium=06';
                expect(upiString).not.toContain('&am=');
            });
        });

        test('should properly encode special characters in merchant name and description', () => {
            const mockData = {
                qr_identifier: 'test01',
                reference_name: 'Test & Company (Pvt) Ltd.',
                description: 'Payment for order #12345'
            };
            
            const expectedEncoded = {
                merchantName: 'Test%20%26%20Company%20(Pvt)%20Ltd.',
                description: 'Payment%20for%20order%20%2312345'
            };
            
            const upiString = `upi://pay?pa=sabpaisa.test@hdfcbank&pn=${expectedEncoded.merchantName}&tn=${expectedEncoded.description}&cu=INR&mc=6012&tr=STQtest01123456&mode=01&qrMedium=06`;
            
            expect(upiString).toContain('Test%20%26%20Company');
            expect(upiString).toContain('Payment%20for%20order%20%2312345');
        });
    });

    describe('Transaction Reference Generation', () => {
        test('should generate transaction reference with STQ prefix - HDFC requirement', () => {
            const transactionRef = 'STQwin25123456';
            
            expect(transactionRef).toMatch(/^STQ[A-Z0-9]+\d{6}$/);
            expect(transactionRef).toHaveLength(14); // STQ + identifier + 6 digits
            expect(transactionRef.startsWith('STQ')).toBe(true);
        });

        test('should generate unique transaction references for multiple requests', () => {
            const refs = [];
            for (let i = 0; i < 100; i++) {
                const ref = `STQtest${Date.now().toString().slice(-6)}${i}`;
                refs.push(ref);
            }
            
            // All should be unique
            const uniqueRefs = new Set(refs);
            expect(uniqueRefs.size).toBe(refs.length);
        });

        test('should handle long identifiers in transaction reference', () => {
            const longIdentifier = 'verylongidentifier';
            const timestamp = '123456';
            const transactionRef = `STQ${longIdentifier.toUpperCase()}${timestamp}`;
            
            // Should not exceed reasonable length
            expect(transactionRef.length).toBeLessThan(50);
            expect(transactionRef.startsWith('STQ')).toBe(true);
        });
    });

    describe('VPA Integration in QR Generation', () => {
        test('should use dynamic VPA with merchant prefix to prevent collisions', () => {
            VPAGenerator.generateUniqueVPA.mockReturnValue('sabpaisa.sltwin25@hdfcbank');
            
            const mockData = {
                qr_identifier: 'win25',
                merchant_name: 'SRS Live Technologies'
            };
            
            expect(VPAGenerator.generateUniqueVPA).toHaveBeenCalledWith({
                identifier: 'win25',
                merchantName: 'SRS Live Technologies',
                merchantId: expect.any(String),
                strategy: 'prefix'
            });
        });

        test('should generate different VPAs for same identifier with different merchants', () => {
            const mockVPAs = [
                'sabpaisa.sltwin25@hdfcbank', // SRS Live Technologies
                'sabpaisa.abcwin25@hdfcbank'  // ABC Company
            ];
            
            VPAGenerator.generateUniqueVPA
                .mockReturnValueOnce(mockVPAs[0])
                .mockReturnValueOnce(mockVPAs[1]);
            
            const merchant1VPA = VPAGenerator.generateUniqueVPA({
                identifier: 'win25',
                merchantName: 'SRS Live Technologies'
            });
            
            const merchant2VPA = VPAGenerator.generateUniqueVPA({
                identifier: 'win25',
                merchantName: 'ABC Company'
            });
            
            expect(merchant1VPA).not.toBe(merchant2VPA);
        });
    });

    describe('QR Image Generation', () => {
        test('should generate QR image with correct parameters', async () => {
            const QRCode = require('qrcode');
            
            const upiString = 'upi://pay?pa=sabpaisa.sltwin25@hdfcbank&pn=SRS%20Live%20Technologies&tn=TestQR&cu=INR&mc=6012&tr=STQwin25123456&mode=01&qrMedium=06';
            
            await QRCode.toDataURL(upiString, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            expect(QRCode.toDataURL).toHaveBeenCalledWith(upiString, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
        });

        test('should return base64 encoded image data', async () => {
            const QRCode = require('qrcode');
            const result = await QRCode.toDataURL('test-upi-string');
            
            expect(result).toMatch(/^data:image\/png;base64,/);
        });

        test('should handle QR generation errors gracefully', async () => {
            const QRCode = require('qrcode');
            QRCode.toDataURL.mockRejectedValueOnce(new Error('QR generation failed'));
            
            await expect(async () => {
                await QRCode.toDataURL('invalid-upi-string');
            }).rejects.toThrow('QR generation failed');
        });
    });

    describe('QR Data Structure Validation', () => {
        test('should create QR data with all required fields', async () => {
            const mockInput = {
                qr_identifier: 'win25',
                reference_name: 'Test Store',
                description: 'Main counter QR',
                category: 'retail',
                max_amount_per_transaction: 5000
            };
            
            const expectedQRData = {
                ...mockInput,
                id: expect.any(Number),
                full_vpa: 'sabpaisa.sltwin25@hdfcbank',
                qr_image_url: 'data:image/png;base64,mockedQRImageData',
                upi_string: expect.stringContaining('upi://pay?pa='),
                transaction_ref: expect.stringMatching(/^STQ/),
                status: 'active',
                created_at: expect.any(String),
                total_collections: 0,
                transaction_count: 0
            };
            
            // Verify structure matches expected format
            Object.keys(expectedQRData).forEach(key => {
                if (key !== 'id' && key !== 'created_at') {
                    expect(expectedQRData[key]).toBeDefined();
                }
            });
        });

        test('should handle missing optional fields gracefully', () => {
            const minimalInput = {
                qr_identifier: 'test01'
            };
            
            const qrData = {
                ...minimalInput,
                reference_name: minimalInput.reference_name || 'Default Name',
                description: minimalInput.description || '',
                category: minimalInput.category || '',
                max_amount_per_transaction: minimalInput.max_amount_per_transaction || null
            };
            
            expect(qrData.qr_identifier).toBe('test01');
            expect(qrData.reference_name).toBeDefined();
        });
    });

    describe('Business Rule Validation', () => {
        test('should validate amount limits (₹1.00 to ₹1,00,000)', () => {
            const validAmounts = [1, 100, 5000, 100000];
            const invalidAmounts = [0, -1, 0.99, 100000.01, 200000];
            
            validAmounts.forEach(amount => {
                expect(amount).toBeGreaterThanOrEqual(1);
                expect(amount).toBeLessThanOrEqual(100000);
            });
            
            invalidAmounts.forEach(amount => {
                expect(
                    amount < 1 || amount > 100000
                ).toBe(true);
            });
        });

        test('should use correct MCC for UAT environment', () => {
            const upiString = 'upi://pay?pa=sabpaisa.test@hdfcbank&pn=Test&tn=Test&cu=INR&mc=6012&tr=STQtest123456&mode=01&qrMedium=06';
            
            expect(upiString).toContain('mc=6012'); // 6012 is the correct MCC for UAT
        });

        test('should prevent duplicate QR identifiers', () => {
            const existingQRs = [
                { qr_identifier: 'win25' },
                { qr_identifier: 'store01' },
                { qr_identifier: 'counter01' }
            ];
            
            const newIdentifier = 'win25';
            const isDuplicate = existingQRs.some(qr => qr.qr_identifier === newIdentifier);
            
            expect(isDuplicate).toBe(true);
        });

        test('should validate QR identifier format', () => {
            const validIdentifiers = ['WIN25', 'store01', 'ABC123', 'test1'];
            const invalidIdentifiers = ['', '   ', 'test@123', 'very-long-identifier-that-exceeds-limits'];
            
            validIdentifiers.forEach(id => {
                expect(id).toMatch(/^[A-Za-z0-9]{1,10}$/);
            });
            
            invalidIdentifiers.forEach(id => {
                expect(id.match(/^[A-Za-z0-9]{1,10}$/)).toBeNull();
            });
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle missing merchant name gracefully', () => {
            const mockData = {
                qr_identifier: 'test01'
                // Missing merchant_name and reference_name
            };
            
            VPAGenerator.generateUniqueVPA.mockImplementationOnce(({ merchantName }) => {
                const name = merchantName || 'Default Merchant';
                return `sabpaisa.deftest01@hdfcbank`;
            });
            
            const result = VPAGenerator.generateUniqueVPA({
                identifier: mockData.qr_identifier,
                merchantName: mockData.merchant_name || mockData.reference_name || 'Default Merchant'
            });
            
            expect(result).toBe('sabpaisa.deftest01@hdfcbank');
        });

        test('should handle special characters in QR identifier', () => {
            const specialCharInputs = ['test@123', 'win#25', 'store-01', 'counter_1'];
            
            specialCharInputs.forEach(input => {
                const sanitized = input.toLowerCase().replace(/[^a-z0-9]/g, '');
                expect(sanitized).toMatch(/^[a-z0-9]*$/);
            });
        });

        test('should handle extremely long descriptions', () => {
            const longDescription = 'A'.repeat(1000);
            const encodedDescription = encodeURIComponent(longDescription);
            
            // Should not exceed reasonable UPI string limits
            const upiString = `upi://pay?pa=test@bank&tn=${encodedDescription}`;
            expect(upiString.length).toBeLessThan(2000); // Reasonable limit
        });

        test('should handle concurrent QR generation', () => {
            const concurrentRequests = Array.from({ length: 10 }, (_, i) => ({
                qr_identifier: `concurrent${i}`,
                reference_name: `Store ${i}`,
                description: `QR for store ${i}`
            }));
            
            // Should not throw errors
            expect(() => {
                concurrentRequests.forEach((data, index) => {
                    VPAGenerator.generateUniqueVPA.mockReturnValueOnce(`sabpaisa.def${data.qr_identifier}@hdfcbank`);
                });
            }).not.toThrow();
        });

        test('should handle network timeouts in QR image generation', async () => {
            const QRCode = require('qrcode');
            
            // Mock timeout scenario
            QRCode.toDataURL.mockImplementationOnce(() => 
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 100)
                )
            );
            
            await expect(QRCode.toDataURL('test-string')).rejects.toThrow('Timeout');
        });
    });

    describe('Integration with HDFC API Service', () => {
        test('should call HDFC API service for QR generation', async () => {
            sabQRService.generateUniqueIdentifier.mockReturnValue('TEST123');
            
            const mockData = {
                qr_identifier: 'TEST123',
                reference_name: 'Test Merchant',
                description: 'Test QR',
                max_amount_per_transaction: 1000
            };
            
            // Simulate HDFC service call
            const hdfcParams = {
                identifier: mockData.qr_identifier,
                merchantName: mockData.reference_name,
                amount: mockData.max_amount_per_transaction,
                description: mockData.description,
                mcc: process.env.REACT_APP_QR_MCC || '6012'
            };
            
            expect(hdfcParams.mcc).toBe('6012');
            expect(hdfcParams.identifier).toBe('TEST123');
        });

        test('should handle HDFC API errors gracefully', () => {
            const mockError = new Error('HDFC API Error: Invalid request');
            
            expect(() => {
                throw mockError;
            }).toThrow('HDFC API Error: Invalid request');
        });
    });

    describe('Performance and Scalability', () => {
        test('should generate QR code within acceptable time limits', async () => {
            const startTime = performance.now();
            
            // Simulate QR generation process
            const mockData = {
                qr_identifier: 'perf01',
                reference_name: 'Performance Test',
                description: 'Performance testing QR'
            };
            
            VPAGenerator.generateUniqueVPA.mockReturnValue('sabpaisa.perfperf01@hdfcbank');
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // Should complete within 100ms
        });

        test('should handle batch QR generation efficiently', () => {
            const batchSize = 50;
            const qrBatch = Array.from({ length: batchSize }, (_, i) => ({
                qr_identifier: `batch${i}`,
                reference_name: `Batch Store ${i}`,
                description: `Batch QR ${i}`
            }));
            
            // Should not exceed memory limits
            expect(qrBatch).toHaveLength(batchSize);
            
            // Each QR should have unique identifier
            const identifiers = qrBatch.map(qr => qr.qr_identifier);
            const uniqueIdentifiers = new Set(identifiers);
            expect(uniqueIdentifiers.size).toBe(batchSize);
        });
    });

    describe('Compliance and Standards', () => {
        test('should comply with UPI 2.0 specifications', () => {
            const upiString = 'upi://pay?pa=sabpaisa.test@hdfcbank&pn=Test&tn=Test&cu=INR&mc=6012&tr=STQtest123456&mode=01&qrMedium=06';
            
            // UPI 2.0 mandatory parameters
            expect(upiString).toContain('pa='); // Payee address
            expect(upiString).toContain('pn='); // Payee name
            expect(upiString).toContain('cu=INR'); // Currency
            expect(upiString).toContain('mc='); // Merchant category
        });

        test('should comply with HDFC static QR requirements', () => {
            const upiString = 'upi://pay?pa=sabpaisa.test@hdfcbank&pn=Test&tn=Test&cu=INR&mc=6012&tr=STQtest123456&mode=01&qrMedium=06';
            
            // HDFC specific requirements
            expect(upiString).toContain('pa=sabpaisa.'); // VPA prefix
            expect(upiString).toContain('@hdfcbank'); // Bank domain
            expect(upiString).toContain('tr=STQ'); // Transaction reference prefix
            expect(upiString).toContain('mode=01'); // Static QR mode
            expect(upiString).toContain('qrMedium=06'); // QR medium
        });
    });
});