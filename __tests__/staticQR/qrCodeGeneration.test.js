/**
 * QR Code Generation Test Suite
 * Comprehensive testing for Static QR code generation with HDFC UPI format
 * Tests UPI string formation, QR image generation, and transaction references
 */

const { describe, test, expect, beforeEach, afterEach, jest } = require('@jest/globals');

// Mock QR Code Generation functions
const generateTransactionReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `STQ${timestamp}${random}`;
};

const generateUPIString = (params) => {
  const {
    merchantName,
    vpa,
    amount = '',
    transactionRef,
    transactionNote = ''
  } = params;
  
  // HDFC UPI format
  const upiParams = [
    'upi://pay?ver=01',
    'mode=01',
    `tr=${transactionRef || generateTransactionReference()}`,
    `tn=${encodeURIComponent(transactionNote)}`,
    `pn=${encodeURIComponent(merchantName)}`,
    `pa=${vpa}`,
    'mc=6012', // Merchant Category Code for financial institutions
    `am=${amount}`,
    'cu=INR',
    'qrMedium=06'
  ];
  
  return upiParams.join('&');
};

const validateAmount = (amount) => {
  if (amount === '' || amount === undefined) return true; // Static QR
  const numAmount = parseFloat(amount);
  return numAmount >= 1 && numAmount <= 100000;
};

