import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";


const rejectKycOperation = (veriferDetails) => {
    
    return axiosInstanceJWT.post(API_URL.REJECT_KYC_TAB,veriferDetails)
  }

  const completeVerification = (veriferDetails) => {
    
    return axiosInstanceJWT.post(API_URL.COMPLETE_VERIFICATION,veriferDetails)
  }

  const completeVerificationRejectKyc = (veriferDetails) => {
    
    return axiosInstanceJWT.post(API_URL.COMPLETE_VERIFICATION_REJECT_KYC,veriferDetails)
  }
 

  const reverseToPendingVerification = (reverseDetails) => {
    return axiosInstanceJWT.post(API_URL.Back_To_Pending_Verification,reverseDetails)

  }
  const reverseToPendingApproval = (reverseToPendingApprovalDetails) => {
    return axiosInstanceJWT.post(API_URL.Back_To_Pending_Approval,reverseToPendingApprovalDetails)

  }
  const reverseToPendingkyc = (reverseToPendingKyc) => {
    return axiosInstanceJWT.post(API_URL.Back_To_Pending_KYC,reverseToPendingKyc)

  }

  const onboardedReport=(onboarderReportdata) => {
    return axiosInstanceJWT.post(API_URL.KYC_FOR_VERIFIED,onboarderReportdata)

  }

  const kycOperationService = {
    rejectKycOperation,
    completeVerification,
    completeVerificationRejectKyc,
    reverseToPendingVerification,
    reverseToPendingApproval,
    reverseToPendingkyc,
    onboardedReport
   
  };
  export default kycOperationService;