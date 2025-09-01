import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"

export const fetchUserInfoData = (body) => {
    return axiosInstanceJWT.post(API_URL.userInfoLoginData, body)
}
