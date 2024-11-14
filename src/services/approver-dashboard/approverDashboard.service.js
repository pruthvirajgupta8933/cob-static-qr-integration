import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";

const businessCategoryType = () => {
  return axiosInstanceJWT.get(API_URL.Business_Category_Type);
};

const getAllClientCode = () => {
  return axiosInstanceJWT.get(API_URL.getAllClientCode);
};
const getClientCodeByRole = (role) =>
  axiosInstanceJWT.get(`${API_URL.getClientCodeByRole}?role=${role}`);

const getPlatformById = (pid) => {
  return axiosInstanceJWT.post(API_URL.GET_PLATFORM_BY_ID, {
    platform_id: pid,
  });
};

const approveKyc = (requestParam) => {
  return axiosInstanceJWT.post(`${API_URL.APPROVE_KYC}`, requestParam);
};

const approverDashboardService = {
  businessCategoryType,
  getClientCodeByRole,
  getAllClientCode,
  getPlatformById,
  approveKyc,
};

export default approverDashboardService;
