import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";



const verifyKycTab = (object) => {
  // console.log("profileservice",object)
  return axiosInstanceJWT.post(API_URL.VERIFY_EACH_TAB, object)
};

const veriferApproverService = {
  verifyKycTab,
};

export default veriferApproverService;
