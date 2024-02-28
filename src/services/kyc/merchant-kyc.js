import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"



export const getRefferal = () => {
    return axiosInstanceJWT.get(API_URL.GET_REFERRAL)
}


const updateContactInfo = async (requestParam) => {
    return await axiosInstanceJWT.put(`${API_URL.Save_General_Info}`, requestParam)
}

export const merchantKycService = {
    updateContactInfo
}




