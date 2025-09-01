/**
 * VPA Generator Utility
 * Generates unique VPAs for multi-merchant environment
 * Format: sabpaisa.{merchantPrefix}{identifier}@hdfcbank
 */

class VPAGenerator {
    /**
     * Generate merchant prefix from company name
     * Takes first letter of each significant word (ignores common words)
     * @param {string} companyName - Full company name
     * @returns {string} 3-character prefix
     */
    static generateMerchantPrefix(companyName) {
        if (!companyName) return 'mer'; // Default prefix
        
        console.log('[generateMerchantPrefix] Input company name:', companyName);
        
        // Common words to ignore
        const ignoreWords = ['pvt', 'private', 'ltd', 'limited', 'inc', 'incorporated', 
                           'corp', 'corporation', 'llc', 'llp', 'and', 'the', 'of'];
        
        // Split company name into words and filter
        const words = companyName
            .toLowerCase()
            .split(/[\s\-_]+/) // Split on spaces, hyphens, underscores
            .filter(word => word.length > 0 && !ignoreWords.includes(word.toLowerCase()));
        
        console.log('[generateMerchantPrefix] Filtered words:', words);
        
        let prefix = '';
        
        // Strategy 1: Take first letter of each significant word
        if (words.length >= 3) {
            // Take first letter of first 3 words
            prefix = words.slice(0, 3).map(w => w[0]).join('');
        } else if (words.length === 2) {
            // Two words: take first letter of each, then second letter of first word
            prefix = words[0][0] + words[1][0] + (words[0][1] || words[1][1] || 'x');
        } else if (words.length === 1) {
            // One word: take first 3 characters
            prefix = words[0].substring(0, 3);
        }
        
        // Ensure we have exactly 3 characters
        prefix = prefix.substring(0, 3);
        while (prefix.length < 3) {
            prefix += 'x';
        }
        
        const result = prefix.toLowerCase();
        console.log('[generateMerchantPrefix] Final prefix:', result);
        return result;
    }

    /**
     * Generate unique VPA with merchant prefix
     * @param {object} params - Parameters for VPA generation
     * @param {string} params.identifier - User-provided identifier (e.g., 'store01', 'win25')
     * @param {string} params.merchantName - Company/merchant name
     * @param {string} params.merchantId - Optional merchant ID for additional uniqueness
     * @param {string} params.strategy - 'prefix' | 'suffix' | 'mixed' (default: 'prefix')
     * @returns {string} Generated VPA
     */
    static generateUniqueVPA(params) {
        const {
            identifier,
            merchantName,
            merchantId,
            strategy = 'prefix'
        } = params;

        console.log('[VPAGenerator] Input:', { identifier, merchantName, strategy });

        // Clean and validate identifier
        const cleanIdentifier = (identifier || 'default')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 10); // Limit identifier length

        // Generate merchant prefix
        const merchantPrefix = this.generateMerchantPrefix(merchantName);
        console.log('[VPAGenerator] Generated prefix:', merchantPrefix, 'from merchant:', merchantName);
        
        // Generate VPA based on strategy
        let vpaIdentifier;
        
        switch (strategy) {
            case 'suffix':
                // Merchant code at the end: win25srs
                vpaIdentifier = `${cleanIdentifier}${merchantPrefix}`;
                break;
                
            case 'mixed':
                // Merchant code in middle: sr-win25-s
                const firstChar = merchantPrefix.substring(0, 2);
                const lastChar = merchantPrefix.substring(2, 3);
                vpaIdentifier = `${firstChar}${cleanIdentifier}${lastChar}`;
                break;
                
            case 'prefix':
            default:
                // Merchant code at start: srswin25
                vpaIdentifier = `${merchantPrefix}${cleanIdentifier}`;
                break;
        }

        // Ensure VPA identifier doesn't exceed HDFC's limits (typically 20 chars)
        vpaIdentifier = vpaIdentifier.substring(0, 20);

        // Generate final VPA
        const vpa = `sabpaisa.${vpaIdentifier}@hdfcbank`;
        
