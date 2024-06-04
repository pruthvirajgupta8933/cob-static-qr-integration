import API_URL from "../../../config"
import { axiosInstanceJWT } from "../../../utilities/axiosInstance"

export const frmPushMerchantData=(obj)=>{
    return axiosInstanceJWT.post(API_URL. PUSH_MERCHANT_DATA,obj)
}

export const frmMerchantList=(obj)=>{
    const pageSize=obj.page_size
    const page=obj.page
    const url = `${API_URL.MERCHANT_FRM_LIST}?page_size=${pageSize}&page=${page}`
    return axiosInstanceJWT.post(url)
}
