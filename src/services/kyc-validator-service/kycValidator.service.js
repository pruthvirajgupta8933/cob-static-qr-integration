import {
  kycValidatorAuth,
  axiosInstanceJWT,
} from "../../utilities/axiosInstance";
import API_URL from "../../config";

export const cinDetail = (paramData) => {
  return axiosInstanceJWT.post(API_URL.CIN_DETAIL, paramData);
};

export const aadharNumberVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-aadhar/send-otp/`,
    paramData
  );
};

export const aadharOtpVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-aadhar/verify-otp/`,
    paramData
  );
};

// Signzy aadhaar api integration
// create url
export const aadharCreateUrl = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.Aadhar_create_url}`,
    paramData
  );
};

export const aadharGetAadhaar = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.Aadhar_get_aadhaar}`,
    paramData
  );
};

export const panVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-pan/`,
    paramData
  );
};

export const advancePanVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-pan-advance/`,
    paramData
  );
};

export const gstVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-gst/`,
    paramData
  );
};

export const udyamVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-udyam/`,
    paramData
  );
};

export const ifscVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-ifsc/`,
    paramData
  );
};

export const accountVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-account/`,
    paramData
  );
};

export const credReportVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-cred-report/`,
    paramData
  );
};

export const cinVerify = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.CIN_DETAIL}`, paramData);
};
export const cinDataByLogin = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.CIN_BY_LOGIN}`, paramData);
};

export const voterVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-voter-card/`,
    paramData
  );
};

export const dlVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/validate-driving-liscence/`,
    paramData
  );
};
