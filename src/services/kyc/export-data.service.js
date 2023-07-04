import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import { KYC_STATUS_APPROVED, KYC_STATUS_VERIFIED } from "../../utilities/enums";


////////////////////////////////////////////////
export const onboardedReportExport = async (data) => {
    const from_date = data.from_date;
    const to_date = data?.to_date
    const kyc_status = data?.status;
    let order_by = kyc_status.toLowerCase() + "_date"
    if (!kyc_status === KYC_STATUS_APPROVED || !kyc_status === KYC_STATUS_VERIFIED) {
        order_by = "id"
    }
   
    const response = await axiosInstanceJWT
        .get(`${API_URL.KYC_FOR_ONBOARDED}export-excel/?search=${kyc_status}&search_map=${order_by}&from_date=${from_date}&to_date=${to_date}`,
            {
                responseType: 'arraybuffer'
            })
        .catch((error) => {
            return error.response;
        });

    return response;
}
