import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";

export const fetchSubscribedMerchantList = ()=>{
    return axiosInstanceJWT.get(API_URL.saveBasicDetails)
}
