import PAYOUT_API_URL from "../config";
import { axiosInstance } from "../utilities/axiosInstance";
import { axiosInstanceJWT } from "../utilities/axiosInstance";

const getLedgersMerchant = () => {
  const param = {
    end: "all",
    start: "all",
    trans_status: "all",
    transfer_type: "all",
  };
  return axiosInstanceJWT
    .post(PAYOUT_API_URL.getLedgersMerchantList, param, {
      headers: {
        "auth-token": "CklPC/Ks1VJNX3aRZoNaUA==",
      },
    })
    .then((response) => {
      return response.data;
    });
};

const fetchBeneficiaryHistory = () => {
  return axiosInstanceJWT
    .get(PAYOUT_API_URL.fetchBeneficiary, {
      headers: {
        "auth-token": "j0m8DtBgoqSeeV5G7wARyg==",
      },
    })
    .then((response) => {
      return response.data;
    });
};

const fetchClientCode = () => {
  return axiosInstanceJWT.get(PAYOUT_API_URL.fetchClientCode);
};
export const Payoutservice = {
  fetchClientCode,
  getLedgersMerchant,
  fetchBeneficiaryHistory,
};
