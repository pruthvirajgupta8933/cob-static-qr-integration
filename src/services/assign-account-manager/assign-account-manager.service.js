import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";

const assignAccountMangerApi = (requestParam) => {
  const url = `${API_URL.ASSIGN_ACCOUNT_MANAGER}`;
  return axiosInstanceJWT.post(url, requestParam);
};
const assignManagerDetails = (requestParam) => {
  const url = `${API_URL.ACCOUNT_MANAGER_DETAILS}`;
  return axiosInstanceJWT.post(url, requestParam);
};
const assignClient = (requestParam) => {
  const url = `${API_URL.ASSIGN_CLIENT}`;
  return axiosInstanceJWT.put(url, requestParam);
};

const getAssignmentType = () => {
  return axiosInstanceJWT.get(API_URL.GET_ASSIGNMENT_TYPE);
};

const assignRoleWise = (payload) => {
  return axiosInstanceJWT.post(API_URL.ASSIGN_ROLE_WISE, payload);
};
const exportAssignedMerchant = (payload) => {
  return axiosInstanceJWT.get(
    `${API_URL.EXPORT_ASSIGNED_MERCHANT}?login_id=${payload.login_id}&type=${payload.type}`
  );
};

const assignAccountMangerService = {
  assignAccountMangerApi,
  assignManagerDetails,
  assignClient,
  getAssignmentType,
  assignRoleWise,
  exportAssignedMerchant,
};
export default assignAccountMangerService;
