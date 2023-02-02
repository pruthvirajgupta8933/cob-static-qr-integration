import API_URL from "../../config";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";



export const fetchSubscribedPlan = (dataObj) => {
  return axiosInstanceAuth.post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, dataObj)
};



