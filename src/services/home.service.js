import axios from "axios";

const BASE_URL = "https://adminapi.sabpaisa.in";

const successTxnSummary = (fromdate, todate, clientcode) => {
  return axios.post(BASE_URL + "/REST/SuccessTxnSummary/", {
    fromdate,
    todate,
    clientcode,
  });
};


const homeService = {
    successTxnSummary
};

export default homeService;
