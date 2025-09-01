# QR Payment Refund Handling Documentation

## 📊 Current Refund Infrastructure

### 1. Database Support for Refunds
The database schema (`/database/qr_schema.sql`) already includes refund support:

```sql
-- In qr_payments table
status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'success', 'failed', 'refunded'
```

The payment status can be set to `'refunded'` to track refunded transactions.

### 2. Refund API Services Available

#### HDFC API Service (`/src/services/hdfc/hdfcApi.service.js`)
```javascript
// Process Refund method available
async processRefund(params) {
    const payload = {
        merchantId: this.merchantId,
        originalTransactionRef: params.originalTransactionRef,
        refundAmount: params.refundAmount,
        refundReason: params.refundReason,
        // ... additional parameters
    };
    // Makes API call to HDFC for refund processing
}

// Alias method for consistency
async refundTransaction(params) {
    return this.processRefund(params);
}
```

#### SabQR Service (`/src/services/sabqr/sabqr.service.js`)
```javascript
// Wrapper for HDFC refund processing
async processRefund(transactionRef, amount, reason) {
    return hdfcApiService.processRefund({
        originalTransactionRef: transactionRef,
        refundAmount: amount,
        refundReason: reason
    });
}
```

### 3. Existing Refund Transaction History
The system already has a dedicated refund transaction history component:
- **Location:** `/src/components/dashboard/AllPages/RefundTransactionHistory.js`
- **Route:** `/dashboard/refund-transaction-history`
- **Purpose:** View all refund transactions

## 🚫 What's Missing

### 1. No Refund UI in QR Payments Component
The current `QRPayments.js` component does NOT have:
- Refund button/action for transactions
- Refund modal or form
- Refund status tracking in the UI

### 2. No Redux Actions for Refunds
The `sabqrSlice.js` doesn't have:
- `initiateRefund` async thunk
- `fetchRefundStatus` action
- Refund state management

## 🔧 Implementation Guide for Refunds

### Step 1: Add Refund Actions to Redux Slice

Add to `/src/slices/sabqr/sabqrSlice.js`:

```javascript
// Async thunk for processing refund
export const processQRRefund = createAsyncThunk(
    'sabqr/processRefund',
    async ({ transactionId, amount, reason }, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.processRefund(
                transactionId, 
                amount, 
                reason
            );
            toastConfig.successToast('Refund initiated successfully!');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to process refund';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Add to extraReducers
.addCase(processQRRefund.pending, (state) => {
    state.loading.refund = true;
    state.error.refund = null;
})
.addCase(processQRRefund.fulfilled, (state, action) => {
    state.loading.refund = false;
    // Update payment status in the list
    const paymentIndex = state.payments.findIndex(
        p => p.transaction_id === action.meta.arg.transactionId
    );
    if (paymentIndex !== -1) {
        state.payments[paymentIndex].status = 'refunded';
        state.payments[paymentIndex].refund_data = action.payload;
    }
})
.addCase(processQRRefund.rejected, (state, action) => {
    state.loading.refund = false;
    state.error.refund = action.payload;
});
```

### Step 2: Add Refund UI to QRPayments Component

Add refund functionality to transactions table:

```javascript
// Add refund modal state
const [showRefundModal, setShowRefundModal] = useState(false);
const [selectedTransaction, setSelectedTransaction] = useState(null);
const [refundReason, setRefundReason] = useState('');
const [refundAmount, setRefundAmount] = useState('');

// Handle refund initiation
const handleRefundClick = (transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(transaction.amount);
    setShowRefundModal(true);
};

// Process refund
const handleRefundSubmit = async () => {
    if (!refundReason.trim()) {
        toastConfig.errorToast('Please provide a refund reason');
        return;
    }
    
    try {
        await dispatch(processQRRefund({
            transactionId: selectedTransaction.transactionId,
            amount: refundAmount,
            reason: refundReason
        })).unwrap();
        
        setShowRefundModal(false);
        loadTransactions(); // Refresh transactions
    } catch (error) {
        console.error('Refund failed:', error);
    }
};

// Add to transaction actions
{transaction.status === 'success' && (
    <button 
        className="btn btn-warning btn-sm"
        onClick={() => handleRefundClick(transaction)}
    >
        <i className="fa fa-undo"></i> Refund
    </button>
)}
```

