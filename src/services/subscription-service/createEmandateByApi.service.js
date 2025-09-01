import { E_NACH_URL } from "../../config";
import { axiosInstanceEmandateAuthApiKey } from "../../utilities/axiosInstance";

export const mandateByApi = (postData) => {
    return axiosInstanceEmandateAuthApiKey.post(E_NACH_URL.MANDATE_BY_API, postData);
};


export const createMandateHandleResponse = (postData) => {
    return axiosInstanceEmandateAuthApiKey.post(E_NACH_URL.CREATE_MANDATE_HANDLE_RESPONSE, postData);
}

export const bulkCreateEmandateApi = (postData) => {

    return axiosInstanceEmandateAuthApiKey.post(E_NACH_URL.BULK_CREATE_MANDATE, postData);
}


