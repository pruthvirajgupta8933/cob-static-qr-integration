import axios from "axios";
import { axiosInstanceJWT } from "../utilities/axiosInstance";

// const BASE_URL = "https://cobapi.sabpaisa.in/auth-service/client";
// const BANK_LIST_URL = "https://subscription.sabpaisa.in/subscription/REST/GetCommonData/0/";

// // const createClintCode = (object) => {
//   // console.log("profileservice",object)
//   return axiosInstanceJWT.post(BASE_URL + "/create", object)
// };


// const updateClientProfile = (object,clientId)=>{
//     return axiosInstanceJWT.post(BASE_URL + "/update/"+clientId, object);
// }


// const verifyClientCode=(clientCode)=>{
//   return axiosInstanceJWT.get(BASE_URL + "/verifyClientCode/"+clientCode);
// }
 

// const verifyIfcsCode=(ifsc_code)=>{
//   return axiosInstanceJWT.get( "https://ifsc.razorpay.com/"+ifsc_code);
// }

// const fetchNbBankList=()=>{
//   return axiosInstanceJWT.get(BANK_LIST_URL + "nb");
// }

// const fetchDcBankList=()=>{
//   return axiosInstanceJWT.get(BANK_LIST_URL + "dc");
// }
const profileService = {
    // createClintCode,
    // updateClientProfile,
    // verifyClientCode,
    // fetchNbBankList,
    // fetchDcBankList,
    // verifyIfcsCode
};

export default profileService;
