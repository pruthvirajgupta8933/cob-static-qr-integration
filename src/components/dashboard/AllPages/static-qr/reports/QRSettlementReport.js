import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import staticQrClasses from '../staticqr.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const QRSettlementReport = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    
    const [dateRange, setDateRange] = useState({
        fromDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD')
    });
    
    const [settlementType, setSettlementType] = useState('all');
    const [settlementStatus, setSettlementStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [selectedSettlements, setSelectedSettlements] = useState([]);
    
    // Mock settlement data
    const [settlements, setSettlements] = useState([
        {
            settlementId: 'SETT20240116001',
            settlementDate: '2024-01-16',
            batchId: 'BATCH20240116001',
            totalTransactions: 45,
            totalAmount: 125000,
            settledAmount: 122500,
            charges: 2500,
            tax: 450,
            netSettlement: 122050,
            status: 'completed',
            bankReference: 'HDFC20240116001',
            accountNumber: 'XXXX1234',
            bankName: 'HDFC Bank',
            utrNumber: 'HDFC24011612345',
            initiatedAt: '2024-01-16 09:00:00',
            completedAt: '2024-01-16 14:30:00'
        },
        {
            settlementId: 'SETT20240115001',
            settlementDate: '2024-01-15',
            batchId: 'BATCH20240115001',
            totalTransactions: 38,
            totalAmount: 98500,
            settledAmount: 96530,
            charges: 1970,
            tax: 354,
            netSettlement: 96176,
            status: 'completed',
            bankReference: 'HDFC20240115001',
            accountNumber: 'XXXX1234',
            bankName: 'HDFC Bank',
            utrNumber: 'HDFC24011512345',
            initiatedAt: '2024-01-15 09:00:00',
            completedAt: '2024-01-15 15:00:00'
        },
        {
            settlementId: 'SETT20240114001',
            settlementDate: '2024-01-14',
            batchId: 'BATCH20240114001',
            totalTransactions: 52,
            totalAmount: 145000,
            settledAmount: 142100,
            charges: 2900,
            tax: 522,
            netSettlement: 141578,
            status: 'completed',
            bankReference: 'HDFC20240114001',
            accountNumber: 'XXXX1234',
            bankName: 'HDFC Bank',
            utrNumber: 'HDFC24011412345',
            initiatedAt: '2024-01-14 09:00:00',
            completedAt: '2024-01-14 16:00:00'
        },
        {
            settlementId: 'SETT20240117001',
            settlementDate: '2024-01-17',
            batchId: 'BATCH20240117001',
            totalTransactions: 28,
            totalAmount: 75000,
            settledAmount: 0,
            charges: 1500,
            tax: 270,
            netSettlement: 73230,
            status: 'pending',
            bankReference: null,
            accountNumber: 'XXXX1234',
            bankName: 'HDFC Bank',
            utrNumber: null,
            initiatedAt: '2024-01-17 09:00:00',
            completedAt: null
        }
    ]);
    
    // Summary statistics
    const [summaryStats, setSummaryStats] = useState({
        totalSettlements: 4,
        totalAmount: 443500,
        totalSettled: 361130,
        totalCharges: 8870,
        totalTax: 1596,
        averageSettlementTime: '5.5 hours',
        pendingSettlements: 1,
        pendingAmount: 73230
    });
    
    // Chart data for settlement trends
    const settlementTrendData = {
        labels: settlements.map(s => moment(s.settlementDate).format('MMM DD')),
        datasets: [
            {
                label: 'Gross Amount',
                data: settlements.map(s => s.totalAmount),
                backgroundColor: 'rgba(0, 123, 255, 0.6)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            },
            {
                label: 'Net Settlement',
                data: settlements.map(s => s.netSettlement),
                backgroundColor: 'rgba(40, 167, 69, 0.6)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1
            },
            {
                label: 'Charges & Tax',
                data: settlements.map(s => s.charges + s.tax),
                backgroundColor: 'rgba(255, 193, 7, 0.6)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 1
            }
        ]
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₹' + value.toLocaleString();
                    }
                }
            }
        }
    };
    
    const handleDateChange = (field, value) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
    };
    
    const loadSettlementReport = async () => {
        setLoading(true);
        try {
            // In production, fetch from API
            // const response = await api.getSettlementReport(dateRange);
            // setSettlements(response.data.settlements);
            // setSummaryStats(response.data.summary);
        } catch (error) {
            console.error('Error loading settlement report:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadSettlementReport();
    }, [dateRange, settlementType, settlementStatus]);
    
    const handleSelectSettlement = (settlementId) => {
        setSelectedSettlements(prev => {
            if (prev.includes(settlementId)) {
                return prev.filter(id => id !== settlementId);
            }
            return [...prev, settlementId];
        });
    };
    
    const handleSelectAll = () => {
        if (selectedSettlements.length === settlements.length) {
            setSelectedSettlements([]);
        } else {
            setSelectedSettlements(settlements.map(s => s.settlementId));
        }
    };
    
    const exportSettlementReport = (format) => {
        if (format === 'csv') {
            const headers = ['Settlement ID', 'Date', 'Batch ID', 'Transactions', 'Gross Amount', 'Charges', 'Tax', 'Net Settlement', 'Status', 'UTR Number'];
            const rows = settlements.map(s => [
                s.settlementId,
                s.settlementDate,
                s.batchId,
                s.totalTransactions,
                s.totalAmount,
                s.charges,
                s.tax,
                s.netSettlement,
                s.status,
                s.utrNumber || 'N/A'
            ]);
            
            const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Settlement_Report_${moment().format('YYYYMMDD_HHmmss')}.csv`;
            a.click();
        }
    };
    
    const downloadSettlementFile = (settlementId) => {
        // In production, this would download the actual settlement file
        console.log('Downloading settlement file for:', settlementId);
    };
    
    const initiateManualSettlement = () => {
        if (window.confirm('Are you sure you want to initiate a manual settlement?')) {
            console.log('Initiating manual settlement...');
            // In production, call API to initiate settlement
        }
    };
    
    return (
        <div className="card">
            <div className="card-body">
                {/* Summary Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <h6 className="card-title">Total Settlements</h6>
                                <h3>{summaryStats.totalSettlements}</h3>
                                <small>Last 7 days</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <h6 className="card-title">Total Settled</h6>
                                <h3>₹{summaryStats.totalSettled.toLocaleString()}</h3>
                                <small>Successfully settled</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white">
                            <div className="card-body">
                                <h6 className="card-title">Pending Amount</h6>
                                <h3>₹{summaryStats.pendingAmount.toLocaleString()}</h3>
                                <small>{summaryStats.pendingSettlements} settlements</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <h6 className="card-title">Avg Settlement Time</h6>
                                <h3>{summaryStats.averageSettlementTime}</h3>
                                <small>Processing time</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">
                            <i className="fa fa-filter mr-2"></i>
                            Settlement Filters
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <label>From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateRange.fromDate}
                                    onChange={(e) => handleDateChange('fromDate', e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>To Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateRange.toDate}
                                    onChange={(e) => handleDateChange('toDate', e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label>Type</label>
                                <select
                                    className="form-control"
                                    value={settlementType}
                                    onChange={(e) => setSettlementType(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="auto">Auto Settlement</option>
                                    <option value="manual">Manual Settlement</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    value={settlementStatus}
                                    onChange={(e) => setSettlementStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label>&nbsp;</label>
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={loadSettlementReport}
                                    disabled={loading}
                                >
                                    <i className="fa fa-search mr-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settlement Trend Chart */}
                <div className="card mb-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">
                            <i className="fa fa-chart-bar mr-2"></i>
                            Settlement Trends
                        </h5>
                    </div>
                    <div className="card-body">
                        <Bar data={settlementTrendData} options={chartOptions} />
                    </div>
                </div>

                {/* Settlement Details Table */}
                <div className="card">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="fa fa-list mr-2"></i>
                            Settlement Details
                        </h5>
                        <div className="btn-group">
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => exportSettlementReport('csv')}
                            >
                                <i className="fa fa-download mr-1"></i>
                                Export CSV
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={initiateManualSettlement}
                            >
                                <i className="fa fa-play mr-1"></i>
                                Manual Settlement
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                checked={selectedSettlements.length === settlements.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Settlement Date</th>
                                        <th>Settlement ID</th>
                                        <th>Batch ID</th>
                                        <th className="text-center">Transactions</th>
                                        <th className="text-right">Gross Amount</th>
                                        <th className="text-right">Charges</th>
                                        <th className="text-right">Tax</th>
                                        <th className="text-right">Net Settlement</th>
                                        <th>Status</th>
                                        <th>UTR Number</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="12" className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : settlements.length > 0 ? (
                                        settlements.map(settlement => (
                                            <tr key={settlement.settlementId}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSettlements.includes(settlement.settlementId)}
                                                        onChange={() => handleSelectSettlement(settlement.settlementId)}
                                                    />
                                                </td>
                                                <td>{settlement.settlementDate}</td>
                                                <td>
                                                    <small className="text-monospace">{settlement.settlementId}</small>
                                                </td>
                                                <td>
                                                    <small className="text-monospace">{settlement.batchId}</small>
                                                </td>
                                                <td className="text-center">{settlement.totalTransactions}</td>
                                                <td className="text-right">
                                                    ₹{settlement.totalAmount.toLocaleString()}
                                                </td>
                                                <td className="text-right text-danger">
                                                    -₹{settlement.charges.toLocaleString()}
                                                </td>
                                                <td className="text-right text-danger">
                                                    -₹{settlement.tax.toLocaleString()}
                                                </td>
                                                <td className="text-right font-weight-bold text-success">
                                                    ₹{settlement.netSettlement.toLocaleString()}
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${
                                                        settlement.status === 'completed' ? 'success' :
                                                        settlement.status === 'pending' ? 'warning' : 'danger'
                                                    }`}>
                                                        {settlement.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    {settlement.utrNumber ? (
                                                        <small className="text-monospace">{settlement.utrNumber}</small>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            title="View Details"
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </button>
                                                        {settlement.status === 'completed' && (
                                                            <button
                                                                className="btn btn-outline-success"
                                                                title="Download Report"
                                                                onClick={() => downloadSettlementFile(settlement.settlementId)}
                                                            >
                                                                <i className="fa fa-download"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className="text-center py-4 text-muted">
                                                No settlements found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Settlement Summary */}
                <div className="card mt-4">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">
                            <i className="fa fa-info-circle mr-2"></i>
                            Settlement Summary
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <table className="table table-sm table-borderless">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">Total Gross Amount:</td>
                                            <td className="text-right font-weight-bold">
                                                ₹{summaryStats.totalAmount.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Total Charges:</td>
                                            <td className="text-right text-danger">
                                                -₹{summaryStats.totalCharges.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Total Tax:</td>
                                            <td className="text-right text-danger">
                                                -₹{summaryStats.totalTax.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-top">
                                            <td className="text-muted font-weight-bold">Net Settlement:</td>
                                            <td className="text-right font-weight-bold text-success">
                                                ₹{summaryStats.totalSettled.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <div className="alert alert-info mb-0">
                                    <h6 className="alert-heading">
                                        <i className="fa fa-info-circle mr-2"></i>
                                        Settlement Information
                                    </h6>
                                    <hr />
                                    <ul className="mb-0 pl-3">
                                        <li>Settlements are processed daily at 9:00 AM IST</li>
                                        <li>T+1 settlement cycle (next business day)</li>
                                        <li>Minimum settlement amount: ₹100</li>
                                        <li>Settlement charges: 2% + 18% GST</li>
                                        <li>Manual settlements can be initiated once per day</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRSettlementReport;