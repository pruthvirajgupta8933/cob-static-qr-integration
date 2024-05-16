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
export const getAllZoneCode= () => {
    return axiosInstanceJWT.get(API_URL.getAllzone)
}

// export const fetchReferralChildList = (obj) => {
//     return axiosInstanceJWT.post(API_URL.fetchReferralChild, obj)
// }

export const fetchPerentTypeMerchantData = (obj) => {
    return axiosInstanceJWT.post(API_URL.perentTypeMerchantData, obj)
}



export const clientListExportApi = (postData) => {
 const { bank_login_id,type } = postData;
    let param = ""
    if (type === "bank") {
            param += `&bank_login_id=${bank_login_id}`
        }
        if (type === "referrer") {
            param += `&referrer_login_id=${bank_login_id}`
        }
    const url = `${API_URL.exportOflineMerchant}?type=${type}${param}&order_by=-loginMasterId`;
    return axiosInstanceJWT.get(url, {
        responseType: 'arraybuffer'
    });
}







export const saveDocumentDetails = (obj) => {
    return axiosInstanceJWT.post(API_URL.uploadDocuement, obj, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    )
}






export const addReferralService = (obj, isChild=false)=>{
    let apiUrl;
    // console.log("isChild",isChild)
    if(isChild===true){
        apiUrl = API_URL.addReferralChild
    }else{
        apiUrl = API_URL.addReferral
    }
    return axiosInstanceJWT.post(apiUrl,obj)
}