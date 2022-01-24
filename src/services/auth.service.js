import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const SIGNUP_URL = "http://18.216.47.58:8080/auth-service/auth/";

const register = (fullName, mobileNumber, email, password, selectStates) => {
  return axios.post(SIGNUP_URL + "signup", {
    name: fullName,
    mobileNumber: mobileNumber,
    email: email,
    password: password,
    state: selectStates,
  })
  .then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem("register", JSON.stringify(response.data));
    }else{
      localStorage.setItem("register", JSON.stringify(response.data));
    }

    return response.data;
  });
};

const login = (username, password) => {
  return axios
    .post("https://spl.sabpaisa.in/clientOnBoarding/fetchMerchantListUsingLogin", {
      clientUserId:username,
      userPassword:password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }else{
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  // console.log('remove user from LS');
  localStorage.removeItem("user");
};



// Home, successTxnSummary 
const BASE_URL = "https://adminapi.sabpaisa.in";

const successTxnSummary = (fromdate, todate, clientcode) => {
  // console.log('fromDate',fromdate);
  return axios.post(BASE_URL + "/REST/SuccessTxnSummary/", {
    fromdate,
    todate,
    clientcode,
  });
};

// <<<<<<< HEAD

const authtest=(ttt)=>{
  return ttt
}
// =======
const sendEmail = (toEmail, toCc, subject, msg) => {
  return axios.post(BASE_URL + "/REST/Email/sendEmail", {
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

const authService = {
  register,
  login,
  logout,
  successTxnSummary,
  authtest,
  sendEmail,
};

export default authService;
