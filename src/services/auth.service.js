import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const SIGNUP_URL = "https://cobtest.sabpaisa.in/auth-service/auth/";

const register = (firstName, lastName, mobileNumber, email, password) => {
  return axios.post(SIGNUP_URL + "signup", {
    name: firstName+' '+ lastName,
    mobileNumber: mobileNumber,
    email: email,
    password: password,
    requestedClientType:1,
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

// login old url : https://spl.sabpaisa.in/clientOnBoarding/fetchMerchantListUsingLogin 
// login new url : https://cobtest.sabpaisa.in/auth-service/auth/login

var staticClientList = [
  {
    "clientId": 2078,
    "clientCode": "LPSD1",
    "clientName": "Laxman Public School",
    "clientContact": "7895352728",
    "clientEmail": "pooja.kushwaha@sabpaisa.in",
    "roleType": "Client",
    "clientUserName": "Abh789@sp",
    "clientContactPersonName": "Abhay",
    "clientType": null,
    "parentClientId": 0,
    "lastLoginTime": null,
    "address": null,
    "stateId": null,
    "stateName": null,
    "bid": null,
    "businessType": null,
    "successUrl": null,
    "failedUrl": null,
    "subscription_status": null,
    "subscribedTym": null,
    "configuration_status": null,
    "referrerChildClient": null
  }
];

const login = (username, password) => {
  return axios
    .post("https://cobtest.sabpaisa.in/auth-service/auth/login", {
      clientUserId:username,
      userPassword:password,
    })
    .then((response) => {
      // response.data.clientSuperMasterList = staticClientList
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }else{

        localStorage.setItem("user", JSON.stringify(response.data));
      }
      
      console.log(response.data)
      return response.data;
    });
};

const logout = () => {
  // console.log('remove user from LS');
  localStorage.removeItem("user");
};



// Home,
const BASE_URL = "https://adminapi.sabpaisa.in";

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
  sendEmail,
};

export default authService;
