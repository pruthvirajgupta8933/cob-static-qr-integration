import API_URL from "../../../../config";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";

const updateRollingReserve = (postData) => {
    return axiosInstanceJWT.post(API_URL.UPDATE_ROLLING_RESERVE, postData);
};



const updateRollingReserveService = {
    updateRollingReserve

};

export default updateRollingReserveService;
