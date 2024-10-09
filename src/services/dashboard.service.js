import API_URL from "../config";
import {
  axiosInstance,
  axiosInstanceJWT,
  axiosInstanceAuth,
} from "../utilities/axiosInstance";

// Home - successTxnSummary

const successTxnSummary = (object) => {
  // console.log("object", object)
  return axiosInstanceJWT
    .post(API_URL.SUCCESS_TXN_SUMMARY, object)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

// Graph
const getTxnDataForGraph = (object) => {
  return axiosInstanceJWT.post(API_URL.GET_TRANSACTION_DATA_CHART, object);
};

const subscriptionplan = () => {
  return axiosInstance.get(API_URL.FETCH_APP_AND_PLAN).then((response) => {
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
  return axiosInstance.post(API_URL.SUBSCRIBE_SERVICE).then((response) => {
    if (response.data) {
      localStorage.setItem(
        "subscriptionchargesdetail",
        JSON.stringify(response.data)
      );
    } else {
      localStorage.setItem(
        "subscriptionchargesdetail",
        JSON.stringify(response.data)
      );
    }

    return response.data;
  });
};

const fetchTransactionHistory = (paramData) => {
  // const {clientCode,fromDate,payModeId,toDate,txnStatus,ref1,ref2} = paramData;
  // console.log("hit",`https://reportapi.sabpaisa.in/REST/txnHistory/${clientCode}/${txnStatus}/${payModeId}/${fromDate}/${toDate}/${ref1}/${ref2}`);
  return axiosInstanceJWT.post(API_URL.GetMerchantTxnHistory, paramData);
};

const dowlonadTransactionHistory = (postData) => {
  return axiosInstanceJWT.post(API_URL.DownloadTxnHistory, postData, {
    responseType: "arraybuffer",
  });
};

// const refund_url=`https://reportapi.sabpaisa.in/SabPaisaReport/REST/`
const settlementReport = (paramData) => {
  return axiosInstanceJWT.post(API_URL.SettlementReport, paramData);
};

const refundTransactionHistory = (paramData) => {
  return axiosInstanceJWT.post(API_URL.RefundTxnHistory, paramData);
};
const chargebackTxnHistory = (paramData) => {
  return axiosInstanceJWT.post(API_URL.ChargeBankTxnHistory, paramData);
};

export const Dashboardservice = {
  successTxnSummary,
  subscriptionplan,
  subscriptionPlanDetail,
  fetchTransactionHistory,
  settlementReport,
  refundTransactionHistory,
  chargebackTxnHistory,
  getTxnDataForGraph,
  dowlonadTransactionHistory,
};
