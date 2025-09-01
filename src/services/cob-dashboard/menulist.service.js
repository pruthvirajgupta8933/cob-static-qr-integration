import API_URL from "../../config";
import { axiosInstance, axiosInstanceJWT } from "../../utilities/axiosInstance";


// CHECK_PERMISSION_PAYLINK
const menulist = (object) => {
  return axiosInstanceJWT.post(`${API_URL.menuListByLoginId}`, object)
}

const saveGeoLocation = (object) => {
  return axiosInstanceJWT.post(`${API_URL.saveGeoCord}`, object)
}


const menulistService = {
  menulist,
  saveGeoLocation
};

export default menulistService;