import axios from "axios";

const BASE_URL = "https://cobtest.sabpaisa.in/auth-service/client";
const BANK_LIST_URL = "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/";

const createClintCode = (object) => {
  console.log("profileservice",object)
  return axios.post(BASE_URL + "/create", object);
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
const profileService = {
    createClintCode,
    updateClientProfile,
    verifyClientCode,
    fetchNbBankList,
    fetchDcBankList,
    verifyIfcsCode
};

export default profileService;
