// HDFC UPI API Configuration
const HDFC_CONFIG = {
    // Environment Detection
    environment: process.env.REACT_APP_ENV || 'development',
    
    // UAT Environment Credentials
    merchantId: process.env.REACT_APP_HDFC_MERCHANT_ID || 'HDFC000010380443',
    merchantKey: process.env.REACT_APP_HDFC_MERCHANT_KEY || 'ef880fed3abe10d54102a24e05e41ca2',
    
    // Dynamic VPA configuration as per HDFC UAT requirements
    // HDFC requires dynamic VPA: sabpaisa.{identifier}@hdfcbank
    // Note: UAT won't work with live UPI apps (GPay, PhonePe)
    vpa: process.env.REACT_APP_HDFC_VPA || 'sabpaisa.MERCHANT001@hdfcbank',
    
    // UAT specific configuration from HDFC email
    uatMode: true, // Set to false for production
    uatMCC: '6012', // Use 6012 for UAT, actual MCC for production
    
    merchantName: process.env.REACT_APP_HDFC_MERCHANT_NAME || 'SRS Live Technologies Private Limited',
    
    // API Configuration
    apiUrl: process.env.REACT_APP_HDFC_API_URL || 'https://upitestv2.hdfcbank.com/upi',
    
    // QR Configuration
    mcc: process.env.REACT_APP_QR_MCC || '5499',
    qrMedium: process.env.REACT_APP_QR_MEDIUM || '06',
    
    // Feature Flags
    enableRealTimeUpdates: process.env.REACT_APP_ENABLE_REAL_TIME_UPDATES === 'true',
    useActualAPI: process.env.REACT_APP_USE_ACTUAL_API === 'true', // Set to false for demo mode
    
    // Webhook Configuration
    webhookUrl: process.env.REACT_APP_WEBHOOK_URL || 'https://api.sabpaisa.in/hdfc/webhook',
    
    // Get formatted VPA with dynamic identifier
    getFormattedVPA: function(identifier) {
        // HDFC format: baseVPA.identifier@okhdfcbank
        if (identifier) {
            const baseVPA = this.vpa.split('.')[0]; // Get 'sabpaisa' part
            return `${baseVPA}.${identifier}@okhdfcbank`;
        }
        return this.vpa;
    },
    
    // Generate transaction reference
    generateTransactionRef: function(type = 'STQ') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `${type}${random}${timestamp}`;
    },
    
    // Check if configuration is valid
    isConfigured: function() {
        return !!(this.merchantId && this.merchantKey && this.vpa);
    },
    
    // Check if using test VPA
    isTestMode: function() {
        return this.vpa.includes('@paytm') || 
               this.vpa.includes('@ybl') || 
               this.vpa.includes('@gpay') ||
               this.environment !== 'production';
    },
    
    // Get VPA status message
    getVPAStatus: function() {
        if (this.isTestMode()) {
            return {
                status: 'test',
                message: 'Using test VPA for development. QR codes will work with UPI apps.',
                vpa: this.vpa
            };
        }
        return {
            status: 'production',
            message: 'Using HDFC production VPA. Requires HDFC activation to work with UPI apps.',
            vpa: this.vpa,
            warning: 'If QR scanning fails, HDFC merchant onboarding may not be complete.'
        };
    }
};

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
    console.log('HDFC Configuration Status:', {
        configured: HDFC_CONFIG.isConfigured(),
        merchantId: HDFC_CONFIG.merchantId,
        vpa: HDFC_CONFIG.vpa,
        apiUrl: HDFC_CONFIG.apiUrl
    });
}

export default HDFC_CONFIG;