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
    .get(subAPIURL.mandateCategory)
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

export const createMandateService = {
  fetchFrequency,
  fetchMandateType,
  fetchMandatePurpose,
};
