import API_URL from "../../config"
import { axiosInstance } from "../../utilities/axiosInstance"

export const transactionEnquireyApi = (endPoint) => {
    return axiosInstance.get(API_URL.VIEW_TXN + endPoint)
}

