const ENV_PROD = false; // For proudction make it true, don't change in the local environment
let url,
  kyc_url,
  b2b_url,
  // kyc_validate,
  payout_url,
  webSocketUrl,
  widget_url,
  widget_script,
  payLinkAPIURL,
  qwick_form_url,
  report_api_url,
  paylinkBaseUrl,
  refund_url = "";

if (ENV_PROD) {
  url = "https://cobawsapi.sabpaisa.in";
  kyc_url = "https://cobkyc.sabpaisa.in";
  // kyc_validate = " https://kycvalidator.sabpaisa.in";
  payout_url = "https://payout.sabpaisa.in";
  b2b_url = "https://b2becollect.sabpaisa.in";
  payLinkAPIURL = "https://paybylink.sabpaisa.in/paymentlink";
  webSocketUrl = "wss://stage-notification.sabpaisa.in";
  widget_url = "https://paywidget.sabpaisa.in";
  widget_script = "https://prod-payment-widget-sabpaisa.web.app/widget-bundle.js";
  refund_url = "https://refundapi.sabpaisa.in/SabPaisaRefundApi";
  qwick_form_url = "https://qwikforms.in";
  report_api_url = "https://reportapi.sabpaisa.in";
  paylinkBaseUrl = "https://sendpaylink.sabpaisa.in"
} else {
  url = "https://stgcobapi.sabpaisa.in";
  kyc_url = "https://stgcobkyc.sabpaisa.in";
  // url = "http://192.168.2.44:8000";
  // kyc_url = "http://192.168.2.44:8001";
  // kyc_validate = "https://stage-kycvalidator.sabpaisa.in";
  payout_url = "https://staging-payout.sabpaisa.in";
  b2b_url = "https://stage-b2bchallan.sabpaisa.in";
  widget_url = "https://stage-widget.sabpaisa.in";
  payLinkAPIURL = "https://paybylink-staging.sabpaisa.in/paymentlink";
  webSocketUrl = "wss://stage-notification.sabpaisa.in";
  widget_script = "https://payment-widget-sabpaisa.web.app/widget-bundle.js";
  refund_url = "https://stage-refundapi.sabpaisa.in/SabPaisaRefundApi";
  qwick_form_url = "https://stage-qwikform.sabpaisa.in";
  report_api_url = "https://stage-python-reportapi.sabpaisa.in";
  paylinkBaseUrl = "https://stage-paymentlinks.sabpaisa.in"
}

const subAPIURL = "https://subscription.sabpaisa.in/subscription";
const adminAPIURL = "https://adminapi.sabpaisa.in/SabPaisaAdmin";
// const reportAPIURL = "https://reportapi.sabpaisa.in/SabPaisaReport";

