import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid
} from '@mui/material';
import {
    CloudUpload,
    Download,
    Delete,
    Visibility,
    QrCode,
    CheckCircle,
    Error,
    Warning,
    GetApp
} from '@mui/icons-material';
import { bulkCreateQR } from '../../slices/sabqr/sabqrSlice';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const BulkQRGenerator = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [csvData, setCsvData] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedQR, setSelectedQR] = useState(null);
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

    // Validate CSV Data
    const validateCSVData = (data) => {
        const errors = [];
        const requiredFields = ['merchant_name', 'merchant_id', 'reference_name'];
        
        data.forEach((row, index) => {
            requiredFields.forEach(field => {
                if (!row[field] || row[field].trim() === '') {
                    errors.push(`Row ${index + 1}: Missing required field '${field}'`);
                }
            });

            // Validate email format if provided
            if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
                errors.push(`Row ${index + 1}: Invalid email format`);
            }

            // Validate mobile number if provided
            if (row.mobile_number && !/^\d{10}$/.test(row.mobile_number.replace(/\D/g, ''))) {
                errors.push(`Row ${index + 1}: Invalid mobile number (must be 10 digits)`);
            }

            // Validate amount if provided
            if (row.amount && isNaN(parseFloat(row.amount))) {
                errors.push(`Row ${index + 1}: Invalid amount format`);
            }
        });

        // Check for duplicate merchant IDs
        const merchantIds = data.map(row => row.merchant_id);
        const duplicates = merchantIds.filter((id, index) => merchantIds.indexOf(id) !== index);
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

    // Preview QR Code
    const handlePreview = (qr) => {
        setSelectedQR(qr);
        setPreviewOpen(true);
    };

    // Clear all data
    const clearAll = () => {
        setCsvData([]);
        setResults([]);
        setErrors([]);
        setValidationErrors([]);
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Bulk QR Code Generator
            </Typography>

            {/* Upload Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Step 1: Upload CSV File
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Download />}
                                    onClick={downloadTemplate}
                                >
                                    Download Template
                                </Button>
                                <input
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<CloudUpload />}
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={processing}
                                >
                                    Upload CSV
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {csvData.length > 0 && (
                                <Alert severity="success">
                                    {csvData.length} records loaded successfully
                                </Alert>
                            )}
                        </Grid>
                    </Grid>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Validation Errors:</Typography>
                            <ul style={{ marginTop: 8, marginBottom: 0 }}>
                                {validationErrors.slice(0, 5).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                                {validationErrors.length > 5 && (
                                    <li>... and {validationErrors.length - 5} more errors</li>
                                )}
                            </ul>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Process Section */}
            {csvData.length > 0 && validationErrors.length === 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Step 2: Generate QR Codes
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<QrCode />}
                                onClick={processBulkGeneration}
                                disabled={processing}
                                size="large"
                            >
                                Generate {csvData.length} QR Codes
                            </Button>
                            {processing && (
                                <Box sx={{ flex: 1, ml: 2 }}>
                                    <LinearProgress variant="determinate" value={progress} />
                                    <Typography variant="caption">
                                        Processing... {progress}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Results Section */}
            {results.length > 0 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                                Generation Results
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<GetApp />}
                                    onClick={downloadAllQRs}
                                    disabled={results.filter(r => r.status === 'success').length === 0}
                                >
                                    Download All QRs
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={clearAll}
                                >
                                    Clear All
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Merchant Name</TableCell>
                                        <TableCell>Merchant ID</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>VPA</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.merchant_name}</TableCell>
                                            <TableCell>{row.merchant_id}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    color={row.status === 'success' ? 'success' : 'error'}
                                                    size="small"
                                                    icon={row.status === 'success' ? <CheckCircle /> : <Error />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {row.status === 'success' ? row.vpa : row.error}
                                            </TableCell>
                                            <TableCell>
                                                {row.status === 'success' && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handlePreview(row)}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* QR Preview Dialog */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>QR Code Preview</DialogTitle>
                <DialogContent>
                    {selectedQR && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img 
                                src={selectedQR.qr_image} 
                                alt="QR Code" 
                                style={{ maxWidth: '300px', width: '100%' }}
                            />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                {selectedQR.merchant_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                VPA: {selectedQR.vpa}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={selectedQR.upi_string}
                                sx={{ mt: 2 }}
                                InputProps={{ readOnly: true }}
                                label="UPI String"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BulkQRGenerator;