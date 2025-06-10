import { E_NACH_URL } from "../../../config";
import { axiosInstanceEmandateAuthApiKey } from "../../../utilities/axiosInstance";

export const settlementHistoryApi = (postData) => {
    return axiosInstanceEmandateAuthApiKey.post(E_NACH_URL.SETTLEMENT_TRANSACTION, postData);

}



