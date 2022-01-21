import axios from "axios";

// Home - successTxnSummary 
const BASE_URL = "https://adminapi.sabpaisa.in";
const successTxnSummary = (fromdate, todate, clientcode) => {
  // console.log('fromDate',fromdate);
  return axios.post(BASE_URL + "/REST/SuccessTxnSummary/", {
    fromdate,
    todate,
    clientcode,
  }).then((response)=>{
    //   console.log('service--',response.data);
    return response.data;
  }).catch(err=>console.log(err));
};



export const Dashboardservice = {
    successTxnSummary
  };
  