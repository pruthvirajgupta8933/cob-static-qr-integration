// import axios from "axios";
import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";

const successTxnSummary = (fromdate, todate, clientcode) => {
  return axiosInstanceJWT.post(API_URL.SUCCESS_TXN_SUMMARY, {
    fromdate,
    todate,
    clientcode,
  });
};



const homeService = {
  successTxnSummary
};

export default homeService;
