import axios from "axios";
import API_URL from "../config";
import { axiosInstance } from "../utilities/axiosInstance";

const successTxnSummary = (fromdate, todate, clientcode) => {
  return axiosInstance.post(API_URL.SUCCESS_TXN_SUMMARY, {
    fromdate,
    todate,
    clientcode,
  });
};



const homeService = {
    successTxnSummary
};

export default homeService;
