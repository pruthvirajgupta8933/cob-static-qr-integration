import { axiosInstanceAuth } from "../../utilities/axiosInstance"
import API_URL from "../../config"

export const emailVerify=(obj)=>{
    return axiosInstanceAuth.post(API_URL.AUTH_VERIFY_OTP_ON_FWD,obj)
}

