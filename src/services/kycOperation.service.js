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
 

  const reverseToPendingVerification = (reverseDetails) => {
    return axiosInstanceAuth.post(API_URL.Back_To_Pending_Verification,reverseDetails)

  }
  const reverseToPendingApproval = (reverseToPendingApprovalDetails) => {
    return axiosInstanceAuth.post(API_URL.Back_To_Pending_Approval,reverseToPendingApprovalDetails)

  }

  const kycOperationService = {
    rejectKycOperation,
    completeVerification,
    completeVerificationRejectKyc,
    reverseToPendingVerification,
    reverseToPendingApproval
   
  };
  export default kycOperationService;