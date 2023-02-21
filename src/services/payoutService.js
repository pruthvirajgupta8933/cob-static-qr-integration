import PAYOUT_API_URL from "../config";
import { axiosInstance } from "../utilities/axiosInstance";
import api from './api';


const getLedgersMerchant = () => {
  const param = {
    end: "all",
    start: "all",
    trans_status: "all",
    transfer_type: "all",
  };
  return api
    .post(PAYOUT_API_URL.getLedgersMerchantList,param, {
      headers: {
        "auth-token": "CklPC/Ks1VJNX3aRZoNaUA==",
      },
    })
    .then((response) => {
      return response.data;
    });
};

const fetchBeneficiaryHistory = () => {
  return api
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
  return api.get(PAYOUT_API_URL.fetchClientCode);
};
export const Payoutservice = {
  fetchClientCode,
  getLedgersMerchant,
  fetchBeneficiaryHistory
};