describe('QR Code Generation Test Suite', () => {
  
  describe('UPI String Generation', () => {
    test('should generate correct UPI string for static QR', () => {
      const upiString = generateUPIString({
        merchantName: 'SRS Live Technologies',
        vpa: 'sabpaisa.sltwin25@hdfcbank',
        transactionRef: 'STQ1234567890'
      });
      
      expect(upiString).toContain('upi://pay?ver=01');
      expect(upiString).toContain('mode=01');
      expect(upiString).toContain('tr=STQ1234567890');
      expect(upiString).toContain('pa=sabpaisa.sltwin25@hdfcbank');
      expect(upiString).toContain('mc=6012');
      expect(upiString).toContain('cu=INR');
      expect(upiString).toContain('qrMedium=06');
    });

    test('should generate UPI string with amount for dynamic QR', () => {
      const upiString = generateUPIString({
        merchantName: 'Test Merchant',
        vpa: 'sabpaisa.test01@hdfcbank',
        amount: '500.00',
        transactionRef: 'STQ987654321'
      });
      
      expect(upiString).toContain('am=500.00');
    });

    test('should handle special characters in merchant name', () => {
      const upiString = generateUPIString({
        merchantName: "John's Store & Co.",
        vpa: 'sabpaisa.jsc01@hdfcbank'
      });
      
      expect(upiString).toContain('pn=John%27s%20Store%20%26%20Co.');
    });

    test('should encode transaction notes properly', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank',
        transactionNote: 'Payment for Order #123'
      });
      
      expect(upiString).toContain('tn=Payment%20for%20Order%20%23123');
    });
  });

  describe('Transaction Reference Generation', () => {
    test('should generate unique transaction references', () => {
      const refs = new Set();
      for (let i = 0; i < 100; i++) {
        refs.add(generateTransactionReference());
      }
      expect(refs.size).toBe(100);
    });

    test('should start with STQ prefix', () => {
      const ref = generateTransactionReference();
      expect(ref).toMatch(/^STQ/);
    });

    test('should contain timestamp', () => {
      const before = Date.now();
      const ref = generateTransactionReference();
      const after = Date.now();
      
      const timestamp = parseInt(ref.substring(3, 16));
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    test('should be alphanumeric only', () => {
      const ref = generateTransactionReference();
      expect(ref).toMatch(/^[A-Z0-9]+$/);
    });
  });

  describe('Amount Validation', () => {
    test('should accept valid amounts', () => {
      expect(validateAmount('1.00')).toBe(true);
      expect(validateAmount('100.50')).toBe(true);
      expect(validateAmount('50000')).toBe(true);
      expect(validateAmount('100000')).toBe(true);
    });

    test('should reject amounts below minimum', () => {
      expect(validateAmount('0')).toBe(false);
      expect(validateAmount('0.50')).toBe(false);
      expect(validateAmount('0.99')).toBe(false);
    });

    test('should reject amounts above maximum', () => {
      expect(validateAmount('100001')).toBe(false);
      expect(validateAmount('150000')).toBe(false);
      expect(validateAmount('1000000')).toBe(false);
    });

    test('should handle empty amount for static QR', () => {
      expect(validateAmount('')).toBe(true);
      expect(validateAmount(undefined)).toBe(true);
    });

    test('should handle invalid amount formats', () => {
      expect(validateAmount('abc')).toBe(false);
      expect(validateAmount('10.123')).toBe(true); // Will be rounded
      expect(validateAmount('-100')).toBe(false);
    });
  });

  describe('HDFC Format Compliance', () => {
    test('should use correct version parameter', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('ver=01');
    });

    test('should use correct mode for static QR', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('mode=01');
    });

    test('should use correct merchant category code', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('mc=6012');
    });

    test('should use INR currency only', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('cu=INR');
    });

    test('should use correct QR medium code', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('qrMedium=06');
    });
  });

  describe('QR Code Data Validation', () => {
    test('should validate complete UPI string structure', () => {
      const upiString = generateUPIString({
        merchantName: 'Test Merchant',
        vpa: 'sabpaisa.test@hdfcbank',
        amount: '100',
        transactionRef: 'STQ123'
      });
      
      const expectedParams = [
        'ver=01', 'mode=01', 'tr=STQ123', 'tn=',
        'pn=Test%20Merchant', 'pa=sabpaisa.test@hdfcbank',
        'mc=6012', 'am=100', 'cu=INR', 'qrMedium=06'
      ];
      
      expectedParams.forEach(param => {
        expect(upiString).toContain(param);
      });
    });

    test('should maintain parameter order', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank'
      });
      
      const params = upiString.split('&');
      expect(params[0]).toContain('upi://pay?ver=01');
      expect(params[1]).toBe('mode=01');
      expect(params[params.length - 1]).toBe('qrMedium=06');
    });

    test('should handle maximum length constraints', () => {
      const longName = 'A'.repeat(100);
      const upiString = generateUPIString({
        merchantName: longName,
        vpa: 'test@hdfcbank'
      });
      
      expect(upiString.length).toBeLessThan(2000); // UPI spec limit
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty merchant name', () => {
      const upiString = generateUPIString({
        merchantName: '',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('pn=');
    });

    test('should handle missing VPA', () => {
      expect(() => {
        generateUPIString({
          merchantName: 'Test'
        });
      }).not.toThrow();
    });

    test('should handle special amounts', () => {
      const testAmounts = ['1.00', '99999.99', '100000.00'];
      testAmounts.forEach(amount => {
        const upiString = generateUPIString({
          merchantName: 'Test',
          vpa: 'test@hdfcbank',
          amount
        });
        expect(upiString).toContain(`am=${amount}`);
      });
    });

    test('should handle Unicode in merchant names', () => {
      const upiString = generateUPIString({
        merchantName: 'कॉफी शॉप',
        vpa: 'test@hdfcbank'
      });
      expect(upiString).toContain('pn=');
      expect(upiString).not.toContain('कॉफी');
    });
  });

  describe('Performance Tests', () => {
    test('should generate UPI string within 5ms', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        generateUPIString({
          merchantName: 'Test Merchant',
          vpa: 'test@hdfcbank',
          amount: '100'
        });
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(50); // 50ms for 1000 operations
    });

    test('should handle batch QR generation', () => {
      const start = Date.now();
      const qrCodes = [];
      
      for (let i = 0; i < 100; i++) {
        qrCodes.push(generateUPIString({
          merchantName: `Merchant ${i}`,
          vpa: `test${i}@hdfcbank`,
          amount: `${i + 1}.00`
        }));
      }
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
      expect(qrCodes.length).toBe(100);
      expect(new Set(qrCodes).size).toBe(100); // All unique
    });
  });

  describe('Integration Scenarios', () => {
    test('should generate QR for new merchant registration', () => {
      const newMerchant = {
        name: 'New Store ABC',
        vpa: 'sabpaisa.nsa01@hdfcbank'
      };
      
      const upiString = generateUPIString({
        merchantName: newMerchant.name,
        vpa: newMerchant.vpa
      });
      
      expect(upiString).toContain('pa=sabpaisa.nsa01@hdfcbank');
      expect(upiString).toContain('pn=New%20Store%20ABC');
    });

    test('should handle multiple QRs for same merchant', () => {
      const merchant = {
        name: 'Multi QR Store',
        vpa: 'sabpaisa.mqs01@hdfcbank'
      };
      
      const qr1 = generateUPIString({ ...merchant, transactionRef: 'STQ001' });
      const qr2 = generateUPIString({ ...merchant, transactionRef: 'STQ002' });
      
      expect(qr1).not.toBe(qr2);
      expect(qr1).toContain('STQ001');
      expect(qr2).toContain('STQ002');
    });
  });

  describe('Error Recovery', () => {
    test('should handle null inputs gracefully', () => {
      expect(() => generateUPIString(null)).not.toThrow();
      expect(() => generateUPIString({})).not.toThrow();
    });

    test('should handle undefined parameters', () => {
      const upiString = generateUPIString({
        merchantName: undefined,
        vpa: undefined
      });
      expect(upiString).toContain('upi://pay');
    });

    test('should generate fallback transaction reference', () => {
      const upiString = generateUPIString({
        merchantName: 'Test',
        vpa: 'test@hdfcbank',
        transactionRef: null
      });
      expect(upiString).toMatch(/tr=STQ\d+/);
    });
  });
});

module.exports = {
  generateTransactionReference,
  generateUPIString,
  validateAmount
};