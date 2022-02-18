import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const SIGNUP_URL = "https://cobtest.sabpaisa.in/auth-service/auth/";

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
// http://18.189.11.232:8080/auth-service/auth/login
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
  localStorage.clear();
  // alert('logout call auth service');
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
