import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { 
    createQR, 
    uploadLogo, 
    fetchDesignTemplates, 
    validateQRIdentifier,
    clearUploadedLogo 
} from '../../../../slices/sabqr/sabqrSlice';
import QRDesignCustomizer from './components/QRDesignCustomizer';
import QRPreviewModal from './components/QRPreviewModal';
import toastConfig from '../../../../utilities/toastTypes';
import staticQrClasses from './staticqr.module.css';

const validationSchema = Yup.object().shape({
    qr_identifier: Yup.string()
        .required('QR Identifier is required - this creates your unique VPA')
        .matches(/^[A-Z0-9]{5}$/, 'Must be exactly 5 characters using A-Z and 0-9 only')
        .uppercase(),
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
    notes: Yup.string()
        .max(500, 'Notes too long')
});

const QRGenerationEnhanced = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth) || {};
    const { loading, uploadedLogo, designTemplates, identifierValidation = {} } = useSelector((state) => state.sabqr) || {};
    
    // State management
    const [qrData, setQrData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showDesignCustomizer, setShowDesignCustomizer] = useState(false);
    const [amountType, setAmountType] = useState('dynamic');
    const [customIdentifier, setCustomIdentifier] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedCustomerFields, setSelectedCustomerFields] = useState([]);
    const [designConfig, setDesignConfig] = useState({
        template: 'professional',
        logo_url: null,
        brand_color: '#007bff',
        secondary_color: '#6c757d',
        include_instructions: true,
        logo_position: 'center',
        show_merchant_name: true,
        show_amount: true
    });
    
    // Get merchant details
    const merchantName = user?.clientMerchantDetailsList?.[0]?.merchantName || 'Merchant';
    
    useEffect(() => {
        dispatch(fetchDesignTemplates());
        return () => {
            dispatch(clearUploadedLogo());
        };
    }, [dispatch]);

    // Categories for QR codes
    const categories = [
        { value: 'retail', label: 'Retail Store', icon: 'fa-store' },
        { value: 'restaurant', label: 'Restaurant', icon: 'fa-utensils' },
        { value: 'service', label: 'Service', icon: 'fa-concierge-bell' },
        { value: 'donation', label: 'Donation', icon: 'fa-hand-holding-heart' },
        { value: 'billing', label: 'Billing Counter', icon: 'fa-cash-register' },
        { value: 'parking', label: 'Parking', icon: 'fa-parking' },
        { value: 'education', label: 'Education', icon: 'fa-graduation-cap' },
        { value: 'healthcare', label: 'Healthcare', icon: 'fa-heartbeat' },
        { value: 'other', label: 'Other', icon: 'fa-qrcode' }
    ];

    // Customer information fields
    const customerFields = [
        { value: 'mobile', label: 'Mobile Number', icon: 'fa-phone' },
        { value: 'email', label: 'Email Address', icon: 'fa-envelope' },
        { value: 'name', label: 'Customer Name', icon: 'fa-user' },
        { value: 'invoice', label: 'Invoice Number', icon: 'fa-file-invoice' },
        { value: 'address', label: 'Address', icon: 'fa-map-marker-alt' }
    ];

    // Handle QR generation
    const handleGenerateQR = async (values, { setSubmitting, resetForm }) => {
        try {
            // Check if identifier is available before submitting
            if (identifierValidation && identifierValidation.available === false) {
                toastConfig.errorToast(`QR identifier "${customIdentifier}" is already in use. Please choose another.`);
                setSubmitting(false);
                return;
            }
            
            const qrPayload = {
                qr_identifier: values.qr_identifier || customIdentifier, // Use the form value
                reference_name: values.reference_name,
                description: values.description,
                category: values.category,
                max_amount_per_transaction: amountType === 'fixed' ? values.max_amount_per_transaction : null,
                design_config: {
                    ...designConfig,
                    logo_url: uploadedLogo?.logo_url || designConfig.logo_url
                },
                customer_info: {
                    required_fields: selectedCustomerFields,
                    optional_fields: []
                },
                notes: values.notes,
                custom_identifier: values.qr_identifier || customIdentifier // Pass the identifier
            };
            
            const result = await dispatch(createQR(qrPayload)).unwrap();
            
            setQrData(result.data);
            setShowPreview(true);
            resetForm();
            setAmountType('dynamic');
            setCustomIdentifier('');
            setSelectedCustomerFields([]);
            
        } catch (error) {
            console.error('Error generating QR:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle logo upload
    const handleLogoUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toastConfig.errorToast('Logo size should be less than 2MB');
                return;
            }
            
            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                toastConfig.errorToast('Only PNG and JPEG formats are allowed');
                return;
            }
            
            const formData = new FormData();
            formData.append('logo', file);
            dispatch(uploadLogo(formData));
        }
    };

    // Validate custom identifier
    const handleIdentifierValidation = (identifier) => {
        const uppercaseId = identifier.toUpperCase().replace(/[^A-Z0-9]/g, '');
        setCustomIdentifier(uppercaseId);
        
        if (uppercaseId.length === 5) {
            dispatch(validateQRIdentifier(uppercaseId));
        }
    };

    // Toggle customer field selection
    const toggleCustomerField = (field) => {
        setSelectedCustomerFields(prev => 
            prev.includes(field) 
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    return (
        <div className={`card ${staticQrClasses.form_card}`}>
            <div className="card-body p-4">
                <div className="row">
                    {/* Form Section */}
                    <div className="col-lg-7">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className={staticQrClasses.section_title}>
                                <i className="fa fa-magic mr-2"></i>
                                Generate Professional QR Code
                            </h4>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowDesignCustomizer(true)}
                            >
                                <i className="fa fa-palette mr-2"></i>
                                Customize Design
                            </button>
                        </div>

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
                                {amountType === 'dynamic' 
                                    ? 'Customer can enter any amount during payment' 
                                    : 'Customer will pay a fixed predefined amount'}
                            </small>
                        </div>

                        <Formik
                            initialValues={{
                                qr_identifier: '',
                                reference_name: '',
                                description: '',
                                category: '',
                                max_amount_per_transaction: '',
                                notes: '',
                                amount_type: amountType
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleGenerateQR}
                            enableReinitialize={true}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form>
                                    {/* QR Identifier - MOST IMPORTANT FIELD */}
                                    <div className="form-group">
                                        <label className="font-weight-bold">
                                            Unique QR Identifier <span className="text-danger">*</span>
                                            <small className="text-muted ml-2">(This creates your unique VPA)</small>
                                        </label>
                                        <div className="input-group input-group-lg">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-primary text-white">sabpaisa.</span>
                                            </div>
                                            <input
                                                type="text"
                                                className={`form-control ${
                                                    identifierValidation?.available === false ? 'is-invalid' : 
                                                    identifierValidation?.available === true ? 'is-valid' : ''
                                                }`}
                                                placeholder="Enter 5 characters (A-Z, 0-9)"
                                                maxLength="5"
                                                value={customIdentifier}
                                                onChange={(e) => {
                                                    handleIdentifierValidation(e.target.value);
                                                    setFieldValue('qr_identifier', e.target.value);
                                                }}
                                                required
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text bg-primary text-white">@okhdfcbank</span>
                                            </div>
                                        </div>
                                        {customIdentifier && customIdentifier.length === 5 && identifierValidation?.available === true && (
                                            <small className="text-success d-block mt-2">
                                                <i className="fa fa-check-circle mr-1"></i>
                                                Your VPA will be: <strong>sabpaisa.{customIdentifier}@okhdfcbank</strong>
                                            </small>
                                        )}
                                        {customIdentifier && customIdentifier.length === 5 && identifierValidation?.available === false && (
                                            <div className="mt-2">
                                                <small className="text-danger">
                                                    <i className="fa fa-times-circle mr-1"></i>
                                                    This identifier "{customIdentifier}" is already taken. Please try another.
                                                </small>
                                            </div>
                                        )}
                                        {customIdentifier && customIdentifier.length < 5 && (
                                            <small className="text-muted d-block mt-2">
                                                Enter {5 - customIdentifier.length} more character{5 - customIdentifier.length !== 1 ? 's' : ''}
                                            </small>
                                        )}
                                    </div>

                                    {/* Reference Name */}
                                    <div className="form-group">
                                        <label className="font-weight-bold">
                                            Reference Name <span className="text-danger">*</span>
                                        </label>
                                        <Field
                                            name="reference_name"
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="e.g., Store Counter 1, Billing Desk"
                                        />
                                        <ErrorMessage name="reference_name" component="div" className="text-danger mt-1 small" />
                                    </div>

                                    {/* Category Selection */}
                                    <div className="form-group">
                                        <label className="font-weight-bold">
                                            Category <span className="text-danger">*</span>
                                        </label>
                                        <Field as="select" name="category" className="form-control form-control-lg">
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="category" component="div" className="text-danger mt-1 small" />
                                    </div>

                                    {/* Fixed Amount (conditional) */}
                                    {amountType === 'fixed' && (
                                        <div className="form-group">
                                            <label className="font-weight-bold">
                                                Fixed Amount (₹) <span className="text-danger">*</span>
                                            </label>
                                            <Field
                                                name="max_amount_per_transaction"
                                                type="number"
                                                className="form-control form-control-lg"
                                                placeholder="Enter fixed amount"
                                            />
                                            <ErrorMessage name="max_amount_per_transaction" component="div" className="text-danger mt-1 small" />
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="form-group">
                                        <label className="font-weight-bold">Description</label>
                                        <Field
                                            as="textarea"
                                            name="description"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Additional information about this QR code"
                                        />
                                        <ErrorMessage name="description" component="div" className="text-danger mt-1 small" />
                                    </div>

                                    {/* Advanced Options Toggle */}
                                    <div className="mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-link p-0"
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                        >
                                            <i className={`fa fa-chevron-${showAdvanced ? 'up' : 'down'} mr-2`}></i>
                                            Advanced Options
                                        </button>
                                    </div>

                                    {/* Advanced Options */}
                                    {showAdvanced && (
                                        <div className={staticQrClasses.advanced_options}>

                                            {/* Customer Fields */}
                                            <div className="form-group">
                                                <label className="font-weight-bold">
                                                    Collect Customer Information
                                                </label>
                                                <div className="d-flex flex-wrap">
                                                    {customerFields.map(field => (
                                                        <button
                                                            key={field.value}
                                                            type="button"
                                                            className={`btn btn-sm m-1 ${
                                                                selectedCustomerFields.includes(field.value)
                                                                    ? 'btn-primary'
                                                                    : 'btn-outline-primary'
                                                            }`}
                                                            onClick={() => toggleCustomerField(field.value)}
                                                        >
                                                            <i className={`fa ${field.icon} mr-1`}></i>
                                                            {field.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Logo Upload */}
                                            <div className="form-group">
                                                <label className="font-weight-bold">Business Logo</label>
                                                <div className="custom-file">
                                                    <input
                                                        type="file"
                                                        className="custom-file-input"
                                                        id="logoUpload"
                                                        accept="image/png,image/jpeg,image/jpg"
                                                        onChange={handleLogoUpload}
                                                    />
                                                    <label className="custom-file-label" htmlFor="logoUpload">
                                                        {uploadedLogo ? 'Logo uploaded' : 'Choose logo file'}
                                                    </label>
                                                </div>
                                                {uploadedLogo && (
                                                    <div className="mt-2">
                                                        <img 
                                                            src={uploadedLogo.thumbnail_url || uploadedLogo.logo_url} 
                                                            alt="Logo" 
                                                            className="img-thumbnail"
                                                            style={{ maxHeight: '60px' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-link text-danger"
                                                            onClick={() => dispatch(clearUploadedLogo())}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            <div className="form-group">
                                                <label className="font-weight-bold">Internal Notes</label>
                                                <Field
                                                    as="textarea"
                                                    name="notes"
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Notes for internal reference (not visible to customers)"
                                                />
                                                <ErrorMessage name="notes" component="div" className="text-danger mt-1 small" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg btn-block"
                                        disabled={isSubmitting || loading.create || (customIdentifier.length === 5 && identifierValidation?.available === false)}
                                    >
                                        {loading.create ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                                Generating QR Code...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-magic mr-2"></i>
                                                Generate QR Code
                                            </>
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Preview Section */}
                    <div className="col-lg-5">
                        <div className={staticQrClasses.preview_section}>
                            <h4 className={`${staticQrClasses.section_title} text-center mb-4`}>
                                <i className="fa fa-eye mr-2"></i>
                                Live Preview
                            </h4>
                            
                            <div className={staticQrClasses.qr_preview_card}>
                                <div className={staticQrClasses.qr_preview_header}>
                                    <img 
                                        src={uploadedLogo?.logo_url || '/images/default-logo.png'} 
                                        alt="Logo"
                                        className={staticQrClasses.preview_logo}
                                    />
                                    <h5>{merchantName}</h5>
                                </div>
                                
                                <div className={staticQrClasses.qr_preview_body}>
                                    <div className={staticQrClasses.qr_placeholder}>
                                        <i className="fa fa-qrcode fa-5x text-muted"></i>
                                        <p className="mt-3 text-muted">
                                            Your QR code will appear here
                                        </p>
                                    </div>
                                    
                                    {amountType === 'fixed' && (
                                        <div className={staticQrClasses.amount_display}>
                                            <span>Amount: ₹0</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className={staticQrClasses.qr_preview_footer}>
                                    <small className="text-muted">Scan to pay with any UPI app</small>
                                    <div className={staticQrClasses.upi_apps}>
                                        <img src="/images/upi-apps.png" alt="UPI Apps" />
                                    </div>
                                </div>
                            </div>

                            {/* Design Templates */}
                            <div className="mt-4">
                                <h6 className="font-weight-bold mb-3">Quick Templates</h6>
                                <div className="row">
                                    {['professional', 'minimal', 'branded', 'classic'].map(template => (
                                        <div key={template} className="col-6 mb-2">
                                            <button
                                                type="button"
                                                className={`btn btn-sm btn-block ${
                                                    designConfig.template === template 
                                                        ? 'btn-primary' 
                                                        : 'btn-outline-secondary'
                                                }`}
                                                onClick={() => setDesignConfig({...designConfig, template})}
                                            >
                                                {template.charAt(0).toUpperCase() + template.slice(1)}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showPreview && qrData && (
                <QRPreviewModal
                    show={showPreview}
                    onClose={() => setShowPreview(false)}
                    qrData={qrData}
                    designConfig={designConfig}
                />
            )}

            {showDesignCustomizer && (
                <QRDesignCustomizer
                    show={showDesignCustomizer}
                    onClose={() => setShowDesignCustomizer(false)}
                    designConfig={designConfig}
                    onSave={setDesignConfig}
                />
            )}
        </div>
    );
};

export default QRGenerationEnhanced;