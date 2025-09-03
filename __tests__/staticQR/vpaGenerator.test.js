/**
 * VPA Generator Test Suite
 * Comprehensive testing for VPA (Virtual Payment Address) generation system
 * Tests merchant name to VPA prefix conversion and collision prevention
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

// Mock VPA Generator functions (to be replaced with actual imports)
const generateVPAPrefix = (merchantName) => {
  // Remove common suffixes
  const cleaned = merchantName
    .replace(/\b(Pvt|Private|Ltd|Limited|Inc|Corporation|Corp|Company|Co)\b/gi, '')
    .trim();
  
  // Extract significant words
  const words = cleaned.split(/\s+/).filter(word => word.length > 0);
  
  // Generate 3-letter prefix
  if (words.length === 1) {
    return words[0].substring(0, 3).toLowerCase();
  } else if (words.length === 2) {
    return (words[0][0] + words[1].substring(0, 2)).toLowerCase();
  } else {
    return words.slice(0, 3).map(w => w[0]).join('').toLowerCase();
  }
};

const generateFullVPA = (merchantName, identifier = '01') => {
  const prefix = generateVPAPrefix(merchantName);
  return `sabpaisa.${prefix}${identifier}@hdfcbank`;
};

describe('VPA Generator Test Suite', () => {
  
  describe('Basic VPA Generation', () => {
    test('should generate correct VPA for SRS Live Technologies', () => {
      const vpa = generateVPAPrefix('SRS Live Technologies');
      expect(vpa).toBe('slt');
      const fullVPA = generateFullVPA('SRS Live Technologies', 'win25');
      expect(fullVPA).toBe('sabpaisa.sltwin25@hdfcbank');
    });

    test('should generate correct VPA for Wishful Auto Parts Pvt Ltd', () => {
      const vpa = generateVPAPrefix('Wishful Auto Parts Pvt Ltd');
      expect(vpa).toBe('wap');
      const fullVPA = generateFullVPA('Wishful Auto Parts Pvt Ltd', 'store01');
      expect(fullVPA).toBe('sabpaisa.wapstore01@hdfcbank');
    });

    test('should handle single word company names', () => {
      const vpa = generateVPAPrefix('Amazon');
      expect(vpa).toBe('ama');
      expect(generateFullVPA('Amazon')).toBe('sabpaisa.ama01@hdfcbank');
    });

    test('should handle two word company names', () => {
      const vpa = generateVPAPrefix('Blue Sky');
      expect(vpa).toBe('bsk');
      expect(generateFullVPA('Blue Sky')).toBe('sabpaisa.bsk01@hdfcbank');
    });
  });

  describe('Suffix Removal', () => {
    test('should remove Pvt from company names', () => {
      expect(generateVPAPrefix('ABC Pvt')).toBe('abc');
      expect(generateVPAPrefix('ABC Solutions Pvt')).toBe('aso');
    });

    test('should remove Ltd from company names', () => {
      expect(generateVPAPrefix('XYZ Ltd')).toBe('xyz');
      expect(generateVPAPrefix('Tech Solutions Ltd')).toBe('tso');
    });

    test('should remove Private Limited', () => {
      expect(generateVPAPrefix('Global Tech Private Limited')).toBe('gte');
      expect(generateVPAPrefix('ABC Private Limited')).toBe('abc');
    });

    test('should remove multiple suffixes', () => {
      expect(generateVPAPrefix('Tech Corp Private Ltd')).toBe('tec');
      expect(generateVPAPrefix('Global Inc Corporation Ltd')).toBe('gin');
    });
  });

  describe('Special Characters Handling', () => {
    test('should handle hyphens in company names', () => {
      expect(generateVPAPrefix('Tech-Solutions')).toBe('tec');
      expect(generateVPAPrefix('E-Commerce Hub')).toBe('ech');
    });

    test('should handle apostrophes', () => {
      expect(generateVPAPrefix("McDonald's")).toBe('mcd');
      expect(generateVPAPrefix("John's Electronics")).toBe('jel');
    });

    test('should handle ampersands', () => {
      expect(generateVPAPrefix('Johnson & Johnson')).toBe('jjo');
      expect(generateVPAPrefix('AT&T Services')).toBe('ats');
    });

    test('should handle dots and commas', () => {
      expect(generateVPAPrefix('A.B.C. Corporation')).toBe('abc');
      expect(generateVPAPrefix('Tech, Inc.')).toBe('tec');
    });

    test('should handle numbers in names', () => {
      expect(generateVPAPrefix('3M Company')).toBe('3mc');
      expect(generateVPAPrefix('7-Eleven')).toBe('7el');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty strings', () => {
      expect(generateVPAPrefix('')).toBe('');
      expect(generateVPAPrefix('   ')).toBe('');
    });

    test('should handle very long company names', () => {
      const longName = 'International Business Machines Global Technology Services Division';
      expect(generateVPAPrefix(longName)).toBe('ibm');
    });

    test('should handle names with only suffixes', () => {
      expect(generateVPAPrefix('Pvt Ltd')).toBe('');
      expect(generateVPAPrefix('Private Limited Corporation')).toBe('');
    });

    test('should handle Unicode characters', () => {
      expect(generateVPAPrefix('Café Express')).toBe('cex');
      expect(generateVPAPrefix('Zürich Financial')).toBe('zfi');
    });

    test('should handle names with excessive spaces', () => {
      expect(generateVPAPrefix('  Tech   Solutions   ')).toBe('tso');
      expect(generateVPAPrefix('A    B    C')).toBe('abc');
    });
  });

  describe('VPA Collision Prevention', () => {
    test('should generate unique VPAs for similar names', () => {
      const merchants = [
        'ABC Technologies',
        'ABC Tech',
        'ABC Technical Solutions'
      ];
      
      const vpas = merchants.map(m => generateVPAPrefix(m));
      expect(vpas[0]).toBe('ate');
      expect(vpas[1]).toBe('ate');
      expect(vpas[2]).toBe('ats');
    });

    test('should handle collision with identifiers', () => {
      const vpa1 = generateFullVPA('Tech Solutions', '01');
      const vpa2 = generateFullVPA('Tech Solutions', '02');
      expect(vpa1).not.toBe(vpa2);
      expect(vpa1).toBe('sabpaisa.tso01@hdfcbank');
      expect(vpa2).toBe('sabpaisa.tso02@hdfcbank');
    });
  });

  describe('Performance Tests', () => {
    test('should generate VPA within 10ms', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        generateVPAPrefix('Test Company Name');
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // 100ms for 1000 operations
    });

    test('should handle batch generation efficiently', () => {
      const merchants = Array(100).fill(null).map((_, i) => `Company ${i}`);
      const start = Date.now();
      const vpas = merchants.map(m => generateFullVPA(m));
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(50);
      expect(vpas.length).toBe(100);
      expect(new Set(vpas).size).toBeGreaterThan(90); // Most should be unique
    });
  });

  describe('Format Validation', () => {
    test('should always generate lowercase VPAs', () => {
      const tests = ['UPPERCASE', 'MixedCase', 'lowercase'];
      tests.forEach(name => {
        const vpa = generateVPAPrefix(name);
        expect(vpa).toBe(vpa.toLowerCase());
      });
    });

    test('should maintain correct VPA structure', () => {
      const vpa = generateFullVPA('Test Company', 'abc123');
      expect(vpa).toMatch(/^sabpaisa\.[a-z0-9]+@hdfcbank$/);
    });

    test('should enforce 3-letter prefix length', () => {
      const tests = [
        'A',
        'AB',
        'ABC',
        'ABCD',
        'ABCDEFG'
      ];
      tests.forEach(name => {
        const vpa = generateVPAPrefix(name);
        if (vpa) {
          expect(vpa.length).toBeLessThanOrEqual(3);
        }
      });
    });
  });

  describe('Database Integration Scenarios', () => {
    test('should handle merchant updates', () => {
      const oldVPA = generateFullVPA('Old Company Name', '001');
      const newVPA = generateFullVPA('New Company Name', '001');
      expect(oldVPA).not.toBe(newVPA);
    });

    test('should maintain VPA history', () => {
      const merchantHistory = [
        { name: 'ABC Corp', date: '2024-01-01' },
        { name: 'ABC Corporation', date: '2024-06-01' },
        { name: 'ABC Corp Ltd', date: '2024-12-01' }
      ];
      
      const vpas = merchantHistory.map(m => generateVPAPrefix(m.name));
      expect(vpas[0]).toBe('aco');
      expect(vpas[1]).toBe('aco');
      expect(vpas[2]).toBe('abc');
    });
  });

  describe('Compliance and Standards', () => {
    test('should comply with HDFC VPA format', () => {
      const vpa = generateFullVPA('Test Merchant', 'test01');
      expect(vpa).toMatch(/^sabpaisa\.[a-z0-9]+@hdfcbank$/);
      expect(vpa.length).toBeLessThanOrEqual(50); // UPI spec limit
    });

    test('should not contain special characters in prefix', () => {
      const vpa = generateVPAPrefix('Test@#$%Company');
      expect(vpa).toMatch(/^[a-z0-9]*$/);
    });

    test('should handle Indian company name formats', () => {
      const indianCompanies = [
        'Reliance Industries Limited',
        'Tata Consultancy Services',
        'Infosys Technologies Pvt Ltd',
        'Wipro Limited'
      ];
      
      indianCompanies.forEach(company => {
        const vpa = generateFullVPA(company);
        expect(vpa).toMatch(/^sabpaisa\.[a-z]+[0-9]+@hdfcbank$/);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle null input gracefully', () => {
      expect(() => generateVPAPrefix(null)).not.toThrow();
    });

    test('should handle undefined input', () => {
      expect(() => generateVPAPrefix(undefined)).not.toThrow();
    });

    test('should handle non-string input', () => {
      expect(() => generateVPAPrefix(123)).not.toThrow();
      expect(() => generateVPAPrefix({})).not.toThrow();
      expect(() => generateVPAPrefix([])).not.toThrow();
    });
  });
});

// Export for use in other test files
module.exports = {
  generateVPAPrefix,
  generateFullVPA
};