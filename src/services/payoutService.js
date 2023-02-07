import PAYOUT_API_URL from "../config";
import { axiosInstance } from "../utilities/axiosInstance";


const getLedgersMerchant = () => {
  const param = {
    end: "all",
    start: "all",
    trans_status: "all",
    transfer_type: "all",
  };
  return axiosInstance
    .post(PAYOUT_API_URL.getLedgersMerchantList,param, {
      headers: {
        "auth-token": "j0m8DtBgoqSeeV5G7wARyg==",
      },
    })
    .then((response) => {
      return response.data;
    });
};

const fetchBeneficiaryHistory = () => {
  return axiosInstance
    .get(PAYOUT_API_URL.fetchBeneficiary, {
      headers: {
        "auth-token": "j0m8DtBgoqSeeV5G7wARyg==",
      },
    })
    .then((response) => {
      return response.data;
    });
};
export const Payoutservice = {
  getLedgersMerchant,
  fetchBeneficiaryHistory
};