const API_LIVE = {
  BASE_URL_COB: url,
  //------------------------------------------------------------
  AUTH_SIGNUP: `${url}/auth-service/auth/signup`,
  AUTH_LOGIN: `${url}/auth-service/auth/login`,
  AUTH_LOGIN_VERIFY: `${url}/auth-service/auth/login-verify`,
  RECAPTCHA_VERIFY: `${url}/auth-service/auth/captcha-verify`,
  ////////////////////////////////////---------------------------business_cat_code api

  Business_Category_CODE: `${kyc_url}/kyc/get-all-business-category/`,
  getExpectedTransaction: `${kyc_url}/kyc/get-range/transaction-range`,

  // AUTH_CLIENT_CREATE : "${url}/auth-service/client",
  AUTH_CLIENT_CREATE: `${url}/auth-service/client`,
  // AUTH_UPDATE_PROFILE: `${url}/auth-service/updateProfile`,
  AUTH_GET_EMAIL_TO_SEND_OTP: `${url}/auth-service/account/getotp`,
  AUTH_VERIFY_OTP_ON_FWD: `${url}/auth-service/account/verify-otp`,
  AUTH_CREATE_NEW_PASSWORD: `${url}/auth-service/account/forgot-password`,
  AUTH_CHANGE_PASSWORD: `${url}/auth-service/account/change-password`,
  // AUTH_FORGET_PASSWORD: `${url}/auth-service/account/create-password`,
  AUTH_CHECK_CLIENT_CODE: `${url}/auth-service/account/check-clientcode`,
  /* Email Verify for new register users */
  EMAIL_VERIFY: `${url}/auth-service/auth/emailVerify/`,
  BizzAPPForm: `${url}/biz-app-form/`,
  Business_Category_Type: `${url}/auth-service/auth/business-category`,

  ///////////Payment mode for mid
  GET_PAYMENT_MODE_LIST: `${url}/mid/payment-mode/`,
  GET_ALL_BANK_NAME: `${url}/mid/bank/`,
  MID_CREATE_API: `${url}/mid/create/`,
  MID_CLIENT_CODE: `${url}/mid/mid-client-code/`,
  SUBSCRIPTION_BALANCE_DETAIL: `${url}/subscription/balance-detail/`,

  EMAIL_BASE_URL: adminAPIURL + "/REST/Email/sendEmail",

  SUCCESS_TXN_SUMMARY:
    report_api_url + "/transactions/SuccessTxnSummaryMerchant/",
  // https://reportapi.sabpaisa.in/SabPaisaReport/REST/SuccessTxnSummaryMerchant/
  // * Rate mapping */
  RATE_MAPPING_GenerateClientFormForCob:
    adminAPIURL + "/REST/config/GenerateClientFormForCob",
  // https://adminapi.sabpaisa.in/REST/Ratemapping/cloning/clientCodeF/clientCodeT/loginBy
  RATE_MAPPING_CLONE: adminAPIURL + "/REST/Ratemapping/cloning",
  RATE_ENABLE_PAYLINK: adminAPIURL + "/getDataByCommonProc/getCommonData/31",

  CHECK_PERMISSION_PAYLINK:
    adminAPIURL + "/getDataByCommonProc/getCommonData/29/",
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
  GetMerchantTxnHistory: `${report_api_url}/transactions/getMerchantTransactionHistory/`,
  merchantTxnHistoryBit: `${report_api_url}/transactions/getMerchantTransactionHistoryBit/`,
  merchantTxnHistoryWhole: `${report_api_url}/transactions/getMerchantTransactionHistoryWhole/`,
  branchTransactionView: `${report_api_url}/transactions/branchTransactionView/`,
  DownloadTxnHistory: `${url}/download-merchant-transaction-history`,

  /* Settlement Report */
  SettlementReport: report_api_url + "/transactions/GetSettledTxnHistory/",
  SettlementSummaryReport: report_api_url + "/transactions/SettledGroupedView/",
  ChargeBankTxnHistory:
    report_api_url + "/transactions/GetChargebackTxnHistory/",
  RefundTxnHistory: report_api_url + "/transactions/GetRefundTxnHistory/",
  GET_DOITC_SETTLED_TXN_HISTORY:
    report_api_url + "/transactions/GetDOITCSettledTxnHistory/",
  GET_DOITC_MERCHANT_TXN_HISTORY:
    report_api_url + "/transactions/GetDOITCMerchantTxnHistory/",

  /* Transaction Enquiry */
  VIEW_TXN: `${url}/get-transaction-status`,
  VIEW_RECIPTS_TXN: report_api_url + "/transactions/ViewTxnPublic",
  SP2_VIEW_TXN: "https://sp2-adminapi.sabpaisa.in/Enquiry/ViewTxn",

  /* Settlement Report */
  GET_FILE_NAME: adminAPIURL + "/REST/settlementReport/getFileName/",

  /* PAYLINK */
  GET_CUSTOMERS: `${payLinkAPIURL}/getCustomers/`,
  SMART_UPLOAD: `${payLinkAPIURL}/smartupload`,
  EDIT_CUSTOMER: `${payLinkAPIURL}/editCustomer/`,
  GET_CUSTOMER_TYPE: `${payLinkAPIURL}/getCustomerTypes`,
  ADD_LINK: `${payLinkAPIURL}/addLink`,
  ADD_CUSTOMER: `${payLinkAPIURL}/addCustomers`,
  DELETE_CUSTOMER: `${payLinkAPIURL}/deleteCustomer`,
  GET_LINKS: `${payLinkAPIURL}/getLinks/`,
  GET_REPORTS: `${payLinkAPIURL}/getReports/`,

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
  searchQuery: `${kyc_url}/kyc/get-merchant-data/?search=Pending&search_query=lpsuman2001@gmail.com&page_size=5&page=1`,
  DocumentsUpload: `${kyc_url}/kyc/document-type`, //get APi
  getAllClientCode: `${kyc_url}/kyc/get-all-client-code`, //get APi

  getClientCodeByRole: `${kyc_url}/kyc/get-client-code-by-role`,
  saveSubMerchant: `${url}/sub-merchant/create/`,
  getSubMerchants: `${url}/sub-merchant/get/`,

  Upload_Merchant_document: `${kyc_url}/kyc/upload-merchant-document/`, //post APi
  upload_Single_Doc: `${kyc_url}/kyc/upload-merchant-document/single-file/`, //post APi
  UPLOAD_MERCHANT_AADHAAR: `${kyc_url}/kyc/upload-merchant-document/aadhar-upload/`, //post APi

  Business_type: `${kyc_url}/kyc/get-all-business-type/`,
  Platform_type: `${kyc_url}/kyc/get-all-platform-type/`,
  Collection_frequency: `${kyc_url}/kyc/get-all-collection-frequency/`,
  Get_ALL_Collection_Type: `${kyc_url}/kyc/get-all-collection-type`,
  save_Business_Info: `${kyc_url}/kyc/save-business-info/`,
  Business_overview_state: `${kyc_url}/kyc/get-all-state-details/`,
  /////////////////////////////////////////////  AssignZone APi
  ZONE_DETAILS: `${url}/zone/zones`,
  ZONE_MASTER: `${url}/zone/zones-master`,
  RISK_CATEGORY: `${kyc_url}/kyc/get-risk-category-details/`,
  ZONE_EMPLOYEE: `${url}/zone/employee-detail`,
  UPDATE_ZONE_DATA: `${url}/zone/update-zone-data`,
  GET_ZONE_INFO: `${url}/zone/get-zone-info`,

  GET_EMPLOYEE_NAME: `${url}/merchant/employee-data/?order_by=empName`,
  GET_MCC_MASTER_CODE: `${url}/get-mcc-master-data/?order_by=mcc_ellaboration`,
  ////////////////////////////////////////Rate mapping
  GET_RISK_BUISENSS_BYID: `${url}/merchant/get-risk-business-by-id`,
  GET_RISK_TEMPLSTE: `${url}/merchant/get-risk-category-template`,
  TEMPLATE_DETAILS_BYRISKCODE: `${url}/merchant/get-template-detail-by-business-code`,
  ////////////////////////////////////////SIGNUP DATA API
  GET_SIGNUP_DATA_INFO: `${url}/merchant/get-signup-info/`,
  GET_BIZZ_DATA: `${url}/get-biz-app-form/`,
  //////////////////////// For merchnat list export to csv
  Export_FOR_MERCHANT_LIST: `${kyc_url}/kyc/get-merchant-data/`,
  GET_MERCHANT_DATA: `${kyc_url}/kyc/get-merchant-data/`,
  /////////////////////////Kyc approver
  /* For pending*/
  KYC_FOR_NOT_FILLED: `${kyc_url}/kyc/get-merchant-data/?order_by=-id`,
  MY_MERCHANT_LIST: `${kyc_url}/kyc/get-merchant-data/created-by/`,
  KYC_FOR_PENDING_MERCHANTS: `${kyc_url}/kyc/get-merchant-data/?order_by=-id`,
  KYC_FOR_REJECTED_MERCHANTS: `${kyc_url}/kyc/get-merchant-data/?order_by=-kyc_reject`,
  KYC_FOR_PROCESSING: `${kyc_url}/kyc/get-merchant-data/?order_by=-id`,
  KYC_FOR_VERIFIED: `${kyc_url}/kyc/get-merchant-data/?order_by=-verified_date`,
  KYC_FOR_APPROVED: `${kyc_url}/kyc/get-merchant-data/?order_by=-approved_date`,
  KYC_FOR_COMPLETED: `${kyc_url}/kyc/get-merchant-data/?search=completed&order_by=-merchantId`,
  // MERCHANT_DOCUMENT: `${kyc_url}/kyc/get-merchant-document`,
  DOCUMENT_BY_LOGINID: `${kyc_url}/kyc/upload-merchant-document/document-by-login-id/`,
  KYC_FOR_ONBOARDED: `${kyc_url}/kyc/get-merchant-data/`,
  KYC_FOR_SAVING_REFER_MERCHANT: `${kyc_url}/kyc/refer-zone/save-refer-zone/`,
  FOR_GENERATING_MID: `${kyc_url}/kyc/mid-creation/send-request-subMerchant-mid/`,
  GET_ALL_GENERATE_MID_DATA: `${kyc_url}//kyc/mid-creation/get-merchant-mid-data/`,
  ASSIGN_ACCOUNT_MANAGER: `${url}/assigned-account-manager`,
  ACCOUNT_MANAGER_DETAILS: `${url}/account-manager-details`,
  ASSIGN_CLIENT: `${url}/assign-client`,

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
  GET_PLATFORM_BY_ID: `${kyc_url}/kyc/get-platform-by-id/`,
  GET_PAYMENT_MODE: `${kyc_url}/kyc/mid-creation/get-payment-mode-type/`,
  // Business_overview_state: `${kyc_url}/kyc/get-all-lookup-state/`,
  Business_Category: `${kyc_url}/kyc/get-all-business-category/`,
  SAVE_MERCHANT_INFO: `${kyc_url}/kyc/save-merchant-info/`,
  /*KYC USER LIST */
  Kyc_User_List: `${kyc_url}/kyc/merchant-data-by-login-id/`,
  getMerchantInfo: `${kyc_url}/kyc/get-merchant-info/`,
  // PAN API FOR DISPLAY DATA

  GET_MERCHANT_PAN: `${kyc_url}/kyc/get-merchants-by-pan/`,
  /* KYC VERIFICATION FOR ALL TABS */
  KYC_TAB_STATUS_URL: `${kyc_url}/kyc/verify-kyc`,
  /*Image Preview API */
  // Image_Preview: `${kyc_url}/kyc/get-merchant-document/`,
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
  SUBSCRIBED_DETAILS: `${url}/merchant/get-subscribed-details`,

  SUBSCRIPTIONS: `${url}/subscription`,
  GET_SUBSCRIPTIONS: `${url}/get-subscription`,

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

  /////frm(push-merchant-data)
  PUSH_MERCHANT_DATA: `${kyc_url}/kyc/frm/push-merchant-data/`,
  MERCHANT_FRM_LIST: `${kyc_url}/kyc/frm/merchant-frm-list/`,

  ///EDIT KYC FORM
  UPDATE_CONATCT_INFO: `${kyc_url}/kyc/update-kyc/general-info/`,
  UPDATE_BUSINESS_INFO: `${kyc_url}/kyc/update-kyc/business-info/`,
  UPDATE_MERCHANT_INFO: `${kyc_url}/kyc/update-kyc/merchant-info/`,
  UPDATE_SETTLEMENT_INFO: `${kyc_url}/kyc/update-kyc/settlement-info/`,
  UPLOAD_DOCUMENT: `${kyc_url}/kyc/update-kyc/additional-doc/`,

  KYC_ID_LIST: `${kyc_url}/kyc/id-proof/`,
  // Client Detail SandBox //
  CLIENT_DETAIL: `${url}/clientDetail`,
  // KYC VALIDATE URL
  VALIDATE_DOC_KYC: `${kyc_url}/kyc/validator`,
  // VALIDATE_KYC: `${kyc_url}/kyc/validator`,

  // UDYAM_REGISTRATION: `${kyc_url}/kyc/validator`,

  CIN_DETAIL: `${kyc_url}/kyc/validator/cin/`,
  CIN_BY_LOGIN: `${kyc_url}/kyc/cin-data/get-by-login-id/`,

  Aadhar_number: `${kyc_url}/kyc/validator/validate-aadhar/send-otp/`,
  Aadhar_otp_verify: `${kyc_url}/kyc/validator/validate-aadhar/verify-otp/`,

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
  // ---------------------------   NEW API FOR Documents
  // 1)submit
  UPLOAD_E_AGREEMENT: `${kyc_url}/kyc/upload-merchant-document/upload-agreement/`,
  REMOVE_AGREEMENT: `${kyc_url}/kyc/upload-merchant-document/remove-agreement-doc/`,
  GET_MERCHANT_AGREEMENT_BY_LOGIN_ID: `${kyc_url}/kyc/upload-merchant-document/get-merchant-agreement-by-login-id/`,

  // refer list
  GET_REFERRAL: `${kyc_url}/kyc/refer-zone/get-referral-zone-mapper/`,
  // --------------------------------------------------->

  // Check is client code mapped or not (ratemapping case)
  isClientCodeMapped: `${adminAPIURL}/getDataByCommonProc/getCommonData/4`,

  //update version https://adminapi.sabpaisa.in/SabPaisaAdmin/REST/ManageFalg/Flag/LPSD1/apiversion/1/1111
  UPDATE_VERSION_RATEMAPPING: `${adminAPIURL}/REST/ManageFalg/Flag`,

  // For Payout
  LedgersMerchant: `${payout_url}/api/getLedgersMerchant`,
  getLedgersMerchantList: `${payout_url}/api/getTransactionHistory`,
  fetchBeneficiary: `${payout_url}/api/fetchBeneficiaryfor`,
  transactionMode: `${payout_url}/api/modesByMerchantId`,
  paymentRequest: `${payout_url}/api/PayoutTransactionRequest`,
  fetchClientCode: `${payout_url}/api/getByClientCode/`,

  // ---------------------------   NEW API FOR COMMENTS (2)
  // Check is client code mapped or not (ratemapping case)

  //menu list by login id
  menuListByLoginId: `${url}/menu-loginwise`,

  // -------------------------------------------------------------------------Subscription APIS-------------------------------------------||

  HANDLE_RESPONSE: `${subAPIURL}/npci/registration/status/`,
  // Mandate Report
  MANDATE_FREQUENCY: `${subAPIURL}/REST/GetCommonData/0/frequency`,
  MANDATE_CATEGORY: `${subAPIURL}/REST/GetCommonData/0/MandateCategory`,
  // filterMandateReport: `${subAPIURL}/npci/filterMandateReport`,
  frequency: `${subAPIURL}/REST/GetCommonData/0/frequency`,
  mandateType: `${subAPIURL}/REST/GetCommonData/0/MandateType`,
  requestType: `${subAPIURL}/REST/GetCommonData/0/RequestType`,
  bankName: `${subAPIURL}/REST/GetCommonData/0/nb`,
  // mandateRegistration: `${subAPIURL}/mandateRegistration`,
  filterMandateReport: `${subAPIURL}/npci/filterMandateReportCob`,
  //handle Response create mandate api
  CREATE_MANDATE_API_RESPONSE: `${subAPIURL}/REST/getMandateById`,

  // Debit Report
  filterDebitReport: `${subAPIURL}/npci/filterDebitReportCob`,
  mandateSubmit: `${subAPIURL}/registration`,
  mandateSendRequest: `https://enach.npci.org.in/onmags/sendRequest`,

  // for chart
  GET_TRANSACTION_DATA_CHART: report_api_url + "/transactions/getSuccessGraph/",

  //////  client list export to xl
  exportOflineMerchant: `${kyc_url}/kyc/get-merchant-data/export-offline-merchant/`,

  // bank merchant onboard API's // kyc_url 'http://192.168.34.91:8000'
  saveBasicDetails: `${kyc_url}/kyc/bank-merchant/basic-detail/`,
  saveBankDetails: `${kyc_url}/kyc/bank-merchant/bank-detail/`,
  saveBusinesDetails: `${kyc_url}/kyc/bank-merchant/business-detail/`,
  uploadDocuement: `${kyc_url}/kyc/bank-merchant/upload-doc/`,
  // `{{url}}/kyc/bank-merchant/basic-detail/`

  /// userInfo api
  userInfoLoginData: `${kyc_url}/kyc/get-merchant-data/login-data/`,

  //   merchant list with the subscription data
  fetchAllMerchantListWithSubscriptionData: `${url}/subscription/?order_by=-id`,
  unsubscribeProductPlan: `${url}/subscription/unsubscribe-plan/`,

  // adding referral merchant
  addReferral: `${kyc_url}/kyc/referrer/add-referrer/`,
  addReferralChild: `${kyc_url}/kyc/referrer/add-referrer-child/`,
  fetchReferralChild: `${kyc_url}/kyc/get-merchant-data/offline-merchant/`,
  fetchParentClientCodes: `${adminAPIURL}/getDataByCommonProc/getCommonData/35/0`,
  perentTypeMerchantData: `${kyc_url}/kyc/get-merchant-data/parent-type/`,
  getAllzone: `${kyc_url}/kyc/refer-zone/get-all-zone/`,
  saveReferralBizOverview: `${kyc_url}/kyc/referrer/company-referrer-business-overview/`,
  saveReferralAddress: `${kyc_url}/kyc/referrer/referrer-address/`,
  saveReferralIds: `${kyc_url}/kyc/referrer/referrer-id/`,
  // Geo location saving
  saveGeoCord: `${kyc_url}/kyc/coordinate/save/`,
  // Refund transaction
  refundTxn: `${refund_url}/refund`,

  // rolling reserve
  rollingReservePeriod: `${url}/get-rolling-reserve-period`,

  // merchant onboarding in qwick form
  qwickFormOnboard: `${qwick_form_url}/QwikForms/cobMerchant/saveClientCredentials`,

  // get merchant data by client id
  clientDataById: `${url}/GetClientByID`,

  //ipWhiteList

  IP_WHITElIST: `${kyc_url}/kyc/update-merchant-data/website-url/`,

  // Bank merchant related reports
  BANK_MERCHANT_DETAIL_LIST: `${kyc_url}/kyc/get-merchant-data/reseller-merchant-summary/`,
  BANK_MERCHANT_SUMMARY: `${report_api_url}/transactions/merchantSummary/`,

  GET_INFORMATION_BULLETIN: `${url}/get-information-bulletin/?order_by=-id`,
};

