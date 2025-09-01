import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";

export const udyamValidate = async (objData) => {
    return await axiosInstanceJWT.post(`${API_URL.VALIDATE_DOC_KYC}/validate-udyam/`, objData)
}


