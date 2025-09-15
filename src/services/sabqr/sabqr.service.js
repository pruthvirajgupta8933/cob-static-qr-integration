import { axiosInstanceJWT } from '../../utilities/axiosInstance';
import API_URL from '../../config';
import hdfcApiService from '../hdfc/hdfcApi.service';
import encryptionService from '../../utilities/encryption';

class SabQRService {
    // QR Creation & Management - Now with HDFC Integration
    async createQR(data) {
        try {
            // Generate unique identifier
            const identifier = data.qr_identifier || this.generateUniqueIdentifier();
            
            // Generate QR using HDFC API
            const hdfcResponse = await hdfcApiService.generateStaticQR({
                identifier,
                merchantName: data.reference_name,
                amount: data.max_amount_per_transaction,
                description: data.description,
                mcc: data.mcc || process.env.REACT_APP_QR_MCC
            });

            if (hdfcResponse.success) {
                // Save QR details to backend
                const qrData = {
                    ...data,
                    qr_identifier: identifier,
                    full_vpa: hdfcResponse.data.vpa,
                    qr_image_url: hdfcResponse.data.qrImageData,
                    upi_string: hdfcResponse.data.upiString,
                    transaction_ref: hdfcResponse.data.transactionRef,
                    hdfc_merchant_id: process.env.REACT_APP_HDFC_MERCHANT_ID
                };

                const response = await axiosInstanceJWT.post(API_URL.QR_CREATE, qrData);
                
                // Return combined data
                return {
                    ...response,
                    data: {
                        ...response.data,
                        qr_image_url: hdfcResponse.data.qrImageData
                    }
                };
            }

            throw new Error(hdfcResponse.error || 'Failed to generate QR');
        } catch (error) {
            console.error('Error creating QR:', error);
            throw error;
        }
    }

    async getQRList(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return axiosInstanceJWT.get(`${API_URL.QR_LIST}?${queryString}`);
    }

    async getQRDetails(qrId) {
        const response = await axiosInstanceJWT.get(`${API_URL.QR_DETAILS}/${qrId}`);
        
        // Check transaction status with HDFC
        if (response.data?.transaction_ref) {
            const statusResponse = await hdfcApiService.checkTransactionStatus(
                response.data.transaction_ref
            );
            
            if (statusResponse.success) {
                response.data.payment_status = statusResponse.data;
            }
        }
        
        return response;
    }

    async updateQR(qrId, data) {
        return axiosInstanceJWT.put(`${API_URL.QR_UPDATE}/${qrId}`, data);
    }

    async deleteQR(qrId) {
        return axiosInstanceJWT.delete(`${API_URL.QR_DELETE}/${qrId}`);
    }

    async toggleQRStatus(qrId, status) {
        return axiosInstanceJWT.put(`${API_URL.QR_TOGGLE_STATUS}/${qrId}`, { status });
    }

    async validateQRIdentifier(identifier) {
        return axiosInstanceJWT.post(API_URL.QR_VALIDATE_ID, { identifier });
    }

    // QR Image Generation with HDFC
    async generateQRImage(qrId, config = {}) {
        try {
            // Get QR details
            const qrResponse = await this.getQRDetails(qrId);
            const qrData = qrResponse.data;
            
            // Generate new QR image with HDFC
            const hdfcResponse = await hdfcApiService.generateStaticQR({
                identifier: qrData.qr_identifier,
                merchantName: qrData.reference_name,
                amount: qrData.max_amount_per_transaction,
                description: qrData.description,
                ...config
            });
            
            if (hdfcResponse.success) {
                return {
                    data: hdfcResponse.data.qrImageData
                };
            }
            
            throw new Error('Failed to generate QR image');
        } catch (error) {
            console.error('Error generating QR image:', error);
            throw error;
        }
    }

