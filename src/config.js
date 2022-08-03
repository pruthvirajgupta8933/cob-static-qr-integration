const env = "staging"
let url = "";

<<<<<<< HEAD
if(env == "staging") {
=======
if(env === "staging") {
>>>>>>> phase_1
  url ="http://13.126.165.212:5000"
}
else  {
  url = "https://cobapi.sabpaisa.-in"
}
// const stagingUrl = "${url}"
// const prodUrl = "https://cobapi.sabpaisa.-in"

const API_LIVE = {
  // AUTH_LOGIN_EMAILVERIFY : "${url}/auth-service/auth/emailVerify/",
  // AUTH_SIGNUP : "${url}/auth-service/auth/signup",

  //------------------------------------------------------------
  AUTH_SIGNUP : `${url}/cob/register`  ,
  AUTH_LOGIN : `${url}/cob/loginapi`,
  //  AUTH_LOGIN : "${url}/cob/loginapi",
  

  // AUTH_CLIENT_CREATE : "${url}/auth-service/client",
  AUTH_CLIENT_CREATE : `${url}/cob/createprofile`,
  AUTH_GET_EMAIL_TO_SEND_OTP : `${url}/cob/auth-service/account/forgot-password`,
  AUTH_VERIFY_OTP_ON_FWD : `${url}/cob/auth-service/account/verify-otp`,
  AUTH_CREATE_NEW_PASSWORD : `${url}/cob/auth-service/account/create-password`,
  AUTH_CHANGE_PASSWORD : `${url}/cob/auth-service/account/change-password`,
  
  /** Email Verify for new register users **/
  // EMAIL_VERIFY : "${url}/auth-service/auth/emailVerify/",
  EMAIL_VERIFY : `${url}/cob/emailverify/`,


  


  CHECK_PERMISSION_PAYLINK: "https://adminapi.sabpaisa.in/getDataByCommonProc/getCommonData/29/",
  BANK_IFSC_CODE_VERIFY:"https://ifsc.razorpay.com/",
  BANK_LIST_NB : "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/nb",
  BANK_LIST_DC : "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/dc",

  SEND_EMAIL : "https://adminapi.sabpaisa.in/REST/Email/sendEmail",
  
  SUBSCRIBE_FETCH_APP_AND_PLAN : "https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",
  FETCH_APP_AND_PLAN: "https://spl.sabpaisa.in/client-subscription-service/fetchAppAndPlan",
  SUBSCRIBE_SERVICE: "https://spl.sabpaisa.in/client-subscription-service/subscribe",

  /* transaction history  */
    //old api of txn history
  /*https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2} */

  GET_PAYMENT_STATUS_LIST : "https://adminapi.sabpaisa.in/REST/admin/getPaymentStatusList",
  PAY_MODE_LIST : "https://adminapi.sabpaisa.in/REST/paymode/paymodeList",
  GetMerchantTxnHistory : "https://adminapi.sabpaisa.in/REST/GetMerchantTxnHistory",
  
  /* Transaction Enquiry */
  VIEW_TXN : "https://adminapi.sabpaisa.in/Enquiry/ViewTxn",

  /* Settlement Report */
  GET_FILE_NAME : "https://adminapi.sabpaisa.in/REST/settlementReport/getFileName/",

  /** PAYLINK **/
  GET_CUSTOMERS : "https://paybylink.sabpaisa.in/paymentlink/getCustomers/",
  SMART_UPLOAD : "https://paybylink.sabpaisa.in/paymentlink/smartupload",
  EDIT_CUSTOMER : "https://paybylink.sabpaisa.in/paymentlink/editCustomer/",
  GET_CUSTOMER_TYPE : "https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes",
  ADD_LINK : "https://paybylink.sabpaisa.in/paymentlink/addLink",
  ADD_CUSTOMER : "https://paybylink.sabpaisa.in/paymentlink/addCustomers",
  DELETE_CUSTOMER : "https://paybylink.sabpaisa.in/paymentlink/deleteCustomer",
  GET_LINKS : "https://paybylink.sabpaisa.in/paymentlink/getLinks/",
  GET_REPORTS : "https://paybylink.sabpaisa.in/paymentlink/getReports/",



  /** GET MANDATE REG. STATUS */
  MANDATE_REGISTRATION_STATUS : "https://subscription.sabpaisa.in/subscription/npci/registration/status/",

  /** RECEIPT MB */
  RECEIPT_MB : "https://adminapi.sabpaisa.in/Receipt/ReceiptMB/",

  /** FETCH_DATA_FOR_WACOE */
  FETCH_DATA_FOR_WACOE:"https://qwikforms.in/QwikForms/fetchDataForWACOE",

  //** ReceiptForWalchand */
  RECEIPT_FOR_WALCHAND : "https://adminapi.sabpaisa.in/Receipt/ReceiptForWalchand/",

  /** SEARCH_BY_TRANSID */
  SEARCH_BY_TRANSID :"https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/",


  /** NODE SERVER URL */
  NODE_PG_URL : "https://cob-node-server.herokuapp.com/getPg/pg-url/",
  MANDATE_REGISTRATION : "https://subscription.sabpaisa.in/subscription/mandateRegistration",

  /** ViewTxnEnqMultiParam **/
  ViewTxnEnqMultiParam : "https://adminapi.sabpaisa.in/Enquiry/ViewTxnEnqMultiParam",

<<<<<<< HEAD
  /**Kyc DocumentsUploads */
  DocumentsUpload:"http://13.126.165.212:8000/kyc/document-type/",                      //get APi
  Upload_Merchant_document:"http://13.126.165.212:8000/kyc/upload-merchant-document/", //post APi

  ///////////Business overview//////////////
  Buisness_overview:"http://13.126.165.212:8000/kyc/get-all-business-type/",
  Buisness_category:"http://13.126.165.212:8000/kyc/get-all-business-category",
  Platform_type:"http://13.126.165.212:8000/kyc/get-all-platform-type/",
  Collection_frequency:"http://13.126.165.212:8000/kyc/get-all-collection-frequency/",
 Get_ALL_Collection_Type :"http://13.126.165.212:8000/kyc/get-all-collection-type",
 save_Business_Info:"http://13.126.165.212:8000/kyc/save-business-info/",

 //////////////////////Business Details////////////////
 Buisness_overview_state:"http://13.126.165.212:8000/kyc/get-all-lookup-state/",

 ////PUTsave merchant info///
 save_merchant_info:"http://13.126.165.212:8000/kyc/save-merchant-info/",



=======

>>>>>>> phase_1
    
}

const API_URL =  API_LIVE
export default API_URL;

export const TIMEOUT = 1200;  // 1200 seconds = 20 minutes 


// COB PG credential