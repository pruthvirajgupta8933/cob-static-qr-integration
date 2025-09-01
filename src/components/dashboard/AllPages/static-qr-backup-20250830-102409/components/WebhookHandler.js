import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePaymentStatus, addNewPayment } from '../../../../../slices/sabqr/sabqrSlice';
import sabqrService from '../../../../../services/sabqr/sabqr.service';
import { toast } from 'react-toastify';

const WebhookHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Set up webhook endpoint for development
        const webhookInterval = setInterval(async () => {
            try {
                // In production, this would be replaced with actual webhook endpoint
                // For now, we'll poll for new transactions
                const response = await sabqrService.getQRPayments({
                    status: 'PENDING',
                    limit: 10
                });

                if (response.data?.payments?.length > 0) {
                    response.data.payments.forEach(payment => {
                        if (payment.source === 'hdfc' && payment.hdfc_synced) {
                            // Process new payment from HDFC
                            dispatch(addNewPayment(payment));
                            
                            // Show notification
                            if (payment.transactionStatus === 'SUCCESS') {
                                toast.success(
                                    `Payment received: ₹${payment.amount} from ${payment.payerName || payment.payerVPA}`,
                                    { position: 'top-right' }
                                );
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error checking for new payments:', error);
            }
        }, 30000); // Check every 30 seconds

        // Listen for payment events
        const handlePaymentSuccess = (event) => {
            const transactionData = event.detail;
            
            // Update Redux store
            dispatch(updatePaymentStatus({
                transactionId: transactionData.transactionId,
                status: 'SUCCESS',
                data: transactionData
            }));

            // Show success notification
            toast.success(
                `Payment successful! ₹${transactionData.amount} received from ${transactionData.payerName}`,
                {
                    position: 'top-right',
                    autoClose: 5000
                }
            );

            // Play success sound if available
            const audio = new Audio('/sounds/payment-success.mp3');
            audio.play().catch(() => {});
        };

        const handlePaymentFailed = (event) => {
            const transactionData = event.detail;
            
            // Update Redux store
            dispatch(updatePaymentStatus({
                transactionId: transactionData.transactionId,
                status: 'FAILED',
                data: transactionData
            }));

            // Show failure notification
            toast.error(
                `Payment failed: ${transactionData.statusDescription}`,
                {
                    position: 'top-right',
                    autoClose: 5000
                }
            );
        };

        // Add event listeners
        window.addEventListener('payment-success', handlePaymentSuccess);
        window.addEventListener('payment-failed', handlePaymentFailed);

        // Cleanup
        return () => {
            clearInterval(webhookInterval);
            window.removeEventListener('payment-success', handlePaymentSuccess);
            window.removeEventListener('payment-failed', handlePaymentFailed);
        };
    }, [dispatch]);

    // Process webhook callback (to be called from API endpoint)
    const processWebhookCallback = async (encryptedData) => {
        try {
            const result = await sabqrService.handleWebhookCallback(encryptedData);
            
            if (result.success) {
                const transactionData = result.data;
                
                // Update local state
                dispatch(updatePaymentStatus({
                    transactionId: transactionData.transactionId,
                    status: transactionData.transactionStatus,
                    data: transactionData
                }));

                // Return success response
                return {
                    status: 'SUCCESS',
                    message: 'Webhook processed successfully'
                };
            }
            
            return {
                status: 'FAILED',
                message: result.error || 'Failed to process webhook'
            };
        } catch (error) {
            console.error('Error processing webhook:', error);
            return {
                status: 'ERROR',
                message: error.message
            };
        }
    };

    // Expose webhook handler globally for API endpoint
    useEffect(() => {
        window.processHDFCWebhook = processWebhookCallback;
        
        return () => {
            delete window.processHDFCWebhook;
        };
    }, []);

    return null; // This is a non-visual component
};

export default WebhookHandler;