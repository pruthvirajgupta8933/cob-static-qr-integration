import API_URL from "../../config";
import { axiosInstance, axiosInstanceJWT } from "../../utilities/axiosInstance";


// CHECK_PERMISSION_PAYLINK
const menulist = (object) => {
  return axiosInstanceJWT.post(`${API_URL.menuListByLoginId}`, object)
}


const menulistService = {
  menulist
};

export default menulistService;