const env = "staging";
let url,
  kyc_url = "";

if (env === "staging") {
  url = "https://stgcobapi.sabpaisa.in";
  kyc_url = "https://stgcobkyc.sabpaisa.in";
} else {
  url = "https://cobapi.sabpaisa.in";
  kyc_url = "https://kycprocess.sabpaisa.in";
}
// const stagingUrl = "${url}"
// const prodUrl = "https://cobapi.sabpaisa.-in"

const adminAPIURL = "https://adminapi.sabpaisa.in/SabPaisaAdmin";
const reportAPIURL = "https://reportapi.sabpaisa.in/SabPaisaReport";

const API_LIVE = {
  //------------------------------------------------------------
  AUTH_SIGNUP: `${url}/auth-service/auth/signup`,
  AUTH_LOGIN: `${url}/auth-service/auth/login`,
  //  AUTH_LOGIN : "${url}/cob/loginapi",

  ////////////////////////////////////---------------------------business_cat_code api

  Business_Category_CODE: `${kyc_url}/kyc/get-all-business-category/`,

  // AUTH_CLIENT_CREATE : "${url}/auth-service/client",
  AUTH_CLIENT_CREATE: `${url}/auth-service/client`,
  AUTH_UPDATE_PROFILE: `${url}/auth-service/updateProfile`,
  AUTH_GET_EMAIL_TO_SEND_OTP: `${url}/auth-service/account/getotp`,
  AUTH_VERIFY_OTP_ON_FWD: `${url}/auth-service/account/verify-otp`,
  AUTH_CREATE_NEW_PASSWORD: `${url}/auth-service/account/forgot-password`,
  AUTH_CHANGE_PASSWORD: `${url}/auth-service/account/change-password`,
  AUTH_FORGET_PASSWORD: `${url}/auth-service/account/create-password`,
  /* Email Verify for new register users */
  EMAIL_VERIFY: `${url}/auth-service/auth/emailVerify/`,

  EMAIL_BASE_URL: adminAPIURL + "/REST/Email/sendEmail",
  SUCCESS_TXN_SUMMARY: adminAPIURL + "/REST/SuccessTxnSummary/",

  // * Rate mapping */
  RATE_MAPPING_GenerateClientFormForCob:
    adminAPIURL + "/config/GenerateClientFormForCob",
  // https://adminapi.sabpaisa.in/REST/Ratemapping/cloning/clientCodeF/clientCodeT/loginBy
  RATE_MAPPING_CLONE: adminAPIURL + "/Ratemapping/cloning",
  RATE_ENABLE_PAYLINK: adminAPIURL + "/getDataByCommonProc/getCommonData/31",

  CHECK_PERMISSION_PAYLINK:
    adminAPIURL + "/getDataByCommonProc/getCommonData/29/",
  BANK_IFSC_CODE_VERIFY: "https://ifsc.razorpay.com/",
  BANK_LIST_NB:
    "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/nb",
  BANK_LIST_DC:
    "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/dc",
  SEND_EMAIL: adminAPIURL + "/Email/sendEmail",
  SUBSCRIBE_FETCH_APP_AND_PLAN:    "https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",
  FETCH_APP_AND_PLAN:    "https://spl.sabpaisa.in/client-subscription-service/fetchAppAndPlan",
  SUBSCRIBE_SERVICE:    "https://spl.sabpaisa.in/client-subscription-service/subscribe",

  /* transaction history  */
  //old api of txn history
  /*https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2} */

  GET_PAYMENT_STATUS_LIST: adminAPIURL + "/REST/admin/getPaymentStatusList",
  PAY_MODE_LIST: adminAPIURL + "/REST/paymode/paymodeList",
  GetMerchantTxnHistory: adminAPIURL + "/REST/GetMerchantTxnHistory",
  /* Settlement Report */
  SettlementReport: reportAPIURL + "/REST/GetSettledTxnHistory",
  RefundTxnHistory: reportAPIURL + "/REST/GetRefundTxnHistory",
  ChargeBankTxnHistory: reportAPIURL + "/REST/GetChargebackTxnHistory",

  /* Transaction Enquiry */
  VIEW_TXN: adminAPIURL + "/Enquiry/ViewTxn",
  SP2_VIEW_TXN: "https://sp2-adminapi.sabpaisa.in/Enquiry/ViewTxn",

  /* Settlement Report */
  GET_FILE_NAME: adminAPIURL + "/settlementReport/getFileName/",

  /* PAYLINK */
  GET_CUSTOMERS: "https://paybylink.sabpaisa.in/paymentlink/getCustomers/",
  SMART_UPLOAD: "https://paybylink.sabpaisa.in/paymentlink/smartupload",
  EDIT_CUSTOMER: "https://paybylink.sabpaisa.in/paymentlink/editCustomer/",
  GET_CUSTOMER_TYPE: "https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes",
  ADD_LINK: "https://paybylink.sabpaisa.in/paymentlink/addLink",
  ADD_CUSTOMER: "https://paybylink.sabpaisa.in/paymentlink/addCustomers",
  DELETE_CUSTOMER: "https://paybylink.sabpaisa.in/paymentlink/deleteCustomer",
  GET_LINKS: "https://paybylink.sabpaisa.in/paymentlink/getLinks/",
  GET_REPORTS: "https://paybylink.sabpaisa.in/paymentlink/getReports/",

  /** GET MANDATE REG. STATUS */
  MANDATE_REGISTRATION_STATUS:
    "https://subscription.sabpaisa.in/subscription/npci/registration/status/",

  /** RECEIPT MB */
  RECEIPT_MB: adminAPIURL + "/Receipt/ReceiptMB/",

  /** FETCH_DATA_FOR_WACOE */
  FETCH_DATA_FOR_WACOE: "https://qwikforms.in/QwikForms/fetchDataForWACOE",

  //** ReceiptForWalchand */
  RECEIPT_FOR_WALCHAND: adminAPIURL + "/Receipt/ReceiptForWalchand/",

  /** SEARCH_BY_TRANSID */
  SEARCH_BY_TRANSID: adminAPIURL + "/transaction/searchByTransId/",

  /** NODE SERVER URL */
  NODE_PG_URL: "https://cob-node-server.herokuapp.com/getPg/pg-url/",
  MANDATE_REGISTRATION:
    "https://subscription.sabpaisa.in/subscription/mandateRegistration",

  /* ViewTxnEnqMultiParam */
  ViewTxnEnqMultiParam: adminAPIURL + "/Enquiry/ViewTxnEnqMultiParam",

  /**Kyc DocumentsUploads */
  DocumentsUpload: `${kyc_url}/kyc/document-type/`, //get APi

  Upload_Merchant_document: `${kyc_url}/kyc/upload-merchant-document/`, //post APi
  upload_Single_Doc: `${kyc_url}/kyc/upload-merchant-document/single-file/`, //post APi
  UPLOAD_MERCHANT_AADHAAR: `${kyc_url}/kyc/upload-merchant-document/aadhar-upload/`, //post APi
  
  Business_type: `${kyc_url}/kyc/get-all-business-type/`,
  Platform_type: `${kyc_url}/kyc/get-all-platform-type/`,
  Collection_frequency: `${kyc_url}/kyc/get-all-collection-frequency/`,
  Get_ALL_Collection_Type: `${kyc_url}/kyc/get-all-collection-type`,
  save_Business_Info: `${kyc_url}/kyc/save-business-info/`,
  Business_overview_state_: `${kyc_url}/kyc/get-all-state-details/`,

  /////////////////////////Kyc approver
  /* For pending*/
  KYC_FOR_NOT_FILLED: `${kyc_url}/kyc/get-merchant-data/?search=Not-Filled&order_by=-merchantId`,
  KYC_FOR_PENDING_MERCHANTS: `${kyc_url}/kyc/get-merchant-data/?search=Pending&order_by=-merchantId`,
  KYC_FOR_REJECTED_MERCHANTS: `${kyc_url}/kyc/get-merchant-data/?search=Rejected&order_by=-merchantId`,
  KYC_FOR_PROCESSING: `${kyc_url}/kyc/get-merchant-data/?search=processing&order_by=-merchantId`,
  KYC_FOR_VERIFIED: `${kyc_url}/kyc/get-merchant-data/?search=verified&order_by=-merchantId`,
  KYC_FOR_APPROVED: `${kyc_url}/kyc/get-merchant-data/?search=approved&order_by=-merchantId`,
  KYC_FOR_COMPLETED: `${kyc_url}/kyc/get-merchant-data/?search=completed&order_by=-merchantId`,
  MERCHANT_DOCUMENT: `${kyc_url}/kyc/get-merchant-document`,
  DOCUMENT_BY_LOGINID: `${kyc_url}/kyc/upload-merchant-document/document-by-login-id/`,

  /** Contact Information */
  Save_General_Info: `${kyc_url}/kyc/save-general-info/`,

  //==>For Verfifying Contact Info Ist Phase(Send OTP and Verify OTP)
  Send_OTP: `${kyc_url}/kyc/send-otp/`,
  //==>2nd Phase
  Verify_OTP: `${kyc_url}/kyc/verify-otp/`,

  /** Bank Details One OF KYC TAB  */

  Save_Settlement_Info: `${kyc_url}/kyc/save-settlement-info/`,

  //Get All Bnak Names in Kyc Bank Details Dropdown Tab
  GET_ALL_BANK_NAMES: `${kyc_url}/kyc/get-all-bank-name/`,

  Business_overview_state: `${kyc_url}/kyc/get-all-lookup-state/`,
  Business_Category: `${kyc_url}/kyc/get-all-business-category/`,
  SAVE_MERCHANT_INFO: `${kyc_url}/kyc/save-merchant-info/`,

  /*KYC USER LIST */
  Kyc_User_List: `${kyc_url}/kyc/merchant-data-by-login-id/`,


  /* KYC VERIFICATION FOR ALL TABS */
  KYC_TAB_STATUS_URL: `${kyc_url}/kyc/verify-kyc`,

  /*Image Preview API */
  Image_Preview: `${kyc_url}/kyc/get-merchant-document/`,

  /* Registered Address */
  Registered_Address: `${kyc_url}/kyc/save-registered-address/`,

  /* Registered Address */
  Kyc_Consent: `${kyc_url}/kyc/kyc-submit/`,
  /* Product catalogue */

 PRODUCT_DETAILS:`https://stgcobapi.sabpaisa.in/product/product-details`,
 PRODUCT_SUB_DETAILS:`https://stgcobapi.sabpaisa.in/product/product-sub-details`,
 SUBSCRIBE_FETCHAPPAND_PLAN:`https://stgcobapi.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan`,


/* get bank Id */
GET_BANK_ID: `${kyc_url}/kyc/get-bank-id-by-name/`,
/* get bank Id */

  /* verify each tab of the kyc , URL FOR VERIFER*/
  VERIFY_EACH_TAB: `${kyc_url}/kyc/verify-kyc/update/`,
  VERIFY_FINAL_ALL: `${kyc_url}/kyc/verify-kyc/verify/`,
  DOCUMENT_VERIFY: `${kyc_url}/kyc/upload-merchant-document/verify/`,
  DOCUMENT_REJECT: `${kyc_url}/kyc/upload-merchant-document/reject/`,
  DOCUMENT_REMOVE: `${kyc_url}/kyc/upload-merchant-document/remove/`,
  APPROVE_DOCUMENT: `${kyc_url}/kyc/upload-merchant-document/approve/`,
  APPROVE_KYC: `${kyc_url}/kyc/verify-kyc/approve/`,

  // VERIFY_EACH_TAB : `${kyc_url}kyc/verify-kyc/update/`,
};

 
const API_URL = API_LIVE;
export default API_URL;

export const TIMEOUT = 1200; // 1200 seconds = 20 minutes
export const AUTH_TOKEN = "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69";

// COB PG credential
