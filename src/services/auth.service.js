
import API_URL from "../config";
import { axiosInstance, axiosInstanceAuth, axiosInstanceJWT } from "../utilities/axiosInstance";
import { clearLocalStore } from "../utilities/clearLocalStorage";


const register = ({ fullname, mobileNumber, email, business_cat_code, password, businessType, isDirect, created_by, roleId, plan_details, is_social, zone_code, developer_contact, developer_name }) => {
  const requestData = {
    name: fullname,
    mobileNumber: mobileNumber,
    email: email,
    business_cat_code: business_cat_code,
    password: password,
    requestedClientType: businessType,
    isDirect: isDirect,
    created_by: created_by,
    roleId: roleId,
    plan_details: plan_details,
    is_social: is_social,
    developer_contact: developer_contact || "",
    developer_name: developer_contact || ""
  };
  if (zone_code) {
    requestData.zone_code = zone_code;
  }

  return axiosInstanceAuth.post(API_URL.AUTH_SIGNUP, requestData);
};


const login = async (obj) => {
  return axiosInstanceAuth.post(API_URL.AUTH_LOGIN, {
    ...obj
  })
};

const loginOtpVerify = async (otp, verification_token) => {

  return axiosInstanceAuth.post(API_URL.AUTH_LOGIN_VERIFY, {
    otp,
    verification_token
  })
};

const logout = () => {
  clearLocalStore()

};




const createClintCode = (object) => {
  return axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, object)
};

const checkClintCode = (object) => {
  return axiosInstanceJWT.post(API_URL.AUTH_CHECK_CLIENT_CODE, object)
};

const captchaVerify = (object) => {
  return axiosInstanceJWT.post(API_URL.RECAPTCHA_VERIFY, object)
};

const changePassword = (object) => {
  // console.log("profileservice",object)
  return axiosInstanceJWT.put(API_URL.AUTH_CHANGE_PASSWORD, object)
};


// forgot password function
const getEmailToSendOTP = (object) => {
  // here we pass the valid email-id / username to send OTP on Phone number and email

  return axiosInstanceAuth.post(API_URL.AUTH_GET_EMAIL_TO_SEND_OTP, object)
}


const verifyOtpOnForgotPwd = (object) => {
  // here we pass received OTP on email / phone number
  return axiosInstanceAuth.post(API_URL.AUTH_VERIFY_OTP_ON_FWD, object)
}

const createNewPassword = (object) => {
  //CREATE NEW PASSWORD
  return axiosInstanceAuth.post(API_URL.AUTH_CREATE_NEW_PASSWORD, object)
}


// CHECK_PERMISSION_PAYLINK
const checkPermission = (object) => {
  //pass client code
  return axiosInstance.get(`${API_URL.CHECK_PERMISSION_PAYLINK}${object}`)
}


const emailVerification = async (loginId) => {
  return axiosInstanceAuth.put(`${API_URL.EMAIL_VERIFY}${loginId}`)
}

const authService = {
  register,
  login,
  loginOtpVerify,
  logout,
  emailVerification,
  createClintCode,
  captchaVerify,
  changePassword,
  getEmailToSendOTP,
  verifyOtpOnForgotPwd,
  createNewPassword,
  checkPermission,
  checkClintCode
};

export default authService;
