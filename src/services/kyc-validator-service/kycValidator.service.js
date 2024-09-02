import { kycValidatorAuth } from "../../utilities/axiosInstance";
import API_URL from "../../config";


export const cinDetail = (paramData) => {
    return kycValidatorAuth.post(API_URL.CIN_DETAIL, paramData);
    }