import API_URL from "../../config";
import { axiosInstance } from "../../utilities/axiosInstance";


const filterForAllDebitReports=(paramData)=>
{ 
  return axiosInstance.post(API_URL.filterDebitReport,paramData);
}


export const DebitService = {
    filterForAllDebitReports,
  };
  