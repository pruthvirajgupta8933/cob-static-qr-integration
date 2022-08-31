import axios from "axios";
import API_URL from "../config";



const verifyKycTab = (object) => {
  // console.log("profileservice",object)
  return axios.post(API_URL.VERIFY_EACH_TAB, object)
};

const veriferApproverService = {
  verifyKycTab,
};

export default veriferApproverService;
