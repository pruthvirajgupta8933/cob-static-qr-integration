import API_URL from "../../../config"
import { axiosInstanceJWT } from "../../../utilities/axiosInstance"

export const updateMfa = (body) => {
    return axiosInstanceJWT.post(API_URL.MFA_STATUS_UPDATE, body)
}
