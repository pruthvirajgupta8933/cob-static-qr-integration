import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { bulkCreateQR } from '../../slices/sabqr/sabqrSlice';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import './BulkQRGenerator.css';

const BulkQRGenerator = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [csvData, setCsvData] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState([]);
    const [previewQR, setPreviewQR] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    // CSV Template columns
    const csvTemplate = [
        'merchant_name',
        'merchant_id', 
        'vpa_handle',
        'reference_name',
        'description',
        'amount',
        'mobile_number',
        'email',
        'address'
    ];

    // Download CSV Template
    const downloadTemplate = () => {
        const templateData = [
            csvTemplate,
            ['Sample Merchant 1', 'MERCH001', 'payu', 'Sample Store 1', 'Payment for services', '1000', '9876543210', 'merchant1@example.com', '123 Main St'],
            ['Sample Merchant 2', 'MERCH002', 'hdfc', 'Sample Store 2', 'Product purchase', '2000', '9876543211', 'merchant2@example.com', '456 Market Rd']
        ];

        const csv = Papa.unparse(templateData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'bulk_qr_template.csv');
    };

    // Handle CSV Upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setErrors(['Please upload a valid CSV file']);
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const validationErrs = validateCSVData(results.data);
                if (validationErrs.length > 0) {
                    setValidationErrors(validationErrs);
                    return;
                }
                setCsvData(results.data);
                setErrors([]);
                setValidationErrors([]);
            },
            error: (error) => {
                setErrors([`Error parsing CSV: ${error.message}`]);
            }
        });
    };

    // Sanitize input to prevent XSS
    const sanitizeInput = (input) => {
        if (typeof input !== 'string') return input;
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '')
            .replace(/[<>\"']/g, (match) => {
                const replacements = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;'
                };
                return replacements[match];
            })
            .trim();
    };

    // Validate email with strict regex
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254 && !email.includes('..');
    };

    // Validate mobile number (Indian format)
    const validateMobile = (mobile) => {
        const cleaned = String(mobile).replace(/\D/g, '');
        return cleaned.length === 10 && ['6', '7', '8', '9'].includes(cleaned[0]);
    };

    // Validate merchant ID format
    const validateMerchantId = (merchantId) => {
        const merchantIdRegex = /^[A-Z0-9_]{3,20}$/;
        return merchantIdRegex.test(merchantId.toUpperCase());
    };

    // Validate amount
    const validateAmount = (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return false;
        if (numAmount < 0 || numAmount > 10000000) return false;
        const decimalPlaces = (String(amount).split('.')[1] || '').length;
        return decimalPlaces <= 2;
    };

    // Validate CSV Data with enhanced security
    const validateCSVData = (data) => {
        const errors = [];
        const requiredFields = ['merchant_name', 'merchant_id', 'reference_name'];
        
        data.forEach((row, index) => {
            // Check required fields
            requiredFields.forEach(field => {
                if (!row[field] || row[field].trim() === '') {
                    errors.push(`Row ${index + 1}: Missing required field '${field}'`);
                }
            });

            // Check for XSS attempts
            ['merchant_name', 'reference_name', 'description', 'address'].forEach(field => {
                if (row[field] && row[field] !== sanitizeInput(row[field])) {
                    errors.push(`Row ${index + 1}: Invalid characters in ${field} (possible XSS attempt)`);
                }
            });

            // Check for SQL injection patterns
            const sqlPatterns = /(\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC|UNION|SELECT)\b|--|;|\/\*|\*\/)/gi;
            Object.values(row).forEach(value => {
                if (value && typeof value === 'string' && sqlPatterns.test(value)) {
                    errors.push(`Row ${index + 1}: Suspicious SQL pattern detected`);
                }
            });

            // Validate merchant ID format
            if (row.merchant_id && !validateMerchantId(row.merchant_id)) {
                errors.push(`Row ${index + 1}: Invalid merchant ID format (use 3-20 uppercase alphanumeric characters)`);
            }

            // Validate email format if provided
            if (row.email && !validateEmail(row.email)) {
                errors.push(`Row ${index + 1}: Invalid email format`);
            }

            // Validate mobile number if provided
            if (row.mobile_number && !validateMobile(row.mobile_number)) {
                errors.push(`Row ${index + 1}: Invalid mobile number (must be 10 digits starting with 6-9)`);
            }

            // Validate amount if provided
            if (row.amount && !validateAmount(row.amount)) {
                errors.push(`Row ${index + 1}: Invalid amount (max 10000000, max 2 decimal places)`);
            }
        });

        // Check for duplicate merchant IDs
        const merchantIds = data.map(row => row.merchant_id ? row.merchant_id.toUpperCase() : '');
        const duplicates = merchantIds.filter((id, index) => id && merchantIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            errors.push(`Duplicate merchant IDs found: ${[...new Set(duplicates)].join(', ')}`);
        }

        return errors;
    };

    // Process Bulk QR Generation
    const processBulkGeneration = async () => {
        setProcessing(true);
        setProgress(0);
        setResults([]);
        setErrors([]);

        const totalItems = csvData.length;
        const generatedQRs = [];
        const failedItems = [];

        for (let i = 0; i < totalItems; i++) {
            const item = csvData[i];
            try {
                // Prepare QR data
                const qrData = {
                    merchant_name: item.merchant_name,
                    custom_identifier: item.merchant_id,
                    reference_name: item.reference_name,
                    description: item.description || 'Payment',
                    max_amount_per_transaction: item.amount || null,
                    mobile_number: item.mobile_number,
                    email: item.email,
                    address: item.address,
                    vpa_handle: item.vpa_handle || 'hdfc'
                };

                // Generate QR through Redux action
                const result = await dispatch(bulkCreateQR(qrData)).unwrap();
                
                generatedQRs.push({
                    ...item,
                    status: 'success',
                    qr_image: result.qr_image_url,
                    upi_string: result.upi_string,
                    vpa: result.full_vpa,
                    transaction_ref: result.transaction_ref
                });

            } catch (error) {
                failedItems.push({
                    ...item,
                    status: 'failed',
                    error: error.message || 'Generation failed'
                });
            }

            // Update progress
            setProgress(Math.round(((i + 1) / totalItems) * 100));
        }

        setResults([...generatedQRs, ...failedItems]);
        setProcessing(false);
    };

    // Download All QRs as ZIP
    const downloadAllQRs = async () => {
        const zip = new JSZip();
        const successfulQRs = results.filter(r => r.status === 'success');

        // Create QR Images folder
        const qrFolder = zip.folder('qr_codes');
        
        // Create CSV report
        const reportData = successfulQRs.map(qr => ({
            merchant_name: qr.merchant_name,
            merchant_id: qr.merchant_id,
            vpa: qr.vpa,
            upi_string: qr.upi_string,
            transaction_ref: qr.transaction_ref,
            status: qr.status
        }));
        
        const reportCSV = Papa.unparse(reportData);
        zip.file('qr_generation_report.csv', reportCSV);

        // Add QR images to zip
        for (const qr of successfulQRs) {
            if (qr.qr_image) {
                // Convert base64 to blob
                const base64Data = qr.qr_image.replace(/^data:image\/(png|jpg);base64,/, '');
                const fileName = `${qr.merchant_id}_${qr.merchant_name.replace(/[^a-z0-9]/gi, '_')}.png`;
                qrFolder.file(fileName, base64Data, { base64: true });
            }
        }

        // Generate and download zip
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `bulk_qr_codes_${new Date().toISOString().split('T')[0]}.zip`);
    };

    // Clear all data
    const clearAll = () => {
        setCsvData([]);
        setResults([]);
        setErrors([]);
        setValidationErrors([]);
        setProgress(0);
        setPreviewQR(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container-fluid bulk-qr-generator">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Bulk QR Code Generator</h2>
                </div>
            </div>

            {/* Upload Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Step 1: Upload CSV File</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="btn-group" role="group">
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={downloadTemplate}
                                >
                                    <i className="fa fa-download"></i> Download Template
                                </button>
                                <input
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={processing}
                                >
                                    <i className="fa fa-upload"></i> Upload CSV
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            {csvData.length > 0 && (
                                <div className="alert alert-success">
                                    <i className="fa fa-check-circle"></i> {csvData.length} records loaded successfully
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="alert alert-danger mt-3">
                            <strong>Validation Errors:</strong>
                            <ul className="mb-0 mt-2">
                                {validationErrors.slice(0, 5).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                                {validationErrors.length > 5 && (
                                    <li>... and {validationErrors.length - 5} more errors</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Process Section */}
            {csvData.length > 0 && validationErrors.length === 0 && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Step 2: Generate QR Codes</h5>
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={processBulkGeneration}
                                    disabled={processing}
                                >
                                    <i className="fa fa-qrcode"></i> Generate {csvData.length} QR Codes
                                </button>
                            </div>
                            <div className="col-md-9">
                                {processing && (
                                    <div>
                                        <div className="progress">
                                            <div 
                                                className="progress-bar progress-bar-striped progress-bar-animated" 
                                                role="progressbar" 
                                                style={{ width: `${progress}%` }}
                                            >
                                                {progress}%
                                            </div>
                                        </div>
                                        <small className="text-muted">Processing... {progress}%</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {results.length > 0 && (
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Generation Results</h5>
                            <div className="btn-group">
                                <button
                                    className="btn btn-success"
                                    onClick={downloadAllQRs}
                                    disabled={results.filter(r => r.status === 'success').length === 0}
                                >
                                    <i className="fa fa-download"></i> Download All QRs
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={clearAll}
                                >
                                    <i className="fa fa-trash"></i> Clear All
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Merchant Name</th>
                                        <th>Merchant ID</th>
                                        <th>Status</th>
                                        <th>VPA</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.merchant_name}</td>
                                            <td>{row.merchant_id}</td>
                                            <td>
                                                <span className={`badge badge-${row.status === 'success' ? 'success' : 'danger'}`}>
                                                    {row.status === 'success' ? (
                                                        <><i className="fa fa-check-circle"></i> Success</>
                                                    ) : (
                                                        <><i className="fa fa-times-circle"></i> Failed</>
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                {row.status === 'success' ? row.vpa : row.error}
                                            </td>
                                            <td>
                                                {row.status === 'success' && (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => setPreviewQR(row)}
                                                        data-toggle="modal"
                                                        data-target="#qrPreviewModal"
                                                    >
                                                        <i className="fa fa-eye"></i> Preview
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Preview Modal */}
            <div className="modal fade" id="qrPreviewModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">QR Code Preview</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-center">
                            {previewQR && (
                                <>
                                    <img 
                                        src={previewQR.qr_image} 
                                        alt="QR Code" 
                                        style={{ maxWidth: '300px', width: '100%' }}
                                    />
                                    <h6 className="mt-3">{previewQR.merchant_name}</h6>
                                    <p className="text-muted">VPA: {previewQR.vpa}</p>
                                    <div className="form-group">
                                        <label>UPI String:</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={previewQR.upi_string}
                                            readOnly
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkQRGenerator;