import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";

import { getQueryStr } from "../../../utilities/generateURLQueryParams";










const getAssignedMerchant = ({ queryParams, payload }) => {
    console.log("queryParams", queryParams)
    console.log("payload", payload)
    const url = `${API_URL.GET_ASSIGNED_MERCHANT}`;
    const apiUrl = getQueryStr(url, queryParams);

    return axiosInstanceJWT.post(apiUrl, payload);
};




const merchantAssignedService = {
    getAssignedMerchant

};
export default merchantAssignedService