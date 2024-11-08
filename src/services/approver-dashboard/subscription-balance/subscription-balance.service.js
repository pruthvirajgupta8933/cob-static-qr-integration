import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";

export const subscriptionBalance = (obj) => {
    return axiosInstanceJWT.get(`${API_URL.SUBSCRIPTION_BALANCE_DETAIL}?client_code=${obj.clientCode}`)
};