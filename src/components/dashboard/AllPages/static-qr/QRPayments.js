import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstanceJWT } from '../../../../utilities/axiosInstance';
import API_URL from '../../../../config';
import toastConfig from '../../../../utilities/toastTypes';
import staticQrClasses from './staticqr.module.css';
import RefundModal from './components/RefundModal';
import PaymentSimulator from './components/PaymentSimulator';
import localTransactionService from '../../../../services/localTransactionService';

const QRPayments = () => {
    const { user } = useSelector((state) => state.auth) || {};
    const dispatch = useDispatch();
    
    // Get transactions from Redux state
    const { transactions: reduxTransactions } = useSelector((state) => state.sabqr);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filters, setFilters] = useState({
        searchText: '',
        dateFrom: '',
        dateTo: '',
        qrId: 'all',
        status: 'all',
        minAmount: '',
        maxAmount: ''
    });
    const [qrCodesList, setQrCodesList] = useState([]);
    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalAmount: 0,
        successfulTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        refundedTransactions: 0
    });

    // Mock transaction data
    const mockTransactions = [
        {
            transactionId: 'TXN20240115001',
            qrId: 'QR001',
            merchantName: 'Store Main Counter',
            customerName: 'Rajesh Kumar',
            customerUPI: 'rajesh@paytm',
            amount: 2500,
            status: 'success',
            date: '2024-01-15',
            time: '10:30:45',
            referenceNumber: 'UPI400115103045'
        },
        {
            transactionId: 'TXN20240115002',
            qrId: 'QR002',
            merchantName: 'Store Billing Desk 2',
            customerName: 'Priya Sharma',
            customerUPI: 'priya@gpay',
            amount: 500,
            status: 'success',
            date: '2024-01-15',
            time: '11:15:22',
            referenceNumber: 'UPI400115111522'
        },
        {
            transactionId: 'TXN20240115003',
            qrId: 'QR001',
            merchantName: 'Store Main Counter',
            customerName: 'Amit Patel',
            customerUPI: 'amit@phonepe',
            amount: 1200,
            status: 'pending',
            date: '2024-01-15',
            time: '12:45:10',
            referenceNumber: 'UPI400115124510'
        },
        {
            transactionId: 'TXN20240114004',
            qrId: 'QR001',
            merchantName: 'Store Main Counter',
            customerName: 'Neha Singh',
            customerUPI: 'neha@bhim',
            amount: 3400,
            status: 'success',
            date: '2024-01-14',
            time: '14:20:33',
            referenceNumber: 'UPI400114142033'
        },
        {
            transactionId: 'TXN20240114005',
            qrId: 'QR002',
            merchantName: 'Store Billing Desk 2',
            customerName: 'Vikram Reddy',
            customerUPI: 'vikram@paytm',
            amount: 500,
            status: 'failed',
            date: '2024-01-14',
            time: '15:55:18',
            referenceNumber: 'UPI400114155518'
        }
    ];

    // Mock QR codes list
    const mockQRCodes = [
        { id: 'QR001', merchantName: 'Store Main Counter' },
        { id: 'QR002', merchantName: 'Store Billing Desk 2' },
        { id: 'QR003', merchantName: 'Online Store' }
    ];

    useEffect(() => {
        loadTransactions();
        loadQRCodes();
        
        // Auto-refresh transactions every 5 seconds in development
        let refreshInterval;
        if (process.env.NODE_ENV === 'development') {
            refreshInterval = setInterval(() => {
                loadTransactions();
            }, 5000);
            console.log('Auto-refresh enabled for transactions (5 seconds)');
        }
        
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [reduxTransactions]); // Reload when Redux transactions change

    useEffect(() => {
        calculateStats();
    }, [transactions]);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            // In development, fetch from backend local storage
            if (process.env.NODE_ENV === 'development') {
                const backendTransactions = await localTransactionService.getTransactions();
                if (backendTransactions && backendTransactions.length > 0) {
                    // Format transactions for display
                    const formattedTransactions = backendTransactions.map(txn => ({
                        transactionId: txn.transactionId,
                        qrId: txn.qrId,
                        merchantName: txn.merchantName,
                        customerName: txn.payerName || 'Customer',
                        customerUPI: txn.payerVPA || '',
                        amount: txn.amount,
                        status: txn.status.toLowerCase(),
                        date: new Date(txn.createdAt).toISOString().split('T')[0],
                        time: new Date(txn.createdAt).toTimeString().split(' ')[0],
                        referenceNumber: txn.bankRRN || txn.transactionId
                    }));
                    setTransactions(formattedTransactions);
                    console.log(`Loaded ${formattedTransactions.length} transactions from backend`);
                } else if (reduxTransactions && reduxTransactions.length > 0) {
                    setTransactions(reduxTransactions);
                } else {
                    setTransactions(mockTransactions);
                }
            } else {
                // Production mode
                if (reduxTransactions && reduxTransactions.length > 0) {
                    setTransactions(reduxTransactions);
                } else {
                    setTransactions(mockTransactions);
                }
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            // Fall back to mock data on error
            setTransactions(mockTransactions);
        } finally {
            setLoading(false);
        }
    };

    const loadQRCodes = async () => {
        try {
            // In production, fetch from actual API
            setQrCodesList(mockQRCodes);
        } catch (error) {
            console.error('Error loading QR codes:', error);
        }
    };

    const calculateStats = () => {
        const filtered = getFilteredTransactions();
        const totalAmount = filtered.reduce((sum, txn) => sum + txn.amount, 0);
        const successful = filtered.filter(txn => txn.status === 'success').length;
        const pending = filtered.filter(txn => txn.status === 'pending').length;
        const failed = filtered.filter(txn => txn.status === 'failed').length;
        const refunded = filtered.filter(txn => txn.status === 'refunded').length;

        setStats({
            totalTransactions: filtered.length,
            totalAmount,
            successfulTransactions: successful,
            pendingTransactions: pending,
            failedTransactions: failed,
            refundedTransactions: refunded
        });
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const resetFilters = () => {
        setFilters({
            searchText: '',
            dateFrom: '',
            dateTo: '',
            qrId: 'all',
            status: 'all',
            minAmount: '',
            maxAmount: ''
        });
    };

    const getFilteredTransactions = () => {
        return transactions.filter(txn => {
            const matchesSearch = !filters.searchText || 
                txn.transactionId.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                txn.customerName.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                txn.referenceNumber.toLowerCase().includes(filters.searchText.toLowerCase());
            
            const matchesQR = filters.qrId === 'all' || txn.qrId === filters.qrId;
            const matchesStatus = filters.status === 'all' || txn.status === filters.status;
            
            const matchesDateFrom = !filters.dateFrom || new Date(txn.date) >= new Date(filters.dateFrom);
            const matchesDateTo = !filters.dateTo || new Date(txn.date) <= new Date(filters.dateTo);
            
            const matchesMinAmount = !filters.minAmount || txn.amount >= parseFloat(filters.minAmount);
            const matchesMaxAmount = !filters.maxAmount || txn.amount <= parseFloat(filters.maxAmount);
            
            return matchesSearch && matchesQR && matchesStatus && 
                   matchesDateFrom && matchesDateTo && 
                   matchesMinAmount && matchesMaxAmount;
        });
    };

    const handleRefundClick = (transaction) => {
        setSelectedTransaction(transaction);
        setShowRefundModal(true);
    };

    const handleRefundModalClose = () => {
        setShowRefundModal(false);
        setSelectedTransaction(null);
        // Reload transactions to reflect any changes
        loadTransactions();
    };

    const exportToCSV = () => {
        const filtered = getFilteredTransactions();
        const csv = [
            ['Transaction ID', 'QR ID', 'Merchant', 'Customer', 'UPI ID', 'Amount', 'Status', 'Date', 'Time', 'Reference'],
            ...filtered.map(t => [
                t.transactionId, t.qrId, t.merchantName, t.customerName, 
                t.customerUPI, t.amount, t.status, t.date, t.time, t.referenceNumber
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toastConfig.successToast('Transactions exported successfully!');
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <>
            {/* Payment Simulator for Testing */}
            <PaymentSimulator />
            
            <div className={`card ${staticQrClasses.form_card} mt-3`}>
            <div className="card-header bg-white">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h4 className="mb-0">QR Payment Transactions</h4>
                    </div>
                    <div className="col-md-6 text-right">
                        <button className="btn btn-success mr-2" onClick={exportToCSV}>
                            <i className="fa fa-download mr-2"></i>
                            Export CSV
                        </button>
                        <button className="btn btn-primary" onClick={loadTransactions}>
                            <i className="fa fa-refresh mr-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-2">
                        <div className={`card ${staticQrClasses.stats_card} bg-primary text-white`}>
                            <div className="card-body text-center">
                                <div className={staticQrClasses.stats_value}>{stats.totalTransactions}</div>
                                <div className={staticQrClasses.stats_label}>Total Transactions</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className={`card ${staticQrClasses.stats_card} bg-info text-white`}>
                            <div className="card-body text-center">
                                <div className={staticQrClasses.stats_value}>₹{stats.totalAmount.toLocaleString()}</div>
                                <div className={staticQrClasses.stats_label}>Total Amount</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className={`card ${staticQrClasses.stats_card} bg-success text-white`}>
                            <div className="card-body text-center">
                                <div className={staticQrClasses.stats_value}>{stats.successfulTransactions}</div>
                                <div className={staticQrClasses.stats_label}>Successful</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className={`card ${staticQrClasses.stats_card} bg-warning text-white`}>
                            <div className="card-body text-center">
                                <div className={staticQrClasses.stats_value}>{stats.pendingTransactions}</div>
                                <div className={staticQrClasses.stats_label}>Pending</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className={`card ${staticQrClasses.stats_card} bg-danger text-white`}>
                            <div className="card-body text-center">
                                <div className={staticQrClasses.stats_value}>{stats.failedTransactions}</div>
                                <div className={staticQrClasses.stats_label}>Failed</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1">
                        <div className={`card ${staticQrClasses.stats_card} bg-secondary text-white`}>
                            <div className="card-body text-center">
                                <div className={staticQrClasses.stats_value}>{stats.refundedTransactions}</div>
                                <div className={staticQrClasses.stats_label}>Refunded</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className={staticQrClasses.filter_section}>
                    <div className="row">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search transactions..."
                                value={filters.searchText}
                                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-control"
                                value={filters.qrId}
                                onChange={(e) => handleFilterChange('qrId', e.target.value)}
                            >
                                <option value="all">All QR Codes</option>
                                {qrCodesList.map(qr => (
                                    <option key={qr.id} value={qr.id}>{qr.merchantName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-control"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="success">Success</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="From Date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="To Date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-secondary btn-block" onClick={resetFilters}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min Amount"
                                value={filters.minAmount}
                                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max Amount"
                                value={filters.maxAmount}
                                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Date & Time</th>
                                    <th>QR Code</th>
                                    <th>Customer</th>
                                    <th>UPI ID</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Reference</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map(txn => (
                                        <tr key={txn.transactionId}>
                                            <td>
                                                <span className="badge badge-info">{txn.transactionId}</span>
                                            </td>
                                            <td>
                                                {txn.date}<br/>
                                                <small className="text-muted">{txn.time}</small>
                                            </td>
                                            <td>
                                                {txn.qrId}<br/>
                                                <small className="text-muted">{txn.merchantName}</small>
                                            </td>
                                            <td>{txn.customerName}</td>
                                            <td>{txn.customerUPI}</td>
                                            <td className="font-weight-bold">₹{txn.amount.toLocaleString()}</td>
                                            <td>
                                                <span className={`badge badge-${
                                                    txn.status === 'success' ? 'success' : 
                                                    txn.status === 'pending' ? 'warning' : 
                                                    txn.status === 'refunded' ? 'info' : 'danger'
                                                }`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td>
                                                <small>{txn.referenceNumber}</small>
                                            </td>
                                            <td>
                                                {txn.status === 'success' && (
                                                    <button 
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleRefundClick(txn)}
                                                        title="Process Refund"
                                                    >
                                                        <i className="fa fa-undo"></i> Refund
                                                    </button>
                                                )}
                                                {txn.status === 'refunded' && (
                                                    <span className="text-muted">
                                                        <i className="fa fa-check-circle"></i> Refunded
                                                    </span>
                                                )}
                                                {(txn.status === 'pending' || txn.status === 'failed') && (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">
                                            <i className={`fa fa-exchange ${staticQrClasses.empty_state_icon}`}></i>
                                            <p className="mt-2">No transactions found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Refund Modal */}
            <RefundModal 
                show={showRefundModal}
                onClose={handleRefundModalClose}
                transaction={selectedTransaction}
            />
        </div>
        </>
    );
};

export default QRPayments;