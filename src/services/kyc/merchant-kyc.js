import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"



export const getRefferal = () => {
    return axiosInstanceJWT.get(API_URL.GET_REFERRAL)
}





