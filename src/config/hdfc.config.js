/**
 * HDFC Bank Configuration for Static QR Integration
 */

const HDFC_CONFIG = {
    // HDFC Merchant Configuration
    MERCHANT_ID: process.env.REACT_APP_HDFC_MERCHANT_ID || 'HDFC000010380443',
    MERCHANT_NAME: process.env.REACT_APP_HDFC_MERCHANT_NAME || 'SabPaisa',
    
    // API Configuration
    API_BASE_URL: process.env.REACT_APP_HDFC_API_URL || 'https://api.hdfcbank.com',
    API_VERSION: 'v1',
    
    // VPA Configuration
    VPA_SUFFIX: '@hdfcbank',
    VPA_PREFIX: 'sabpaisa',
    
    // QR Code Configuration
    QR_SIZE: 400,
    QR_MARGIN: 2,
    QR_ERROR_CORRECTION: 'M', // L, M, Q, H
    
    // Transaction Configuration
    DEFAULT_CURRENCY: 'INR',
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 100000,
    
    // Webhook Configuration
    WEBHOOK_URL: process.env.REACT_APP_HDFC_WEBHOOK_URL || '/api/hdfc/webhook',
    WEBHOOK_SECRET: process.env.REACT_APP_HDFC_WEBHOOK_SECRET || 'hdfc_webhook_secret',
    
    // Timeout Configuration (in milliseconds)
    API_TIMEOUT: 30000,
    TRANSACTION_TIMEOUT: 180000, // 3 minutes
    
    // MCC (Merchant Category Code)
    MCC: process.env.REACT_APP_QR_MCC || '6012',
    
    // Status Codes
    STATUS: {
        SUCCESS: 'SUCCESS',
        PENDING: 'PENDING',
        FAILED: 'FAILED',
        EXPIRED: 'EXPIRED',
        CANCELLED: 'CANCELLED'
    },
    
    // Error Messages
    ERRORS: {
        INVALID_VPA: 'Invalid VPA format',
        INVALID_AMOUNT: 'Amount must be between 1 and 100000',
        API_ERROR: 'HDFC API error occurred',
        TIMEOUT: 'Request timed out',
        INVALID_MERCHANT: 'Invalid merchant configuration'
    },
    
    // Response Codes
    RESPONSE_CODES: {
        '00': 'Success',
        '01': 'Invalid Request',
        '02': 'Invalid Merchant',
        '03': 'Invalid Amount',
        '04': 'Duplicate Transaction',
        '05': 'System Error',
        '06': 'Timeout',
        '99': 'Unknown Error'
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(HDFC_CONFIG);
Object.freeze(HDFC_CONFIG.STATUS);
Object.freeze(HDFC_CONFIG.ERRORS);
Object.freeze(HDFC_CONFIG.RESPONSE_CODES);

export default HDFC_CONFIG;