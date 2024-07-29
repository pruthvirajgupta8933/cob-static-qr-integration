import { axiosInstanceJWT
 } from "../../utilities/axiosInstance";
 import API_URL from "../../config";
 

const assignAccountMangerApi = (requestParam) => {

    const url = `${API_URL.ASSIGN_ACCOUNT_MANAGER}`;
    return axiosInstanceJWT.post(url,requestParam);
}
const assignManagerDetails =(requestParam)=>{
    const url=`${API_URL.ACCOUNT_MANAGER_DETAILS}`;
    return axiosInstanceJWT.post(url,requestParam)
}
const assignClient=(requestParam)=>{
    const url=`${API_URL.ASSIGN_CLIENT}`;
    return axiosInstanceJWT.put(url,requestParam)
}


const assignAccountMangerService = {
    assignAccountMangerApi,
    assignManagerDetails,
    assignClient
  

};
export default assignAccountMangerService