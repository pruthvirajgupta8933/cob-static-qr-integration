import API_URL from "../../config";
import { axiosInstance } from "../../utilities/axiosInstance";


const filterForAllMandatesReports=(paramData)=>
{ 
  return axiosInstance.post(API_URL.filterMandateReport,paramData);
}


export const MandateService = {
    filterForAllMandatesReports,
  };
  