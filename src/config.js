const ENV_PROD = false; // don't change in the local environment
let url, kyc_url, b2b_url, kyc_validate, payout_url = "";

if (ENV_PROD) {
  url = "https://cobawsapi.sabpaisa.in";
  kyc_url = "https://cobkyc.sabpaisa.in";
  kyc_validate = " https://kycvalidator.sabpaisa.in";
  payout_url = "https://payout.sabpaisa.in";
  b2b_url = "https://b2becollect.sabpaisa.in"
} else {
  url = "https://stgcobapi.sabpaisa.in";
  kyc_url = "https://stgcobkyc.sabpaisa.in";
  kyc_validate = "https://stage-kycvalidator.sabpaisa.in";
  payout_url = "https://staging-payout.sabpaisa.in";
  b2b_url = "https://stage-b2bchallan.sabpaisa.in"
  

}



const adminAPIURL = "https://adminapi.sabpaisa.in/SabPaisaAdmin";
const reportAPIURL = "https://reportapi.sabpaisa.in/SabPaisaReport";

const API_LIVE = {
  //------------------------------------------------------------
  AUTH_SIGNUP: `${url}/auth-service/auth/signup`,
  AUTH_LOGIN: `${url}/auth-service/auth/login`,
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
  AUTH_CHECK_CLIENT_CODE: `${url}/auth-service/account/check-clientcode`,
  /* Email Verify for new register users */
  EMAIL_VERIFY: `${url}/auth-service/auth/emailVerify/`,

  EMAIL_BASE_URL: adminAPIURL + "/REST/Email/sendEmail",
  SUCCESS_TXN_SUMMARY: reportAPIURL + "/REST/SuccessTxnSummary/",

  // * Rate mapping */
  RATE_MAPPING_GenerateClientFormForCob: adminAPIURL + "/REST/config/GenerateClientFormForCob",
  // https://adminapi.sabpaisa.in/REST/Ratemapping/cloning/clientCodeF/clientCodeT/loginBy
  RATE_MAPPING_CLONE: adminAPIURL + "/REST/Ratemapping/cloning",
  RATE_ENABLE_PAYLINK: adminAPIURL + "/getDataByCommonProc/getCommonData/31",

  CHECK_PERMISSION_PAYLINK: adminAPIURL + "/getDataByCommonProc/getCommonData/29/",
  BANK_IFSC_CODE_VERIFY: "https://ifsc.razorpay.com/",
  BANK_LIST_NB:
    "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/nb",
  BANK_LIST_DC:
    "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/dc",
  SEND_EMAIL: adminAPIURL + "/Email/sendEmail",
  SUBSCRIBE_FETCH_APP_AND_PLAN:
    "https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",
  FETCH_APP_AND_PLAN:
    "https://spl.sabpaisa.in/client-subscription-service/fetchAppAndPlan",
  SUBSCRIBE_SERVICE:
    "https://spl.sabpaisa.in/client-subscription-service/subscribe",

  /* transaction history  */
  //old api of txn history
  /*https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2} */

  GET_PAYMENT_STATUS_LIST: adminAPIURL + "/REST/admin/getPaymentStatusList",
  PAY_MODE_LIST: adminAPIURL + "/REST/paymode/paymodeList",
  // GetMerchantTxnHistory: reportAPIURL+"/REST/GetMerchantTxnHistory",
  GetMerchantTxnHistory: reportAPIURL + "/REST/GetMerchantTxnHistoryN",

  /* Settlement Report */
  SettlementReport: reportAPIURL + "/REST/GetSettledTxnHistory",
  RefundTxnHistory: reportAPIURL + "/REST/GetRefundTxnHistory",
  ChargeBankTxnHistory: reportAPIURL + "/REST/GetChargebackTxnHistory",

  /* Transaction Enquiry */
  VIEW_TXN: reportAPIURL + "/Enquiry/ViewTxn",
  SP2_VIEW_TXN: "https://sp2-adminapi.sabpaisa.in/Enquiry/ViewTxn",

  /* Settlement Report */
  GET_FILE_NAME: adminAPIURL + "/REST/settlementReport/getFileName/",

  /* PAYLINK */
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
  DocumentsUpload: `${kyc_url}/kyc/document-type`, //get APi

  Upload_Merchant_document: `${kyc_url}/kyc/upload-merchant-document/`, //post APi
  upload_Single_Doc: `${kyc_url}/kyc/upload-merchant-document/single-file/`, //post APi
  UPLOAD_MERCHANT_AADHAAR: `${kyc_url}/kyc/upload-merchant-document/aadhar-upload/`, //post APi

  Business_type: `${kyc_url}/kyc/get-all-business-type/`,
  Platform_type: `${kyc_url}/kyc/get-all-platform-type/`,
  Collection_frequency: `${kyc_url}/kyc/get-all-collection-frequency/`,
  Get_ALL_Collection_Type: `${kyc_url}/kyc/get-all-collection-type`,
  save_Business_Info: `${kyc_url}/kyc/save-business-info/`,
  Business_overview_state_: `${kyc_url}/kyc/get-all-state-details/`,
  /////////////////////////////////////////////  AssignZone APi
  ZONE_DETAILS: `${url}/zone/zones`,
  ZONE_MASTER: `${url}/zone/zones-master`,
  RISK_CATEGORY: `${kyc_url}/kyc/get-risk-category-details/`,
  ZONE_EMPLOYEE: `${url}/zone/employee-detail`,
  UPDATE_ZONE_DATA: `${url}/zone/update-zone-data`,
  GET_ZONE_INFO: `${url}/zone/get-zone-info`,
  ////////////////////////////////////////Rate mapping
  GET_RISK_BUISENSS_BYID: `${url}/merchant/get-risk-business-by-id`,
  GET_RISK_TEMPLSTE: `${url}/merchant/get-risk-category-template`,
  TEMPLATE_DETAILS_BYRISKCODE: `${url}/merchant/get-template-detail-by-business-code`,
  ////////////////////////////////////////SIGNUP DATA API
  GET_SIGNUP_DATA_INFO: `${url}/merchant/get-signup-info/`,
  //////////////////////// For merchnat list export to csv
  Export_FOR_MERCHANT_LIST: `${kyc_url}/kyc/get-merchant-data/all-data/`,
  /////////////////////////Kyc approver
  /* For pending*/
  KYC_FOR_NOT_FILLED: `${kyc_url}/kyc/get-merchant-data/?search=Not-Filled&order_by=-merchantId`,
  KYC_FOR_PENDING_MERCHANTS: `${kyc_url}/kyc/get-merchant-data/?search=Pending&order_by=-merchantId`,
  KYC_FOR_REJECTED_MERCHANTS: `${kyc_url}/kyc/get-merchant-data/?search=Rejected&order_by=-merchantId`,
  KYC_FOR_PROCESSING: `${kyc_url}/kyc/get-merchant-data/?search=processing&order_by=-merchantId`,
  KYC_FOR_VERIFIED: `${kyc_url}/kyc/get-merchant-data/?search=verified&order_by=-merchantId`,
  KYC_FOR_APPROVED: `${kyc_url}/kyc/get-merchant-data/?search=Approved&order_by=-merchantId`,
  KYC_FOR_COMPLETED: `${kyc_url}/kyc/get-merchant-data/?search=completed&order_by=-merchantId`,
  MERCHANT_DOCUMENT: `${kyc_url}/kyc/get-merchant-document`,
  DOCUMENT_BY_LOGINID: `${kyc_url}/kyc/upload-merchant-document/document-by-login-id/`,
  KYC_FOR_ONBOARDED: `${kyc_url}/kyc/get-merchant-data/`,
  KYC_FOR_SAVING_REFER_MERCHANT:`${kyc_url}/kyc/refer-zone/save-refer-zone/`,
  FOR_GENERATING_MID:`${kyc_url}/kyc/mid-creation/send-request-subMerchant-mid/`,
  GET_ALL_GENERATE_MID_DATA:`${kyc_url}//kyc/mid-creation/get-merchant-mid-data/`,



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
  GET_PAYMENT_MODE:`${kyc_url}/kyc/mid-creation/get-payment-mode-type/`,
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
  PRODUCT_DETAILS: `${url}/product/product-details`,
  PRODUCT_SUB_DETAILS: `${url}/product/product-sub-details`,
  SUBSCRIBE_FETCHAPPAND_PLAN: `${url}/client-subscription-service/subscribeFetchAppAndPlan`,
  Get_Subscribed_Plan_Detail_By_ClientId: `${url}/client-subscription-service/GetSubscribedPlanDetailByClientId`,
  UPDATE_SUBSCRIBED_PLAN_DETAILS: `${url}/subscribed/update-detail`,
  PRE_UPDATE_SUBSCRIBE_DETAILS: `${url}/subscribed/Pre-update-subscribed-detail`,



  /* get bank , business type, business category by Id */
  GET_BANK_ID: `${kyc_url}/kyc/get-bank-id-by-name/`,
  GET_BUSINESS_TYPE_ID: `${kyc_url}/kyc/get-business-type-by-id/`,
  GET_BUSINESS_CATEGORY_ID: `${kyc_url}/kyc/get-business-category-by-id/`,
  /* get bank, business type, business category by Id ====*/
  /* verify each tab of the kyc, URL FOR VERIFER ====*/
  VERIFY_EACH_TAB: `${kyc_url}/kyc/verify-kyc/update/`,
  VERIFY_FINAL_ALL: `${kyc_url}/kyc/verify-kyc/verify/`,
  DOCUMENT_VERIFY: `${kyc_url}/kyc/upload-merchant-document/verify/`,
  DOCUMENT_REJECT: `${kyc_url}/kyc/upload-merchant-document/reject/`,
  CHECKED_DOCUMENT_REJECT: `${kyc_url}/kyc/upload-merchant-document/document-reject/`,
  DOCUMENT_REMOVE: `${kyc_url}/kyc/upload-merchant-document/remove/`,
  APPROVE_DOCUMENT: `${kyc_url}/kyc/upload-merchant-document/approve/`,
  APPROVE_KYC: `${kyc_url}/kyc/verify-kyc/approve/`,
  // VERIFY_EACH_TAB : `${kyc_url}kyc/verify-kyc/update/`,
  // Reject each tab of the kyc , URL FOR VERIFER
  REJECT_KYC_TAB: `${kyc_url}/kyc/verify-kyc/tab-reject/`,
  COMPLETE_VERIFICATION: `${kyc_url}/kyc/verify-kyc/verify/`,
  COMPLETE_VERIFICATION_REJECT_KYC: `${kyc_url}/kyc/verify-kyc/reject/`,
  //Reversing from pending approval to pending verification
  Back_To_Pending_Verification: `${kyc_url}/kyc/reverse-kyc/approver-to-verifier/`,
  Back_To_Pending_Approval: `${kyc_url}/kyc/reverse-kyc/re-approval/`,
  Back_To_Pending_KYC: `${kyc_url}/kyc/reverse-kyc/re-kyc-submit/`,



  // Client Detail SandBox //
  CLIENT_DETAIL: `${url}/clientDetail`,
  // KYC VALIDATE URL
  VALIDATE_KYC: `${kyc_validate}/validator`,
  // For comments in approver and merchant (Pending Verification and Pending Approval)
  COMMENTS_BOX: `${url}/merchant/update-comments`,
  // OnBoard Merchant Role URL 
  Roles_DropDown: `${kyc_url}/kyc/get-all-role-details/`,
  // Fetch selected product during registration
  website_plan_details: `${url}/auth-service/auth/login/website-plan-detail`,
  // ---------------------------   NEW API FOR COMMENTS (2)
  // For Saving Comments
  SAVE_COMMENTS: `${url}/merchant/save-comments`,
  // GET API FOR VIEWING COMMENTS
  VIEW_COMMENTS_LIST: `${url}/merchant/get-comments-by-clientcode`,

  // ---------------------------   NEW API FOR COMMENTS (2)

  // Check is client code mapped or not (ratemapping case)
  isClientCodeMapped: `${adminAPIURL}/getDataByCommonProc/getCommonData/4`,
  
  //update version https://adminapi.sabpaisa.in/SabPaisaAdmin/REST/ManageFalg/Flag/LPSD1/apiversion/1/1111 
  UPDATE_VERSION_RATEMAPPING: `${adminAPIURL}/REST/ManageFalg/Flag`,

  // For Payout
  LedgersMerchant:`${payout_url}/api/getLedgersMerchant`,
  getLedgersMerchantList:`${payout_url}/api/getTransactionHistory`,
  fetchBeneficiary:`${payout_url}/api/fetchBeneficiaryfor`,
  transactionMode: `${payout_url}/api/modesByMerchantId`,
  paymentRequest: `${payout_url}/api/PayoutTransactionRequest`,


  // ---------------------------   NEW API FOR COMMENTS (2)
  // Check is client code mapped or not (ratemapping case)

  //menu list by login id
  menuListByLoginId : `${url}/menu-loginwise`,

  
};


const B2B_API_LIVE = {
  challanTransaction: `${b2b_url}/e-collection/challan/get_transactions`,
  challanTransactionExport: `${b2b_url}/e-collection/challan/get_mis`
}


const API_URL = API_LIVE;

export const B2B_URL = B2B_API_LIVE;
export default API_URL;


export const APP_ENV = ENV_PROD;

export const TIMEOUT = 1500; // time in seconds 1500 = 25 minutes
export const AUTH_TOKEN = "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69";

// COB PG credential
