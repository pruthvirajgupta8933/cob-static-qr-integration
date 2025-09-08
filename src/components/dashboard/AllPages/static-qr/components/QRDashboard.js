import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchDashboardSummary } from '../../../../../slices/sabqr/sabqrSlice';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import staticQrClasses from '../staticqr.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const QRDashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { dashboard = {}, loading } = useSelector(state => state.sabqr || {});
    
    // Provide default values if dashboard is undefined
    const { 
        summary = {
            total_qr_codes: 0,
            active_qr_codes: 0,
            total_collections: 0,
            today_collections: 0,
            monthly_collections: 0,
            today_transactions: 0,
            conversion_rate: 0,
            average_transaction_value: 0
        }, 
        collection_trend = [],
        top_performing_qrs = [],
        recent_payments = []
    } = dashboard || {};

    useEffect(() => {
        dispatch(fetchDashboardSummary());
        
        // Refresh dashboard every 30 seconds
        const interval = setInterval(() => {
            dispatch(fetchDashboardSummary());
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Chart data for collection trend
    const chartData = {
        labels: collection_trend.map(item => moment(item.date).format('MMM DD')),
        datasets: [
            {
                label: 'Collections (₹)',
                data: collection_trend.map(item => item.amount),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Transactions',
                data: collection_trend.map(item => item.transactions),
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.label === 'Collections (₹)') {
                            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
                        }
                        return `${context.parsed.y} transactions`;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    callback: function(value) {
                        return '₹' + value.toLocaleString('en-IN');
                    }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                }
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const MetricCard = ({ title, value, subtitle, icon, color, trend }) => (
        <div className={`${staticQrClasses.metric_card} card`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <p className={staticQrClasses.metric_title}>{title}</p>
                        <h3 className={staticQrClasses.metric_value}>{value}</h3>
                        {subtitle && (
                            <p className={staticQrClasses.metric_subtitle}>{subtitle}</p>
                        )}
                    </div>
                    <div className={`${staticQrClasses.metric_icon} bg-${color}`}>
                        <i className={icon}></i>
                    </div>
                </div>
                {trend && (
                    <div className={staticQrClasses.metric_trend}>
                        <i className={`fa fa-arrow-${trend > 0 ? 'up text-success' : 'down text-danger'} mr-1`}></i>
                        <span className={trend > 0 ? 'text-success' : 'text-danger'}>
                            {Math.abs(trend)}%
                        </span>
                        <span className="text-muted ml-1">vs yesterday</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading.dashboard) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={staticQrClasses.dashboard_container}>
            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                    <MetricCard
                        title="Total QR Codes"
                        value={summary.total_qr_codes}
                        subtitle={`${summary.active_qr_codes} Active`}
                        icon="fa fa-qrcode"
                        color="primary"
                    />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                    <MetricCard
                        title="Today's Collections"
                        value={formatCurrency(summary.today_collections)}
                        subtitle={`${summary.today_transactions} Transactions`}
                        icon="fa fa-rupee-sign"
                        color="success"
                        trend={15}
                    />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                    <MetricCard
                        title="Total Collections"
                        value={formatCurrency(summary.total_collections)}
                        subtitle={`${summary.total_transactions} Total`}
                        icon="fa fa-wallet"
                        color="info"
                    />
                </div>
                <div className="col-lg-3 col-md-6 mb-3">
                    <MetricCard
                        title="Avg Transaction"
                        value={formatCurrency(summary.average_transaction_value)}
                        subtitle="Per transaction"
                        icon="fa fa-chart-line"
                        color="warning"
                    />
                </div>
            </div>

            {/* Charts and Tables Row */}
            <div className="row">
                {/* Collection Trend Chart */}
                <div className="col-lg-8 mb-4">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="fa fa-chart-line mr-2"></i>
                                Collection Trend (Last 7 Days)
                            </h5>
                        </div>
                        <div className="card-body">
                            {collection_trend.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <p className="text-muted text-center py-5">No data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Performing QRs */}
                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="fa fa-trophy mr-2"></i>
                                Top Performing QRs
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className={staticQrClasses.top_qr_list}>
                                {top_performing_qrs.length > 0 ? (
                                    top_performing_qrs.slice(0, 5).map((qr, index) => (
                                        <div key={qr.qr_identifier} className={staticQrClasses.top_qr_item}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <span className={`${staticQrClasses.rank_badge} ${
                                                        index === 0 ? 'bg-warning' : 
                                                        index === 1 ? 'bg-secondary' : 
                                                        index === 2 ? 'bg-danger' : 'bg-light'
                                                    }`}>
                                                        #{index + 1}
                                                    </span>
                                                    <div className="ml-3">
                                                        <h6 className="mb-0">{qr.reference_name}</h6>
                                                        <small className="text-muted">ID: {qr.qr_identifier}</small>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-weight-bold">
                                                        {formatCurrency(qr.total_collections)}
                                                    </div>
                                                    <small className="text-muted">
                                                        {qr.transaction_count} txns
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-center py-4">No data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fa fa-clock mr-2"></i>
                                Recent Payments
                            </h5>
                            <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => history.push('/dashboard/static-qr?tab=payments')}
                            >
                                View All
                                <i className="fa fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Time</th>
                                            <th>QR Code</th>
                                            <th>Payment ID</th>
                                            <th>Customer VPA</th>
                                            <th className="text-right">Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent_payments.length > 0 ? (
                                            recent_payments.slice(0, 10).map(payment => (
                                                <tr key={payment.payment_id}>
                                                    <td>
                                                        <small>{moment(payment.payment_time).format('HH:mm:ss')}</small>
                                                        <br />
                                                        <small className="text-muted">
                                                            {moment(payment.payment_time).format('DD MMM')}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <span className="badge badge-primary">
                                                            {payment.qr_identifier}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small className="text-monospace">{payment.payment_id}</small>
                                                    </td>
                                                    <td>{payment.customer_vpa}</td>
                                                    <td className="text-right font-weight-bold">
                                                        {formatCurrency(payment.amount)}
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-${
                                                            payment.status === 'success' ? 'success' : 
                                                            payment.status === 'pending' ? 'warning' : 'danger'
                                                        }`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    No recent payments
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className={staticQrClasses.quick_actions}>
                        <h5 className="mb-3">Quick Actions</h5>
                        <div className="btn-group" role="group">
                            <button 
                                className="btn btn-primary"
                                onClick={() => history.push('/dashboard/static-qr?tab=generation')}
                            >
                                <i className="fa fa-plus mr-2"></i>
                                Generate New QR
                            </button>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => history.push('/dashboard/static-qr?tab=management')}
                            >
                                <i className="fa fa-th-large mr-2"></i>
                                Manage QRs
                            </button>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => dispatch(fetchDashboardSummary())}
                            >
                                <i className="fa fa-sync mr-2"></i>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRDashboard;