// API URLs configuration for Static QR module
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const API_URL = {
    // QR Management endpoints
    QR_CREATE: `${API_BASE_URL}/qr/create`,
    QR_LIST: `${API_BASE_URL}/qr/list`,
    QR_DETAILS: `${API_BASE_URL}/qr/details`,
    QR_UPDATE: `${API_BASE_URL}/qr/update`,
    QR_DELETE: `${API_BASE_URL}/qr/delete`,
    QR_DOWNLOAD: `${API_BASE_URL}/qr/download`,
    
    // Transaction endpoints
    QR_TRANSACTIONS: `${API_BASE_URL}/qr/transactions`,
    QR_TRANSACTION_STATUS: `${API_BASE_URL}/qr/transaction/status`,
    QR_REFUND: `${API_BASE_URL}/qr/refund`,
    
    // Settlement endpoints
    QR_SETTLEMENT: `${API_BASE_URL}/qr/settlement`,
    QR_SETTLEMENT_REPORT: `${API_BASE_URL}/qr/settlement/report`,
    
    // Webhook endpoints
    QR_WEBHOOK: `${API_BASE_URL}/qr/webhook`,
    QR_WEBHOOK_REGISTER: `${API_BASE_URL}/qr/webhook/register`,
    
    // Analytics endpoints
    QR_ANALYTICS: `${API_BASE_URL}/qr/analytics`,
    QR_ANALYTICS_SUMMARY: `${API_BASE_URL}/qr/analytics/summary`,
    
    // Health check
    HEALTH_CHECK: `${API_BASE_URL}/health`
};

export default API_URL;