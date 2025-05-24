

import { axiosInstanceJWT } from "../../../../../utilities/axiosInstance";
import { PAYMENT_LINK } from "../../../../../config";
import { getQueryStr } from "../../../../../utilities/generateURLQueryParams";
import EnsurePaymentLinkApiKey from "../ensure-payment-link-api-key/EnsurePaymentLinkApiKey";
// import { useSelector } from "react-redux";

// const clientCode = user?.clientMerchantDetailsList[0]?.clientCode;

// const { auth} = useSelector(
//     (state) => state
//   );

//   const { user } = auth;

const user = JSON.parse(localStorage.getItem("user") || JSON.stringify({}));
const clientCode = user?.clientMerchantDetailsList[0]?.clientCode;
console.log("user", user);

const addPayer = async (postData) => {
    const url = `${PAYMENT_LINK.CREATE_PAYER}`;
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.post(url, postData, config);
};

const editPayer = async (postData) => {
    const url = `${PAYMENT_LINK.UPDATE_PAYER}`;
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.put(url, postData, config);
};

const deletePayer = async (postData) => {
    const url = `${PAYMENT_LINK.DELETE_PAYER}`;

    const apiUrl = getQueryStr(url, postData);
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.delete(apiUrl, config);
};

const getPayer = async (postData) => {
    const url = `${PAYMENT_LINK.GET_PAYER}`;
    const apiUrl = getQueryStr(url, postData);
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.get(apiUrl, config);
};

const getPayerType = async () => {
    const url = `${PAYMENT_LINK.GET_PAYER_TYPE}`;
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.get(url, config);
};

const createPaymentLink = async (postData) => {
    const url = `${PAYMENT_LINK.CREATE_LINK}`;
    // const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.post(url, postData, config);
};

const getPaymentLink = async (postData) => {
    const url = `${PAYMENT_LINK.GET_LINK}`;
    const apiUrl = getQueryStr(url, postData);
    // const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.get(apiUrl, config);
};

const getPaymentLinkApiKey = (postData) => {
    const url = `${PAYMENT_LINK.GET_API_KEY}`;
    const apiUrl = getQueryStr(url, postData);
    return axiosInstanceJWT.get(apiUrl);
};

const getDashboardData = async (postData) => {
    const url = `${PAYMENT_LINK.GET_LINK_DASHBOARD}`;
    // const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.post(url, postData, config);
};

const getTxnGraphData = async (postData) => {
    const url = `${PAYMENT_LINK.GET_TXN_GRAPH_DATA}`;
    // const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.post(url, postData, config);
};

const getTxnTableData = async (postData) => {
    const url = `${PAYMENT_LINK.GET_ALL_TXN}`;
    const apiUrl = getQueryStr(url, postData);
    // const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);

    const config = {
        headers: {
            "api-key": apiKey,
        },
    };
    return axiosInstanceJWT.get(apiUrl, config);
};

const getPayerData = async (postData) => {
    const url = `${PAYMENT_LINK.GET_PAYER_DATA}`;
    const apiUrl = getQueryStr(url, postData);
    // const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey");
    const apiKey = await EnsurePaymentLinkApiKey(clientCode);
    const config = {
        headers: {
            "api-key": apiKey,
        }
    }
    return axiosInstanceJWT.get(apiUrl, config);
}





// const getCustomerDetails = (fromDate, toDate, clientCode) => {

//     const url = `${API_URL.GET_CUSTOMERS}${clientCode}/${fromDate}/${toDate}`;
//     return axiosInstance.get(url);
// }

// const deleteCustomer = (clientCode, id) => {
//     const url = `${API_URL.DELETE_CUSTOMER}?Client_Code=${clientCode}&Customer_id=${id}`
//     return axiosInstance.delete(url)
// }
// const getCustomerType = () => {
//     const url = `${API_URL.GET_CUSTOMER_TYPE}`
//     return axiosInstance.get(url)
// }

// const paymentLinkDetails = (clientCode, fromDate, toDate, splitDate) => {
//     const startDate = fromDate || splitDate;
//     const endDate = toDate || splitDate;
//     const url = `${API_URL.GET_LINKS}${clientCode}/${startDate}/${endDate}`;
//     return axiosInstance.get(url);
// };

// const getReports = (clientCode, fromDate, toDate, splitDate) => {
//     const startDate = fromDate || splitDate;
//     const endDate = toDate || splitDate;
//     const url = `${API_URL.GET_REPORTS}${clientCode}/${startDate}/${endDate}`;
//     return axiosInstance.get(url);

// }
// const createPaymentLink = (postData) => {
//     const { Customer_id, Remarks, Amount, clientCode, valid_to, isPasswordProtected } = postData
//    const url = `${API_URL.ADD_LINK}?Customer_id=${Customer_id}&Remarks=${Remarks}&Amount=${Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${valid_to}&isMerchantChargeBearer=true&isPasswordProtected=${isPasswordProtected}`
//     return axiosInstance.post(url)
// }

// const editCustomer=(postData)=>{
//     const url =`${API_URL.EDIT_CUSTOMER}`
//     return axiosInstance.put(url,postData)

// }
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
    getPayerData
};
export default paymentLinkService;
