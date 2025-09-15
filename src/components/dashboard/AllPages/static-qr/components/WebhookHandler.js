import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../../../slices/sabqr/sabqrSlice';
import encryptionService from '../../../../../utilities/encryption';
import toastConfig from '../../../../../utilities/toastTypes';

const WebhookHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Handle HDFC payment callback
        const handleHDFCCallback = (encryptedData) => {
            try {
                // Parse HDFC callback response
                const callbackData = encryptionService.parseCallbackResponse(encryptedData);
                
                // Create transaction object from callback
                const transaction = {
                    transactionId: callbackData.transactionId || `TXN${Date.now()}`,
                    qrId: callbackData.merchantTxnId?.substring(3, 9) || 'UNKNOWN',
                    merchantName: callbackData.merchantName || 'Merchant',
                    customerName: callbackData.payerName || 'Customer',
                    customerUPI: callbackData.payerVPA || '',
                    amount: callbackData.amount,
                    status: callbackData.transactionStatus === 'SUCCESS' ? 'success' : 
                           callbackData.transactionStatus === 'PENDING' ? 'pending' : 'failed',
                    date: new Date(callbackData.transactionDateTime).toISOString().split('T')[0],
                    time: new Date(callbackData.transactionDateTime).toTimeString().split(' ')[0],
                    referenceNumber: callbackData.bankRRN,
                    bankRRN: callbackData.bankRRN,
                    paymentMode: callbackData.paymentMode || 'UPI',
                    settlementAmount: callbackData.settlementAmount,
                    transactionRef: callbackData.merchantTxnId
                };

                // Dispatch to Redux store
                dispatch(addTransaction(transaction));
                
                // Show notification
                if (transaction.status === 'success') {
                    toastConfig.successToast(`Payment received: ₹${transaction.amount.toLocaleString()}`);
                } else if (transaction.status === 'failed') {
                    toastConfig.errorToast(`Payment failed: ${callbackData.statusDescription}`);
                }
            } catch (error) {
                console.error('Error processing HDFC callback:', error);
                toastConfig.errorToast('Failed to process payment notification');
            }
        };

        // Listen for payment webhook events
        const handleWebhook = (event) => {
            if (event.detail && event.detail.provider === 'HDFC') {
                handleHDFCCallback(event.detail.encryptedData);
            } else if (event.detail && event.detail.transaction) {
                // Handle direct transaction data
                dispatch(addTransaction(event.detail.transaction));
                toastConfig.successToast(`Payment received: ₹${event.detail.transaction.amount}`);
            }
        };

        // Listen for postMessage events (for iframe integrations)
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'QR_PAYMENT_CALLBACK') {
                if (event.data.provider === 'HDFC') {
                    handleHDFCCallback(event.data.encryptedData);
                }
            }
        };

        // Add event listeners
        window.addEventListener('qr-payment-webhook', handleWebhook);
        window.addEventListener('message', handleMessage);

        // Log for development
        if (process.env.NODE_ENV === 'development') {
            console.log('WebhookHandler: Ready to receive payment notifications');
            console.log('To simulate a payment, dispatch:');
            console.log(`window.dispatchEvent(new CustomEvent('qr-payment-webhook', { detail: { transaction: {...} } }))`);
        }

        // Cleanup
        return () => {
            window.removeEventListener('qr-payment-webhook', handleWebhook);
            window.removeEventListener('message', handleMessage);
        };
    }, [dispatch]);

    // Expose global webhook handler for testing
    useEffect(() => {
        window.simulatePayment = (qrId, amount = 100) => {
            const transaction = {
                transactionId: `TXN${Date.now()}`,
                qrId: qrId || 'QR001',
                merchantName: 'Test Merchant',
                customerName: 'Test Customer',
                customerUPI: 'test@paytm',
                amount: amount,
                status: 'success',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0],
                referenceNumber: `UPI${Date.now()}`,
                bankRRN: `${Date.now()}`.slice(-12),
                paymentMode: 'UPI',
                settlementAmount: amount,
                transactionRef: `STQ${qrId}${Date.now()}`
            };
            
            window.dispatchEvent(new CustomEvent('qr-payment-webhook', {
                detail: { transaction }
            }));
            
            return transaction;
        };
        
        return () => {
            delete window.simulatePayment;
        };
    }, []);

    return null; // This is a non-visual component
};

export default WebhookHandler;