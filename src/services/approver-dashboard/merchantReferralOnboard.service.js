import API_URL from "../../config";
import { axiosInstanceAuth, axiosInstanceJWT } from "../../utilities/axiosInstance";



export const saveBasicDetails = (obj) => {
    return axiosInstanceJWT.post(API_URL.saveBasicDetails, obj)
};


export const updateBasicDetails = (obj) => {
    return axiosInstanceJWT.put(API_URL.saveBasicDetails, obj)
};


export const bankDetails = (obj) => {
    return axiosInstanceJWT.post(API_URL.saveBankDetails, obj)
}


export const fetchBankList = () => {
    return axiosInstanceJWT.get(`${API_URL.GET_ALL_BANK_NAMES}`)
}


export const saveBusinessDetails = (obj) => {
    return axiosInstanceJWT.post(API_URL.saveBusinesDetails, obj)
}

export const saveDocumentDetails = (obj) => {
    return axiosInstanceJWT.post(API_URL.uploadDocuement, obj, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    )
}