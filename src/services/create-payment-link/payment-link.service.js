import { axiosInstance } from "../../utilities/axiosInstance";
import API_URL from "../../config";

const getCustomerDetails = (fromDate, toDate, clientCode) => {

    const url = `${API_URL.GET_CUSTOMERS}${clientCode}/${fromDate}/${toDate}`;
    return axiosInstance.get(url);
}

const addCustomer = (postData) => {
    const url = `${API_URL.ADD_CUSTOMER}`
    return axiosInstance.post(url, postData)

}

const deleteCustomer = (clientCode, id) => {
    const url = `${API_URL.DELETE_CUSTOMER}?Client_Code=${clientCode}&Customer_id=${id}`
    return axiosInstance.delete(url)
}
const getCustomerType = () => {
    const url = `${API_URL.GET_CUSTOMER_TYPE}`
    return axiosInstance.get(url)
}

const paymentLinkDetails = (clientCode, fromDate, toDate, splitDate) => {
    const startDate = fromDate || splitDate;
    const endDate = toDate || splitDate;
    const url = `${API_URL.GET_LINKS}${clientCode}/${startDate}/${endDate}`;
    return axiosInstance.get(url);
};

const getReports = (clientCode, fromDate, toDate, splitDate) => {
    const startDate = fromDate || splitDate;
    const endDate = toDate || splitDate;
    const url = `${API_URL.GET_REPORTS}${clientCode}/${startDate}/${endDate}`;
    return axiosInstance.get(url);

}
const createPaymentLink = (postData) => {
    const { Customer_id, Remarks, Amount, clientCode, valid_to, isPasswordProtected } = postData
   const url = `${API_URL.ADD_LINK}?Customer_id=${Customer_id}&Remarks=${Remarks}&Amount=${Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${valid_to}&isMerchantChargeBearer=true&isPasswordProtected=${isPasswordProtected}`
    return axiosInstance.post(url)
}

const editCustomer=(postData)=>{
    const url =`${API_URL.EDIT_CUSTOMER}`
    return axiosInstance.put(url,postData)

}
const createPaymentLinkService = {
    getCustomerDetails,
    addCustomer,
    deleteCustomer,
    getCustomerType,
    paymentLinkDetails,
    getReports,
    createPaymentLink,
    editCustomer

};
export default createPaymentLinkService