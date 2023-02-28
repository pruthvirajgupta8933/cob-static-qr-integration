import API_URL from "../config";
import { axiosInstance, axiosInstanceAuth, axiosInstanceJWT } from "../utilities/axiosInstance";
import { stringEnc } from "../utilities/encodeDecode";

const register = ({fullname, mobileNumber, email, business_cat_code, password, businessType, isDirect, requestId, roleId, plan_details}) => {
  return axiosInstanceAuth.post(API_URL.AUTH_SIGNUP, {
    name: fullname,
    mobileNumber: mobileNumber,
    email: email,
    business_cat_code: business_cat_code,
    password: password,
    requestedClientType: businessType,
    isDirect: isDirect,
    requestId: requestId,
    roleId: roleId,
    plan_details: plan_details
  })
};


const login = (username, password) => {
  return axiosInstanceJWT
    .post(API_URL.AUTH_LOGIN, {
      clientUserId: username,
      userPassword: password,
    })
    .then((response) => {
      
      sessionStorage.setItem("user", JSON.stringify(response.data));
      sessionStorage.setItem("categoryId", 1)
      sessionStorage.setItem("prog_id", stringEnc(password))
      return response.data;
    });
};

const logout = () => {
  sessionStorage.removeItem("user");
  sessionStorage.clear();
  sessionStorage.clear();

};




const createClintCode = (object) => {
  return axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, object)
};

const checkClintCode = (object) => {
  return axiosInstanceJWT.post(API_URL.AUTH_CHECK_CLIENT_CODE, object)
};


// const updateClientProfile = (object, clientId) => {
//   return axiosInstanceJWT.put(BASE_URL_FOR_PROFILE + "/updateProfile", object);
// }


// const verifyClientCode = (clientCode) => {
//   return axiosInstanceJWT.get(BASE_URL + "/verifyClientCode/" + clientCode);
// }


const verifyIfcsCode = (ifsc_code) => {
  return axiosInstance.get("https://ifsc.razorpay.com/" + ifsc_code);
}

// const fetchNbBankList = () => {
//   return axiosInstance.get(BANK_LIST_URL + "nb");
// }

// const fetchDcBankList = () => {
//   return axiosInstance.get(BANK_LIST_URL + "dc");
// }


const changePassword = (object) => {
  // console.log("profileservice",object)
  return axiosInstanceJWT.put(API_URL.AUTH_CHANGE_PASSWORD, object)
};


// forgot password function
const getEmailToSendOTP = (object) => {
  // here we pass the valid email-id / username to send OTP on Phone number and email

  return axiosInstanceJWT.post(API_URL.AUTH_GET_EMAIL_TO_SEND_OTP, object)
}


const verifyOtpOnForgotPwd = (object) => {
  // here we pass received OTP on email / phone number
  return axiosInstanceJWT.post(API_URL.AUTH_VERIFY_OTP_ON_FWD, object)
}

const createNewPassword = (object) => {
  //CREATE NEW PASSWORD
  return axiosInstanceJWT.post(API_URL.AUTH_CREATE_NEW_PASSWORD, object)
}


// CHECK_PERMISSION_PAYLINK
const checkPermission = (object) => {
  //pass client code
  return axiosInstance.get(`${API_URL.CHECK_PERMISSION_PAYLINK}${object}`)
}

const authService = {
  register,
  login,
  logout,
  // sendEmail,
  createClintCode,
  // updateClientProfile,
  // verifyClientCode,
  // fetchNbBankList,
  // fetchDcBankList,
  verifyIfcsCode,
  changePassword,
  getEmailToSendOTP,
  verifyOtpOnForgotPwd,
  createNewPassword,
  checkPermission,
  checkClintCode
};

export default authService;
