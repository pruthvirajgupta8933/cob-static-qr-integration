import {
  kycValidatorAuth,
  axiosInstanceJWT,
} from "../../utilities/axiosInstance";
import API_URL from "../../config";

export const cinDetail = (paramData) => {
  return kycValidatorAuth.post(API_URL.CIN_DETAIL, paramData);
};

export const aadharNumberVerify = (paramData) => {
  return kycValidatorAuth.post(
    `${API_URL.VALIDATE_DOC_KYC}/aadhar-send-otp/`,
    paramData
  );
};

export const aadharOtpVerify = (paramData) => {
  return kycValidatorAuth.post(
    `${API_URL.VALIDATE_DOC_KYC}/aadhar-verify-otp`,
    paramData
  );
};

export const panVerify = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.VALIDATE_DOC_KYC}/pan/`, paramData);
};

export const gstVerify = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.VALIDATE_DOC_KYC}/gst/`, paramData);
};

export const udyamVerify = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.VALIDATE_DOC_KYC}/udyam/`, paramData);
};

export const ifscVerify = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.VALIDATE_DOC_KYC}/ifsc/`, paramData);
};

export const accountVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/account/`,
    paramData
  );
};

export const credReportVerify = (paramData) => {
  return axiosInstanceJWT.post(
    `${API_URL.VALIDATE_DOC_KYC}/cred-report/`,
    paramData
  );
};

export const cinVerify = (paramData) => {
  return axiosInstanceJWT.post(`${API_URL.VALIDATE_DOC_KYC}/cin/`, paramData);
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
