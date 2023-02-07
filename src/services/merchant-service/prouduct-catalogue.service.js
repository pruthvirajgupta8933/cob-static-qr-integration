import API_URL from "../../config";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";



export const fetchSubscribedPlan = (dataObj) => {
  return axiosInstanceAuth.post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, dataObj)
};


export const fetchProductPlan = (dataObj) => {
  const id = dataObj.app_id;
  let url = API_URL.PRODUCT_SUB_DETAILS + "/" + id;
  return axiosInstanceAuth.get(url)
}


export const  createClientTxnId =  (postBody)=>{
  let url = API_URL.PRE_UPDATE_SUBSCRIBE_DETAILS
  return axiosInstanceAuth.post(url,postBody)
}


export const updateClientSubscribedDetails =(postBody)=>{
  let url = API_URL.UPDATE_SUBSCRIBED_PLAN_DETAILS
  return axiosInstanceAuth.post(url,postBody)
}