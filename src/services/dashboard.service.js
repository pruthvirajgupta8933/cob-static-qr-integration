import axios from "axios";
import API_URL from "../config";
import  { axiosInstance } from "../utilities/axiosInstance"

// Home - successTxnSummary 

const successTxnSummary = (fromdate, todate, clientcode) => {
  return axiosInstance.post(API_URL.SUCCESS_TXN_SUMMARY, {
    fromdate,
    todate,
    clientcode,
  }).then((response)=>{
    return response.data;
  }).catch(err=>console.log(err));
};

const subscriptionplan = () => {
  return axiosInstance.get(API_URL.FETCH_APP_AND_PLAN)
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
    return axiosInstance.post(API_URL.SUBSCRIBE_SERVICE)
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
  // const {clientCode,fromDate,payModeId,toDate,txnStatus,ref1,ref2} = paramData;
  // console.log("hit",`https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2}`);
  

  return axiosInstance.post(API_URL.GetMerchantTxnHistory,paramData);
  // axiosInstance.defaults.headers.common["Authorization"] = ';
}


const settlementReport=(paramData) => {
  return axiosInstance.post(API_URL.SettlementReport,paramData)
}

const RefundTransactionHistory =(paramData) => {
  return axiosInstance.post(API_URL.RefundTransactionHistory,paramData)
}

export const Dashboardservice = {
    successTxnSummary,
    subscriptionplan,
    subscriptionPlanDetail,
    fetchTransactionHistory,
    RefundTransactionHistory,
    settlementReport
  };
  