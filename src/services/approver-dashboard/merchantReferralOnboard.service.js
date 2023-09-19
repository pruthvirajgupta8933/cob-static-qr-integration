import API_URL from "../../config";
import { axiosInstanceAuth, axiosInstanceJWT } from "../../utilities/axiosInstance";



export const saveBasicDetails = (obj) => {
    return axiosInstanceAuth.post(API_URL.AUTH_SIGNUP, obj)
};



export const bankDetails = (obj) => {
    return axiosInstanceJWT.put(`${API_URL.Save_Settlement_Info}`,obj)
}


export const fetchBankList = ()=>{
    return axiosInstanceJWT.get(`${API_URL.GET_ALL_BANK_NAMES}`)
}
