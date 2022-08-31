import axios from "axios";
import API_URL from "../config";

const successTxnSummary = (fromdate, todate, clientcode) => {
  return axios.post(API_URL.SUCCESS_TXN_SUMMARY, {
    fromdate,
    todate,
    clientcode,
  });
};



const homeService = {
    successTxnSummary
};

export default homeService;
