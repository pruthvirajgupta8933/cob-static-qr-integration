import React from 'react';
import Modal from 'react-modal';
import staticQrClasses from '../staticqr.module.css';

const QRPreviewModal = ({ show, onClose, qrData, designConfig }) => {
    if (!qrData) return null;

    const downloadQR = () => {
        if (qrData.qr_image_url) {
            const link = document.createElement('a');
            link.download = `QR_${qrData.qr_identifier}_${Date.now()}.png`;
            link.href = qrData.qr_image_url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const printQR = () => {
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
        <Modal
            isOpen={show}
            onRequestClose={onClose}
            className="modal-dialog modal-lg"
            overlayClassName="modal-backdrop show"
            ariaHideApp={false}
        >
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
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <div className={staticQrClasses.qr_preview_container} style={{ background: 'white', border: 'none' }}>
                                {qrData.qr_image_url ? (
                                    <img
                                        src={qrData.qr_image_url}
                                        alt="QR Code"
                                        className={staticQrClasses.qr_image}
                                        style={{ maxWidth: '300px' }}
                                    />
                                ) : (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Generating QR...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-3">
                                <div className={staticQrClasses.vpa_display}>
                                    {qrData.full_vpa}
                                    <button 
                                        className="btn btn-sm btn-link p-0 ml-2"
                                        onClick={copyVPA}
                                        title="Copy VPA"
                                    >
                                        <i className="fa fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <h5 className="mb-3">QR Code Details</h5>
                            
                            <div className="mb-3">
                                <label className="font-weight-bold text-muted small">Reference Name:</label>
                                <p className="mb-2">{qrData.reference_name}</p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="font-weight-bold text-muted small">QR Identifier:</label>
                                <p className="mb-2">
                                    <span className="badge badge-primary">{qrData.qr_identifier}</span>
                                </p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="font-weight-bold text-muted small">Payment Type:</label>
                                <p className="mb-2">
                                    {qrData.max_amount_per_transaction ? 
                                        `Fixed Amount: ₹${qrData.max_amount_per_transaction}` : 
                                        'Dynamic Amount'
                                    }
                                </p>
                            </div>
                            
                            {qrData.description && (
                                <div className="mb-3">
                                    <label className="font-weight-bold text-muted small">Description:</label>
                                    <p className="mb-2">{qrData.description}</p>
                                </div>
                            )}
                            
                            <div className="mb-3">
                                <label className="font-weight-bold text-muted small">Category:</label>
                                <p className="mb-2">
                                    <span className="badge badge-info">{qrData.category}</span>
                                </p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="font-weight-bold text-muted small">Status:</label>
                                <p className="mb-2">
                                    <span className="badge badge-success">Active</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="alert alert-info">
                        <h6 className="alert-heading">
                            <i className="fa fa-info-circle mr-2"></i>
                            What's Next?
                        </h6>
                        <ul className="mb-0 pl-4">
                            <li>Download or print this QR code</li>
                            <li>Display it at your payment counter or share with customers</li>
                            <li>Track payments in real-time from the Transactions tab</li>
                            <li>All payments will be automatically reconciled using the unique VPA</li>
                        </ul>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={downloadQR}
                    >
                        <i className="fa fa-download mr-2"></i>
                        Download
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-info"
                        onClick={printQR}
                    >
                        <i className="fa fa-print mr-2"></i>
                        Print
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={shareQR}
                    >
                        <i className="fa fa-share-alt mr-2"></i>
                        Share
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default QRPreviewModal;