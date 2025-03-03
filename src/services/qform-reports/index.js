// import API_URL from "../../config";
import API_URL from "../../config";
import { axiosInstance } from "../../utilities/axiosInstance";

const getListOfForms = (paramData) => {
  return axiosInstance.post(
    `${API_URL.qwickFormList}?clientCode=${paramData.clientCode}`,
    paramData
  );
};
const getTxnReports = (paramData) => {
  return axiosInstance.post(API_URL.qwickFormTxnReport, paramData);
};
export const QformService = {
  getListOfForms,
  getTxnReports,
};
