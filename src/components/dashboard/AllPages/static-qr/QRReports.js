import React, { useState } from 'react';
import QRTransactionSummary from './reports/QRTransactionSummary';
import QRTransactionEnquiry from './reports/QRTransactionEnquiry';
import QRTransactionHistory from './reports/QRTransactionHistory';
import QRSettlementReport from './reports/QRSettlementReport';
import staticQrClasses from './staticqr.module.css';

const QRReports = () => {
    const [activeReportTab, setActiveReportTab] = useState('summary');

    const reportTabs = [
        { id: 'summary', label: 'Transaction Summary', icon: 'fa-chart-bar' },
        { id: 'enquiry', label: 'Transaction Enquiry', icon: 'fa-search' },
        { id: 'history', label: 'Transaction History', icon: 'fa-history' },
        { id: 'settlement', label: 'Settlement Report', icon: 'fa-file-invoice-dollar' }
    ];

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className={`card ${staticQrClasses.header_card}`}>
                        <div className="card-body">
                            <h3 className={staticQrClasses.section_title}>
                                <i className="fa fa-chart-line mr-2"></i>
                                QR Transaction Reports
                            </h3>
                            <p className="text-muted mb-0">
                                Comprehensive reporting and analytics for QR payment transactions
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Navigation Tabs */}
            <div className="row mb-4">
                <div className="col-12">
                    <ul className="nav nav-tabs">
                        {reportTabs.map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <button
                                    className={`nav-link ${activeReportTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveReportTab(tab.id)}
                                >
                                    <i className={`fa ${tab.icon} mr-2`}></i>
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Report Content */}
            <div className="row">
                <div className="col-12">
                    {activeReportTab === 'summary' && <QRTransactionSummary />}
                    {activeReportTab === 'enquiry' && <QRTransactionEnquiry />}
                    {activeReportTab === 'history' && <QRTransactionHistory />}
                    {activeReportTab === 'settlement' && <QRSettlementReport />}
                </div>
            </div>
        </div>
    );
};

export default QRReports;