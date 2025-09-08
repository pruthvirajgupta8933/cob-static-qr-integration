import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processQRRefund } from '../../../../../slices/sabqr/sabqrSlice';
import CustomModal from '../../../../../_components/custom_modal';
import staticQrClasses from '../staticqr.module.css';

const RefundModal = ({ 
    show, 
    onClose, 
    transaction 
}) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.sabqr);
    
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [partialRefund, setPartialRefund] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (transaction) {
            setRefundAmount(transaction.amount?.toString() || '');
            setPartialRefund(false);
            setRefundReason('');
            setErrors({});
        }
    }, [transaction]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!refundAmount || parseFloat(refundAmount) <= 0) {
            newErrors.amount = 'Please enter a valid refund amount';
        } else if (parseFloat(refundAmount) > parseFloat(transaction?.amount || 0)) {
            newErrors.amount = 'Refund amount cannot exceed original transaction amount';
        }
        
        if (!refundReason.trim()) {
            newErrors.reason = 'Please provide a reason for the refund';
        } else if (refundReason.trim().length < 10) {
            newErrors.reason = 'Reason must be at least 10 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        try {
            await dispatch(processQRRefund({
                transactionId: transaction.transactionId,
                amount: parseFloat(refundAmount),
                reason: refundReason.trim()
            })).unwrap();
            
            onClose();
            // Reset form
            setRefundAmount('');
            setRefundReason('');
            setPartialRefund(false);
            setErrors({});
        } catch (error) {
            console.error('Refund failed:', error);
        }
    };

    const handlePartialRefundToggle = (checked) => {
        setPartialRefund(checked);
        if (!checked) {
            setRefundAmount(transaction?.amount?.toString() || '');
        }
    };

    if (!transaction) return null;

    const modalBody = () => (
        <>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="font-weight-bold">Transaction ID</label>
                    <p className="text-muted">{transaction.transactionId}</p>
                </div>
                <div className="col-md-6">
                    <label className="font-weight-bold">Original Amount</label>
                    <p className="text-success font-weight-bold">₹{transaction.amount}</p>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="font-weight-bold">Customer</label>
                    <p className="text-muted">{transaction.customerName || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                    <label className="font-weight-bold">Payment Date</label>
                    <p className="text-muted">{transaction.date} {transaction.time}</p>
                </div>
            </div>

            <hr />

            <div className="form-group">
                <div className="custom-control custom-switch mb-3">
                    <input 
                        type="checkbox" 
                        className="custom-control-input" 
                        id="partialRefundSwitch"
                        checked={partialRefund}
                        onChange={(e) => handlePartialRefundToggle(e.target.checked)}
                    />
                    <label className="custom-control-label" htmlFor="partialRefundSwitch">
                        Partial Refund
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label className="required">Refund Amount</label>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">₹</span>
                    </div>
                    <input 
                        type="number" 
                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        disabled={!partialRefund}
                        max={transaction.amount}
                        min={0}
                        step="0.01"
                    />
                </div>
                {errors.amount && (
                    <div className="invalid-feedback d-block">
                        {errors.amount}
                    </div>
                )}
                {partialRefund && (
                    <small className="form-text text-muted">
                        Maximum refundable amount: ₹{transaction.amount}
                    </small>
                )}
            </div>

            <div className="form-group">
                <label className="required">Refund Reason</label>
                <textarea 
                    className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                    rows={3}
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Please provide a detailed reason for the refund..."
                    maxLength={500}
                />
                {errors.reason && (
                    <div className="invalid-feedback">
                        {errors.reason}
                    </div>
                )}
                <small className="form-text text-muted">
                    {refundReason.length}/500 characters
                </small>
            </div>

            <div className="alert alert-warning">
                <i className="fa fa-info-circle mr-2"></i>
                <strong>Important:</strong>
                <ul className="mb-0 mt-2">
                    <li>Refunds typically take 5-7 business days to process</li>
                    <li>The amount will be credited to the customer's original payment method</li>
                    <li>Once initiated, refunds cannot be cancelled</li>
                </ul>
            </div>
        </>
    );

    const modalFooter = () => (
        <>
            <button 
                type="button"
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading.refund}
            >
                Cancel
            </button>
            <button 
                type="button"
                className="btn btn-danger" 
                onClick={handleSubmit}
                disabled={loading.refund}
            >
                {loading.refund ? (
                    <>
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <i className="fa fa-check mr-2"></i>
                        Process Refund
                    </>
                )}
            </button>
        </>
    );

    return (
        <CustomModal
            headerTitle={
                <>
                    <i className="fa fa-undo mr-2"></i>
                    Process Refund
                </>
            }
            modalBody={modalBody}
            modalFooter={modalFooter}
            modalToggle={show}
            fnSetModalToggle={onClose}
            modalSize="modal-lg"
        />
    );
};

export default RefundModal;