    async uploadLogo(formData) {
        return axiosInstanceJWT.post(API_URL.QR_UPLOAD_LOGO, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async getDesignTemplates() {
        return axiosInstanceJWT.get(API_URL.QR_DESIGN_TEMPLATES);
    }

    // Bulk Operations
    async bulkCreateQR(file) {
        const formData = new FormData();
        formData.append('file', file);
        return axiosInstanceJWT.post(API_URL.QR_BULK_CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async downloadBulkTemplate() {
        return axiosInstanceJWT.get(API_URL.QR_BULK_TEMPLATE, {
            responseType: 'blob'
        });
    }

    async getBulkJobStatus(jobId) {
        return axiosInstanceJWT.get(`${API_URL.QR_BULK_STATUS}/${jobId}`);
    }

    // Payment Management with HDFC Integration
    async getQRPayments(params = {}) {
        try {
            // Get payments from backend
            const queryString = new URLSearchParams(params).toString();
            const response = await axiosInstanceJWT.get(`${API_URL.QR_PAYMENTS_LIST}?${queryString}`);
            
            // Also fetch latest transactions from HDFC
            const hdfcTransactions = await hdfcApiService.getTransactionHistory(params);
            
            if (hdfcTransactions.success && hdfcTransactions.data.length > 0) {
                // Merge HDFC transactions with local data
                const mergedData = this.mergeTransactionData(
                    response.data.payments || [],
                    hdfcTransactions.data
                );
                
                response.data.payments = mergedData;
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching payments:', error);
            return { data: { payments: [] } };
        }
    }

    async getPaymentsSummary(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return axiosInstanceJWT.get(`${API_URL.QR_PAYMENTS_SUMMARY}?${queryString}`);
    }

    async exportPayments(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return axiosInstanceJWT.get(`${API_URL.QR_PAYMENTS_EXPORT}?${queryString}`, {
            responseType: 'blob'
        });
    }

    // Dashboard & Analytics with Real-time Data
    async getDashboardSummary() {
        try {
            // Get local dashboard data
            const response = await axiosInstanceJWT.get(API_URL.QR_DASHBOARD_SUMMARY);
            
            // Fetch latest HDFC transactions
            const hdfcTransactions = await hdfcApiService.getTransactionHistory({
                limit: 10
            });
            
            if (hdfcTransactions.success) {
                // Update dashboard with real-time data
                response.data.recent_payments = hdfcTransactions.data;
                
                // Calculate today's collections from HDFC data
                const today = new Date().toDateString();
                const todayTransactions = hdfcTransactions.data.filter(
                    t => new Date(t.transactionDateTime).toDateString() === today
                );
                
                response.data.summary.today_collections = todayTransactions.reduce(
                    (sum, t) => sum + (t.amount || 0), 0
                );
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            // Return mock data if API fails
            return {
                data: {
                    summary: {
                        total_qr_codes: 0,
                        active_qr_codes: 0,
                        total_collections: 0,
                        today_collections: 0
                    },
                    recent_payments: []
                }
            };
        }
    }

    // Process refund through HDFC
    async processRefund(transactionRef, amount, reason) {
        return hdfcApiService.processRefund({
            originalTransactionRef: transactionRef,
            refundAmount: amount,
            refundReason: reason
        });
    }

    // Check transaction status
    async checkTransactionStatus(transactionRef) {
        return hdfcApiService.checkTransactionStatus(transactionRef);
    }

    // Handle webhook callback
    async handleWebhookCallback(encryptedData) {
        return hdfcApiService.handleWebhookCallback(encryptedData);
    }

    // Utility functions
    generateUPIString(params) {
        return encryptionService.generateStaticQRString(params).upiString;
    }

    generateUniqueIdentifier(length = 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    formatVPA(identifier) {
        // Using actual HDFC VPA format from credentials
        return `${process.env.REACT_APP_HDFC_VPA || 'sabpaisa@hdfcbank'}`;
    }

    // Helper function to merge transaction data
    mergeTransactionData(localData, hdfcData) {
        const mergedMap = new Map();
        
        // Add local data first
        localData.forEach(transaction => {
            mergedMap.set(transaction.transaction_id, transaction);
        });
        
        // Update with HDFC data
        hdfcData.forEach(hdfcTransaction => {
            const existing = mergedMap.get(hdfcTransaction.transactionId);
            if (existing) {
                // Update existing transaction
                mergedMap.set(hdfcTransaction.transactionId, {
                    ...existing,
                    ...hdfcTransaction,
                    hdfc_synced: true
                });
            } else {
                // Add new transaction from HDFC
                mergedMap.set(hdfcTransaction.transactionId, {
                    ...hdfcTransaction,
                    hdfc_synced: true,
                    source: 'hdfc'
                });
            }
        });
        
        return Array.from(mergedMap.values());
    }
}

export default new SabQRService();