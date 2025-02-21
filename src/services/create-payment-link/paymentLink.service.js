import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import { PAYMENT_LINK } from "../../config";
import { getQueryStr } from "../../utilities/generateURLQueryParams";

const addPayer = (postData) => {
  const url = `${PAYMENT_LINK.CREATE_PAYER}`;
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.post(url, postData, config);
};

const editPayer = (postData) => {
  const url = `${PAYMENT_LINK.UPDATE_PAYER}`;
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.put(url, postData, config);
};

const deletePayer = (postData) => {
  const url = `${PAYMENT_LINK.DELETE_PAYER}`;

  const apiUrl = getQueryStr(url, postData);
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.delete(apiUrl, config);
};

const getPayer = (postData) => {
  const url = `${PAYMENT_LINK.GET_PAYER}`;
  const apiUrl = getQueryStr(url, postData);
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.get(apiUrl, config);
};

const getPayerType = () => {
  const url = `${PAYMENT_LINK.GET_PAYER_TYPE}`;
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.get(url, config);
};

const createPaymentLink = (postData) => {
  const url = `${PAYMENT_LINK.CREATE_LINK}`;
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.post(url, postData, config);
};

const getPaymentLink = (postData) => {
  const url = `${PAYMENT_LINK.GET_LINK}`;
  const apiUrl = getQueryStr(url, postData);
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.get(apiUrl, config);
};

const getPaymentLinkApiKey = (postData) => {
  const url = `${PAYMENT_LINK.GET_API_KEY}`;
  const apiUrl = getQueryStr(url, postData);
  return axiosInstanceJWT.get(apiUrl);
};

const getDashboardData = (postData) => {
  const url = `${PAYMENT_LINK.GET_LINK_DASHBOARD}`;
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.post(url, postData, config);
};

const getTxnGraphData = (postData) => {
  const url = `${PAYMENT_LINK.GET_TXN_GRAPH_DATA}`;
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.post(url, postData, config);
};

const getTxnTableData = (postData) => {
  const url = `${PAYMENT_LINK.GET_ALL_TXN}`;
  const apiUrl = getQueryStr(url, postData);
  const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
  const config = {
    headers: {
      "api-key": sessionApiKey,
    },
  };
  return axiosInstanceJWT.get(apiUrl, config);
};


const paymentLinkService = {
  addPayer,
  editPayer,
  deletePayer,
  getPayer,
  getPayerType,
  createPaymentLink,
  getPaymentLink,
  getPaymentLinkApiKey,
  getDashboardData,
  getTxnGraphData,
  getTxnTableData,
};
export default paymentLinkService;
