/**
 * VPA Generator Utility for Static QR
 * Generates unique Virtual Payment Addresses for merchants
 */

class VPAGenerator {
    constructor() {
        this.baseVPA = '@hdfcbank';
        this.prefix = 'sabpaisa';
    }

    /**
     * Generate a unique VPA for a merchant
     * @param {Object} options - Configuration options
     * @param {string} options.identifier - Unique identifier for the QR
     * @param {string} options.merchantPrefix - Merchant-specific prefix
     * @returns {string} Generated VPA
     */
    generateUniqueVPA({ identifier, merchantPrefix }) {
        // Clean and format the identifier
        const cleanIdentifier = this.cleanIdentifier(identifier);
        const cleanPrefix = merchantPrefix ? this.cleanIdentifier(merchantPrefix) : this.prefix;
        
        // Generate VPA in format: sabpaisa.merchantprefix.identifier@hdfcbank
        const vpa = `${cleanPrefix}.${cleanIdentifier}${this.baseVPA}`.toLowerCase();
        
        return vpa;
    }

    /**
     * Generate merchant-specific prefix from merchant name
     * @param {string} merchantName - Name of the merchant
     * @returns {string} Generated prefix
     */
    generateMerchantPrefix(merchantName) {
        if (!merchantName) return this.prefix;
        
        // Take first 3 letters of each word (max 3 words)
        const words = merchantName.trim().split(/\s+/).slice(0, 3);
        const prefix = words
            .map(word => word.substring(0, 3))
            .join('')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
        
        return prefix || this.prefix;
    }

    /**
     * Clean identifier to make it VPA compliant
     * @param {string} identifier - Raw identifier
     * @returns {string} Cleaned identifier
     */
    cleanIdentifier(identifier) {
        if (!identifier) {
            // Generate random identifier if none provided
            return this.generateRandomIdentifier();
        }
        
        // Remove special characters and spaces, keep only alphanumeric
        return identifier
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20); // Limit length
    }

    /**
     * Generate a random identifier
     * @returns {string} Random identifier
     */
    generateRandomIdentifier() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}${random}`;
    }

    /**
     * Validate if a VPA is in correct format
     * @param {string} vpa - VPA to validate
     * @returns {boolean} Is valid
     */
    isValidVPA(vpa) {
        const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
        return vpaRegex.test(vpa);
    }

    /**
     * Extract components from a VPA
     * @param {string} vpa - Full VPA string
     * @returns {Object} VPA components
     */
    parseVPA(vpa) {
        const parts = vpa.split('@');
        if (parts.length !== 2) {
            return null;
        }

        const [handle, bank] = parts;
        const handleParts = handle.split('.');
        
        return {
            full: vpa,
            handle,
            bank,
            prefix: handleParts[0] || '',
            merchantPrefix: handleParts[1] || '',
            identifier: handleParts[2] || ''
        };
    }

    /**
     * Generate QR-specific VPA with amount
     * @param {Object} options - Configuration options
     * @returns {string} VPA with parameters
     */
    generateQRVPA({ vpa, amount, note, merchantName }) {
        let qrVPA = vpa;
        
        // Build UPI deep link format
        const params = [];
        if (amount) params.push(`am=${amount}`);
        if (note) params.push(`tn=${encodeURIComponent(note)}`);
        if (merchantName) params.push(`pn=${encodeURIComponent(merchantName)}`);
        params.push('cu=INR');
        
        if (params.length > 0) {
            qrVPA = `upi://pay?pa=${vpa}&${params.join('&')}`;
        }
        
        return qrVPA;
    }
}

// Export singleton instance
export default new VPAGenerator();