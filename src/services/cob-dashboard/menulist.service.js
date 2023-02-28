import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";


// CHECK_PERMISSION_PAYLINK
const menulist = (object) => {
    //pass login id
    return axiosInstanceJWT.post(`${API_URL.menuListByLoginId}`,object)
  }
  
  const menulistService = {
    menulist
  };
  
  export default menulistService;