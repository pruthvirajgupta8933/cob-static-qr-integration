import subAPIURL from "../../config";
import { axiosInstance } from "../../utilities/axiosInstance";

const fetchFrequency = () => {
  return axiosInstance
    .get(subAPIURL.frequency)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));
};

const fetchMandateType = () => {
  return axiosInstance
    .get(subAPIURL.mandateType)
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};
const fetchMandatePurpose = () => {
  return axiosInstance
    .get(subAPIURL.MANDATE_CATEGORY)
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};
const fetchrequestType = () => {
  return axiosInstance
    .get(subAPIURL.requestType)
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};
const fetchBankName = () => {
  return axiosInstance
    .get(subAPIURL.bankName)
    .then((resp) => {
      return resp;
    })
    .catch((err) => console.log(err));
};
const creatingMandate = (data) => {
  return axiosInstance
    .post(subAPIURL.mandateRegistration, data)
    .then((resp) => {
      return resp;
    })
    .catch((err) => console.log(err));
};

export const createMandateService = {
  fetchFrequency,
  fetchMandateType,
  fetchMandatePurpose,
  fetchrequestType,
  fetchBankName,
  creatingMandate,
};
