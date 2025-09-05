/**
 * Merchant API Client Example
 * Complete Node.js implementation for merchant dashboard integration
 */

const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

class SabPaisaQRClient {
    constructor(apiKey, apiSecret, environment = 'production') {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        
        const baseUrls = {
            production: 'https://api.sabpaisa.in/api/v1/merchant',
            staging: 'https://staging-api.sabpaisa.in/api/v1/merchant',
            development: 'http://localhost:3001/api/v1/merchant'
        };
        
        this.client = axios.create({
            baseURL: baseUrls[environment] || baseUrls.production,
            headers: {
                'X-API-Key': this.apiKey,
                'X-API-Secret': this.apiSecret,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            response => response,
            error => {
                if (error.response) {
                    const { status, data } = error.response;
                    
                    if (status === 429) {
                        console.error('Rate limit exceeded. Retry after:', data.retry_after);
                    } else if (status === 401) {
                        console.error('Authentication failed:', data.error);
                    } else {
                        console.error(`API Error (${status}):`, data.error);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
    
    /**
     * Generate a single QR code
     */
    async generateQR(params) {
        try {
            const response = await this.client.post('/qr/generate', params);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * Generate bulk QR codes
     */
    async generateBulkQR(merchants) {
        try {
            const response = await this.client.post('/qr/bulk', { merchants });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * List QR codes with pagination
     */
    async listQRCodes(params = {}) {
        try {
            const response = await this.client.get('/qr/list', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * Get QR code details
     */
    async getQRCode(qrId) {
        try {
            const response = await this.client.get(`/qr/${qrId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * List transactions
     */
    async listTransactions(params = {}) {
        try {
            const response = await this.client.get('/transactions', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * Get analytics
     */
    async getAnalytics(period = '7d') {
        try {
            const response = await this.client.get('/analytics', { 
                params: { period } 
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * Deactivate a QR code
     */
    async deactivateQR(qrId) {
        try {
            const response = await this.client.put(`/qr/${qrId}/deactivate`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * Register webhook
     */
    async registerWebhook(url, events = ['transaction.success', 'transaction.failed']) {
        try {
            const response = await this.client.post('/webhook/register', {
                url,
                events
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload, signature, secret) {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }
    
    /**
     * Save QR code image to file
     */
    saveQRImage(base64Data, filename) {
        const base64Image = base64Data.split(';base64,').pop();
        fs.writeFileSync(filename, base64Image, { encoding: 'base64' });
        console.log(`QR code saved to ${filename}`);
    }
    
    /**
     * Handle errors
     */
    handleError(error) {
        if (error.response) {
            return new Error(error.response.data.error || 'API request failed');
        }
        return error;
    }
}

// Example usage
async function main() {
    // Initialize client
    const client = new SabPaisaQRClient(
        'mk_live_MERCH001',
        'sk_live_your_secret_key',
        'development'
    );
    
    try {
        // 1. Generate a single QR code
        console.log('1. Generating single QR code...');
        const qrResponse = await client.generateQR({
            merchant_name: 'ABC Electronics Store',
            merchant_id: 'MERCH001',
            reference_name: 'ABC Electronics - Main Branch',
            amount: 1500.00,
            description: 'Payment for electronics',
            mobile_number: '9876543210',
            email: 'abc@electronics.com'
        });
        
        console.log('QR Generated:', qrResponse.data.qr_id);
        
        // Save QR image
        client.saveQRImage(
            qrResponse.data.qr_image, 
            `qr_${qrResponse.data.qr_id}.png`
        );
        
        // 2. Generate bulk QR codes
        console.log('\n2. Generating bulk QR codes...');
        const bulkResponse = await client.generateBulkQR([
            {
                merchant_name: 'Store 1',
                merchant_id: 'STORE001',
                reference_name: 'Store 1 - Downtown',
                amount: 500.00
            },
            {
                merchant_name: 'Store 2',
                merchant_id: 'STORE002',
                reference_name: 'Store 2 - Mall',
                amount: 750.00
            }
        ]);
        
        console.log(`Bulk generation: ${bulkResponse.successful}/${bulkResponse.total} successful`);
        
        // 3. List QR codes
        console.log('\n3. Listing QR codes...');
        const listResponse = await client.listQRCodes({
            page: 1,
            limit: 10,
            status: 'active'
        });
        
        console.log(`Found ${listResponse.data.pagination.total} QR codes`);
        listResponse.data.qr_codes.forEach(qr => {
            console.log(`  - ${qr.qr_id}: ${qr.merchant_name} (${qr.status})`);
        });
        
        // 4. Get analytics
        console.log('\n4. Getting analytics...');
        const analytics = await client.getAnalytics('7d');
        
        console.log('Analytics (Last 7 days):');
        console.log(`  QR Codes: ${analytics.data.qr_codes.total} total, ${analytics.data.qr_codes.active} active`);
        console.log(`  Transactions: ${analytics.data.transactions.total} total`);
        console.log(`  Total Amount: ₹${analytics.data.transactions.total_amount}`);
        console.log(`  Success Rate: ${(analytics.data.transactions.successful / analytics.data.transactions.total * 100).toFixed(1)}%`);
        
        // 5. List transactions
        console.log('\n5. Listing recent transactions...');
        const transactions = await client.listTransactions({
            page: 1,
            limit: 5
        });
        
        console.log(`Found ${transactions.data.pagination.total} transactions`);
        transactions.data.transactions.forEach(tx => {
            console.log(`  - ${tx.transaction_id}: ₹${tx.amount} (${tx.status})`);
        });
        
        // 6. Register webhook
        console.log('\n6. Registering webhook...');
        const webhook = await client.registerWebhook(
            'https://your-domain.com/webhook/payments',
            ['transaction.success', 'transaction.failed']
        );
        
        console.log('Webhook registered:', webhook.data.webhook_id);
        console.log('Webhook secret:', webhook.data.secret);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    main();
}

// Export for use in other modules
module.exports = SabPaisaQRClient;