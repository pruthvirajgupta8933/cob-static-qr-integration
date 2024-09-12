import API_URL from "../../config"
import { axiosInstance, axiosInstanceJWT } from "../../utilities/axiosInstance"

export const transactionEnquireyApi = (postData) => {
    return axiosInstanceJWT.post(API_URL.VIEW_TXN,postData)
}

