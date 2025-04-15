// import API_URL from "../../../config"
// import { axiosInstanceJWT } from "../../../utilities/axiosInstance"
import API_URL from "../../../../config"
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance"

export const assignBdApi = (body) => {
    return axiosInstanceJWT.post(API_URL.BD_DEVELOPMENT, body)
}
