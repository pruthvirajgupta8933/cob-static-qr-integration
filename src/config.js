const API_LIVE = {
    AUTH_LOGIN_EMAILVERIFY : "https://cobapi.sabpaisa.in/auth-service/auth/emailVerify/",
    AUTH_SIGNUP : "https://cobapi.sabpaisa.in/auth-service/auth/",
    AUTH_LOGIN : "https://cobapi.sabpaisa.in/auth-service/auth/login",
    AUTH_CLIENT_CREATE : "https://cobapi.sabpaisa.in/auth-service/client",
    AUTH_GET_EMAIL_TO_SEND_OTP : "https://cobapi.sabpaisa.in/auth-service/account/forgot-password",
    AUTH_VERIFY_OTP_ON_FWD : "https://cobapi.sabpaisa.in/auth-service/account/verify-otp",
    AUTH_CREATE_NEW_PASSWORD : "https://cobapi.sabpaisa.in/auth-service/account/create-password",
    AUTH_CHANGE_PASSWORD : "https://cobapi.sabpaisa.in/auth-service/account/change-password",
    CHECK_PERMISSION_PAYLINK: "https://adminapi.sabpaisa.in/getDataByCommonProc/getCommonData/29/",


    BANK_IFSC_CODE_VERIFY:"https://ifsc.razorpay.com/",
    BANK_LIST_NB : "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/nb",
    BANK_LIST_DC : "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/dc",

    SEND_EMAIL : "https://adminapi.sabpaisa.in/REST/Email/sendEmail",
    
    SUBSCRIBE_FETCH_APP_AND_PLAN : "https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",
    FETCH_APP_AND_PLAN: "https://spl.sabpaisa.in/client-subscription-service/fetchAppAndPlan",
    SUBSCRIBE_SERVICE: "https://spl.sabpaisa.in/client-subscription-service/subscribe",

    /* transaction history  */
    GET_PAYMENT_STATUS_LIST : "https://adminapi.sabpaisa.in/REST/admin/getPaymentStatusList",
    PAY_MODE_LIST : "https://adminapi.sabpaisa.in/REST/paymode/paymodeList",

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


    /** Email Verify for new register users **/
    EMAIL_VERIFY : "https://cobapi.sabpaisa.in/auth-service/auth/emailVerify/",

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
}

const API_URL =  API_LIVE
export default API_URL;

export const TIMEOUT = 1200;  // 1200 seconds = 20 minutes 


// COB PG credential