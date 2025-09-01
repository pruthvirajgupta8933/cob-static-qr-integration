// Webhook Configuration for HDFC Integration
// Update this when using tunneling services

const WEBHOOK_CONFIG = {
    // LocalTunnel URL (when running)
    PUBLIC_WEBHOOK_URL: 'https://sabpaisa-webhook.loca.lt/api/hdfc/webhook',
    
    // Local development URL
    LOCAL_WEBHOOK_URL: 'http://localhost:3001/api/hdfc/webhook',
    
    // Production URL (for future)
    PRODUCTION_WEBHOOK_URL: 'https://api.sabpaisa.in/api/hdfc/webhook',
    
    // Get current webhook URL based on environment
    getCurrentWebhookUrl: () => {
        if (process.env.REACT_APP_USE_TUNNEL === 'true') {
            return WEBHOOK_CONFIG.PUBLIC_WEBHOOK_URL;
        }
        if (process.env.NODE_ENV === 'production') {
            return WEBHOOK_CONFIG.PRODUCTION_WEBHOOK_URL;
        }
        return WEBHOOK_CONFIG.LOCAL_WEBHOOK_URL;
    }
};

export default WEBHOOK_CONFIG;