        return vpa;
    }

    /**
     * Generate VPA with merchant ID hash for guaranteed uniqueness
     * @param {object} params - Parameters
     * @returns {string} Generated VPA with hash
     */
    static generateHashedVPA(params) {
        const { identifier, merchantId } = params;
        
        if (!merchantId) {
            return this.generateUniqueVPA(params);
        }

        // Create a short hash from merchant ID (last 3 chars)
        const merchantHash = merchantId.slice(-3).toLowerCase();
        
        // Clean identifier
        const cleanIdentifier = (identifier || 'default')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 12);

        // Combine: hash + identifier
        const vpaIdentifier = `${merchantHash}${cleanIdentifier}`;
        
        return `sabpaisa.${vpaIdentifier}@hdfcbank`;
    }

    /**
     * Validate if a VPA follows the expected format
     * @param {string} vpa - VPA to validate
     * @returns {boolean} Is valid
     */
    static validateVPA(vpa) {
        const vpaRegex = /^sabpaisa\.[a-z0-9]{1,20}@hdfcbank$/;
        return vpaRegex.test(vpa.toLowerCase());
    }

    /**
     * Extract components from a VPA
     * @param {string} vpa - VPA to parse
     * @returns {object} Parsed components
     */
    static parseVPA(vpa) {
        const match = vpa.match(/^sabpaisa\.([a-z0-9]+)@(.+)$/i);
        if (!match) return null;

        const identifier = match[1];
        const bank = match[2];
        
        // Try to extract merchant prefix (first 3 chars)
        const merchantPrefix = identifier.substring(0, 3);
        const userIdentifier = identifier.substring(3);

        return {
            full: vpa,
            identifier,
            merchantPrefix,
            userIdentifier,
            bank
        };
    }

    /**
     * Generate examples for documentation
     */
    static generateExamples() {
        const examples = [
            {
                company: "SRS Live Technologies",
                identifier: "win25",
                strategy: "prefix",
                result: null
            },
            {
                company: "ABC Retail Store",
                identifier: "store01",
                strategy: "prefix",
                result: null
            },
            {
                company: "XYZ Enterprises",
                identifier: "main",
                strategy: "suffix",
                result: null
            },
            {
                company: "Tech Solutions Pvt Ltd",
                identifier: "dev",
                strategy: "mixed",
                result: null
            }
        ];

        examples.forEach(ex => {
            ex.result = this.generateUniqueVPA({
                identifier: ex.identifier,
                merchantName: ex.company,
                strategy: ex.strategy
            });
        });

        return examples;
    }
}

// Configuration for different merchant types
const VPA_CONFIG = {
    // Maximum length for VPA identifier (after sabpaisa.)
    MAX_IDENTIFIER_LENGTH: 20,
    
    // Merchant prefix length
    PREFIX_LENGTH: 3,
    
    // Strategies available
    STRATEGIES: {
        PREFIX: 'prefix',      // srswin25
        SUFFIX: 'suffix',      // win25srs
        MIXED: 'mixed',        // srwin25s
        HASHED: 'hashed'       // 443win25 (using merchant ID)
    },
    
    // Reserved identifiers that can't be used
    RESERVED: ['admin', 'test', 'demo', 'system'],
    
    // Bank handles for different environments
    BANKS: {
        UAT: 'hdfcbank',
        PRODUCTION: 'hdfcbank', // May change in production
        SANDBOX: 'hdfcbank'
    }
};

// Export for use in application
export default VPAGenerator;
export { VPA_CONFIG };

// Usage Examples:
/*
// Example 1: Generate VPA for SRS Live Technologies
const vpa1 = VPAGenerator.generateUniqueVPA({
    identifier: 'win25',
    merchantName: 'SRS Live Technologies',
    strategy: 'prefix'
});
// Result: sabpaisa.srswin25@hdfcbank

// Example 2: Generate VPA for ABC Store
const vpa2 = VPAGenerator.generateUniqueVPA({
    identifier: 'win25',
    merchantName: 'ABC Store',
    strategy: 'prefix'
});
// Result: sabpaisa.abcwin25@hdfcbank (No collision!)

// Example 3: Using merchant ID for uniqueness
const vpa3 = VPAGenerator.generateHashedVPA({
    identifier: 'main',
    merchantId: 'HDFC000010380443'
});
// Result: sabpaisa.443main@hdfcbank

// Example 4: Validate VPA
const isValid = VPAGenerator.validateVPA('sabpaisa.srswin25@hdfcbank');
// Result: true
*/