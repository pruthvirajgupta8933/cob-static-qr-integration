import axios from 'axios';

class LocalTransactionService {
    constructor() {
        this.baseURL = process.env.REACT_APP_WEBHOOK_URL || 'http://localhost:3001';
    }

    // Fetch transactions from backend local storage
    async getTransactions() {
        try {
            const response = await axios.get(`${this.baseURL}/api/hdfc/transactions`);
            if (response.data.success) {
                return response.data.transactions;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch transactions from backend:', error);
            return [];
        }
    }

    // Get transaction stats
    async getStats() {
        try {
            const response = await axios.get(`${this.baseURL}/api/hdfc/transactions`);
            if (response.data.success) {
                return response.data.stats;
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            return null;
        }
    }

    // Poll for new transactions
    startPolling(callback, interval = 5000) {
        // Initial fetch
        this.getTransactions().then(callback);
        
        // Set up polling
        const pollInterval = setInterval(async () => {
            const transactions = await this.getTransactions();
            callback(transactions);
        }, interval);
        
        return pollInterval;
    }

    // Stop polling
    stopPolling(intervalId) {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }
}

export default new LocalTransactionService();