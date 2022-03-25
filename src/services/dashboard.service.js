import axios from "axios";

// Home - successTxnSummary 
const BASE_URL = "https://adminapi.sabpaisa.in";
const successTxnSummary = (fromdate, todate, clientcode) => {
  return axios.post(BASE_URL + "/REST/SuccessTxnSummary/", {
    fromdate,
    todate,
    clientcode,
  }).then((response)=>{
    return response.data;
  }).catch(err=>console.log(err));
};

const SUBSCRIPTION_URL = "https://cobapi.sabpaisa.in/client-subscription-service/";

const subscriptionplan = () => {
  return axios.get(SUBSCRIPTION_URL + "fetchAppAndPlan")
  .then((response) => {
    // console.log("subscribe data - service", response )
    if (response.data) {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    } else {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const subscriptionPlanDetail = () => {
    return axios.post(SUBSCRIPTION_URL + "subscribe")
    .then((response) => {
      if (response.data) {
        localStorage.setItem("subscriptionchargesdetail", JSON.stringify(response.data));
      } else {
        localStorage.setItem("subscriptionchargesdetail", JSON.stringify(response.data));
      }
  
      return response.data;
    });
  };

const fetchTransactionHistory=(paramData)=>
{ 
  const {clientCode,fromDate,payModeId,toDate,txnStatus,ref1,ref2} = paramData;
  // console.log("hit",`https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2}`);
  return axios.get(`https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2}`);
}

export const Dashboardservice = {
    successTxnSummary,
    subscriptionplan,
    subscriptionPlanDetail,
    fetchTransactionHistory
  };
  