// KYC (staging): http://13.126.165.212:8000/
// KYC (production): https://kycprocess.sabpaisa.in/

// COB (staging): http://13.126.165.212:5000/
// COB (production): https://cobapi.sabpaisa.in

const env = "staging";
let url,kyc_url = "";


if (env === "staging") {
  url = "https://stgcobapi.sabpaisa.in";
  kyc_url = "https://stgcobkyc.sabpaisa.in";
} else {
  url = "https://cobapi.sabpaisa.in";
  kyc_url = "https://kycprocess.sabpaisa.in";
}
// const stagingUrl = "${url}"
// const prodUrl = "https://cobapi.sabpaisa.-in"

const API_LIVE = {
  // AUTH_LOGIN_EMAILVERIFY : "${url}/auth-service/auth/emailVerify/",
  // AUTH_SIGNUP : "${url}/auth-service/auth/signup",

  //------------------------------------------------------------
  AUTH_SIGNUP: `${url}/auth-service/auth/signup`,
  AUTH_LOGIN: `${url}/auth-service/auth/login`,
  //  AUTH_LOGIN : "${url}/cob/loginapi",

  // AUTH_CLIENT_CREATE : "${url}/auth-service/client",
  AUTH_CLIENT_CREATE: `${url}/cob/createprofile`,
  AUTH_GET_EMAIL_TO_SEND_OTP: `${url}/cob/auth-service/account/forgot-password`,
  AUTH_VERIFY_OTP_ON_FWD: `${url}/cob/auth-service/account/verify-otp`,
  AUTH_CREATE_NEW_PASSWORD: `${url}/cob/auth-service/account/create-password`,
  AUTH_CHANGE_PASSWORD: `${url}/cob/auth-service/account/change-password`,

  /** Email Verify for new register users **/
  // EMAIL_VERIFY : "${url}/auth-service/auth/emailVerify/",
  EMAIL_VERIFY: `${url}/cob/emailverify/`,

  CHECK_PERMISSION_PAYLINK:
    "https://adminapi.sabpaisa.in/getDataByCommonProc/getCommonData/29/",
  BANK_IFSC_CODE_VERIFY: "https://ifsc.razorpay.com/",
  BANK_LIST_NB:
    "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/nb",
  BANK_LIST_DC:
    "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/dc",

  SEND_EMAIL: "https://adminapi.sabpaisa.in/REST/Email/sendEmail",

  SUBSCRIBE_FETCH_APP_AND_PLAN:
    "https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",
  FETCH_APP_AND_PLAN:
    "https://spl.sabpaisa.in/client-subscription-service/fetchAppAndPlan",
  SUBSCRIBE_SERVICE:
    "https://spl.sabpaisa.in/client-subscription-service/subscribe",

  /* transaction history  */
  //old api of txn history
  /*https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2} */

  GET_PAYMENT_STATUS_LIST:
    "https://adminapi.sabpaisa.in/REST/admin/getPaymentStatusList",
  PAY_MODE_LIST: "https://adminapi.sabpaisa.in/REST/paymode/paymodeList",
  GetMerchantTxnHistory:
    "https://adminapi.sabpaisa.in/REST/GetMerchantTxnHistory",

  /* Transaction Enquiry */
  VIEW_TXN: "https://adminapi.sabpaisa.in/Enquiry/ViewTxn",

  /* Settlement Report */
  GET_FILE_NAME:
    "https://adminapi.sabpaisa.in/REST/settlementReport/getFileName/",

  /** PAYLINK **/
  GET_CUSTOMERS: "https://paybylink.sabpaisa.in/paymentlink/getCustomers/",
  SMART_UPLOAD: "https://paybylink.sabpaisa.in/paymentlink/smartupload",
  EDIT_CUSTOMER: "https://paybylink.sabpaisa.in/paymentlink/editCustomer/",
  GET_CUSTOMER_TYPE:
    "https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes",
  ADD_LINK: "https://paybylink.sabpaisa.in/paymentlink/addLink",
  ADD_CUSTOMER: "https://paybylink.sabpaisa.in/paymentlink/addCustomers",
  DELETE_CUSTOMER: "https://paybylink.sabpaisa.in/paymentlink/deleteCustomer",
  GET_LINKS: "https://paybylink.sabpaisa.in/paymentlink/getLinks/",
  GET_REPORTS: "https://paybylink.sabpaisa.in/paymentlink/getReports/",

  /** GET MANDATE REG. STATUS */
  MANDATE_REGISTRATION_STATUS:
    "https://subscription.sabpaisa.in/subscription/npci/registration/status/",

  /** RECEIPT MB */
  RECEIPT_MB: "https://adminapi.sabpaisa.in/Receipt/ReceiptMB/",

  /** FETCH_DATA_FOR_WACOE */
  FETCH_DATA_FOR_WACOE: "https://qwikforms.in/QwikForms/fetchDataForWACOE",

  //** ReceiptForWalchand */
  RECEIPT_FOR_WALCHAND:
    "https://adminapi.sabpaisa.in/Receipt/ReceiptForWalchand/",

  /** SEARCH_BY_TRANSID */
  SEARCH_BY_TRANSID:
    "https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/",

  /** NODE SERVER URL */
  NODE_PG_URL: "https://cob-node-server.herokuapp.com/getPg/pg-url/",
  MANDATE_REGISTRATION:
    "https://subscription.sabpaisa.in/subscription/mandateRegistration",

  /** ViewTxnEnqMultiParam **/
  ViewTxnEnqMultiParam:
    "https://adminapi.sabpaisa.in/Enquiry/ViewTxnEnqMultiParam",

  /**Kyc DocumentsUploads */
  DocumentsUpload: `${kyc_url}/kyc/document-type/`, //get APi
  Upload_Merchant_document: `${kyc_url}/kyc/upload-merchant-document/`, //post APi
  Business_type: `${kyc_url}/kyc/get-all-business-type/`,
  Platform_type: `${kyc_url}/kyc/get-all-platform-type/`,
  Collection_frequency: `${kyc_url}/kyc/get-all-collection-frequency/`,
  Get_ALL_Collection_Type: `${kyc_url}/kyc/get-all-collection-type`,
  save_Business_Info: `${kyc_url}/kyc/save-business-info/`,
  Business_overview_state: `${kyc_url}/kyc/get-all-lookup_state/`,
  Business_Category : `${kyc_url}/kyc/get-all-business-category/`,

  /////////////////////////Kyc approver 
  /* For pending*/
  KYC_FOR_PENDING:`${kyc_url}/kyc/get-merchant-data/?search=pending&order_by=-merchantId`,
  KYC_FOR_VERIFIED:`${kyc_url}/kyc/get-merchant-data/?search=verified&order_by=-merchantId`,
  KYC_FOR_APPROVED:`${kyc_url}/kyc/get-merchant-data/?search=approved&order_by=-merchantId`,
  KYC_FOR_COMPLETED:`${kyc_url}/kyc/get-merchant-data/?search=completed&order_by=-merchantId`,
  





  





  

    /** Contact Information */
    Save_General_Info:`${kyc_url}/kyc/save-general-info/`,

    //==>For Verfifying Contact Info Ist Phase(Send OTP and Verify OTP)
    Send_OTP:`${kyc_url}/kyc/send-otp/`,
    //==>2nd Phase
    Verify_OTP:`${kyc_url}/kyc/verify-otp/`,


    /** Bank Details One OF KYC TAB  */

    Save_Settlement_Info: `${kyc_url}/kyc/save-settlement-info/`,

    //Get All Bnak Names in Kyc Bank Details Dropdown Tab
    GET_ALL_BANK_NAMES: `${kyc_url}/kyc/get-all-bank-name/`,

  Business_overview_state: `${kyc_url}/kyc/get-all-lookup-state/`,
  Business_Category : `${kyc_url}/kyc/get-all-business-category/`,
  SAVE_MERCHANT_INFO: `${kyc_url}/kyc/save-merchant-info/`,

 /*KYC USER LIST */
 Kyc_User_List: `${kyc_url}/kyc/merchant-data-by-login-id/`,

  /*KYC Document Upload LIST */
  Kyc_Doc_List: `${kyc_url}/kyc/upload-merchant-document/document-by-login-id/`,

   /* KYC VERIFICATION FOR ALL TABS */
  Kyc_Verification_For_All_Tabs: `${kyc_url}/kyc/verify-kyc/1/`,

  /*Image Preview API */
  Image_Preview:`${kyc_url}/kyc/get-merchant-document/`
 
};

const API_URL = API_LIVE;
export default API_URL;

export const TIMEOUT = 1200; // 1200 seconds = 20 minutes

// COB PG credential
