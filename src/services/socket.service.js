import io from 'socket.io-client';
import store from '../store';
import { addTransaction } from '../slices/sabqr/sabqrSlice';
import toastConfig from '../utilities/toastTypes';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect() {
        // Get webhook server URL from environment or use default
        const SOCKET_URL = process.env.REACT_APP_WEBHOOK_URL || 'http://localhost:3001';
        
        console.log('Connecting to Socket.io server:', SOCKET_URL);
        
        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Connection events
        this.socket.on('connect', () => {
            this.connected = true;
            console.log('✅ Connected to webhook server');
            
            // Join client-specific room
            const state = store.getState();
            const clientId = state.auth?.user?.clientId;
            if (clientId) {
                this.socket.emit('join', { clientId });
                console.log('Joined room for client:', clientId);
            }
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log('❌ Disconnected from webhook server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        // Listen for payment events
        this.setupPaymentListeners();
    }

    setupPaymentListeners() {
        // New payment received
        this.socket.on('payment:new', (data) => {
            console.log('New payment received:', data);
            
            // Create transaction object
            const transaction = {
                transactionId: data.transactionId || `TXN${Date.now()}`,
                qrId: data.qrId,
                merchantName: data.merchantName || 'Merchant',
                customerName: data.payerName || 'Customer',
                customerUPI: data.payerVPA || '',
                amount: data.amount,
                status: data.status === 'SUCCESS' ? 'success' : 
                       data.status === 'PENDING' ? 'pending' : 'failed',
                date: new Date(data.transactionDateTime).toISOString().split('T')[0],
                time: new Date(data.transactionDateTime).toTimeString().split(' ')[0],
                referenceNumber: data.bankRRN,
                bankRRN: data.bankRRN,
                paymentMode: data.paymentMode || 'UPI',
                settlementAmount: data.settlementAmount,
                transactionRef: data.merchantTxnId,
                statusDescription: data.statusDescription
            };

            // Dispatch to Redux store
            store.dispatch(addTransaction(transaction));
            
            // Show notification
            if (transaction.status === 'success') {
                toastConfig.successToast(
                    `Payment received: ₹${transaction.amount.toLocaleString()} from ${transaction.customerName}`
                );
                
                // Play sound if available
                this.playNotificationSound();
            } else if (transaction.status === 'failed') {
                toastConfig.errorToast(
                    `Payment failed: ${data.statusDescription || 'Transaction failed'}`
                );
            }
        });

        // Payment status update
        this.socket.on('payment:update', (data) => {
            console.log('Payment status updated:', data);
            
            // Update existing transaction in store
            // You can implement updateTransaction action in Redux if needed
            toastConfig.infoToast(
                `Payment ${data.transactionId} status: ${data.status}`
            );
        });

        // Refund processed
        this.socket.on('refund:processed', (data) => {
            console.log('Refund processed:', data);
            
            toastConfig.infoToast(
                `Refund processed: ₹${data.amount.toLocaleString()} for transaction ${data.originalTransactionId}`
            );
        });

        // Webhook error
        this.socket.on('webhook:error', (data) => {
            console.error('Webhook error:', data);
            
            if (process.env.NODE_ENV === 'development') {
                toastConfig.errorToast(`Webhook error: ${data.message}`);
            }
        });
    }

    playNotificationSound() {
        try {
            // Create audio element and play sound
            const audio = new Audio('/sounds/payment-success.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {
                // Silently fail if audio cannot be played
                console.log('Could not play notification sound');
            });
        } catch (error) {
            console.log('Audio playback not supported');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            console.log('Socket disconnected');
        }
    }

    emit(event, data) {
        if (this.socket && this.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected. Cannot emit event:', event);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    isConnected() {
        return this.connected;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;