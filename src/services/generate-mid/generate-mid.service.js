import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"

console.log( API_URL.GET_PAYMENT_MODE)

export const fetchPaymentMode = (obj) => {
    return axiosInstanceJWT.get(API_URL.GET_PAYMENT_MODE_LIST)
}

export const fetchBankName =()=>{
    return axiosInstanceJWT.get(API_URL.GET_ALL_BANK_NAME)

}