import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"

export const adminTableList = (postData) => {
    return axiosInstanceJWT.post(API_URL.TABLE_LIST)
}

