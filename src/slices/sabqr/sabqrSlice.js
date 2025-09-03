import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sabQRService from '../../services/sabqr/sabqr.service';
import { setMessage } from '../message';
import toastConfig from '../../utilities/toastTypes';
import HDFC_CONFIG from '../../config/hdfc.config';
import VPAGenerator from '../../utilities/vpaGenerator';

// ============================================
// LocalStorage Helper Functions
// ============================================
const STORAGE_KEY = 'sabqr_data';
const TRANSACTIONS_KEY = 'sabqr_transactions';

const loadFromLocalStorage = () => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
        return {
            qrData: savedData ? JSON.parse(savedData) : null,
            transactions: savedTransactions ? JSON.parse(savedTransactions) : []
        };
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return { qrData: null, transactions: [] };
    }
};

const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// ============================================
// Async Thunks
// ============================================

// Create QR Code with HDFC Integration
export const createQR = createAsyncThunk(
    'sabqr/create',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            // For now, use direct QR generation until backend is ready
            const QRCode = await import('qrcode');
            
            // Generate unique identifier - MANDATORY for dynamic VPA
            // Keep original for display, but convert to lowercase for VPA
            const originalIdentifier = data.custom_identifier || data.qr_identifier || sabQRService.generateUniqueIdentifier();
            const identifier = originalIdentifier.toLowerCase(); // VPA requires lowercase
            
            // Get merchant information (from data or use defaults)
            const merchantName = data.merchant_name || data.reference_name || 'SRS Live Technologies';
            const merchantId = HDFC_CONFIG.MERCHANT_ID || 'HDFC000010380443';
            
            console.log('Merchant name being used:', merchantName);
            console.log('Data received:', data);
            
            // Check if QR with this identifier already exists
            const { sabqr } = getState();
            const existingQR = sabqr.qrList.find(qr => qr.qr_identifier === identifier);
            
            if (existingQR) {
                const errorMessage = `A QR code with identifier "${identifier}" already exists. Please use a different identifier.`;
                toastConfig.errorToast(errorMessage);
                return rejectWithValue(errorMessage);
            }
            
            // Generate shorter timestamp for transaction reference (last 6 digits)
            const timestamp = Date.now().toString().slice(-6);
            const transactionRef = `STQ${identifier.toUpperCase()}${timestamp}`; // STQ prefix + uppercase identifier + 6 digit timestamp
            
            // Generate DYNAMIC VPA with merchant-specific prefix to ensure uniqueness
            // This prevents VPA collisions between different merchants
            const dynamicVPA = VPAGenerator.generateUniqueVPA({
                identifier: identifier,
                merchantName: merchantName,
                merchantId: merchantId,
                strategy: 'prefix' // Use prefix strategy for better readability
            });
            
            console.log('Generated VPA with merchant prefix:', {
                merchantName,
                identifier,
                generatedVPA: dynamicVPA,
                merchantPrefix: VPAGenerator.generateMerchantPrefix(merchantName)
            });
            
            // Generate UPI string as per HDFC UAT requirements
            // Critical: Order matters for HDFC processing
            const upiString = [
                'upi://pay?',
                `pa=${dynamicVPA}`, // Dynamic VPA first
                `&pn=${encodeURIComponent(data.reference_name || 'SRS Live Technologies')}`, // Payee name
                `&tn=${encodeURIComponent(data.description || 'TestQR')}`, // Transaction note
                '&cu=INR', // Currency
                '&mc=6012', // MCC 6012 for UAT as per HDFC
                `&tr=${transactionRef}`, // Transaction reference with STQ prefix
                '&mode=01', // Static QR mode (01 not 01S)
                '&qrMedium=06', // QR medium
                data.max_amount_per_transaction && data.max_amount_per_transaction > 0 ? `&am=${data.max_amount_per_transaction}` : ''
            ].filter(Boolean).join('');
            
            console.log('Generated HDFC UAT QR String:', upiString);
            
            // Generate QR code image
            const qrImageData = await QRCode.toDataURL(upiString, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            // Create QR data object
            const qrData = {
                ...data,
                id: Date.now(),
                qr_identifier: identifier,
                full_vpa: dynamicVPA, // Use the dynamic VPA with identifier
                qr_image_url: qrImageData,
                upi_string: upiString,
                transaction_ref: transactionRef,
                status: 'active',
                created_at: new Date().toISOString(),
                total_collections: 0,
                transaction_count: 0
            };
            
            // Success notification
            toastConfig.successToast('QR Code created successfully!');
            
            // Don't dispatch addQRToList here - it's handled in the fulfilled case
            // This was causing duplicates
            
            return { data: qrData };
        } catch (error) {
            const message = error.message || 'Failed to create QR code';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch QR List with filters
export const fetchQRList = createAsyncThunk(
    'sabqr/fetchList',
    async (params = {}, { rejectWithValue, dispatch, getState }) => {
        try {
            const { sabqr } = getState();
            const combinedParams = {
                ...params,
                page: params.page || sabqr.pagination.page,
                limit: params.limit || sabqr.pagination.pageSize,
                ...sabqr.filters
            };
            
            const response = await sabQRService.getQRList(combinedParams);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch QR codes';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Fetch QR Details
export const fetchQRDetails = createAsyncThunk(
    'sabqr/fetchDetails',
    async (qrId, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.getQRDetails(qrId);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch QR details';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update QR Code
export const updateQR = createAsyncThunk(
    'sabqr/update',
    async ({ qrId, data }, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.updateQR(qrId, data);
            toastConfig.successToast('QR Code updated successfully!');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update QR code';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete QR Code
export const deleteQR = createAsyncThunk(
    'sabqr/delete',
    async (qrId, { rejectWithValue, dispatch }) => {
        try {
            await sabQRService.deleteQR(qrId);
            toastConfig.successToast('QR Code deleted successfully!');
            return qrId;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete QR code';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Toggle QR Status
export const toggleQRStatus = createAsyncThunk(
    'sabqr/toggleStatus',
    async ({ qrId, status }, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.toggleQRStatus(qrId, status);
            const statusText = status === 'active' ? 'activated' : 'deactivated';
            toastConfig.successToast(`QR Code ${statusText} successfully!`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update QR status';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Bulk Create QR Codes
export const bulkCreateQR = createAsyncThunk(
    'sabqr/bulkCreate',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            // Use the same logic as single QR creation but optimized for bulk
            const QRCode = await import('qrcode');
            
            // Generate unique identifier
            const originalIdentifier = data.custom_identifier || data.qr_identifier || sabQRService.generateUniqueIdentifier();
            const identifier = originalIdentifier.toLowerCase();
            
            // Get merchant information
            const merchantName = data.merchant_name || data.reference_name || 'SRS Live Technologies';
            const merchantId = HDFC_CONFIG.MERCHANT_ID || 'HDFC000010380443';
            
            // Check for existing QR
            const { sabqr } = getState();
            const existingQR = sabqr.qrList.find(qr => qr.qr_identifier === identifier);
            
            if (existingQR) {
                const errorMessage = `QR with identifier "${identifier}" already exists`;
                return rejectWithValue(errorMessage);
            }
            
            // Generate timestamp and transaction reference
            const timestamp = Date.now().toString().slice(-6);
            const transactionRef = `STQ${identifier.toUpperCase()}${timestamp}`;
            
            // Generate DYNAMIC VPA
            const dynamicVPA = VPAGenerator.generateUniqueVPA({
                identifier: identifier,
                merchantName: merchantName,
                merchantId: merchantId,
                strategy: 'prefix'
            });
            
            // Generate UPI string
            const upiString = [
                'upi://pay?',
                `pa=${dynamicVPA}`,
                `&pn=${encodeURIComponent(data.reference_name || 'SRS Live Technologies')}`,
                `&tn=${encodeURIComponent(data.description || 'TestQR')}`,
                '&cu=INR',
                '&mc=6012',
                `&tr=${transactionRef}`,
                '&mode=01',
                data.max_amount_per_transaction ? `&am=${data.max_amount_per_transaction}` : ''
            ].filter(Boolean).join('');
            
            // Generate QR Code
            const qrOptions = {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                width: 300,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            };
            
            const qrImageData = await QRCode.toDataURL(upiString, qrOptions);
            
            // Prepare response data
            const qrData = {
                id: Date.now(),
                qr_identifier: identifier,
                merchant_name: merchantName,
                reference_name: data.reference_name || 'SRS Live Technologies',
                description: data.description || 'TestQR',
                max_amount_per_transaction: data.max_amount_per_transaction || null,
                min_amount_per_transaction: data.min_amount_per_transaction || null,
                qr_image_url: qrImageData,
                full_vpa: dynamicVPA,
                upi_string: upiString,
                transaction_ref: transactionRef,
                status: 'active',
                created_at: new Date().toISOString(),
                mobile_number: data.mobile_number,
                email: data.email,
                address: data.address
            };
            
            // Save to localStorage for persistence
            saveToLocalStorage(STORAGE_KEY, qrData);
            
            return qrData;
        } catch (error) {
            const message = error.message || 'Failed to create QR code in bulk';
            return rejectWithValue(message);
        }
    }
);

// Validate QR Identifier
export const validateQRIdentifier = createAsyncThunk(
    'sabqr/validateIdentifier',
    async (identifier, { rejectWithValue, dispatch, getState }) => {
        try {
            // First check locally in Redux store
            const { sabqr } = getState();
            const existingQR = sabqr.qrList.find(qr => 
                qr.qr_identifier?.toUpperCase() === identifier.toUpperCase()
            );
            
            if (existingQR) {
                const result = {
                    identifier,
                    available: false,
                    message: 'This identifier is already in use'
                };
                dispatch(setIdentifierValidation(result));
                return result;
            }
            
            // If not found locally, check with API (when backend is ready)
            try {
                const response = await sabQRService.validateQRIdentifier(identifier);
                return response.data;
            } catch {
                // If API fails, assume available (for now)
                const result = {
                    identifier,
                    available: true,
                    message: 'Available'
                };
                dispatch(setIdentifierValidation(result));
                return result;
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to validate identifier';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Generate QR Image
export const generateQRImage = createAsyncThunk(
    'sabqr/generateImage',
    async ({ qrId, config }, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.generateQRImage(qrId, config);
            toastConfig.successToast('QR image generated successfully!');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to generate QR image';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Upload Logo
export const uploadLogo = createAsyncThunk(
    'sabqr/uploadLogo',
    async (file, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.uploadLogo(file);
            toastConfig.successToast('Logo uploaded successfully!');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to upload logo';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Fetch Dashboard Summary
export const fetchDashboardSummary = createAsyncThunk(
    'sabqr/fetchDashboard',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const response = await sabQRService.getDashboardSummary();
            // Ensure we have a proper structure
            if (response?.data) {
                return response.data;
            }
            // Return current state if response is empty
            const { sabqr } = getState();
            return sabqr.dashboard;
        } catch (error) {
            // Return mock data instead of rejecting to keep UI functional
            const { sabqr } = getState();
            console.log('Using mock dashboard data');
            return sabqr.dashboard || initialState.dashboard;
        }
    }
);

// Fetch QR Payments
export const fetchQRPayments = createAsyncThunk(
    'sabqr/fetchPayments',
    async (params = {}, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.getQRPayments(params);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch payments';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Export Payments
export const exportPayments = createAsyncThunk(
    'sabqr/exportPayments',
    async (params = {}, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.exportPayments(params);
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `QR_Payments_${new Date().getTime()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toastConfig.successToast('Payments exported successfully!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to export payments';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Get Bulk Job Status
export const fetchBulkJobStatus = createAsyncThunk(
    'sabqr/fetchBulkStatus',
    async (jobId, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.getBulkJobStatus(jobId);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch job status';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Download Bulk Template
export const downloadBulkTemplate = createAsyncThunk(
    'sabqr/downloadTemplate',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.downloadBulkTemplate();
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'QR_Bulk_Template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            toastConfig.successToast('Template downloaded successfully!');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to download template';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Process QR Payment Refund
export const processQRRefund = createAsyncThunk(
    'sabqr/processRefund',
    async ({ transactionId, amount, reason }, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.processRefund(
                transactionId, 
                amount, 
                reason
            );
            toastConfig.successToast('Refund initiated successfully!');
            return { 
                ...response.data,
                transactionId,
                amount
            };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to process refund';
            dispatch(setMessage(message));
            toastConfig.errorToast(message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get Refund Status
export const fetchRefundStatus = createAsyncThunk(
    'sabqr/fetchRefundStatus',
    async (refundId, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.getRefundStatus(refundId);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch refund status';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get Design Templates
export const fetchDesignTemplates = createAsyncThunk(
    'sabqr/fetchTemplates',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await sabQRService.getDesignTemplates();
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch templates';
            dispatch(setMessage(message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ============================================
// Initial State
// ============================================

// Load saved data from localStorage
const savedData = loadFromLocalStorage();

const initialState = {
    // QR Codes Data - Initialize from localStorage if available
    qrList: savedData.qrData?.qrList || [],
    currentQR: savedData.qrData?.currentQR || null,
    qrSummary: savedData.qrData?.qrSummary || {
        total_active: 0,
        total_inactive: 0,
        total_collections: 0,
        total_transactions: 0
    },
    
    // Transactions Data - Track all transactions
    transactions: savedData.transactions || [],
    
    // Payments Data
    payments: savedData.qrData?.payments || [],
    paymentsSummary: savedData.qrData?.paymentsSummary || {
        total_amount: 0,
        total_transactions: 0,
        success_rate: 0
    },
    
    // Dashboard Data - initialized empty, will be populated from API
    dashboard: {
        summary: {
            total_qr_codes: 0,
            active_qr_codes: 0,
            inactive_qr_codes: 0,
            total_collections: 0,
            today_collections: 0,
            total_transactions: 0,
            today_transactions: 0,
            average_transaction_value: 0
        },
        collection_trend: [],
        top_performing_qrs: [],
        recent_payments: []
    },
    
    // Design Templates
    designTemplates: [],
    uploadedLogo: null,
    
    // Filters & Pagination
    filters: {
        status: 'all',
        search: '',
        category: 'all',
        from_date: null,
        to_date: null,
        sort_by: 'created_at',
        sort_order: 'desc'
    },
    
    pagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0
    },
    
    paymentsPagination: {
        page: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0
    },
    
    // Bulk Operations
    bulkJob: {
        jobId: null,
        status: null,
        progress: 0,
        totalRecords: 0,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errors: []
    },
    
    // Validation
    identifierValidation: {
        identifier: '',
        available: null,
        alternatives: []
    },
    
    // Generated QR Image
    generatedImage: null,
    
    // Refund Data
    refunds: [],
    activeRefund: null,
    refundHistory: [],
    
    // Loading States
    loading: {
        list: false,
        create: false,
        update: false,
        delete: false,
        details: false,
        payments: false,
        dashboard: false,
        bulk: false,
        bulkStatus: false,
        template: false,
        image: false,
        logo: false,
        export: false,
        validation: false,
        refund: false,
        refundStatus: false
    },
    
    // Error States
    error: {
        list: null,
        create: null,
        update: null,
        delete: null,
        details: null,
        payments: null,
        dashboard: null,
        bulk: null,
        image: null,
        logo: null,
        export: null,
        validation: null,
        refund: null,
        refundStatus: null
    }
};

// ============================================
// Slice
// ============================================

const sabqrSlice = createSlice({
    name: 'sabqr',
    initialState,
    reducers: {
        // Filter Actions
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Reset to first page when filters change
        },
        
        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },
        
        // Pagination Actions
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        
        setPaymentsPagination: (state, action) => {
            state.paymentsPagination = { ...state.paymentsPagination, ...action.payload };
        },
        
        // Current QR Actions
        setCurrentQR: (state, action) => {
            state.currentQR = action.payload;
        },
        
        resetCurrentQR: (state) => {
            state.currentQR = null;
        },
        
        // Bulk Job Actions
        setBulkJobStatus: (state, action) => {
            state.bulkJob = { ...state.bulkJob, ...action.payload };
        },
        
        resetBulkJob: (state) => {
            state.bulkJob = initialState.bulkJob;
        },
        
        // Clear Actions
        clearErrors: (state) => {
            state.error = initialState.error;
        },
        
        clearGeneratedImage: (state) => {
            state.generatedImage = null;
        },
        
        clearUploadedLogo: (state) => {
            state.uploadedLogo = null;
        },
        
        // Set identifier validation result
        setIdentifierValidation: (state, action) => {
            state.identifierValidation = action.payload;
        },
        
        // Real-time Updates (for WebSocket)
        addPaymentRealtime: (state, action) => {
            const payment = action.payload;
            state.payments.unshift(payment);
            state.dashboard.recent_payments.unshift(payment);
            
            // Update QR statistics
            const qrIndex = state.qrList.findIndex(qr => qr.id === payment.qr_code_id);
            if (qrIndex !== -1) {
                state.qrList[qrIndex].total_collections += payment.amount;
                state.qrList[qrIndex].transaction_count += 1;
                state.qrList[qrIndex].last_payment_at = payment.payment_time;
            }
            
            // Update dashboard
            state.dashboard.summary.today_collections += payment.amount;
            state.dashboard.summary.today_transactions += 1;
        },
        
        updateQRStatusRealtime: (state, action) => {
            const { qrId, status } = action.payload;
            const qrIndex = state.qrList.findIndex(qr => qr.id === qrId);
            if (qrIndex !== -1) {
                state.qrList[qrIndex].status = status;
            }
            if (state.currentQR?.id === qrId) {
                state.currentQR.status = status;
            }
        },
        
        // Transaction tracking
        addTransaction: (state, action) => {
            const transaction = {
                ...action.payload,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            state.transactions.unshift(transaction);
            
            // Update QR statistics
            const qr = state.qrList.find(q => q.qr_identifier === transaction.qr_identifier);
            if (qr) {
                qr.total_collections = (qr.total_collections || 0) + transaction.amount;
                qr.transaction_count = (qr.transaction_count || 0) + 1;
            }
            
            // Update summary
            if (transaction.status === 'SUCCESS') {
                state.qrSummary.total_collections += transaction.amount;
                state.qrSummary.total_transactions += 1;
            }
            
            // Save to localStorage
            saveToLocalStorage(TRANSACTIONS_KEY, state.transactions);
        },
        
        // Additional real-time actions for HDFC integration
        addQRToList: (state, action) => {
            // Check if QR with same identifier already exists to prevent duplicates
            const existingIndex = state.qrList.findIndex(
                qr => qr.qr_identifier === action.payload.qr_identifier
            );
            
            if (existingIndex === -1) {
                // Only add if it doesn't exist
                state.qrList.unshift(action.payload);
                if (state.qrSummary) {
                    state.qrSummary.total_active += 1;
                }
            } else {
                // Update existing QR instead of adding duplicate
                state.qrList[existingIndex] = action.payload;
            }
        },
        
        // Clean up duplicates from the list
        removeDuplicates: (state) => {
            const uniqueQRs = [];
            const seenIdentifiers = new Set();
            
            state.qrList.forEach(qr => {
                if (!seenIdentifiers.has(qr.qr_identifier)) {
                    seenIdentifiers.add(qr.qr_identifier);
                    uniqueQRs.push(qr);
                }
            });
            
            state.qrList = uniqueQRs;
        },
        
        updatePaymentStatus: (state, action) => {
            const { transactionId, status, data } = action.payload;
            
            // Update payment in payments list
            const paymentIndex = state.payments.findIndex(
                p => p.transaction_id === transactionId
            );
            if (paymentIndex !== -1) {
                state.payments[paymentIndex] = {
                    ...state.payments[paymentIndex],
                    status,
                    ...data
                };
            }
            
            // Update dashboard if payment successful
            if (status === 'SUCCESS' && state.dashboard.summary) {
                state.dashboard.summary.total_collections += data.amount || 0;
                state.dashboard.summary.today_collections += data.amount || 0;
            }
        },
        
        addNewPayment: (state, action) => {
            const payment = action.payload;
            
            // Add to payments list
            state.payments.unshift(payment);
            
            // Add to recent payments in dashboard
            if (state.dashboard.recent_payments) {
                state.dashboard.recent_payments.unshift(payment);
                if (state.dashboard.recent_payments.length > 10) {
                    state.dashboard.recent_payments.pop();
                }
            }
            
            // Update summary if successful
            if (payment.transactionStatus === 'SUCCESS' && state.dashboard.summary) {
                state.dashboard.summary.total_collections += payment.amount || 0;
                const today = new Date().toDateString();
                const paymentDate = new Date(payment.transactionDateTime).toDateString();
                if (today === paymentDate) {
                    state.dashboard.summary.today_collections += payment.amount || 0;
                }
            }
        }
    },
    
    extraReducers: (builder) => {
        // Create QR
        builder
            .addCase(createQR.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createQR.fulfilled, (state, action) => {
                state.loading.create = false;
                
                // Check if QR with same identifier already exists to prevent duplicates
                const existingIndex = state.qrList.findIndex(
                    qr => qr.qr_identifier === action.payload.data.qr_identifier
                );
                
                if (existingIndex === -1) {
                    // Only add if it doesn't exist
                    state.qrList.unshift(action.payload.data);
                    state.qrSummary.total_active += 1;
                } else {
                    // Update existing QR instead of adding duplicate
                    state.qrList[existingIndex] = action.payload.data;
                }
                
                // Save to localStorage
                const dataToSave = {
                    qrList: state.qrList,
                    currentQR: action.payload.data,
                    qrSummary: state.qrSummary,
                    payments: state.payments,
                    paymentsSummary: state.paymentsSummary
                };
                saveToLocalStorage(STORAGE_KEY, dataToSave);
            })
            .addCase(createQR.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload;
            });

        // Fetch QR List
        builder
            .addCase(fetchQRList.pending, (state) => {
                state.loading.list = true;
                state.error.list = null;
            })
            .addCase(fetchQRList.fulfilled, (state, action) => {
                state.loading.list = false;
                state.qrList = action.payload.data.qr_codes || [];
                state.pagination = action.payload.data.pagination || state.pagination;
                state.qrSummary = action.payload.data.summary || state.qrSummary;
            })
            .addCase(fetchQRList.rejected, (state, action) => {
                state.loading.list = false;
                state.error.list = action.payload;
            });

        // Fetch QR Details
        builder
            .addCase(fetchQRDetails.pending, (state) => {
                state.loading.details = true;
                state.error.details = null;
            })
            .addCase(fetchQRDetails.fulfilled, (state, action) => {
                state.loading.details = false;
                state.currentQR = action.payload.data;
            })
            .addCase(fetchQRDetails.rejected, (state, action) => {
                state.loading.details = false;
                state.error.details = action.payload;
            });

        // Update QR
        builder
            .addCase(updateQR.pending, (state) => {
                state.loading.update = true;
                state.error.update = null;
            })
            .addCase(updateQR.fulfilled, (state, action) => {
                state.loading.update = false;
                const index = state.qrList.findIndex(qr => qr.id === action.payload.data.id);
                if (index !== -1) {
                    state.qrList[index] = action.payload.data;
                }
                if (state.currentQR?.id === action.payload.data.id) {
                    state.currentQR = action.payload.data;
                }
            })
            .addCase(updateQR.rejected, (state, action) => {
                state.loading.update = false;
                state.error.update = action.payload;
            });

        // Delete QR
        builder
            .addCase(deleteQR.pending, (state) => {
                state.loading.delete = true;
                state.error.delete = null;
            })
            .addCase(deleteQR.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.qrList = state.qrList.filter(qr => qr.id !== action.payload);
                if (state.currentQR?.id === action.payload) {
                    state.currentQR = null;
                }
            })
            .addCase(deleteQR.rejected, (state, action) => {
                state.loading.delete = false;
                state.error.delete = action.payload;
            });

        // Toggle QR Status
        builder
            .addCase(toggleQRStatus.fulfilled, (state, action) => {
                const updatedQR = action.payload.data;
                const index = state.qrList.findIndex(qr => qr.id === updatedQR.id);
                if (index !== -1) {
                    state.qrList[index] = updatedQR;
                }
                if (state.currentQR?.id === updatedQR.id) {
                    state.currentQR = updatedQR;
                }
            });

        // Validate Identifier
        builder
            .addCase(validateQRIdentifier.pending, (state) => {
                state.loading.validation = true;
                state.error.validation = null;
            })
            .addCase(validateQRIdentifier.fulfilled, (state, action) => {
                state.loading.validation = false;
                state.identifierValidation = action.payload.data;
            })
            .addCase(validateQRIdentifier.rejected, (state, action) => {
                state.loading.validation = false;
                state.error.validation = action.payload;
            });

        // Generate QR Image
        builder
            .addCase(generateQRImage.pending, (state) => {
                state.loading.image = true;
                state.error.image = null;
            })
            .addCase(generateQRImage.fulfilled, (state, action) => {
                state.loading.image = false;
                state.generatedImage = action.payload.data;
            })
            .addCase(generateQRImage.rejected, (state, action) => {
                state.loading.image = false;
                state.error.image = action.payload;
            });

        // Upload Logo
        builder
            .addCase(uploadLogo.pending, (state) => {
                state.loading.logo = true;
                state.error.logo = null;
            })
            .addCase(uploadLogo.fulfilled, (state, action) => {
                state.loading.logo = false;
                state.uploadedLogo = action.payload.data;
            })
            .addCase(uploadLogo.rejected, (state, action) => {
                state.loading.logo = false;
                state.error.logo = action.payload;
            });

        // Fetch Dashboard
        builder
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.loading.dashboard = true;
                state.error.dashboard = null;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.loading.dashboard = false;
                // Handle both response formats
                state.dashboard = action.payload?.data || action.payload || state.dashboard;
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.loading.dashboard = false;
                state.error.dashboard = action.payload;
            });

        // Fetch Payments
        builder
            .addCase(fetchQRPayments.pending, (state) => {
                state.loading.payments = true;
                state.error.payments = null;
            })
            .addCase(fetchQRPayments.fulfilled, (state, action) => {
                state.loading.payments = false;
                state.payments = action.payload.data.payments || [];
                state.paymentsPagination = action.payload.data.pagination || state.paymentsPagination;
                state.paymentsSummary = action.payload.data.summary || state.paymentsSummary;
            })
            .addCase(fetchQRPayments.rejected, (state, action) => {
                state.loading.payments = false;
                state.error.payments = action.payload;
            });

        // Export Payments
        builder
            .addCase(exportPayments.pending, (state) => {
                state.loading.export = true;
                state.error.export = null;
            })
            .addCase(exportPayments.fulfilled, (state) => {
                state.loading.export = false;
            })
            .addCase(exportPayments.rejected, (state, action) => {
                state.loading.export = false;
                state.error.export = action.payload;
            });

        // Bulk Create
        builder
            .addCase(bulkCreateQR.pending, (state) => {
                state.loading.bulk = true;
                state.error.bulk = null;
                state.bulkJob.status = 'processing';
            })
            .addCase(bulkCreateQR.fulfilled, (state, action) => {
                state.loading.bulk = false;
                state.bulkJob = {
                    ...state.bulkJob,
                    ...action.payload.data,
                    status: 'processing'
                };
            })
            .addCase(bulkCreateQR.rejected, (state, action) => {
                state.loading.bulk = false;
                state.error.bulk = action.payload;
                state.bulkJob.status = 'failed';
            });

        // Fetch Bulk Job Status
        builder
            .addCase(fetchBulkJobStatus.pending, (state) => {
                state.loading.bulkStatus = true;
            })
            .addCase(fetchBulkJobStatus.fulfilled, (state, action) => {
                state.loading.bulkStatus = false;
                state.bulkJob = action.payload.data;
            })
            .addCase(fetchBulkJobStatus.rejected, (state) => {
                state.loading.bulkStatus = false;
            });

        // Download Template
        builder
            .addCase(downloadBulkTemplate.pending, (state) => {
                state.loading.template = true;
            })
            .addCase(downloadBulkTemplate.fulfilled, (state) => {
                state.loading.template = false;
            })
            .addCase(downloadBulkTemplate.rejected, (state) => {
                state.loading.template = false;
            });

        // Fetch Design Templates
        builder
            .addCase(fetchDesignTemplates.fulfilled, (state, action) => {
                state.designTemplates = action.payload.data || [];
            });

        // Process QR Refund
        builder
            .addCase(processQRRefund.pending, (state) => {
                state.loading.refund = true;
                state.error.refund = null;
            })
            .addCase(processQRRefund.fulfilled, (state, action) => {
                state.loading.refund = false;
                // Update payment status in the list
                const paymentIndex = state.payments.findIndex(
                    p => p.transaction_id === action.payload.transactionId
                );
                if (paymentIndex !== -1) {
                    state.payments[paymentIndex].status = 'refunded';
                    state.payments[paymentIndex].refund_data = action.payload;
                    state.payments[paymentIndex].refund_amount = action.payload.amount;
                    state.payments[paymentIndex].refund_date = new Date().toISOString();
                }
                // Add to refund history
                state.refundHistory.unshift({
                    ...action.payload,
                    refunded_at: new Date().toISOString()
                });
                state.activeRefund = action.payload;
            })
            .addCase(processQRRefund.rejected, (state, action) => {
                state.loading.refund = false;
                state.error.refund = action.payload;
            });

        // Fetch Refund Status
        builder
            .addCase(fetchRefundStatus.pending, (state) => {
                state.loading.refundStatus = true;
                state.error.refundStatus = null;
            })
            .addCase(fetchRefundStatus.fulfilled, (state, action) => {
                state.loading.refundStatus = false;
                state.activeRefund = action.payload.data;
            })
            .addCase(fetchRefundStatus.rejected, (state, action) => {
                state.loading.refundStatus = false;
                state.error.refundStatus = action.payload;
            });
    }
});

// Export actions
export const {
    setFilters,
    clearFilters,
    setPagination,
    setPaymentsPagination,
    setCurrentQR,
    resetCurrentQR,
    setBulkJobStatus,
    resetBulkJob,
    clearErrors,
    clearGeneratedImage,
    clearUploadedLogo,
    setIdentifierValidation,
    addPaymentRealtime,
    updateQRStatusRealtime,
    addQRToList,
    updatePaymentStatus,
    addNewPayment,
    removeDuplicates,
    addTransaction
} = sabqrSlice.actions;

// Export reducer
export default sabqrSlice.reducer;