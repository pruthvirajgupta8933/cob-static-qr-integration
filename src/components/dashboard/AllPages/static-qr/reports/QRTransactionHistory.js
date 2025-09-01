import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import staticQrClasses from '../staticqr.module.css';

const QRTransactionHistory = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    
    const [filters, setFilters] = useState({
        qrCode: 'all',
        status: 'all',
        paymentMethod: 'all',
        dateFrom: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        dateTo: moment().format('YYYY-MM-DD'),
        amountFrom: '',
        amountTo: '',
        searchTerm: ''
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [sortField, setSortField] = useState('transaction_date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    
    // Mock transaction history data
    const [transactions, setTransactions] = useState([
        {
            id: 'TXN20240115001',
            qrCode: 'QR001',
            qrName: 'Store Main Counter',
            customerName: 'Rajesh Kumar',
            customerVPA: 'rajesh@paytm',
            amount: 2500,
            status: 'success',
            paymentMethod: 'UPI',
            transactionDate: '2024-01-15',
            transactionTime: '10:30:45',
            referenceNumber: 'UPI400115103045',
            bankReferenceNumber: 'HDFC123456789',
            settlementStatus: 'settled',
            settlementDate: '2024-01-16'
        },
        {
            id: 'TXN20240115002',
            qrCode: 'QR002',
            qrName: 'Store Billing Counter 2',
            customerName: 'Priya Sharma',
            customerVPA: 'priya@phonepe',
            amount: 1850,
            status: 'success',
            paymentMethod: 'UPI',
            transactionDate: '2024-01-15',
            transactionTime: '11:15:22',
            referenceNumber: 'UPI400115111522',
            bankReferenceNumber: 'HDFC123456790',
            settlementStatus: 'settled',
            settlementDate: '2024-01-16'
        },
        {
            id: 'TXN20240115003',
            qrCode: 'QR001',
            qrName: 'Store Main Counter',
            customerName: 'Amit Patel',
            customerVPA: 'amit@gpay',
            amount: 750,
            status: 'failed',
            paymentMethod: 'UPI',
            transactionDate: '2024-01-15',
            transactionTime: '12:45:10',
            referenceNumber: 'UPI400115124510',
            bankReferenceNumber: null,
            settlementStatus: null,
            settlementDate: null
        },
        {
            id: 'TXN20240115004',
            qrCode: 'QR003',
            qrName: 'Online Store QR',
            customerName: 'Sneha Gupta',
            customerVPA: 'sneha@bhim',
            amount: 5000,
            status: 'refunded',
            paymentMethod: 'UPI',
            transactionDate: '2024-01-15',
            transactionTime: '14:20:33',
            referenceNumber: 'UPI400115142033',
            bankReferenceNumber: 'HDFC123456791',
            settlementStatus: 'refunded',
            settlementDate: '2024-01-17',
            refundAmount: 5000,
            refundDate: '2024-01-17',
            refundReason: 'Product return'
        }
    ]);
    
    const [qrCodes, setQrCodes] = useState([
        { id: 'QR001', name: 'Store Main Counter' },
        { id: 'QR002', name: 'Store Billing Counter 2' },
        { id: 'QR003', name: 'Online Store QR' }
    ]);
    
    const totalPages = Math.ceil(100 / pageSize); // Mock total count
    
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };
    
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };
    
    const handleSelectTransaction = (txnId) => {
        setSelectedTransactions(prev => {
            if (prev.includes(txnId)) {
                return prev.filter(id => id !== txnId);
            }
            return [...prev, txnId];
        });
    };
    
    const handleSelectAll = () => {
        if (selectedTransactions.length === transactions.length) {
            setSelectedTransactions([]);
        } else {
            setSelectedTransactions(transactions.map(txn => txn.id));
        }
    };
    
    const exportTransactions = (format) => {
        if (format === 'csv') {
            // Generate CSV
            const headers = ['Transaction ID', 'Date', 'Time', 'QR Code', 'Customer', 'Amount', 'Status', 'Settlement Status'];
            const rows = transactions.map(txn => [
                txn.id,
                txn.transactionDate,
                txn.transactionTime,
                txn.qrCode,
                txn.customerName,
                txn.amount,
                txn.status,
                txn.settlementStatus || 'N/A'
            ]);
            
            const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `QR_Transactions_${moment().format('YYYYMMDD_HHmmss')}.csv`;
            a.click();
        } else if (format === 'excel') {
            // For Excel, you would typically use a library like xlsx
            console.log('Excel export would be implemented with xlsx library');
        } else if (format === 'pdf') {
            // For PDF, you would typically use a library like jsPDF
            console.log('PDF export would be implemented with jsPDF library');
        }
    };
    
    const loadTransactionHistory = async () => {
        setLoading(true);
        try {
            // In production, fetch from API
            // const response = await api.getTransactionHistory({ ...filters, page: currentPage, pageSize, sortField, sortOrder });
            // setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error loading transaction history:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadTransactionHistory();
    }, [filters, currentPage, pageSize, sortField, sortOrder]);
    
    const getSortIcon = (field) => {
        if (sortField !== field) return 'fa-sort';
        return sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    };
    
    return (
        <div className="card">
            <div className="card-body">
                {/* Filters Section */}
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">
                            <i className="fa fa-filter mr-2"></i>
                            Filters
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label>QR Code</label>
                                <select
                                    className="form-control"
                                    value={filters.qrCode}
                                    onChange={(e) => handleFilterChange('qrCode', e.target.value)}
                                >
                                    <option value="all">All QR Codes</option>
                                    {qrCodes.map(qr => (
                                        <option key={qr.id} value={qr.id}>
                                            {qr.id} - {qr.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="success">Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>Payment Method</label>
                                <select
                                    className="form-control"
                                    value={filters.paymentMethod}
                                    onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                                >
                                    <option value="all">All Methods</option>
                                    <option value="UPI">UPI</option>
                                    <option value="QR">QR Scan</option>
                                    <option value="NFC">NFC</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Transaction ID, Customer, VPA..."
                                    value={filters.searchTerm}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>Date From</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>Date To</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>Amount Range</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Min"
                                        value={filters.amountFrom}
                                        onChange={(e) => handleFilterChange('amountFrom', e.target.value)}
                                    />
                                    <div className="input-group-append input-group-prepend">
                                        <span className="input-group-text">-</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Max"
                                        value={filters.amountTo}
                                        onChange={(e) => handleFilterChange('amountTo', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label>&nbsp;</label>
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={loadTransactionHistory}
                                    disabled={loading}
                                >
                                    <i className="fa fa-search mr-2"></i>
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="mb-0">
                            Transaction History
                            <small className="text-muted ml-2">
                                ({selectedTransactions.length} selected)
                            </small>
                        </h5>
                    </div>
                    <div className="btn-group">
                        <button
                            className="btn btn-outline-success"
                            onClick={() => exportTransactions('csv')}
                        >
                            <i className="fa fa-file-csv mr-2"></i>
                            Export CSV
                        </button>
                        <button
                            className="btn btn-outline-success"
                            onClick={() => exportTransactions('excel')}
                        >
                            <i className="fa fa-file-excel mr-2"></i>
                            Export Excel
                        </button>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => exportTransactions('pdf')}
                        >
                            <i className="fa fa-file-pdf mr-2"></i>
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedTransactions.length === transactions.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th 
                                    className="cursor-pointer"
                                    onClick={() => handleSort('transaction_date')}
                                >
                                    Date/Time
                                    <i className={`fa ${getSortIcon('transaction_date')} ml-2 text-muted`}></i>
                                </th>
                                <th>Transaction ID</th>
                                <th>QR Code</th>
                                <th>Customer</th>
                                <th 
                                    className="cursor-pointer text-right"
                                    onClick={() => handleSort('amount')}
                                >
                                    Amount
                                    <i className={`fa ${getSortIcon('amount')} ml-2 text-muted`}></i>
                                </th>
                                <th>Status</th>
                                <th>Settlement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map(txn => (
                                    <tr key={txn.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedTransactions.includes(txn.id)}
                                                onChange={() => handleSelectTransaction(txn.id)}
                                            />
                                        </td>
                                        <td>
                                            <small>
                                                {txn.transactionDate}<br />
                                                {txn.transactionTime}
                                            </small>
                                        </td>
                                        <td>
                                            <small className="text-monospace">{txn.id}</small>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {txn.qrCode}
                                            </span>
                                            <br />
                                            <small className="text-muted">{txn.qrName}</small>
                                        </td>
                                        <td>
                                            {txn.customerName}
                                            <br />
                                            <small className="text-muted">{txn.customerVPA}</small>
                                        </td>
                                        <td className="text-right font-weight-bold">
                                            ₹{txn.amount.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${
                                                txn.status === 'success' ? 'success' :
                                                txn.status === 'pending' ? 'warning' :
                                                txn.status === 'refunded' ? 'info' : 'danger'
                                            }`}>
                                                {txn.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {txn.settlementStatus ? (
                                                <span className={`badge badge-${
                                                    txn.settlementStatus === 'settled' ? 'success' :
                                                    txn.settlementStatus === 'pending' ? 'warning' :
                                                    txn.settlementStatus === 'refunded' ? 'info' : 'secondary'
                                                }`}>
                                                    {txn.settlementStatus.toUpperCase()}
                                                </span>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                title="View Details"
                                            >
                                                <i className="fa fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4 text-muted">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <label className="mr-2">Show</label>
                        <select
                            className="form-control form-control-sm d-inline-block"
                            style={{ width: 'auto' }}
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="ml-2">entries</span>
                    </div>
                    
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    First
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const pageNum = currentPage - 2 + i;
                                if (pageNum > 0 && pageNum <= totalPages) {
                                    return (
                                        <li
                                            key={pageNum}
                                            className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                            
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    Last
                                </button>
                            </li>
                        </ul>
                    </nav>
                    
                    <div>
                        <span className="text-muted">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRTransactionHistory;