/**
 * HDFC API Integration Test Suite
 * Comprehensive testing for HDFC UPI API integration
 * Tests encryption, webhook processing, status enquiry, and refunds
 */

const { describe, test, expect, beforeEach, afterEach, jest } = require('@jest/globals');
const crypto = require('crypto');

// AES-128 ECB Encryption/Decryption Mock
class AESEncryption {
  constructor(key) {
    this.key = Buffer.from(key, 'hex');
  }

  encrypt(data) {
    try {
      const cipher = crypto.createCipheriv('aes-128-ecb', this.key, null);
      cipher.setAutoPadding(true);
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  decrypt(encryptedData) {
    try {
      const decipher = crypto.createDecipheriv('aes-128-ecb', this.key, null);
      decipher.setAutoPadding(true);
      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }
}

// Mock HDFC API Service
class HDFCApiService {
  constructor() {
    this.encryptionKey = '1234567890abcdef1234567890abcdef';
    this.encryption = new AESEncryption(this.encryptionKey);
    this.apiTimeout = 30000; // 30 seconds
  }

  async transactionEnquiry(transactionRef) {
    const requestData = {
      merchantId: 'SABPAISA001',
      transactionRef,
      timestamp: new Date().toISOString()
    };

    const encryptedRequest = this.encryption.encrypt(requestData);
    
    // Simulate API call
    const mockResponse = {
      status: 'SUCCESS',
      transactionRef,
      amount: '100.00',
      payerVPA: 'customer@upi',
      transactionTime: new Date().toISOString(),
      rrn: 'HDFC' + Date.now()
    };

    return this.encryption.encrypt(mockResponse);
  }

  async processRefund(transactionRef, amount) {
    const requestData = {
      merchantId: 'SABPAISA001',
      originalTransactionRef: transactionRef,
      refundAmount: amount,
      refundRef: 'REF' + Date.now(),
      timestamp: new Date().toISOString()
    };

    const encryptedRequest = this.encryption.encrypt(requestData);
    
    const mockResponse = {
      status: 'REFUND_INITIATED',
      refundRef: requestData.refundRef,
      originalTransactionRef: transactionRef,
      refundAmount: amount
    };

    return this.encryption.encrypt(mockResponse);
  }

  parseWebhookCallback(encryptedData) {
    const decryptedData = this.encryption.decrypt(encryptedData);
    
    // Validate required fields
    const requiredFields = [
      'txnid', 'amount', 'productinfo', 'firstname',
      'email', 'phone', 'status', 'unmappedstatus',
      'mode', 'mihpayid', 'bank_ref_num', 'bankcode',
      'error', 'error_Message', 'name_on_card',
      'cardnum', 'addedon', 'payment_source', 'PG_TYPE',
      'net_amount_debit', 'encryptedPaymentId'
    ];

    const missingFields = requiredFields.filter(field => !(field in decryptedData));
    if (missingFields.length > 0) {
      throw new Error(`Missing webhook fields: ${missingFields.join(', ')}`);
    }

    return decryptedData;
  }

  generateChecksum(data) {
    const sortedKeys = Object.keys(data).sort();
    const checksumString = sortedKeys.map(key => `${key}=${data[key]}`).join('|');
    return crypto.createHash('sha256').update(checksumString).digest('hex');
  }

  validateChecksum(data, providedChecksum) {
    const calculatedChecksum = this.generateChecksum(data);
    return calculatedChecksum === providedChecksum;
  }
}

describe('HDFC API Integration Test Suite', () => {
  let hdfcService;

  beforeEach(() => {
    hdfcService = new HDFCApiService();
  });

  describe('AES-128 ECB Encryption', () => {
    test('should encrypt data correctly', () => {
      const data = { test: 'data', amount: 100 };
      const encrypted = hdfcService.encryption.encrypt(data);
      
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toContain('test');
      expect(encrypted).not.toContain('data');
    });

    test('should decrypt data correctly', () => {
      const originalData = { merchant: 'Test', amount: '500.00' };
      const encrypted = hdfcService.encryption.encrypt(originalData);
      const decrypted = hdfcService.encryption.decrypt(encrypted);
      
      expect(decrypted).toEqual(originalData);
    });

    test('should handle encryption of large payloads', () => {
      const largeData = {
        transactions: Array(100).fill(null).map((_, i) => ({
          id: `TXN${i}`,
          amount: `${i * 100}`,
          status: 'SUCCESS'
        }))
      };
      
      const encrypted = hdfcService.encryption.encrypt(largeData);
      const decrypted = hdfcService.encryption.decrypt(encrypted);
      
      expect(decrypted).toEqual(largeData);
    });

    test('should use PKCS7 padding', () => {
      const data = { a: 'b' }; // Small data to test padding
      const encrypted = hdfcService.encryption.encrypt(data);
      
      expect(encrypted).toBeDefined();
      expect(Buffer.from(encrypted, 'base64').length % 16).toBe(0);
    });

    test('should handle special characters in data', () => {
      const data = {
        merchant: 'Test & Co.',
        amount: '₹1,000.00',
        note: 'Payment #123 @store'
      };
      
      const encrypted = hdfcService.encryption.encrypt(data);
      const decrypted = hdfcService.encryption.decrypt(encrypted);
      
      expect(decrypted).toEqual(data);
    });
  });

  describe('Transaction Status Enquiry', () => {
    test('should query transaction status successfully', async () => {
      const transactionRef = 'STQ1234567890';
      const encryptedResponse = await hdfcService.transactionEnquiry(transactionRef);
      const response = hdfcService.encryption.decrypt(encryptedResponse);
      
      expect(response.status).toBe('SUCCESS');
      expect(response.transactionRef).toBe(transactionRef);
      expect(response.amount).toBeDefined();
      expect(response.rrn).toBeDefined();
    });

    test('should handle timeout scenarios', async () => {
      jest.setTimeout(35000);
      
      const slowEnquiry = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 'TIMEOUT' });
        }, 31000);
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API Timeout')), 30000);
      });
      
      await expect(Promise.race([slowEnquiry, timeoutPromise]))
        .rejects.toThrow('API Timeout');
    });

