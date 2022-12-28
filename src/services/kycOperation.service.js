import API_URL from "../config";
import { axiosInstanceAuth } from "../utilities/axiosInstance";


const rejectKycOperation = (veriferDetails) => {
    
    return axiosInstanceAuth.post(API_URL.REJECT_KYC_TAB,veriferDetails)
  }

  const completeVerification = (veriferDetails) => {
    
    return axiosInstanceAuth.post(API_URL.COMPLETE_VERIFICATION,veriferDetails)
  }

  const completeVerificationRejectKyc = (veriferDetails) => {
    
    return axiosInstanceAuth.post(API_URL.COMPLETE_VERIFICATION_REJECT_KYC,veriferDetails)
  }
 

  const kycOperationService = {
    rejectKycOperation,
    completeVerification,
    completeVerificationRejectKyc
   
  };
  export default kycOperationService;