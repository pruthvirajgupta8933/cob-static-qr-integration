// HDFC UPI API Constants and Configuration
// Based on HDFC Dynamic_Static_QR API Integration Specification V1.1

export const HDFC_ERROR_CODES = {
  // Success Code
  '00': 'Success',
  
  // UPI Error Codes
  'U01': 'The request is duplicate',
  'U02': 'Not sufficient funds',
  'U03': 'Debit has failed',
  'U04': 'Credit has failed',
  'U05': 'Transaction not permitted',
  'U06': 'Invalid VPA',
  'U07': 'Transaction timeout',
  'U08': 'Invalid Amount',
  'U09': 'Remitter bank not available',
  'U10': 'Beneficiary bank not available',
  'U11': 'Risk threshold exceeded',
  'U12': 'Invalid MPIN',
  'U13': 'Invalid OTP',
  'U14': 'Invalid card number',
  'U15': 'Invalid expiry date',
  'U16': 'Insufficient balance',
  'U17': 'Transaction frequency limit exceeded',
  'U18': 'Response not received',
  'U19': 'Declined by customer',
  'U20': 'Invalid beneficiary details',
  'U21': 'Transaction not found',
  'U22': 'Transaction already processed',
  'U23': 'Message integrity failed',
  'U24': 'Unknown error',
  'U25': 'Request timeout',
  'U26': 'Risk check failed',
  'U27': 'Missing digital signature',
  'U28': 'Bank not live on UPI',
  'U29': 'Credit freeze',
  'U30': 'Debit freeze',
  'U31': 'Remitter bank processing error',
  'U32': 'Beneficiary bank processing error',
  'U33': 'Incorrect PIN',
  'U34': 'Limit exceeded',
  'U35': 'Request not found',
  'U36': 'Number of PIN tries exceeded',
  'U37': 'Invalid device ID',
  'U38': 'Channel code not supported',
  'U39': 'Format error',
  'U40': 'NPCI service unavailable',
  
  // Transaction Status Enquiry Error Codes
  '1': 'RNF - Record Not Found',
  '3': 'Merchant not found or inactive',
  '4': 'Validation error',
  '1000': 'Technical error occurred',
  
  // Refund API Error Codes
  'V101': 'Invalid Merchant Id',
  'V103': 'Invalid Transaction Request',
  'V104': 'Invalid Order Id',
  'V105': 'Invalid Order Id Length',
  'V106': 'Invalid Original Order Number',
  'V107': 'Duplicate Order Number',
  'V108': 'Invalid Original Ref Number',
  'V109': 'Invalid Original Customer Ref Number',
  'V110': 'Invalid Transaction Remark',
  'V111': 'Invalid Transaction Amount',
  'V112': 'Invalid Transaction Currency Code',
  'V113': 'Invalid Transaction Payment Type',
  'V114': 'Invalid Transaction Type',
  'V115': 'Invalid Additional Field',
  'V116': 'Refund Already Processed',
  'V117': 'Refund Amount Exceeds The Original Amount',
  'V118': 'Refund Already in Progress',
  'V119': 'Refund Request Rejected',
  'V121': 'Invalid OrderNo/RRN/PgMerchantId',
  'V135': 'Refund failed due to hold',
  'E01': 'Technical Error Occurred',
  'XH': 'Account does not exist (Remitter)',
  '50': 'Refund transaction request initiated',
  '70': 'Refund transaction is failed',
  '2226': 'Refund status accepted',
  
  // Response Codes
  'ZA': 'Transaction pending',
  'U69': 'Collect request expired',
  'MC04': 'Validation error'
};

export const HDFC_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  REFUNDED: 'REFUNDED'
};

export const HDFC_TRANSACTION_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 100000, // ₹1,00,000 for P2M transactions
  DAILY_TRANSACTION_LIMIT: 2000000, // ₹20,00,000 
  MONTHLY_TRANSACTION_LIMIT: 10000000, // ₹1,00,00,000
  MAX_REFUND_DAYS: 180, // Refund allowed within 180 days
  QR_EXPIRY_MINUTES: 30, // Dynamic QR expiry time
  TRANSACTION_TIMEOUT_SECONDS: 300 // 5 minutes
};

export const HDFC_TIMEOUT_CONFIG = {
  generateQR: 10000,      // 10 seconds
  statusEnquiry: 15000,   // 15 seconds  
  refund: 30000,          // 30 seconds
  settlement: 60000,      // 60 seconds
  webhook: 5000           // 5 seconds for webhook response
};

export const HDFC_QR_MODES = {
  STATIC: '01',   // Static QR mode
  DYNAMIC: '15',  // Dynamic QR mode
  SANDBOX: '03'   // Sandbox mode
};

