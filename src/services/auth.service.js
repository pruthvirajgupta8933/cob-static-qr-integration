import API_URL, { AUTH_TOKEN } from "../config";
import { axiosInstance,axiosInstanceAuth } from "../utilities/axiosInstance";

// axiosInstanceAuth.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// const SIGNUP_URL = "https://cobapi.sabpaisa.in/auth-service/auth/";

const register = (fullname, mobilenumber, emaill, passwordd, business_cat_code,businessType) => {
  return axiosInstanceAuth.post(API_URL.AUTH_SIGNUP, {
    fullname: fullname,
    mobilenumber: mobilenumber,
    business_cat_code:business_cat_code,
    emaill: emaill,
    passwordd: passwordd,
    requestedClientType:businessType,
  })
};

// login old url : https://cobapi.sabpaisa.in/clientOnBoarding/fetchMerchantListUsingLogin 
// login new url : https://cobtest.sabpaisa.in/auth-service/auth/login
// https://cobapi.sabpaisa.in/auth-service/auth/login
const login = (username, password) => {
  return axiosInstanceAuth
    .post(API_URL.AUTH_LOGIN, {
      clientUserId:username,
      userPassword:password,
    })
    .then((response) => {
      // response.data.clientMerchantDetailsList = staticClientList
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }else{

        localStorage.setItem("user", JSON.stringify(response.data));
      }
      
      // console.log(response.data)
      return response.data;
    });
};

const logout = () => {
  // console.log('remove user from LS');
  localStorage.removeItem("user");
  localStorage.clear();
  console.log('logout call auth service');
};



// Home,

const sendEmail = (toEmail, toCc, subject, msg) => {
  return axiosInstanceAuth.post(API_URL.EMAIL_BASE_URL, {
    toEmail,
    toCc,
    subject,
    msg,
  })
  .then((response) => {
    if (response.data) {
      localStorage.setItem("sendEmail", JSON.stringify(response.data));
    }else{
      localStorage.setItem("sendEmail", JSON.stringify(response.data));
    }

    return response.data;
  });
};



// profile service
const BASE_URL = "https://cobapi.sabpaisa.in/auth-service/client";
const BASE_URL_FOR_PROFILE="https://stgcobapi.sabpaisa.in/auth-service"
const BANK_LIST_URL = "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/";
const createClintCode = (object) => {
  // console.log("profileservice",object)
  return axiosInstanceAuth.post(API_URL.AUTH_CLIENT_CREATE, object)
};


const updateClientProfile = (object,clientId)=>{
    return axiosInstanceAuth.put(BASE_URL_FOR_PROFILE + "/updateProfile", object);
}


const verifyClientCode=(clientCode)=>{
  return axiosInstanceAuth.get(BASE_URL + "//verifyClientCode/"+clientCode);
}
 

const verifyIfcsCode=(ifsc_code)=>{
  return axiosInstance.get( "https://ifsc.razorpay.com/"+ifsc_code);
}

const fetchNbBankList=()=>{
  return axiosInstance.get(BANK_LIST_URL + "nb");
}

const fetchDcBankList=()=>{
  return axiosInstance.get(BANK_LIST_URL + "dc");
}


const changePassword = (object) => {
  // console.log("profileservice",object)
  return axiosInstanceAuth.put(API_URL.AUTH_CHANGE_PASSWORD, object)
};


// forgot password function
const getEmailToSendOTP=(object)=>{
  // here we pass the valid email-id / username to send OTP on Phone number and email

   return axiosInstanceAuth.post(API_URL.AUTH_GET_EMAIL_TO_SEND_OTP ,object)
}


const verifyOtpOnForgotPwd=(object)=>{
  // here we pass received OTP on email / phone number
  return axiosInstanceAuth.post(API_URL.AUTH_VERIFY_OTP_ON_FWD ,object)
}

const createNewPassword=(object)=>{
  //CREATE NEW PASSWORD
  return axiosInstanceAuth.post(API_URL.AUTH_CREATE_NEW_PASSWORD ,object)
}


// CHECK_PERMISSION_PAYLINK
const checkPermission=(object)=>{
  //pass client code
  return axiosInstanceAuth.get(`${API_URL.CHECK_PERMISSION_PAYLINK}${object}`)
}

const authService = {
  register,
  login,
  logout,
  sendEmail,
  createClintCode,
  updateClientProfile,
  verifyClientCode,
  fetchNbBankList,
  fetchDcBankList,
  verifyIfcsCode,
  changePassword,
  getEmailToSendOTP,
  verifyOtpOnForgotPwd,
  createNewPassword,
  checkPermission
};

export default authService;
