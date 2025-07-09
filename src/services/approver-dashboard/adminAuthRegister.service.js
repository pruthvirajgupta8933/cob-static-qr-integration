import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";

export const adminAuthRegisterApi = (obj) => {
    return axiosInstanceJWT.post(API_URL.ADMIN_AUTH_REGISTER, obj);
};

export const applicationAllowed = () => {
    return axiosInstanceJWT.get(API_URL.APPLICATION_ALLOWED)
}