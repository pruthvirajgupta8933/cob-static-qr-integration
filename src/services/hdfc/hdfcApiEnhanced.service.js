import axios from 'axios';
import encryptionService from '../../utilities/encryption';
import HDFC_CONFIG from '../../config/hdfc.config';
import {
  HDFC_ERROR_CODES,
  HDFC_STATUS,
  HDFC_TRANSACTION_LIMITS,
  HDFC_TIMEOUT_CONFIG,
  HDFC_QR_MODES,
  HDFC_QR_MEDIUM,
  HDFC_CURRENCY,
  HDFC_PAYMENT_TYPE,
  HDFC_TRANSACTION_TYPE,
  HDFC_API_ENDPOINTS,
  HDFC_CALLBACK_FIELDS,
  HDFC_VALIDATION,
  HDFC_TR_PREFIX
} from '../../config/hdfc.constants';

class HDFCApiEnhancedService {
  constructor() {
    this.environment = process.env.REACT_APP_ENV || 'UAT';
    this.endpoints = HDFC_API_ENDPOINTS[this.environment];
    this.merchantId = HDFC_CONFIG.merchantId;
    this.merchantKey = HDFC_CONFIG.merchantKey;
    
    // Transaction cache for duplicate prevention
    this.transactionCache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
    
    // Initialize axios instances with different timeouts
    this.initializeApiClients();
  }

  initializeApiClients() {
    // QR Generation Client
    this.qrClient = this.createApiClient(HDFC_TIMEOUT_CONFIG.generateQR);
    
    // Status Enquiry Client
    this.statusClient = this.createApiClient(HDFC_TIMEOUT_CONFIG.statusEnquiry);
    
    // Refund Client
    this.refundClient = this.createApiClient(HDFC_TIMEOUT_CONFIG.refund);
    
    // Settlement Client
    this.settlementClient = this.createApiClient(HDFC_TIMEOUT_CONFIG.settlement);
  }

