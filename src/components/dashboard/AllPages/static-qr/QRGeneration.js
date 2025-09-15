import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createQR, uploadLogo, fetchDesignTemplates, validateQRIdentifier } from '../../../../slices/sabqr/sabqrSlice';
import QRDesignCustomizer from './components/QRDesignCustomizer';
import QRPreviewModal from './components/QRPreviewModal';
import toastConfig from '../../../../utilities/toastTypes';
import staticQrClasses from './staticqr.module.css';

const validationSchema = Yup.object().shape({
    reference_name: Yup.string()
        .required('Reference name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name too long'),
    description: Yup.string()
        .max(500, 'Description too long'),
    category: Yup.string()
        .required('Category is required'),
    max_amount_per_transaction: Yup.number()
        .when('amount_type', {
            is: 'fixed',
            then: Yup.number()
                .required('Amount is required for fixed QR')
                .positive('Amount must be positive')
                .max(1000000, 'Amount cannot exceed 10,00,000')
        }),
    customer_fields: Yup.array(),
    notes: Yup.string()
        .max(500, 'Notes too long')
});

const QRGeneration = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth) || {};
    const { loading, uploadedLogo, designTemplates, identifierValidation } = useSelector((state) => state.sabqr);
    
    const [qrData, setQrData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showDesignCustomizer, setShowDesignCustomizer] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('professional');
    const [amountType, setAmountType] = useState('dynamic');
    const [customIdentifier, setCustomIdentifier] = useState('');
    const [designConfig, setDesignConfig] = useState({
        template: 'professional',
        logo_url: null,
        brand_color: '#007bff',
        include_instructions: true,
        logo_position: 'center'
    });
    
    // Get merchant details
    const merchantName = user?.clientMerchantDetailsList?.[0]?.merchantName || 'Test Merchant';
    
    useEffect(() => {
        // Load design templates
        dispatch(fetchDesignTemplates());
    }, [dispatch]);

    const handleGenerateQR = async (values) => {
        try {
            // Prepare QR data with design config
            const qrPayload = {
                reference_name: values.reference_name,
                description: values.description,
                category: values.category,
                max_amount_per_transaction: amountType === 'fixed' ? values.max_amount_per_transaction : null,
                design_config: {
                    ...designConfig,
                    logo_url: uploadedLogo?.logo_url || designConfig.logo_url
                },
                customer_info: {
                    required_fields: values.customer_fields || [],
                    optional_fields: []
                },
                notes: values.notes,
                custom_identifier: customIdentifier || null
            };
            
            // Create QR through Redux
            const result = await dispatch(createQR(qrPayload)).unwrap();
            
            // Set QR data for preview
            setQrData(result.data);
            setShowPreview(true);
            
        } catch (error) {
            console.error('Error generating QR:', error);
        }
    };
    
    const handleLogoUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toastConfig.errorToast('Logo size should be less than 2MB');
                return;
            }
            
            const formData = new FormData();
            formData.append('logo', file);
            dispatch(uploadLogo(formData));
        }
    };
    
    const handleIdentifierValidation = async (identifier) => {
        if (identifier.length === 5) {
            dispatch(validateQRIdentifier(identifier));
        }
    };
    
    const categories = [
        { value: 'retail', label: 'Retail Store' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'service', label: 'Service' },
        { value: 'donation', label: 'Donation' },
        { value: 'billing', label: 'Billing Counter' },
        { value: 'other', label: 'Other' }
    ];
    
    const customerFields = [
        { value: 'mobile', label: 'Mobile Number' },
        { value: 'email', label: 'Email Address' },
        { value: 'name', label: 'Customer Name' },
        { value: 'address', label: 'Address' }
    ];

    const resetForm = () => {
        setQrData(null);
        setShowPreview(false);
        setCustomIdentifier('');
        setAmountType('dynamic');
        setDesignConfig({
            template: 'professional',
            logo_url: null,
            brand_color: '#007bff',
            include_instructions: true,
            logo_position: 'center'
        });
    };

    return (
        <div className={`card ${staticQrClasses.form_card}`}>
            <div className="card-body p-4">
                <div className="row">
                    {/* Form Section */}
                    <div className="col-md-6">
                        <h4 className={staticQrClasses.section_title}>Generate Professional QR Code</h4>
                        
                        {/* Amount Type Selection */}
                        <div className="mb-4">
                            <label className="d-block mb-3 font-weight-bold">Payment Type</label>
                            <div className="btn-group w-100" role="group">
                                <button
                                    type="button"
                                    className={`btn ${amountType === 'dynamic' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setAmountType('dynamic')}
                                >
                                    <i className="fa fa-infinity mr-2"></i>
                                    Dynamic Amount
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${amountType === 'fixed' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setAmountType('fixed')}
                                >
                                    <i className="fa fa-lock mr-2"></i>
                                    Fixed Amount
                                </button>
                            </div>
                            <small className="text-muted d-block mt-2">
                                {qrType === 'dynamic' 
                                    ? 'Customer can enter any amount during payment' 
                                    : 'Customer will pay a fixed predefined amount'}
                            </small>
                        </div>

                        <Formik
                            initialValues={{
                                merchantName: merchantName,
                                amount: '',
                                description: '',
                                bankName: 'HDFC'
                            }}
                            validationSchema={validationSchema}
                            onSubmit={generateQR}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="form-group">
                                        <label className="font-weight-500">Merchant Name *</label>
                                        <Field
                                            name="merchantName"
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Enter merchant name"
                                        />
                                        <ErrorMessage name="merchantName" component="div" className="text-danger mt-1 small" />
                                    </div>

                                    {qrType === 'fixed' && (
                                        <div className="form-group">
                                            <label className="font-weight-500">Amount (₹) *</label>
                                            <Field
                                                name="amount"
                                                type="number"
                                                className="form-control form-control-lg"
                                                placeholder="Enter fixed amount"
                                            />
                                            <ErrorMessage name="amount" component="div" className="text-danger mt-1 small" />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="font-weight-500">Description (Optional)</label>
                                        <Field
                                            name="description"
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Payment description"
                                        />
                                        <ErrorMessage name="description" component="div" className="text-danger mt-1 small" />
                                    </div>

                                    <div className="form-group">
                                        <label className="font-weight-500">Bank</label>
                                        <Field as="select" name="bankName" className="form-control form-control-lg">
                                            <option value="HDFC">HDFC Bank</option>
                                            <option value="ICICI">ICICI Bank</option>
                                            <option value="AIRTEL">Airtel Payments Bank</option>
                                        </Field>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block"
                                        disabled={isSubmitting || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-qrcode mr-2"></i>
                                                Generate QR Code
                                            </>
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* QR Display Section */}
                    <div className="col-md-6">
                        <h4 className={`${staticQrClasses.section_title} text-center`}>QR Code Preview</h4>
                        
                        {qrData ? (
                            <div>
                                <div className={staticQrClasses.qr_preview_container}>
                                    <img
                                        src={qrImage}
                                        alt="QR Code"
                                        className={staticQrClasses.qr_image}
                                    />
                                </div>

                                <div className="mt-3 p-3 bg-light rounded">
                                    <p className="mb-2"><strong>QR ID:</strong> {qrData.qrId}</p>
                                    <p className="mb-2"><strong>Type:</strong> {qrType === 'fixed' ? 'Fixed Amount' : 'Dynamic Amount'}</p>
                                    {qrType === 'fixed' && qrData.amount && (
                                        <p className="mb-2"><strong>Amount:</strong> ₹{qrData.amount}</p>
                                    )}
                                </div>

                                <div className="btn-group w-100 mt-3">
                                    <button
                                        className="btn btn-success btn-lg"
                                        onClick={downloadQR}
                                    >
                                        <i className="fa fa-download mr-2"></i>
                                        Download
                                    </button>
                                    <button
                                        className="btn btn-info btn-lg"
                                        onClick={printQR}
                                    >
                                        <i className="fa fa-print mr-2"></i>
                                        Print
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={staticQrClasses.qr_preview_container}>
                                <i className={`fa fa-qrcode ${staticQrClasses.empty_state_icon}`}></i>
                                <p className="mt-3 text-muted">QR code will appear here after generation</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRGeneration;