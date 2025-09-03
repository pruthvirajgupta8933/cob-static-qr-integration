import { E_NACH_URL } from "../../../config";
import { axiosInstanceEmandateAuthApiKey } from "../../../utilities/axiosInstance";

export const getAllMandateApi = (requestParam) => {
  return axiosInstanceEmandateAuthApiKey.post(
    `${E_NACH_URL.REGISTRATION_HISTORY}?page=${requestParam.page}&page_size=${requestParam.page_size}&order_by=-id`,
    requestParam
  );
};
export const getMandateRegistrationReport = (requestParam) => {
  return axiosInstanceEmandateAuthApiKey.post(
    E_NACH_URL.REGISTRATION_REPORT,
    requestParam,
  );
};

export const transactionHistoryByuserApi = (requestParam) => {
  return axiosInstanceEmandateAuthApiKey.post(
    `${E_NACH_URL.DEBIT_TRANSACTION_HISTORY}?order_by=-id&page=${requestParam.page}&page_size=${requestParam.page_size}`,
    requestParam
  );
};

export const debitTransactionReport = (requestParam) => {
  return axiosInstanceEmandateAuthApiKey.post(
    E_NACH_URL.DEBIT_TRANSACTION_REPORT,
    requestParam,
    {
      responseType: 'arraybuffer',
    }
  );
};