  createApiClient(timeout) {
    const client = axios.create({
      baseURL: this.endpoints.BASE_URL,
      timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor for encryption
    client.interceptors.request.use(
      (config) => {
        if (config.data) {
          // Build pipe-separated message as per HDFC spec
          const message = this.buildRequestMessage(config.data);
          const encrypted = encryptionService.encryptAES128(message, this.merchantKey);
          
          config.data = {
            requestMsg: encrypted,
            pgMerchantId: this.merchantId
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for decryption
    client.interceptors.response.use(
      (response) => {
        if (response.data && typeof response.data === 'string') {
          try {
            const decrypted = encryptionService.decryptAES128(response.data, this.merchantKey);
            response.data = this.parseResponseMessage(decrypted);
          } catch (error) {
            console.error('Decryption error:', error);
            response.data = { error: 'Failed to decrypt response' };
          }
        }
        return response;
      },
      (error) => {
        const errorResponse = {
          success: false,
          error: this.handleApiError(error)
        };
        return Promise.resolve({ data: errorResponse });
      }
    );

    return client;
  }

  // Validate transaction amount
  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      throw new Error('Invalid amount format');
    }
    
    if (numAmount < HDFC_TRANSACTION_LIMITS.MIN_AMOUNT) {
      throw new Error(`Amount must be at least ₹${HDFC_TRANSACTION_LIMITS.MIN_AMOUNT}`);
    }
    
    if (numAmount > HDFC_TRANSACTION_LIMITS.MAX_AMOUNT) {
      throw new Error(`Amount exceeds maximum limit of ₹${HDFC_TRANSACTION_LIMITS.MAX_AMOUNT}`);
    }
    
    // Check decimal places (max 2)
    if (!HDFC_VALIDATION.AMOUNT_PATTERN.test(amount.toString())) {
      throw new Error('Amount can have maximum 2 decimal places');
    }
    
    return numAmount.toFixed(2);
  }

  // Validate VPA format
  validateVPA(vpa) {
    if (!HDFC_VALIDATION.VPA_PATTERN.test(vpa)) {
      throw new Error('Invalid VPA format');
    }
    return vpa;
  }

  // Check for duplicate transactions
  async checkDuplicateTransaction(transactionRef) {
    const cached = this.transactionCache.get(transactionRef);
    
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.cacheTimeout) {
        return cached.response;
      }
      this.transactionCache.delete(transactionRef);
    }
    
    return null;
  }

  // Store transaction in cache
  cacheTransaction(transactionRef, response) {
    this.transactionCache.set(transactionRef, {
      response,
      timestamp: Date.now()
    });
    
    // Clean old entries
    setTimeout(() => {
      this.transactionCache.delete(transactionRef);
    }, this.cacheTimeout);
  }

  // Generate Static QR Code with validations
  async generateStaticQR(params) {
    try {
      // Validate parameters
      if (!params.identifier) {
        throw new Error('Identifier is required for static QR');
      }
      
      if (!params.merchantName || params.merchantName.length > 100) {
        throw new Error('Valid merchant name is required (max 100 chars)');
      }
      
      // Optional amount validation for static QR
      let amount = '';
      if (params.amount) {
        amount = this.validateAmount(params.amount);
      }
      
      // Generate unique transaction reference
      const transactionRef = `${HDFC_TR_PREFIX.STATIC}${params.identifier}${Date.now()}`;
      
      // Check for duplicate
      const duplicate = await this.checkDuplicateTransaction(transactionRef);
      if (duplicate) {
        return duplicate;
      }
      
      // Build UPI string as per NPCI specification
      const upiString = this.buildStaticUPIString({
        ...params,
        amount,
        transactionRef
      });
      
      // Generate QR code image
      const QRCode = await import('qrcode');
      const qrImageData = await QRCode.toDataURL(upiString, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      const response = {
        success: true,
        data: {
          transactionRef,
          qrType: 'STATIC',
          identifier: params.identifier,
          merchantName: params.merchantName,
          amount: amount || null,
          upiString,
          qrImageData,
          vpa: HDFC_CONFIG.vpa,
          createdAt: new Date().toISOString(),
          expiresAt: null // Static QR doesn't expire
        }
      };
      
      // Cache the response
      this.cacheTransaction(transactionRef, response);
      
      return response;
    } catch (error) {
      console.error('Error generating static QR:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate Dynamic QR Code with validations
  async generateDynamicQR(params) {
    try {
      // Validate required parameters
      if (!params.orderId) {
        throw new Error('Order ID is required for dynamic QR');
      }
      
      if (!params.amount) {
        throw new Error('Amount is mandatory for dynamic QR');
      }
      
      const amount = this.validateAmount(params.amount);
      
      if (!params.merchantName || params.merchantName.length > 100) {
        throw new Error('Valid merchant name is required (max 100 chars)');
      }
      
      // Generate unique transaction reference
      const transactionRef = `${HDFC_TR_PREFIX.DYNAMIC}${params.orderId}${Date.now()}`;
      
      // Check for duplicate
      const duplicate = await this.checkDuplicateTransaction(transactionRef);
      if (duplicate) {
        return duplicate;
      }
      
      // Calculate expiry time (default 30 minutes)
      const expiryMinutes = params.expiryMinutes || HDFC_TRANSACTION_LIMITS.QR_EXPIRY_MINUTES;
      const expiryTime = new Date(Date.now() + expiryMinutes * 60000);
      
      // Build UPI string with expiry
      const upiString = this.buildDynamicUPIString({
        ...params,
        amount,
        transactionRef,
        expiryTime: expiryTime.toISOString()
      });
      
      // Generate QR code image
      const QRCode = await import('qrcode');
      const qrImageData = await QRCode.toDataURL(upiString, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      const response = {
        success: true,
        data: {
          transactionRef,
          orderId: params.orderId,
          qrType: 'DYNAMIC',
          merchantName: params.merchantName,
          amount,
          upiString,
          qrImageData,
          vpa: HDFC_CONFIG.vpa,
          createdAt: new Date().toISOString(),
          expiresAt: expiryTime.toISOString()
        }
      };
      
      // Cache the response
      this.cacheTransaction(transactionRef, response);
      
      return response;
    } catch (error) {
      console.error('Error generating dynamic QR:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Build Static UPI String
  buildStaticUPIString(params) {
    const mode = this.environment === 'SANDBOX' ? HDFC_QR_MODES.SANDBOX : HDFC_QR_MODES.STATIC;
    
    const upiParams = [
      'upi://pay',
      `ver=01`,
      `mode=${mode}`,
      `tr=${params.transactionRef}`,
      `tn=${params.description || ''}`,
      `pn=${params.merchantName}`,
      `pa=${HDFC_CONFIG.vpa}`,
      `mc=${params.mcc || HDFC_CONFIG.mcc}`,
      `am=${params.amount || ''}`,
      `cu=${HDFC_CURRENCY.INR}`,
      `qrMedium=${HDFC_QR_MEDIUM.WEB}`
    ];
    
    return upiParams.join('?', 1).replace('?', '&');
  }

  // Build Dynamic UPI String
  buildDynamicUPIString(params) {
    const mode = this.environment === 'SANDBOX' ? HDFC_QR_MODES.SANDBOX : HDFC_QR_MODES.DYNAMIC;
    
    const upiParams = [
      'upi://pay',
      `ver=01`,
      `mode=${mode}`,
      `tr=${params.transactionRef}`,
      `tn=${params.description || ''}`,
      `pn=${params.merchantName}`,
      `pa=${HDFC_CONFIG.vpa}`,
      `mc=${params.mcc || HDFC_CONFIG.mcc}`,
      `am=${params.amount}`, // Amount is mandatory for dynamic QR
      `cu=${HDFC_CURRENCY.INR}`,
      `qrMedium=${HDFC_QR_MEDIUM.WEB}`
    ];
    
    // Add expiry for dynamic QR
    if (params.expiryTime) {
      const expiry = new Date(params.expiryTime);
      const expiryStr = expiry.toISOString().replace('Z', '+05:30'); // IST timezone
      upiParams.push(`QRexpire=${expiryStr}`);
    }
    
    return upiParams.join('?', 1).replace('?', '&');
  }

  // Transaction Status Enquiry with enhanced error handling
  async checkTransactionStatus(params) {
    try {
      if (!params.transactionRef && !params.rrn) {
        throw new Error('Either transaction reference or RRN is required');
      }
      
      const requestData = {
        orderNo: params.transactionRef || '',
        upiTxnId: params.upiTxnId || '',
        rrn: params.rrn || ''
      };
      
      const response = await this.statusClient.post(
        this.endpoints.TRANSACTION_STATUS,
        requestData
      );
      
      if (response.data.error) {
        return {
          success: false,
          error: response.data.error,
          errorCode: response.data.errorCode
        };
      }
      
      return {
        success: true,
        data: this.formatTransactionResponse(response.data)
      };
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process Refund with validations
  async processRefund(params) {
    try {
      // Validate refund parameters
      if (!params.originalTransactionRef) {
        throw new Error('Original transaction reference is required');
      }
      
      if (!params.refundAmount) {
        throw new Error('Refund amount is required');
      }
      
      const refundAmount = this.validateAmount(params.refundAmount);
      
      if (!params.refundReason || params.refundReason.length < 10) {
        throw new Error('Refund reason is required (minimum 10 characters)');
      }
      
      // Generate unique refund reference
      const refundRef = `${HDFC_TR_PREFIX.REFUND}${Date.now()}`;
      
      const requestData = {
        newOrderNo: refundRef,
        originalOrderNo: params.originalTransactionRef,
        originalTrnRefNo: params.originalUpiTxnId || '',
        originalCustRefNo: params.originalRRN || '',
        remarks: params.refundReason,
        refundAmount: refundAmount,
        currency: HDFC_CURRENCY.INR,
        paymentType: HDFC_PAYMENT_TYPE.P2P,
        transactionType: HDFC_TRANSACTION_TYPE.PAY
      };
      
      const response = await this.refundClient.post(
        this.endpoints.REFUND,
        requestData
      );
      
      if (response.data.error) {
        return {
          success: false,
          error: response.data.error,
          errorCode: response.data.errorCode
        };
      }
      
      return {
        success: true,
        data: {
          ...response.data,
          refundRef
        }
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle webhook callback from HDFC
  async handleWebhookCallback(encryptedData, pgMerchantId) {
    try {
      // Verify merchant ID
      if (pgMerchantId !== this.merchantId) {
        throw new Error('Invalid merchant ID in callback');
      }
      
      // Decrypt the message
      const decrypted = encryptionService.decryptAES128(encryptedData, this.merchantKey);
      
      // Parse the pipe-separated response
      const fields = decrypted.split('|');
      
      if (fields.length !== 21) {
        throw new Error('Invalid callback format');
      }
      
      // Map fields to response object
      const callbackData = this.parseCallbackResponse(fields);
      
      // Verify transaction signature/checksum if provided
      if (callbackData.checksum) {
        const isValid = this.verifyChecksum(callbackData);
        if (!isValid) {
          throw new Error('Invalid transaction checksum');
        }
      }
      
      return {
        success: true,
        data: callbackData
      };
    } catch (error) {
      console.error('Error handling webhook callback:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Parse callback response fields
  parseCallbackResponse(fields) {
    // Parse additional field 6 (Payer info)
    const payerInfo = fields[HDFC_CALLBACK_FIELDS.PAYER_INFO]?.split('!') || [];
    
    // Parse additional field 7 (Transaction type info)
    const txnTypeInfo = fields[HDFC_CALLBACK_FIELDS.TXN_TYPE_INFO]?.split('!') || [];
    
    // Parse additional field 8 (Payee VPA info)
    const payeeVpaInfo = fields[HDFC_CALLBACK_FIELDS.PAYEE_VPA_INFO]?.split('!') || [];
    
    // Parse additional field 9 (Payer account type info)
    const payerAccTypeInfo = fields[HDFC_CALLBACK_FIELDS.PAYER_ACC_TYPE_INFO]?.split('!') || [];
    
    // Parse additional field 10 (Payer name info)
    const payerNameInfo = fields[HDFC_CALLBACK_FIELDS.PAYER_NAME_INFO]?.split('!') || [];
    
    return {
      upiTxnId: fields[HDFC_CALLBACK_FIELDS.UPI_TXN_ID],
      orderNo: fields[HDFC_CALLBACK_FIELDS.ORDER_NO],
      amount: fields[HDFC_CALLBACK_FIELDS.AMOUNT],
      transactionDate: fields[HDFC_CALLBACK_FIELDS.TXN_AUTH_DATE],
      status: fields[HDFC_CALLBACK_FIELDS.STATUS],
      statusDescription: fields[HDFC_CALLBACK_FIELDS.STATUS_DESC],
      responseCode: fields[HDFC_CALLBACK_FIELDS.RESP_CODE],
      approvalNumber: fields[HDFC_CALLBACK_FIELDS.APPROVAL_NUMBER] !== 'NA' ? 
        fields[HDFC_CALLBACK_FIELDS.APPROVAL_NUMBER] : null,
      payerVPA: fields[HDFC_CALLBACK_FIELDS.PAYER_VPA],
      customerRefNo: fields[HDFC_CALLBACK_FIELDS.CUST_REF_NO],
      refId: fields[HDFC_CALLBACK_FIELDS.REF_ID] !== 'NA' ? 
        fields[HDFC_CALLBACK_FIELDS.REF_ID] : null,
      
      // Payer information
      payerBankName: payerInfo[0] !== 'NA' ? payerInfo[0] : null,
      payerAccountNumber: payerInfo[1] !== 'NA' ? payerInfo[1] : null,
      payerBankIFSC: payerInfo[2] !== 'NA' ? payerInfo[2] : null,
      payerMobile: payerInfo[3] !== 'NA' ? payerInfo[3] : null,
      
      // Transaction type information
      paymentType: txnTypeInfo[0] !== 'NA' ? txnTypeInfo[0] : null,
      transactionId: txnTypeInfo[3] !== 'NA' ? txnTypeInfo[3] : null,
      
      // Payee information
      payeeVPA: payeeVpaInfo[0] !== 'NA' ? payeeVpaInfo[0] : null,
      
      // Payer account type
      payerAccountType: payerAccTypeInfo[0] !== 'NA' ? payerAccTypeInfo[0] : null,
      
      // Payer name
      payerName: payerNameInfo[0] !== 'NA' ? payerNameInfo[0] : null,
      
      // Error details if failed
      errorCode: fields[HDFC_CALLBACK_FIELDS.RESP_CODE],
      errorDescription: HDFC_ERROR_CODES[fields[HDFC_CALLBACK_FIELDS.RESP_CODE]] || 
        fields[HDFC_CALLBACK_FIELDS.STATUS_DESC]
    };
  }

  // Format transaction response
  formatTransactionResponse(data) {
    return {
      ...data,
      statusText: HDFC_STATUS[data.status] || data.status,
      errorDescription: data.errorCode ? 
        HDFC_ERROR_CODES[data.errorCode] || data.statusDescription : null
    };
  }

  // Build request message (pipe-separated)
  buildRequestMessage(data) {
    const fields = [
      this.merchantId,
      data.orderNo || '',
      data.upiTxnId || '',
      data.rrn || '',
      data.newOrderNo || '',
      data.originalOrderNo || '',
      data.originalTrnRefNo || '',
      data.originalCustRefNo || '',
      data.remarks || '',
      data.refundAmount || '',
      data.currency || '',
      data.paymentType || '',
      data.transactionType || '',
      'NA' // Additional field placeholder
    ];
    
    return fields.join('|');
  }

  // Parse response message (pipe-separated)
  parseResponseMessage(message) {
    const fields = message.split('|');
    return this.parseCallbackResponse(fields);
  }

  // Verify checksum for transaction
  verifyChecksum(data) {
    // HDFC specific checksum verification
    const signatureString = [
      this.merchantId,
      data.transactionId,
      data.amount,
      data.status,
      data.customerRefNo
    ].join('|');
    
    const calculatedChecksum = encryptionService.generateSHA256(
      signatureString, 
      this.merchantKey
    );
    
    return calculatedChecksum === data.checksum;
  }

  // Handle API errors
  handleApiError(error) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout - please try again';
    }
    
    if (error.response) {
      const status = error.response.status;
      if (status === 400) return 'Invalid request parameters';
      if (status === 401) return 'Authentication failed';
      if (status === 403) return 'Access forbidden';
      if (status === 404) return 'Service not found';
      if (status === 429) return 'Too many requests - please try later';
      if (status >= 500) return 'Server error - please try later';
    }
    
    if (error.request) {
      return 'Network error - please check your connection';
    }
    
    return error.message || 'An unexpected error occurred';
  }

  // Get transaction error description
  getErrorDescription(errorCode) {
    return HDFC_ERROR_CODES[errorCode] || 'Unknown error';
  }

  // Validate configuration
  isConfigured() {
    return !!(this.merchantId && this.merchantKey && HDFC_CONFIG.vpa);
  }
}

// Export singleton instance
const hdfcApiEnhancedService = new HDFCApiEnhancedService();
export default hdfcApiEnhancedService;