import { E_NACH_URL } from "../../../config";
import { axiosInstanceEmandateAuthApiKey } from "../../../utilities/axiosInstance";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import { getQueryStr } from "../../../utilities/generateURLQueryParams";




export const scheduleTransactionApi = (queryParams, payloadData) => {
    const url = `${E_NACH_URL.SCHEDULE_TRRANSACTION}`;
    const apiUrl = getQueryStr(url, queryParams);
    return axiosInstanceEmandateAuthApiKey.post(apiUrl, payloadData);
};

export const userWiseTransactionSchedule = (requestParam) => {
    return axiosInstanceEmandateAuthApiKey.post(
        E_NACH_URL.USER_WISE_TRANSACTION_SCHEDULE, requestParam,

    );
};



