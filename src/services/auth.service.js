import axios from "axios";
import API_URL from "../config";

const SIGNUP_URL = "https://spl.sabpaisa.in/auth-service/auth/";

const register = (firstName, lastName, mobileNumber, email, password,businessType) => {
  return axios.post(SIGNUP_URL + "signup", {
    name: firstName+' '+ lastName,
    mobileNumber: mobileNumber,
    email: email,
    password: password,
    requestedClientType:businessType,
  })
};

// login old url : https://spl.sabpaisa.in/clientOnBoarding/fetchMerchantListUsingLogin 
// login new url : https://cobtest.sabpaisa.in/auth-service/auth/login
// https://spl.sabpaisa.in/auth-service/auth/login
const login = (username, password) => {
  return axios
    .post("https://spl.sabpaisa.in/clientOnBoarding/fetchMerchantListUsingLogin", {
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
  // alert('logout call auth service');
};



// Home,
const EMAIL_BASE_URL = "https://adminapi.sabpaisa.in";

const sendEmail = (toEmail, toCc, subject, msg) => {
  return axios.post(EMAIL_BASE_URL + "/REST/Email/sendEmail", {
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

const BASE_URL = "https://spl.sabpaisa.in/auth-service/client";
const BANK_LIST_URL = "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/";

const createClintCode = (object) => {
  // console.log("profileservice",object)
  return axios.post(BASE_URL + "/create", object)
};


const updateClientProfile = (object,clientId)=>{
    return axios.post(BASE_URL + "/update/"+clientId, object);
}


const verifyClientCode=(clientCode)=>{
  return axios.get(BASE_URL + "//verifyClientCode/"+clientCode);
}
 

const verifyIfcsCode=(ifsc_code)=>{
  return axios.get( "https://ifsc.razorpay.com/"+ifsc_code);
}

const fetchNbBankList=()=>{
  return axios.get(BANK_LIST_URL + "nb");
}

const fetchDcBankList=()=>{
  return axios.get(BANK_LIST_URL + "dc");
}


const changePassword = (object) => {
  // console.log("profileservice",object)
  return axios.post(API_URL.AUTH_CHANGE_PASSWORD, object)
};


// forgot password function
const getEmailToSendOTP=(object)=>{
  // here we pass the valid email-id / username to send OTP on Phone number and email
  const  config = { headers: {'Content-Type' : 'application/json'}
          }
   return axios.post(API_URL.AUTH_GET_EMAIL_TO_SEND_OTP ,object)
}


const verifyOtpOnForgotPwd=(object)=>{
  // here we pass received OTP on email / phone number
  return axios.post(API_URL.AUTH_VERIFY_OTP_ON_FWD ,object)
}

const createNewPassword=(object)=>{
  //CREATE NEW PASSWORD
  return axios.post(API_URL.AUTH_CREATE_NEW_PASSWORD ,object)
}


// CHECK_PERMISSION_PAYLINK
const checkPermission=(object)=>{
  //pass client code
  return axios.get(API_URL.CHECK_PERMISSION_PAYLINK + object)
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