const B2B_API_LIVE = {
  challanTransaction: `${b2b_url}/e-collection/challan/get_transactions`,
  challanTransactionExport: `${b2b_url}/e-collection/challan/get_mis`,
};

const WIDGET_LIVE = {
  WIDGET_CLIENT_KEY: `${widget_url}/widget/client-master/create-client/`,
  WIDGET_DETAILS: `${widget_url}/widget/client-master/get_client_details/`,
};
const WIDGET_SCRIPT_LIVE = {
  SCRIPT_URL: `${widget_script}`,
};

export const PAYMENT_LINK = {
  CREATE_PAYER: `${paylinkBaseUrl}/api/payer/create-payer/`,
  UPDATE_PAYER: `${paylinkBaseUrl}/api/payer/update-payer/`,
  DELETE_PAYER: `${paylinkBaseUrl}/api/payer/delete-payer/`,
  GET_PAYER: `${paylinkBaseUrl}/api/payer/get-all-payer/`,
  // https://stage-paymentlinks.sabpaisa.in/api/payer/get-all-payer/?client_code=TM001%27
  CREATE_LINK: `${paylinkBaseUrl}/api/link/create-link/`,
  GET_LINK: `${paylinkBaseUrl}/api/link/get-all-links/`,
  GET_PAYER_TYPE: `${paylinkBaseUrl}/api/payer/get-all-payer-type/`,
  GET_API_KEY: `${paylinkBaseUrl}/api/client-configuration/get-api-key-by-client-code/`,
  // https://stage-paymentlinks.sabpaisa.in/api/client-configuration/get-api-key-by-client-code/?client_code=LPSD1

}

export const wsConnectUrl = {
  connectionURL: webSocketUrl,
  readNotification: `${kyc_url}/kyc/notification/fetch_all/`, //?page_size=5&page=1
};

const API_URL = API_LIVE;


export const WIDGET_URL = WIDGET_LIVE;
// export const Qwick_Form = qwick_form_url;

export const WIDGET_SCRIPT_URL = WIDGET_SCRIPT_LIVE;

export const B2B_URL = B2B_API_LIVE;

export default API_URL;

export const APP_ENV = ENV_PROD;

export const TIMEOUT = 300000; // add milisecond
export const AUTH_TOKEN = "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69";

// COB PG credential
