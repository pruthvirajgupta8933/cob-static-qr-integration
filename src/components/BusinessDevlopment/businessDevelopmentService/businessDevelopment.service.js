import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";

import { getQueryStr } from "../../../utilities/generateURLQueryParams";










const getAssignedMerchant = (postData) => {
    console.log("postData", postData)
    const url = `${API_URL.GET_ASSIGNED_MERCHANT}`
    console.log("url", url)
    const apiUrl = getQueryStr(url, postData)
    console.log("apiurl", apiUrl)
    return axiosInstanceJWT.post(apiUrl, postData)
}




const merchantAssignedService = {
    getAssignedMerchant

};
export default merchantAssignedService