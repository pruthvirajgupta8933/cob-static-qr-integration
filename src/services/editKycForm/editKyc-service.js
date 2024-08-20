import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"

export const updateContactInfoEditDetailsApi=(postData)=>{
    return axiosInstanceJWT.post(API_URL.UPDATE_CONATCT_INFO,postData)
}
export const updateBusinessOverViewDetailApi=(postData)=>{
    return axiosInstanceJWT.post(API_URL.UPDATE_BUSINESS_INFO,postData)

}
export const updateMerchantInfoApi=(postData)=>{
    return axiosInstanceJWT.post(API_URL.UPDATE_MERCHANT_INFO,postData)
}

export const updateSettlementInfoApi=(postData)=>{
    return axiosInstanceJWT.post(API_URL.UPDATE_SETTLEMENT_INFO,postData)
}
export const uploadDocumentApi=(postData)=>{
    return axiosInstanceJWT.post(API_URL.UPLOAD_DOCUMENT,postData)
}
