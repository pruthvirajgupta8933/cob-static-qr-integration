import axios from 'axios';
import encryptionService from '../../utilities/encryption';

class HDFCApiService {
    constructor() {
        // Environment-based API URLs
        this.baseURL = process.env.REACT_APP_HDFC_API_URL || 'https://upitestv2.hdfcbank.com/upi';
        this.merchantId = process.env.REACT_APP_HDFC_MERCHANT_ID || 'HDFC000010380443';
        this.merchantKey = process.env.REACT_APP_HDFC_MERCHANT_KEY || '';
        
        // Create axios instance with default config
        this.apiClient = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor for encryption
        this.apiClient.interceptors.request.use(
            (config) => {
                if (config.data) {
                    const encrypted = encryptionService.encryptAES128(
                        JSON.stringify(config.data),
                        this.merchantKey
                    );
                    config.data = { encryptedData: encrypted };
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for decryption
        this.apiClient.interceptors.response.use(
            (response) => {
                if (response.data?.encryptedData) {
                    const decrypted = encryptionService.decryptAES128(
                        response.data.encryptedData,
                        this.merchantKey
                    );
                    response.data = JSON.parse(decrypted);
                }
                return response;
            },
            (error) => Promise.reject(error)
        );
    }

    // Generate Static QR Code
    async generateStaticQR(params) {
        try {
            const { upiString, transactionRef } = encryptionService.generateStaticQRString(params);
            
            // Store transaction reference for tracking
            const qrData = {
                merchantId: this.merchantId,
                transactionRef,
                qrType: 'STATIC',
                identifier: params.identifier,
                merchantName: params.merchantName,
                amount: params.amount || null,
                description: params.description,
                upiString,
                createdAt: new Date().toISOString()
            };

            // Generate QR code image using qrcode library
            const QRCode = await import('qrcode');
            const qrImageData = await QRCode.toDataURL(upiString, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return {
                success: true,
                data: {
                    ...qrData,
                    qrImageData,
                    vpa: encryptionService.vpa
                }
            };
        } catch (error) {
            console.error('Error generating static QR:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate Dynamic QR Code
    async generateDynamicQR(params) {
        try {
            const { upiString, transactionRef } = encryptionService.generateDynamicQRString(params);
            
            // API request payload for dynamic QR
            const payload = {
                merchantId: this.merchantId,
                orderId: params.orderId,
                amount: params.amount,
                transactionRef,
                description: params.description,
                customerMobile: params.customerMobile,
                customerEmail: params.customerEmail,
                expiryTime: params.expiryTime || 3600 // 1 hour default
            };

            // Call HDFC API for dynamic QR generation
            const response = await this.apiClient.post('/generateDynamicQR', payload);

            if (response.data.status === 'SUCCESS') {
                // Generate QR code image
                const QRCode = await import('qrcode');
                const qrImageData = await QRCode.toDataURL(upiString, {
                    width: 400,
                    margin: 2
                });

                return {
                    success: true,
                    data: {
                        ...response.data,
                        qrImageData,
                        upiString,
                        vpa: encryptionService.vpa
                    }
                };
            }

            return {
                success: false,
                error: response.data.message || 'Failed to generate dynamic QR'
            };
        } catch (error) {
            console.error('Error generating dynamic QR:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Transaction Status Enquiry
    async checkTransactionStatus(transactionRef) {
        try {
            const payload = {
                merchantId: this.merchantId,
                transactionRef,
                requestType: 'STATUS_ENQUIRY'
            };

            const response = await this.apiClient.post('/transactionEnquiry', payload);

            return {
                success: response.data.status === 'SUCCESS',
                data: response.data
            };
        } catch (error) {
            console.error('Error checking transaction status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Process Refund
    async processRefund(params) {
        try {
            const payload = {
                merchantId: this.merchantId,
                originalTransactionRef: params.originalTransactionRef,
                refundAmount: params.refundAmount,
                refundReason: params.refundReason,
                refundRef: `REF${Date.now()}`
            };

            const response = await this.apiClient.post('/refund', payload);

            return {
                success: response.data.status === 'SUCCESS',
                data: response.data
            };
        } catch (error) {
            console.error('Error processing refund:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Handle webhook callback from HDFC
    async handleWebhookCallback(encryptedData) {
        try {
            const transactionData = encryptionService.parseCallbackResponse(encryptedData);
            
            // Validate checksum
            const isValid = encryptionService.validateChecksum(
                transactionData,
                transactionData.checksum
            );

            if (!isValid) {
                throw new Error('Invalid checksum in webhook callback');
            }

            // Process based on transaction status
            if (transactionData.transactionStatus === 'SUCCESS') {
                // Update local database/state with successful transaction
                await this.updateTransactionSuccess(transactionData);
            } else {
                // Handle failed transaction
                await this.updateTransactionFailure(transactionData);
            }

            return {
                success: true,
                data: transactionData
            };
        } catch (error) {
            console.error('Error handling webhook callback:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update successful transaction (to be integrated with Redux)
    async updateTransactionSuccess(transactionData) {
        // This will be called from Redux actions
        console.log('Transaction successful:', transactionData);
        
        // Emit event for real-time updates
        window.dispatchEvent(new CustomEvent('payment-success', { 
            detail: transactionData 
        }));
    }

    // Update failed transaction
    async updateTransactionFailure(transactionData) {
        console.log('Transaction failed:', transactionData);
        
        // Emit event for real-time updates
        window.dispatchEvent(new CustomEvent('payment-failed', { 
            detail: transactionData 
        }));
    }

    // Get transaction history
    async getTransactionHistory(params = {}) {
        try {
            const payload = {
                merchantId: this.merchantId,
                fromDate: params.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                toDate: params.toDate || new Date().toISOString(),
                status: params.status || 'ALL',
                limit: params.limit || 100
            };

            const response = await this.apiClient.post('/transactionHistory', payload);

            return {
                success: true,
                data: response.data.transactions || []
            };
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    // Get settlement report
    async getSettlementReport(date) {
        try {
            const payload = {
                merchantId: this.merchantId,
                settlementDate: date,
                reportType: 'DETAILED'
            };

            const response = await this.apiClient.post('/settlementReport', payload);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching settlement report:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Critical method: Create Static QR (alias for consistency)
    async createStaticQR(params) {
        return this.generateStaticQR(params);
    }
    
    // Critical method: Create Dynamic QR (alias for consistency)
    async createDynamicQR(params) {
        return this.generateDynamicQR(params);
    }
    
    // Critical method: Verify Transaction
    async verifyTransaction(transactionRef) {
        try {
            const payload = {
                merchantId: this.merchantId,
                transactionRef,
                requestType: 'VERIFY'
            };
            
            const response = await this.apiClient.post('/verifyTransaction', payload);
            
            return {
                success: response.data.status === 'SUCCESS',
                data: response.data
            };
        } catch (error) {
            console.error('Error verifying transaction:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Validate VPA
    async validateVPA(vpa) {
        try {
            const payload = {
                merchantId: this.merchantId,
                vpa,
                requestType: 'VALIDATE_VPA'
            };
            
            const response = await this.apiClient.post('/validateVPA', payload);
            
            return {
                success: response.data.valid === true,
                data: response.data
            };
        } catch (error) {
            console.error('Error validating VPA:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Refund Transaction (alias for consistency)
    async refundTransaction(params) {
        return this.processRefund(params);
    }
}

export default new HDFCApiService();