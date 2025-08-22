import { axiosInstanceJWT } from "../../utilities/axiosInstance"
import API_URL from "../../config"


export const editProfilOtp = (obj) => {
    return axiosInstanceJWT.post(API_URL.EDIT_PROFILE_OTP, obj)
}

export const updateProfile = (obj) => {
    return axiosInstanceJWT.post(API_URL.UPDATE_PROFILE, obj)
}