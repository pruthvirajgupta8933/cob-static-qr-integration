import React, { useRef, useState } from 'react';
import QRTemplateDesign from './QRTemplateDesign';
import staticQrClasses from '../staticqr.module.css';

const QRPreviewModal = ({ show, onClose, qrData, designConfig }) => {
    const [canvasRef, setCanvasRef] = useState(null);
    const [downloadType, setDownloadType] = useState('branded'); // 'branded' or 'simple'
    
    if (!qrData || !show) return null;

    const downloadQR = () => {
        if (downloadType === 'branded' && canvasRef) {
            // Download branded template
            const link = document.createElement('a');
            link.download = `SabPaisa_QR_${qrData.qr_identifier}_${Date.now()}.png`;
            link.href = canvasRef.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (qrData.qr_image_url) {
            // Download simple QR
            const link = document.createElement('a');
            link.download = `QR_${qrData.qr_identifier}_${Date.now()}.png`;
            link.href = qrData.qr_image_url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const printQR = () => {
        if (downloadType === 'branded' && canvasRef) {
            const printWindow = window.open('', '_blank');
            const dataUrl = canvasRef.toDataURL('image/png');
            printWindow.document.write(`
                <html>
                <head>
                    <title>SabPaisa QR - ${qrData.reference_name}</title>
                    <style>
                        body { 
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                        }
                        img {
                            max-width: 90%;
                            height: auto;
                        }
                        @media print {
                            body { margin: 0; }
                            img { max-width: 100%; }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <img src="${dataUrl}" alt="QR Code" />
                </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>QR Code - ${qrData.reference_name}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 40px;
                        }
                        .qr-container {
                            max-width: 600px;
                            margin: 0 auto;
                            border: 2px solid #007bff;
                            border-radius: 12px;
                            padding: 30px;
                        }
                        .qr-image { 
                            max-width: 400px; 
                            margin: 20px auto;
                        }
                        .vpa-display {
                            font-family: 'Courier New', monospace;
                            font-size: 18px;
                            color: #007bff;
                            background: #e7f3ff;
                            padding: 10px 20px;
                            border-radius: 6px;
                            display: inline-block;
                            margin: 20px 0;
                        }
                        .instructions {
                            margin-top: 30px;
                            padding: 20px;
                            background: #f8f9fa;
                            border-radius: 8px;
                        }
                        h2 { color: #212529; }
                        .label { 
                            font-weight: bold; 
                            color: #495057;
                            margin-right: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <h2>${qrData.reference_name}</h2>
                        <img src="${qrData.qr_image_url}" class="qr-image" alt="QR Code" />
                        <div class="vpa-display">${qrData.full_vpa}</div>
                        <p><span class="label">QR ID:</span> ${qrData.qr_identifier}</p>
                        ${qrData.description ? `<p><span class="label">Description:</span> ${qrData.description}</p>` : ''}
                        ${qrData.max_amount_per_transaction ? `<p><span class="label">Amount:</span> ₹${qrData.max_amount_per_transaction}</p>` : ''}
                        <div class="instructions">
                            <h4>How to Pay:</h4>
                            <ol style="text-align: left;">
                                <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                                <li>Scan this QR code</li>
                                ${qrData.max_amount_per_transaction ? '<li>Confirm the amount</li>' : '<li>Enter the amount to pay</li>'}
                                <li>Complete the payment</li>
                            </ol>
                        </div>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    };

    const shareQR = async () => {
        // Check if Web Share API is available
        if (navigator.share) {
            try {
                // Try to share with image
                const shareData = {
                    title: `QR Code - ${qrData.reference_name}`,
                    text: `Pay using UPI to: ${qrData.full_vpa}\nQR ID: ${qrData.qr_identifier}\n${qrData.description || ''}`.trim()
                };
                
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                    copyShareableInfo();
                }
            }
        } else {
            // Fallback - copy detailed info
            copyShareableInfo();
        }
    };
    
    const copyShareableInfo = () => {
        const shareText = `Payment QR Details:
Business: ${qrData.reference_name}
UPI ID: ${qrData.full_vpa}
QR ID: ${qrData.qr_identifier}
${qrData.max_amount_per_transaction ? `Amount: ₹${qrData.max_amount_per_transaction}` : 'Amount: Any'}
${qrData.description || ''}

Pay using any UPI app`.trim();
        
        navigator.clipboard.writeText(shareText);
        alert('Payment details copied! You can now paste and share via any app.');
    };

    const copyVPA = () => {
        navigator.clipboard.writeText(qrData.full_vpa);
        alert('VPA copied to clipboard!');
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className={`modal-header ${staticQrClasses.modal_header}`}>
                            <h5 className="modal-title">
                                <i className="fa fa-check-circle mr-2"></i>
                                QR Code Generated Successfully!
                            </h5>
                            <button type="button" className="close text-white" onClick={onClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Download Type Selector */}
                            <div className="text-center mb-3">
                                <div className="btn-group" role="group">
                                    <button 
                                        type="button" 
                                        className={`btn ${downloadType === 'branded' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setDownloadType('branded')}
                                    >
                                        <i className="fa fa-certificate mr-2"></i>
                                        Branded Template
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`btn ${downloadType === 'simple' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setDownloadType('simple')}
                                    >
                                        <i className="fa fa-qrcode mr-2"></i>
                                        Simple QR
                                    </button>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className={staticQrClasses.qr_preview_container} style={{ background: 'white', border: 'none' }}>
                                        {downloadType === 'branded' ? (
                                            <QRTemplateDesign 
                                                qrData={qrData.upi_string}
                                                merchantName={qrData.reference_name || 'Merchant'}
                                                reference={qrData.description}
                                                amount={qrData.max_amount_per_transaction}
                                                identifier={qrData.qr_identifier}
                                                onCanvasReady={setCanvasRef}
                                            />
                                        ) : (
                                            qrData.qr_image_url ? (
                                                <img
                                                    src={qrData.qr_image_url}
                                                    alt="QR Code"
                                                    className={staticQrClasses.qr_image}
                                                    style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}
                                                />
                                            ) : (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="sr-only">Generating QR...</span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    
                                    {/* Share Buttons */}
                                    <div className="mt-3">
                                        <button 
                                            className="btn btn-outline-primary btn-block"
                                            onClick={shareQR}
                                        >
                                            <i className="fa fa-share-alt mr-2"></i>
                                            Share QR Details
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    {/* QR Details */}
                                    <div className={staticQrClasses.qr_details}>
                                        <h6 className="text-muted mb-3">QR Code Details</h6>
                                        
                                        <div className="mb-3">
                                            <small className="text-muted d-block">QR Identifier</small>
                                            <div className="d-flex align-items-center">
                                                <strong className="mr-2">{qrData.qr_identifier}</strong>
                                                <span className={`badge ${qrData.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                                                    {qrData.status || 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <small className="text-muted d-block">Virtual Payment Address (VPA)</small>
                                            <div className="input-group">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={qrData.full_vpa} 
                                                    readOnly 
                                                />
                                                <div className="input-group-append">
                                                    <button 
                                                        className="btn btn-outline-secondary" 
                                                        onClick={copyVPA}
                                                        title="Copy VPA"
                                                    >
                                                        <i className="fa fa-copy"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {qrData.reference_name && (
                                            <div className="mb-3">
                                                <small className="text-muted d-block">Reference Name</small>
                                                <strong>{qrData.reference_name}</strong>
                                            </div>
                                        )}
                                        
                                        {qrData.max_amount_per_transaction && (
                                            <div className="mb-3">
                                                <small className="text-muted d-block">Fixed Amount</small>
                                                <h5 className="text-primary mb-0">₹{qrData.max_amount_per_transaction}</h5>
                                            </div>
                                        )}
                                        
                                        {qrData.description && (
                                            <div className="mb-3">
                                                <small className="text-muted d-block">Description</small>
                                                <p className="mb-0">{qrData.description}</p>
                                            </div>
                                        )}
                                        
                                        <div className="mb-3">
                                            <small className="text-muted d-block">Created At</small>
                                            <span>{new Date(qrData.created_at || Date.now()).toLocaleString()}</span>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="mt-4">
                                            <button 
                                                className="btn btn-primary btn-block mb-2"
                                                onClick={downloadQR}
                                            >
                                                <i className="fa fa-download mr-2"></i>
                                                Download QR Code
                                            </button>
                                            
                                            <button 
                                                className="btn btn-outline-primary btn-block"
                                                onClick={printQR}
                                            >
                                                <i className="fa fa-print mr-2"></i>
                                                Print QR Code
                                            </button>
                                        </div>
                                        
                                        {/* Success Message */}
                                        <div className="alert alert-success mt-3">
                                            <small>
                                                <i className="fa fa-info-circle mr-1"></i>
                                                Your QR code is ready! Download and place it at your counter for customers to scan and pay.
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QRPreviewModal;