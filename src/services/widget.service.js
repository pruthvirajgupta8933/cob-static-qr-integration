// import WIDGET_URL from "../config"
// import { axiosInstance, axiosInstanceJWT } from "../utilities/axiosInstance";
// import axios from 'axios'



// const  widgetKeyurl = (postData) => {
// return axiosInstance.post(WIDGET_URL.WIDGET_CLIENT_KEY,postData)

// }

// const widgetService = {
//   widgetKeyurl
//     };
//   export default widgetService;


// import WIDGET_URL from "../config"

import { axiosInstance } from "../utilities/axiosInstance"
import { WIDGET_URL } from "../config";


const createClientkey = (postData) => {
  return axiosInstance.post(WIDGET_URL.WIDGET_CLIENT_KEY, postData)
}

const creteClientScript = (data) => {
  return axiosInstance.post(WIDGET_URL.WIDGET_CLIENT_KEY, data)
}





const widgetService = {
  createClientkey,
  creteClientScript

};
export default widgetService;