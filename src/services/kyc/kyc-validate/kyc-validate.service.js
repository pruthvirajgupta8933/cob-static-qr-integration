import API_URL from "../../../config";
import { kycValidatorAuth } from "../../../utilities/axiosInstance";

export const udyamValidate = async (objData) => {
    return await kycValidatorAuth.post(`${API_URL.VALIDATE_DOC_KYC}/validate-udyam/`, objData)
}


