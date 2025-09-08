import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import staticQrClasses from '../staticqr.module.css';

const QRTransactionEnquiry = () => {
    const { user } = useSelector(state => state.auth);
    
    const [searchParams, setSearchParams] = useState({
        transactionId: '',
        qrCode: '',
        customerVPA: '',
        referenceNumber: '',
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: '',
        status: 'all'
    });
    
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Mock search result
    const mockSearchResult = {
        transactionId: 'TXN20240115001',
        qrCode: 'QR001',
        qrName: 'Store Main Counter',
        customerName: 'Rajesh Kumar',
        customerVPA: 'rajesh@paytm',
        amount: 2500,
        status: 'success',
        transactionDate: '2024-01-15',
        transactionTime: '10:30:45',
        referenceNumber: 'UPI400115103045',
        bankReferenceNumber: 'HDFC123456789',
        paymentMethod: 'UPI',
        deviceInfo: 'Android 12',
        ipAddress: '192.168.1.100',
        settlementStatus: 'settled',
        settlementDate: '2024-01-16',
        settlementBatchId: 'BATCH20240116001',
        remarks: 'Payment successful',
        refundStatus: null,
        refundAmount: null,
        refundDate: null,
        refundReason: null
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In production, make actual API call
            // const response = await api.searchQRTransaction(searchParams);
            // setSearchResult(response.data);
            
            setSearchResult(mockSearchResult);
            setShowDetails(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchParams({
            transactionId: '',
            qrCode: '',
            customerVPA: '',
            referenceNumber: '',
            dateFrom: '',
            dateTo: '',
            amountFrom: '',
            amountTo: '',
            status: 'all'
        });
        setSearchResult(null);
        setShowDetails(false);
    };

    const handleInputChange = (field, value) => {
        setSearchParams(prev => ({ ...prev, [field]: value }));
    };

    const exportTransactionDetails = () => {
        if (!searchResult) return;
        
        const data = JSON.stringify(searchResult, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Transaction_${searchResult.transactionId}_${moment().format('YYYYMMDD_HHmmss')}.json`;
        a.click();
    };

    const printTransactionDetails = () => {
        window.print();
    };

    return (
        <div className="card">
            <div className="card-body">
                {/* Search Form */}
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">
                            <i className="fa fa-search mr-2"></i>
                            Search Transaction
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label>Transaction ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter transaction ID"
                                    value={searchParams.transactionId}
                                    onChange={(e) => handleInputChange('transactionId', e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>QR Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter QR code"
                                    value={searchParams.qrCode}
                                    onChange={(e) => handleInputChange('qrCode', e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Customer VPA</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter customer VPA"
                                    value={searchParams.customerVPA}
                                    onChange={(e) => handleInputChange('customerVPA', e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Reference Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter reference number"
                                    value={searchParams.referenceNumber}
                                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    value={searchParams.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="success">Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Date Range</label>
                                <div className="input-group">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={searchParams.dateFrom}
                                        onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                                    />
                                    <div className="input-group-append input-group-prepend">
                                        <span className="input-group-text">to</span>
                                    </div>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={searchParams.dateTo}
                                        onChange={(e) => handleInputChange('dateTo', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Amount Range</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Min amount"
                                        value={searchParams.amountFrom}
                                        onChange={(e) => handleInputChange('amountFrom', e.target.value)}
                                    />
                                    <div className="input-group-append input-group-prepend">
                                        <span className="input-group-text">to</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Max amount"
                                        value={searchParams.amountTo}
                                        onChange={(e) => handleInputChange('amountTo', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>&nbsp;</label>
                                <div className="btn-group btn-block">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSearch}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-search mr-2"></i>
                                                Search
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleReset}
                                    >
                                        <i className="fa fa-redo mr-2"></i>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Result */}
                {showDetails && searchResult && (
                    <div className="card">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fa fa-file-alt mr-2"></i>
                                Transaction Details
                            </h5>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary mr-2"
                                    onClick={printTransactionDetails}
                                >
                                    <i className="fa fa-print mr-1"></i> Print
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={exportTransactionDetails}
                                >
                                    <i className="fa fa-download mr-1"></i> Export
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {/* Basic Information */}
                                <div className="col-md-6">
                                    <h6 className="text-primary mb-3">Transaction Information</h6>
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted" width="40%">Transaction ID:</td>
                                                <td className="font-weight-bold">{searchResult.transactionId}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Reference Number:</td>
                                                <td>{searchResult.referenceNumber}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Bank Reference:</td>
                                                <td>{searchResult.bankReferenceNumber}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Date & Time:</td>
                                                <td>{searchResult.transactionDate} {searchResult.transactionTime}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Amount:</td>
                                                <td className="font-weight-bold text-success">
                                                    ₹{searchResult.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Status:</td>
                                                <td>
                                                    <span className={`badge badge-${
                                                        searchResult.status === 'success' ? 'success' :
                                                        searchResult.status === 'pending' ? 'warning' :
                                                        searchResult.status === 'refunded' ? 'info' : 'danger'
                                                    }`}>
                                                        {searchResult.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Customer & QR Information */}
                                <div className="col-md-6">
                                    <h6 className="text-primary mb-3">Customer & QR Information</h6>
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted" width="40%">Customer Name:</td>
                                                <td>{searchResult.customerName}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Customer VPA:</td>
                                                <td>{searchResult.customerVPA}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">QR Code:</td>
                                                <td>{searchResult.qrCode}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">QR Name:</td>
                                                <td>{searchResult.qrName}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Payment Method:</td>
                                                <td>{searchResult.paymentMethod}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Device Info:</td>
                                                <td>{searchResult.deviceInfo}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Settlement Information */}
                                <div className="col-md-6">
                                    <h6 className="text-primary mb-3 mt-3">Settlement Information</h6>
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted" width="40%">Settlement Status:</td>
                                                <td>
                                                    <span className={`badge badge-${
                                                        searchResult.settlementStatus === 'settled' ? 'success' :
                                                        searchResult.settlementStatus === 'pending' ? 'warning' : 'secondary'
                                                    }`}>
                                                        {searchResult.settlementStatus?.toUpperCase() || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Settlement Date:</td>
                                                <td>{searchResult.settlementDate || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">Settlement Batch:</td>
                                                <td>{searchResult.settlementBatchId || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Refund Information (if applicable) */}
                                {searchResult.status === 'refunded' && (
                                    <div className="col-md-6">
                                        <h6 className="text-primary mb-3 mt-3">Refund Information</h6>
                                        <table className="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" width="40%">Refund Amount:</td>
                                                    <td className="text-danger font-weight-bold">
                                                        ₹{searchResult.refundAmount?.toLocaleString() || 'N/A'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Refund Date:</td>
                                                    <td>{searchResult.refundDate || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Refund Reason:</td>
                                                    <td>{searchResult.refundReason || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Additional Information */}
                                <div className="col-md-12">
                                    <h6 className="text-primary mb-3 mt-3">Additional Information</h6>
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted" width="20%">IP Address:</td>
                                                <td width="30%">{searchResult.ipAddress}</td>
                                                <td className="text-muted" width="20%">Remarks:</td>
                                                <td width="30%">{searchResult.remarks}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Result Message */}
                {showDetails && !searchResult && (
                    <div className="alert alert-info text-center">
                        <i className="fa fa-info-circle mr-2"></i>
                        No transaction found matching your search criteria
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRTransactionEnquiry;