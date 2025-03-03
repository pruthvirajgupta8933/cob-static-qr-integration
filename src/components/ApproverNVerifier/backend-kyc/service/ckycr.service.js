import { BACKEND_USER_API } from "../../../../config";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";

function ckycrSave(obj) {
    return axiosInstanceJWT.post(BACKEND_USER_API.save_ckycr, obj);
}

function ckycrFetch(obj) {
    return axiosInstanceJWT.post(BACKEND_USER_API.get_ckycr, obj);
}


export const ckycrServices = {
    ckycrSave,
    ckycrFetch
}