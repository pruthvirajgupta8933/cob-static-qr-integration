import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";




const saveReferingMerchant = (saveRefData) => {
    
    return axiosInstanceJWT.post(API_URL.KYC_FOR_SAVING_REFER_MERCHANT,saveRefData)
  }

  const forGeneratingMid = (midData) => {
    
    return axiosInstanceJWT.post(API_URL.FOR_GENERATING_MID,midData)
  }

  



  const referralAndMidService = {
    saveReferingMerchant,
    forGeneratingMid
  
   
  };
  export default referralAndMidService