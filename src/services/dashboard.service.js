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

const SUBSCRIPTION_URL = "http://18.216.47.58:8081/client-subscription-service/";

const subscriptionPlan = () => {
  return axios.get(SUBSCRIPTION_URL + "fetchAppAndPlan")
  .then((response) => {
    console.log("subscribe data - service", response )
    if (response.data) {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    } else {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const subscriptionChargesDetail = () => {
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

export const Dashboardservice = {
    successTxnSummary,
    subscriptionPlan,
    subscriptionChargesDetail,
  };
  