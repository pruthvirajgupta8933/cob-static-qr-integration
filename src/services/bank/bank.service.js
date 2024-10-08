import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"

const bankMerchantDetailList = (obj) => {
    const requestPayload = {
        "client_code": obj.clientCode,
        "start_date": obj.fromDate,
        "end_date": obj.endDate
    }
    return axiosInstanceJWT.post(`${API_URL.BANK_MERCHANT_DETAIL_LIST}?page=${obj?.page}&page_size=${obj?.length}`, requestPayload)
}


const bankMerchantSummary = (obj) => {
    return axiosInstanceJWT.post(API_URL.BANK_MERCHANT_SUMMARY, obj)
}


export const bankDashboardService = {
    bankMerchantDetailList,
    bankMerchantSummary
}


