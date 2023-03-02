import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";


const zoneDetails = () => {
    
    return axiosInstanceJWT.get(API_URL.ZONE_DETAILS)
  }

  const zoneMasters = (zoneCode) => {
return axiosInstanceJWT.post(API_URL.ZONE_MASTER, zoneCode)
    
 }
 const zoneEmployee = (ManagerId) => {
  
return axiosInstanceJWT.post(API_URL.ZONE_EMPLOYEE, ManagerId)
   
}

const updateZoneData = (postData) => {
  
return axiosInstanceJWT.put(API_URL.UPDATE_ZONE_DATA,postData)
   
}

const  getZoneInfo = (postData) => {
  return axiosInstanceJWT.post(API_URL.GET_ZONE_INFO,postData)
   
}
  
  const zoneService = {
    zoneDetails,
    zoneMasters,
    zoneEmployee,
    updateZoneData,
    getZoneInfo
  };
  export default zoneService;