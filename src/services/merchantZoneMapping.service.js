import API_URL from "../config";
import { axiosInstanceAuth } from "../utilities/axiosInstance";


const zoneDetails = () => {
    
    return axiosInstanceAuth.get(API_URL.ZONE_DETAILS)
  }

  const zoneMasters = (zoneCode) => {
return axiosInstanceAuth.post(API_URL.ZONE_MASTER, zoneCode)
    
 }
 const zoneEmployee = (ManagerId) => {
  
return axiosInstanceAuth.post(API_URL.ZONE_EMPLOYEE, ManagerId)
   
}

const updateZoneData = (postData) => {
  
return axiosInstanceAuth.put(API_URL.UPDATE_ZONE_DATA,postData)
   
}

const  getZoneInfo = (postData) => {
  return axiosInstanceAuth.post(API_URL.GET_ZONE_INFO,postData)
   
}
  
  const zoneService = {
    zoneDetails,
    zoneMasters,
    zoneEmployee,
    updateZoneData,
    getZoneInfo
  };
  export default zoneService;