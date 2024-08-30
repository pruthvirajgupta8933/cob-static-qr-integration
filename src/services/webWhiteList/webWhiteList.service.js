import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"

export const webWhiteListApi = (obj) => {
    return axiosInstanceJWT.post(API_URL.IP_WHITElIST, obj)
}

