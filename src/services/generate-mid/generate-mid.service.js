import API_URL from "../../config"
import { axiosInstance, axiosInstanceJWT } from "../../utilities/axiosInstance"

export const getMidClientCode = () => {
    return axiosInstanceJWT.get(API_URL.MID_CLIENT_CODE)
}
export const fetchPaymentMode = (obj) => {
    return axiosInstanceJWT.get(API_URL.GET_PAYMENT_MODE_LIST)
}

export const fetchBankName = () => {
    return axiosInstanceJWT.get(API_URL.GET_ALL_BANK_NAME)

}
export const midCreateApi = (obj) => {
    return axiosInstance.post(API_URL.MID_CREATE_API, obj)
}

export const fetchMidPayload = (obj) => {
    return axiosInstanceJWT.post(API_URL.MID_PAYLOAD_BY_MERCHANT_ID, obj)
}
export const fetchMidDataByClientCode = (obj) => {
    return axiosInstance.post(API_URL.MID_FETCH_DATA_BY_CLIENT_CODE, obj)
}