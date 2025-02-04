import { E_NACH_URL } from "../../../config";
import { axiosInstanceEmandateAuthApiKey } from "../../../utilities/axiosInstance";

export const getAllMandateApi = (requestParam) => {
    return axiosInstanceEmandateAuthApiKey.post(
        `${E_NACH_URL.REGISTRATION_HISTORY}?page=${requestParam.page}&page_size=${requestParam.page_size}&order_by=-id`,
        requestParam
    );
};

