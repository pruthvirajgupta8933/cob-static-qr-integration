import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import staticQrClasses from '../staticqr.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const QRTransactionSummary = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    
    const [dateRange, setDateRange] = useState({
        fromDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD')
    });
    
    const [summaryData, setSummaryData] = useState({
        totalTransactions: 15426,
        totalAmount: 4567890,
        successfulTransactions: 14235,
        failedTransactions: 891,
        pendingTransactions: 300,
        refundedTransactions: 125,
        averageTransactionValue: 296,
        conversionRate: 92.3,
        topQRCode: 'QR001',
        topQRTransactions: 3456,
        peakHour: '14:00-15:00',
        peakDayOfWeek: 'Saturday'
    });

    const [loading, setLoading] = useState(false);

    // Mock data for charts
    const dailyTrendData = {
        labels: Array.from({length: 30}, (_, i) => 
            moment().subtract(29 - i, 'days').format('MMM DD')
        ),
        datasets: [
            {
                label: 'Transaction Count',
                data: Array.from({length: 30}, () => Math.floor(Math.random() * 600) + 400),
                backgroundColor: 'rgba(0, 123, 255, 0.6)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }
        ]
    };

    const statusDistribution = {
        labels: ['Successful', 'Failed', 'Pending', 'Refunded'],
        datasets: [
            {
                data: [
                    summaryData.successfulTransactions,
                    summaryData.failedTransactions,
                    summaryData.pendingTransactions,
                    summaryData.refundedTransactions
                ],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(108, 117, 125, 0.8)'
                ],
                borderWidth: 1
            }
        ]
    };

    const hourlyDistribution = {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [
            {
                label: 'Transactions by Hour',
                data: Array.from({length: 24}, () => Math.floor(Math.random() * 200) + 50),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const loadSummaryData = async () => {
        setLoading(true);
        try {
            // In production, fetch from API
            // const response = await api.getQRTransactionSummary(dateRange);
            // setSummaryData(response.data);
        } catch (error) {
            console.error('Error loading summary:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSummaryData();
    }, [dateRange]);

    const handleDateChange = (field, value) => {
        setDateRange(prev => ({ ...prev, [field]: value }));
    };

    const exportSummaryReport = () => {
        // Generate and download summary report
        console.log('Exporting summary report...');
    };

    return (
        <div className="card">
            <div className="card-body">
                {/* Date Range Filter */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <label>From Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.fromDate}
                            onChange={(e) => handleDateChange('fromDate', e.target.value)}
                            max={dateRange.toDate}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>To Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.toDate}
                            onChange={(e) => handleDateChange('toDate', e.target.value)}
                            min={dateRange.fromDate}
                            max={moment().format('YYYY-MM-DD')}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>&nbsp;</label>
                        <button 
                            className="btn btn-primary btn-block"
                            onClick={loadSummaryData}
                            disabled={loading}
                        >
                            <i className="fa fa-sync mr-2"></i>
                            Refresh
                        </button>
                    </div>
                    <div className="col-md-3">
                        <label>&nbsp;</label>
                        <button 
                            className="btn btn-success btn-block"
                            onClick={exportSummaryReport}
                        >
                            <i className="fa fa-download mr-2"></i>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <h5 className="card-title">Total Transactions</h5>
                                <h2>{summaryData.totalTransactions.toLocaleString()}</h2>
                                <small>
                                    <i className="fa fa-arrow-up"></i> 12% from last period
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <h5 className="card-title">Total Amount</h5>
                                <h2>₹{summaryData.totalAmount.toLocaleString()}</h2>
                                <small>
                                    <i className="fa fa-arrow-up"></i> 8% from last period
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <h5 className="card-title">Avg Transaction Value</h5>
                                <h2>₹{summaryData.averageTransactionValue}</h2>
                                <small>
                                    <i className="fa fa-arrow-down"></i> 3% from last period
                                </small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white">
                            <div className="card-body">
                                <h5 className="card-title">Success Rate</h5>
                                <h2>{summaryData.conversionRate}%</h2>
                                <small>
                                    <i className="fa fa-arrow-up"></i> 2% from last period
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="row mb-4">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Daily Transaction Trend</h5>
                            </div>
                            <div className="card-body">
                                <Bar 
                                    data={dailyTrendData} 
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Status Distribution</h5>
                            </div>
                            <div className="card-body">
                                <Doughnut 
                                    data={statusDistribution}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Hourly Transaction Distribution</h5>
                            </div>
                            <div className="card-body">
                                <Bar 
                                    data={hourlyDistribution}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Key Insights</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="mr-3">
                                                <i className="fa fa-trophy fa-2x text-warning"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Top Performing QR</small>
                                                <h5 className="mb-0">{summaryData.topQRCode}</h5>
                                                <small>{summaryData.topQRTransactions} transactions</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="mr-3">
                                                <i className="fa fa-clock fa-2x text-info"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Peak Hour</small>
                                                <h5 className="mb-0">{summaryData.peakHour}</h5>
                                                <small>Most transactions</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="mr-3">
                                                <i className="fa fa-calendar fa-2x text-primary"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Peak Day</small>
                                                <h5 className="mb-0">{summaryData.peakDayOfWeek}</h5>
                                                <small>Highest volume</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="mr-3">
                                                <i className="fa fa-undo fa-2x text-secondary"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Refunds</small>
                                                <h5 className="mb-0">{summaryData.refundedTransactions}</h5>
                                                <small>Total refunded</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRTransactionSummary;