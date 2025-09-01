import React, { useState } from 'react';
import QRDashboard from './components/QRDashboard';
import QRGenerationEnhanced from './QRGenerationEnhanced';
import QRManagement from './QRManagement';
import QRPayments from './QRPayments';
import QRReports from './QRReports';
import WebhookHandler from './components/WebhookHandler';
import QRErrorBoundary from './components/QRErrorBoundary';
import staticQrClasses from './staticqr.module.css';

function StaticQR() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <QRErrorBoundary>
            <div className="container-fluid">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className={`card ${staticQrClasses.header_card}`}>
                        <div className="card-body">
                            <h2 className={staticQrClasses.page_title}>
                                <i className="fa fa-qrcode mr-2"></i>
                                Static QR Code Management
                            </h2>
                            <p className={staticQrClasses.page_subtitle}>
                                Generate and manage QR codes for accepting payments
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="btn-group w-100" role="group">
                        <button
                            type="button"
                            className={`btn btn-lg ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <i className="fa fa-dashboard mr-2"></i>
                            Dashboard
                        </button>
                        <button
                            type="button"
                            className={`btn btn-lg ${activeTab === 'generation' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveTab('generation')}
                        >
                            <i className="fa fa-plus-circle mr-2"></i>
                            Generate QR
                        </button>
                        <button
                            type="button"
                            className={`btn btn-lg ${activeTab === 'management' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveTab('management')}
                        >
                            <i className="fa fa-th-large mr-2"></i>
                            Manage QR Codes
                        </button>
                        <button
                            type="button"
                            className={`btn btn-lg ${activeTab === 'payments' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveTab('payments')}
                        >
                            <i className="fa fa-credit-card mr-2"></i>
                            Transactions
                        </button>
                        <button
                            type="button"
                            className={`btn btn-lg ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            <i className="fa fa-chart-line mr-2"></i>
                            Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="row">
                <div className="col-12">
                    {activeTab === 'dashboard' && <QRDashboard />}
                    {activeTab === 'generation' && <QRGenerationEnhanced />}
                    {activeTab === 'management' && <QRManagement />}
                    {activeTab === 'payments' && <QRPayments />}
                    {activeTab === 'reports' && <QRReports />}
                </div>
            </div>
            
            {/* Webhook Handler for Real-time Updates */}
            <WebhookHandler />
        </div>
        </QRErrorBoundary>
    );
}

export default StaticQR;