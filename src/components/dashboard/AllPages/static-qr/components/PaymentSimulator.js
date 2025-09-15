import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../../../../slices/sabqr/sabqrSlice';
import toastConfig from '../../../../../utilities/toastTypes';
import staticQrClasses from '../staticqr.module.css';

const PaymentSimulator = () => {
    const dispatch = useDispatch();
    const { qrCodes } = useSelector((state) => state.sabqr);
    const [paymentForm, setPaymentForm] = useState({
        qrId: '',
        customerName: '',
        customerUPI: '',
        amount: '',
        status: 'success'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!paymentForm.qrId || !paymentForm.amount) {
            toastConfig.errorToast('Please fill all required fields');
            return;
        }

        const selectedQR = qrCodes.find(qr => qr.qrId === paymentForm.qrId);
        if (!selectedQR) {
            toastConfig.errorToast('Invalid QR Code selected');
            return;
        }

        // Create transaction object
        const transaction = {
            transactionId: `TXN${Date.now()}`,
            qrId: paymentForm.qrId,
            merchantName: selectedQR.merchantName || 'Merchant',
            customerName: paymentForm.customerName || 'Anonymous',
            customerUPI: paymentForm.customerUPI || 'customer@upi',
            amount: parseFloat(paymentForm.amount),
            status: paymentForm.status,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            referenceNumber: `UPI${Date.now()}`,
            bankRRN: `${Date.now()}`.slice(-12),
            paymentMode: 'UPI',
            settlementAmount: parseFloat(paymentForm.amount),
            transactionRef: selectedQR.transactionRef || `STQ${Date.now()}`
        };

        // Dispatch to Redux
        dispatch(addTransaction(transaction));
        
        // Show success message
        toastConfig.successToast(`Payment ${paymentForm.status === 'success' ? 'successful' : 'recorded'}!`);
        
        // Reset form
        setPaymentForm({
            qrId: '',
            customerName: '',
            customerUPI: '',
            amount: '',
            status: 'success'
        });
    };

    const handleChange = (field, value) => {
        setPaymentForm(prev => ({ ...prev, [field]: value }));
    };

    if (!qrCodes || qrCodes.length === 0) {
        return null;
    }

    return (
        <div className={`card ${staticQrClasses.form_card} mt-3`}>
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                    <i className="fa fa-flask mr-2"></i>
                    Payment Simulator (Testing Only)
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>QR Code *</label>
                                <select
                                    className="form-control"
                                    value={paymentForm.qrId}
                                    onChange={(e) => handleChange('qrId', e.target.value)}
                                    required
                                >
                                    <option value="">Select QR Code</option>
                                    {qrCodes.map(qr => (
                                        <option key={qr.qrId} value={qr.qrId}>
                                            {qr.qrId} - {qr.merchantName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label>Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={paymentForm.customerName}
                                    onChange={(e) => handleChange('customerName', e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label>Customer UPI</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={paymentForm.customerUPI}
                                    onChange={(e) => handleChange('customerUPI', e.target.value)}
                                    placeholder="john@paytm"
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={paymentForm.amount}
                                    onChange={(e) => handleChange('amount', e.target.value)}
                                    placeholder="1000"
                                    min="1"
                                    max="100000"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    value={paymentForm.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                >
                                    <option value="success">Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-1">
                            <div className="form-group">
                                <label>&nbsp;</label>
                                <button type="submit" className="btn btn-success btn-block">
                                    <i className="fa fa-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <small className="text-muted">
                    <i className="fa fa-info-circle mr-1"></i>
                    This simulator is for testing purposes only. In production, transactions are recorded via webhook callbacks.
                </small>
            </div>
        </div>
    );
};

export default PaymentSimulator;