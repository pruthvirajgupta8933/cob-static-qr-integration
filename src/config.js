const DEVELOPMENT_MODE = true;

const API_TEST = {
    AUTH_LOGIN_EMAILVERIFY : "https://cobtest.sabpaisa.in/auth-service/auth/emailVerify/",
    AUTH_SIGNUP : "https://cobtest.sabpaisa.in/auth-service/auth/",
    AUTH_LOGIN : "https://cobtest.sabpaisa.in/auth-service/auth/login",
    AUTH_CLIENT_CREATE : "https://cobtest.sabpaisa.in/auth-service/client",
    AUTH_GET_EMAIL_TO_SEND_OTP : "https://cobtest.sabpaisa.in/auth-service/account/forgot-password",
    AUTH_VERIFY_OTP_ON_FWD : "https://cobtest.sabpaisa.in/auth-service/account/verify-otp",
    AUTH_CREATE_NEW_PASSWORD : "https://cobtest.sabpaisa.in/auth-service/account/create-password",
    AUTH_CHANGE_PASSWORD : "https://cobtest.sabpaisa.in/auth-service/account/change-password",
    CHECK_PERMISSION_PAYLINK: "https://adminapi.sabpaisa.in/getDataByCommonProc/getCommonData/29/"
}


const API_LIVE = {
    AUTH_LOGIN_EMAILVERIFY : "https://cobtest.sabpaisa.in/auth-service/auth/emailVerify/",
    AUTH_SIGNUP : "https://cobtest.sabpaisa.in/auth-service/auth/",
    AUTH_LOGIN : "https://cobtest.sabpaisa.in/auth-service/auth/login",
    AUTH_CLIENT_CREATE : "https://cobtest.sabpaisa.in/auth-service/client",
    AUTH_GET_EMAIL_TO_SEND_OTP : "https://cobtest.sabpaisa.in/auth-service/account/forgot-password",
    AUTH_VERIFY_OTP_ON_FWD : "https://cobtest.sabpaisa.in/auth-service/account/verify-otp",
    AUTH_CREATE_NEW_PASSWORD : "https://cobtest.sabpaisa.in/auth-service/account/create-password",
    AUTH_CHANGE_PASSWORD : "https://cobtest.sabpaisa.in/auth-service/account/change-password",
    CHECK_PERMISSION_PAYLINK: "https://adminapi.sabpaisa.in/getDataByCommonProc/getCommonData/29/"

}

const API_URL = DEVELOPMENT_MODE ? API_TEST : API_LIVE
export default API_URL;