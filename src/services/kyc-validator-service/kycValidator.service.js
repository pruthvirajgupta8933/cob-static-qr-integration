import { kycValidatorAuth } from "../../utilities/axiosInstance";
import API_URL from "../../config";


export const cinDetail = (paramData) => {
    return kycValidatorAuth.post(API_URL.CIN_DETAIL, paramData);
}


export const aadharNumberVerify = (paramData) => {
    return kycValidatorAuth.post(API_URL.Aadhar_number, paramData);
}


export const aadharOtpVerify = (paramData) => {
    return kycValidatorAuth.post(API_URL.Aadhar_otp_verify, paramData);
}