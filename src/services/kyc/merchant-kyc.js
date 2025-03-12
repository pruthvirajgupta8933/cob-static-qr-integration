import API_URL, { APP_ENV } from "../../config"
import { axiosInstance, axiosInstanceJWT } from "../../utilities/axiosInstance"



export const getRefferal = () => {
    return axiosInstanceJWT.get(API_URL.GET_REFERRAL)
}


const updateContactInfo = (requestParam) => {
    return axiosInstanceJWT.put(`${API_URL.Save_General_Info}`, requestParam)
}

const otpForContactInfo = (requestParam) => {
    return axiosInstanceJWT.post(`${API_URL.Send_OTP}`, requestParam)

}
const businessType = (requestParam) => {
    return axiosInstanceJWT.get(`${API_URL.Business_type}`, requestParam)

}
const busiCategory = (requestParam) => {
    return axiosInstanceJWT.get(`${API_URL.Business_Category_CODE}`, requestParam)

}
const platformType = (requestParam) => {
    return axiosInstanceJWT.get(`${API_URL.Platform_type}`, requestParam)
}
const saveBusinessInfo = (requestParam) => {
    return axiosInstanceJWT.put(`${API_URL.save_Business_Info}`, requestParam)
}

const fetchBusinessOverviewState = () => {
    if (APP_ENV) {
        return axiosInstanceJWT.get(`${API_URL.Business_overview_state}`);
    } else {
        return axiosInstanceJWT.post(`${API_URL.Business_overview_state}`);


    }
};

const saveMerchantInfo = (requestParam) => {
    return axiosInstanceJWT.post(`${API_URL.SAVE_MERCHANT_INFO}`, requestParam)
}
const saveMerchantBankDetais = (requestParam) => {
    return axiosInstanceJWT.put(
        `${API_URL.Save_Settlement_Info}`,
        requestParam)
}
const kycBankNames = () => {
    return axiosInstanceJWT.get(`${API_URL.GET_ALL_BANK_NAMES}`)

}
const documentsUpload = (data) => {
    const businessType = data?.businessType;
    const is_udyam = data?.is_udyam;
    return axiosInstanceJWT.get(`${API_URL?.DocumentsUpload}/?business_type_id=${businessType}&is_udyam=${is_udyam}`)


}
const GetKycTabsStatus = (requestParam) => {
    return axiosInstanceJWT.get(`${API_URL.KYC_TAB_STATUS_URL}/${requestParam?.login_id}`)
}

const kycDocumentUploadList = (requestParam) => {
    return axiosInstanceJWT.post(`${API_URL?.DOCUMENT_BY_LOGINID}`, requestParam)
}

const fetchWhiteListedWebsite = (requestParam) => {
    return axiosInstanceJWT.get(`${`${API_URL.GET_WEBSITE_WHITELIST}/${requestParam.clientCode}`}`)
}


const merchantInfo = (requestParam) => {
    const url = requestParam.docType === "1"
        ? API_URL.UPLOAD_MERCHANT_AADHAAR
        : API_URL.upload_Single_Doc;

    return axiosInstanceJWT.post(url, requestParam.bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};



export const merchantKycService = {
    updateContactInfo,
    otpForContactInfo,
    businessType,
    busiCategory,
    platformType,
    saveBusinessInfo,
    fetchBusinessOverviewState,
    saveMerchantInfo,
    saveMerchantBankDetais,
    kycBankNames,
    documentsUpload,
    GetKycTabsStatus,
    kycDocumentUploadList,
    merchantInfo,
    fetchWhiteListedWebsite
}