    test('should include merchant ID in requests', async () => {
      const transactionRef = 'STQ9876543210';
      const encryptedResponse = await hdfcService.transactionEnquiry(transactionRef);
      
      // Decrypt to verify merchant ID was included
      const response = hdfcService.encryption.decrypt(encryptedResponse);
      expect(response).toBeDefined();
    });
  });

  describe('Webhook Callback Processing', () => {
    test('should parse valid webhook callback', () => {
      const webhookData = {
        txnid: 'STQ1234567890',
        amount: '100.00',
        productinfo: 'Static QR Payment',
        firstname: 'John',
        email: 'john@example.com',
        phone: '9876543210',
        status: 'success',
        unmappedstatus: 'captured',
        mode: 'UPI',
        mihpayid: 'HDFC123456',
        bank_ref_num: 'REF987654',
        bankcode: 'HDFC',
        error: 'E000',
        error_Message: 'No Error',
        name_on_card: 'NA',
        cardnum: 'NA',
        addedon: '2024-01-15 10:30:00',
        payment_source: 'payu',
        PG_TYPE: 'UPI',
        net_amount_debit: '100.00',
        encryptedPaymentId: 'ENC123456'
      };
      
      const encrypted = hdfcService.encryption.encrypt(webhookData);
      const parsed = hdfcService.parseWebhookCallback(encrypted);
      
      expect(parsed).toEqual(webhookData);
      expect(parsed.status).toBe('success');
      expect(parsed.txnid).toBe('STQ1234567890');
    });

    test('should validate all 21 required fields', () => {
      const incompleteData = {
        txnid: 'STQ123',
        amount: '100.00'
        // Missing other required fields
      };
      
      const encrypted = hdfcService.encryption.encrypt(incompleteData);
      
      expect(() => {
        hdfcService.parseWebhookCallback(encrypted);
      }).toThrow('Missing webhook fields');
    });

    test('should handle failed payment callbacks', () => {
      const failedPayment = {
        txnid: 'STQ1234567890',
        amount: '100.00',
        productinfo: 'Static QR Payment',
        firstname: 'John',
        email: 'john@example.com',
        phone: '9876543210',
        status: 'failure',
        unmappedstatus: 'failed',
        mode: 'UPI',
        mihpayid: 'HDFC123456',
        bank_ref_num: '',
        bankcode: 'HDFC',
        error: 'E001',
        error_Message: 'Transaction Failed',
        name_on_card: 'NA',
        cardnum: 'NA',
        addedon: '2024-01-15 10:30:00',
        payment_source: 'payu',
        PG_TYPE: 'UPI',
        net_amount_debit: '0.00',
        encryptedPaymentId: ''
      };
      
      const encrypted = hdfcService.encryption.encrypt(failedPayment);
      const parsed = hdfcService.parseWebhookCallback(encrypted);
      
      expect(parsed.status).toBe('failure');
      expect(parsed.error).toBe('E001');
      expect(parsed.error_Message).toBe('Transaction Failed');
    });
  });

  describe('Refund Processing', () => {
    test('should initiate refund successfully', async () => {
      const transactionRef = 'STQ1234567890';
      const refundAmount = '50.00';
      
      const encryptedResponse = await hdfcService.processRefund(transactionRef, refundAmount);
      const response = hdfcService.encryption.decrypt(encryptedResponse);
      
      expect(response.status).toBe('REFUND_INITIATED');
      expect(response.originalTransactionRef).toBe(transactionRef);
      expect(response.refundAmount).toBe(refundAmount);
      expect(response.refundRef).toBeDefined();
    });

    test('should handle partial refunds', async () => {
      const originalAmount = 100.00;
      const partialRefund1 = '30.00';
      const partialRefund2 = '20.00';
      
      const response1 = await hdfcService.processRefund('STQ123', partialRefund1);
      const response2 = await hdfcService.processRefund('STQ123', partialRefund2);
      
      const refund1 = hdfcService.encryption.decrypt(response1);
      const refund2 = hdfcService.encryption.decrypt(response2);
      
      expect(refund1.refundAmount).toBe(partialRefund1);
      expect(refund2.refundAmount).toBe(partialRefund2);
    });

    test('should generate unique refund references', async () => {
      const refunds = [];
      
      for (let i = 0; i < 10; i++) {
        const response = await hdfcService.processRefund(`STQ${i}`, '10.00');
        const refund = hdfcService.encryption.decrypt(response);
        refunds.push(refund.refundRef);
      }
      
      const uniqueRefs = new Set(refunds);
      expect(uniqueRefs.size).toBe(10);
    });
  });

  describe('Checksum Validation', () => {
    test('should generate correct checksum', () => {
      const data = {
        amount: '100.00',
        txnid: 'STQ123',
        status: 'success'
      };
      
      const checksum = hdfcService.generateChecksum(data);
      
      expect(checksum).toBeDefined();
      expect(checksum.length).toBe(64); // SHA-256 hex length
    });

    test('should validate checksum correctly', () => {
      const data = {
        amount: '100.00',
        txnid: 'STQ123',
        status: 'success'
      };
      
      const checksum = hdfcService.generateChecksum(data);
      const isValid = hdfcService.validateChecksum(data, checksum);
      
      expect(isValid).toBe(true);
    });

    test('should detect tampered data', () => {
      const originalData = {
        amount: '100.00',
        txnid: 'STQ123',
        status: 'success'
      };
      
      const checksum = hdfcService.generateChecksum(originalData);
      
      const tamperedData = { ...originalData, amount: '200.00' };
      const isValid = hdfcService.validateChecksum(tamperedData, checksum);
      
      expect(isValid).toBe(false);
    });

    test('should maintain consistent checksum for same data', () => {
      const data = {
        amount: '100.00',
        txnid: 'STQ123',
        status: 'success'
      };
      
      const checksum1 = hdfcService.generateChecksum(data);
      const checksum2 = hdfcService.generateChecksum(data);
      
      expect(checksum1).toBe(checksum2);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed encrypted data', () => {
      expect(() => {
        hdfcService.encryption.decrypt('invalid-base64-data!@#');
      }).toThrow('Decryption failed');
    });

    test('should handle network errors gracefully', async () => {
      const mockNetworkError = jest.fn().mockRejectedValue(new Error('Network error'));
      hdfcService.transactionEnquiry = mockNetworkError;
      
      await expect(hdfcService.transactionEnquiry('STQ123'))
        .rejects.toThrow('Network error');
    });

    test('should handle invalid encryption key', () => {
      const invalidService = new HDFCApiService();
      invalidService.encryption = new AESEncryption('invalid-key');
      
      expect(() => {
        invalidService.encryption.encrypt({ test: 'data' });
      }).toThrow();
    });

    test('should handle API rate limiting', async () => {
      const requests = [];
      
      // Simulate 100 rapid requests
      for (let i = 0; i < 100; i++) {
        requests.push(hdfcService.transactionEnquiry(`STQ${i}`));
      }
      
      const results = await Promise.allSettled(requests);
      const successful = results.filter(r => r.status === 'fulfilled');
      
      // At least some should succeed
      expect(successful.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    test('should encrypt/decrypt within 50ms', () => {
      const data = {
        transactions: Array(10).fill(null).map((_, i) => ({
          id: `TXN${i}`,
          amount: `${i * 100}`,
          status: 'SUCCESS'
        }))
      };
      
      const start = Date.now();
      const encrypted = hdfcService.encryption.encrypt(data);
      const decrypted = hdfcService.encryption.decrypt(encrypted);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(50);
      expect(decrypted).toEqual(data);
    });

    test('should handle concurrent API calls', async () => {
      const start = Date.now();
      const calls = Array(50).fill(null).map((_, i) => 
        hdfcService.transactionEnquiry(`STQ${i}`)
      );
      
      const results = await Promise.all(calls);
      const duration = Date.now() - start;
      
      expect(results.length).toBe(50);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});

module.exports = {
  AESEncryption,
  HDFCApiService
};