### Step 3: Add Refund Modal Component

Create `/src/components/dashboard/AllPages/static-qr/components/RefundModal.js`:

```javascript
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const RefundModal = ({ 
    show, 
    onClose, 
    transaction, 
    refundAmount, 
    setRefundAmount,
    refundReason, 
    setRefundReason, 
    onSubmit,
    loading 
}) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Process Refund</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Transaction ID</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={transaction?.transactionId} 
                            disabled 
                        />
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label>Original Amount</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={`₹${transaction?.amount}`} 
                            disabled 
                        />
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label>Refund Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            max={transaction?.amount}
                            min={0}
                        />
                        <Form.Text className="text-muted">
                            Partial refunds are allowed
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label>Refund Reason *</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Enter reason for refund"
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button 
                    variant="danger" 
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Process Refund'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RefundModal;
```

## 🔄 Refund Workflow

### 1. Customer Refund Request Flow
```
Customer Payment → Success → Refund Request → Merchant Approval → Process Refund
```

### 2. Technical Flow
```
1. User clicks "Refund" on successful transaction
2. Modal opens with transaction details
3. User enters refund amount (full/partial) and reason
4. System calls HDFC processRefund API
5. HDFC processes refund with original bank
6. Webhook receives refund status update
7. Database updates payment status to 'refunded'
8. UI reflects refunded status
```

### 3. Refund Status Tracking
- **Refund Initiated:** Request sent to HDFC
- **Refund Processing:** HDFC processing with bank
- **Refund Success:** Money credited back to customer
- **Refund Failed:** Refund could not be processed

## 📋 Database Schema for Refund Tracking

Consider adding a dedicated refunds table:

```sql
CREATE TABLE IF NOT EXISTS qr_refunds (
    id SERIAL PRIMARY KEY,
    payment_id BIGINT UNSIGNED NOT NULL,
    refund_transaction_id VARCHAR(100) UNIQUE NOT NULL,
    original_transaction_id VARCHAR(100) NOT NULL,
    refund_amount DECIMAL(10,2) NOT NULL,
    refund_reason TEXT NOT NULL,
    refund_status VARCHAR(20) DEFAULT 'initiated',
    initiated_by VARCHAR(100),
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    bank_reference VARCHAR(100),
    response_data JSON,
    
    FOREIGN KEY (payment_id) REFERENCES qr_payments(id),
    INDEX idx_refund_status (refund_status),
    INDEX idx_original_transaction (original_transaction_id)
);
```

## 🔐 Security Considerations

1. **Authorization:** Only allow refunds for authorized users (merchant admin, finance team)
2. **Validation:** Validate refund amount doesn't exceed original payment
3. **Time Limits:** Implement refund time limits (e.g., within 180 days)
4. **Audit Trail:** Log all refund attempts and actions
5. **Dual Approval:** For large amounts, require two-factor approval
6. **Rate Limiting:** Prevent bulk refund attacks

## ⚠️ Important Notes

1. **Partial Refunds:** HDFC API supports partial refunds
2. **Refund Timeline:** Refunds typically take 5-7 business days
3. **Failed Refunds:** Handle cases where refunds fail
4. **Duplicate Prevention:** Prevent duplicate refund requests
5. **Reconciliation:** Daily reconciliation of refunds with bank statements

## 📊 Refund Analytics to Track

- Total refunds processed (count & amount)
- Refund rate (refunds/total transactions)
- Average refund processing time
- Refund reasons analysis
- Merchant-wise refund patterns

## 🚀 Next Steps

1. Implement refund UI in QRPayments component
2. Add Redux actions for refund management
3. Create refund modal component
4. Add refund permissions/roles
5. Implement refund webhook handlers
6. Add refund analytics dashboard
7. Test with HDFC sandbox environment

The infrastructure for refunds is partially in place (API services, database status), but the UI and state management need to be implemented.