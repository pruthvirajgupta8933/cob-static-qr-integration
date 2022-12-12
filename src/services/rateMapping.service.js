import API_URL from "../config";
import { axiosInstanceAuth } from "../utilities/axiosInstance";


const riskCategory = () => {
    
    return axiosInstanceAuth.get(API_URL.RISK_CATEGORY)
  }

 const businessCategory = (postData) => {
    return axiosInstanceAuth.post(API_URL.GET_RISK_BUISENSS_BYID,postData)
 }

 const templateRate = (postData) => {
    return axiosInstanceAuth.post(API_URL.TEMPLATE_DETAILS_BYRISKCODE,postData)
 }

 const viewRateMap  = (postData) => {
    return axiosInstanceAuth.post(API_URL.GET_RISK_TEMPLSTE,postData)
 }

  const rateMappingService = {
    riskCategory,
    businessCategory,
    templateRate,
    viewRateMap
   
  };
  export default rateMappingService