import API_URL from "../../config"
import { axiosInstance } from "../../utilities/axiosInstance"

export const ipWhiteListApi=(obj)=>{
    return axiosInstance.post(API_URL.IP_WHITElIST,obj)
}

