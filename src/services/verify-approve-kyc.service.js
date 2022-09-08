import API_URL from "../config";
import { axiosInstanceAuth } from "../utilities/axiosInstance";



const verifyKycTab = (object) => {
  // console.log("profileservice",object)
  return axiosInstanceAuth.post(API_URL.VERIFY_EACH_TAB, object)
};

const veriferApproverService = {
  verifyKycTab,
};

export default veriferApproverService;