export const HDFC_QR_MEDIUM = {
  PICK_FROM_GALLERY: '01',
  APP: '02',
  POS: '03',
  PHYSICAL: '04',
  ATM: '05',
  WEB: '06'
};

export const HDFC_CURRENCY = {
  INR: 'INR'  // Only INR is supported
};

export const HDFC_PAYMENT_TYPE = {
  P2P: 'P2P',  // Person to Person
  P2M: 'P2M'   // Person to Merchant
};

export const HDFC_TRANSACTION_TYPE = {
  PAY: 'PAY',
  COLLECT: 'COLLECT'
};

// MCC (Merchant Category Code) - 4-digit codes
export const HDFC_MCC_CODES = {
  UAT_TESTING: '6012', // Use for UAT as per HDFC email
  GROCERY_STORES: '5411',
  EATING_PLACES: '5812',
  MISCELLANEOUS_FOOD: '5499',
  SERVICE_STATIONS: '5541',
  DRUG_STORES: '5912',
  DIRECT_MARKETING: '5960',
  INSURANCE_SALES: '6300',
  SCHOOLS_COLLEGES: '8220',
  HOSPITALS: '8062',
  MEDICAL_SERVICES: '8011',
  CHARITABLE: '8398',
  GOVERNMENT_SERVICES: '9399',
  UTILITIES: '4900'
};

// HDFC API URLs
export const HDFC_API_ENDPOINTS = {
  UAT: {
    BASE_URL: 'https://upitestv2.hdfcbank.com/upi',
    TRANSACTION_STATUS: '/transactionStatusQuery',
    REFUND: '/refundReqSvc'
  },
  SANDBOX: {
    BASE_URL: 'https://testupi.mindgate.in:8443/hupi',
    TRANSACTION_STATUS: '/transactionStatusQuery',
    REFUND: '/refundReqSvc'
  },
  PRODUCTION: {
    BASE_URL: 'https://upiv2.hdfcbank.com/upi',
    TRANSACTION_STATUS: '/transactionStatusQuery',
    REFUND: '/refundReqSvc'
  }
};

// Callback Response Field Positions (21 pipe-separated fields)
export const HDFC_CALLBACK_FIELDS = {
  UPI_TXN_ID: 0,
  ORDER_NO: 1,
  AMOUNT: 2,
  TXN_AUTH_DATE: 3,
  STATUS: 4,
  STATUS_DESC: 5,
  RESP_CODE: 6,
  APPROVAL_NUMBER: 7,
  PAYER_VPA: 8,
  CUST_REF_NO: 9,
  REF_ID: 10,
  ADDITIONAL_1: 11,
  ADDITIONAL_2: 12,
  ADDITIONAL_3: 13,
  ADDITIONAL_4: 14,
  ADDITIONAL_5: 15,
  PAYER_INFO: 16,  // Payer Bank Name!Account Number!IFSC!Mobile
  TXN_TYPE_INFO: 17, // Pay Type!Ref Url!NA!Txn Id!NA
  PAYEE_VPA_INFO: 18, // Payee VPA!NA!NA
  PAYER_ACC_TYPE_INFO: 19, // Payer Acc Type!NA!NA!NA!NA
  PAYER_NAME_INFO: 20 // Payer Name!NA!NA!NA!NA
};

// Validation Patterns
export const HDFC_VALIDATION = {
  VPA_PATTERN: /^[a-zA-Z0-9.\-_]{3,256}@[a-zA-Z]{3,64}$/,
  MOBILE_PATTERN: /^[6-9]\d{9}$/,
  ORDER_ID_PATTERN: /^[a-zA-Z0-9]{1,35}$/,
  AMOUNT_PATTERN: /^\d+(\.\d{1,2})?$/,
  RRN_PATTERN: /^\d{12}$/,
  UPI_TXN_ID_PATTERN: /^\d{1,18}$/
};

// Transaction Reference Prefixes
export const HDFC_TR_PREFIX = {
  STATIC: 'STQ',   // Static QR prefix
  DYNAMIC: 'DYN',  // Dynamic QR prefix
  REFUND: 'REF'    // Refund prefix
};

export default {
  HDFC_ERROR_CODES,
  HDFC_STATUS,
  HDFC_TRANSACTION_LIMITS,
  HDFC_TIMEOUT_CONFIG,
  HDFC_QR_MODES,
  HDFC_QR_MEDIUM,
  HDFC_CURRENCY,
  HDFC_PAYMENT_TYPE,
  HDFC_TRANSACTION_TYPE,
  HDFC_MCC_CODES,
  HDFC_API_ENDPOINTS,
  HDFC_CALLBACK_FIELDS,
  HDFC_VALIDATION,
  HDFC_TR_PREFIX
};