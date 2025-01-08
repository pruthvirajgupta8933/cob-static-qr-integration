import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import { PAYMENT_LINK } from "../../config";
import { getQueryStr } from "../../utilities/generateURLQueryParams";

const sessionApiKey = sessionStorage.getItem("paymentLinkApiKey")

const config = {
    headers: {
        "api-key": sessionApiKey
    }
}


const addPayer = (postData) => {
    const url = `${PAYMENT_LINK.CREATE_PAYER}`
    return axiosInstanceJWT.post(url, postData, config)
}
const editPayer = (postData) => {
    const url = `${PAYMENT_LINK.UPDATE_PAYER}`
    return axiosInstanceJWT.put(url, postData, config)
}

const deletePayer = (postData) => {
    const url = `${PAYMENT_LINK.DELETE_PAYER}`

    const apiUrl = getQueryStr(url, postData)
    return axiosInstanceJWT.delete(apiUrl, config)
}

const getPayer = (postData) => {

    const url = `${PAYMENT_LINK.GET_PAYER}`
    const apiUrl = getQueryStr(url, postData)

    return axiosInstanceJWT.get(apiUrl, config)
}

const getPayerType = () => {
    const url = `${PAYMENT_LINK.GET_PAYER_TYPE}`
    return axiosInstanceJWT.get(url, config)
}


const createPaymentLink = (postData) => {
    const url = `${PAYMENT_LINK.CREATE_LINK}`
    return axiosInstanceJWT.post(url, postData, config)
}

const getPaymentLink = (postData) => {
    const url = `${PAYMENT_LINK.GET_LINK}`
    const apiUrl = getQueryStr(url, postData)
    return axiosInstanceJWT.get(apiUrl, config)
}


const getPaymentLinkApiKey = (postData) => {
    const url = `${PAYMENT_LINK.GET_API_KEY}`
    const apiUrl = getQueryStr(url, postData)
    return axiosInstanceJWT.get(apiUrl)
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
    getPaymentLinkApiKey

};
export default paymentLinkService