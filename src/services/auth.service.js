import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
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
  localStorage.removeItem("user");
};



// Home, successTxnSummary 
const BASE_URL = "https://adminapi.sabpaisa.in";

const successTxnSummary = (fromdate, todate, clientcode) => {
  console.log('fromDate',fromdate);
  return axios.post(BASE_URL + "/REST/SuccessTxnSummary/", {
    fromdate,
    todate,
    clientcode,
  });
};

<<<<<<< HEAD

const authtest=(ttt)=>{
  return ttt
}
=======
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
>>>>>>> 47020e4e03d5f8550b97ad46a01cae5f87f9cd9d

const authService = {
  register,
  login,
  logout,
  successTxnSummary,
<<<<<<< HEAD
  authtest,
=======
  sendEmail,
>>>>>>> 47020e4e03d5f8550b97ad46a01cae5f87f9cd9d
};

export default authService;
