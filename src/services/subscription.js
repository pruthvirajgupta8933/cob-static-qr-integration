import axios from "axios";
import { axiosInstance } from "../utilities/axiosInstance";

// const SUBSCRIPTION_URL = "https://spl.sabpaisa.in/client-subscription-service/";

// const subscriptionPlan = () => {
//   return axiosInstance.get(SUBSCRIPTION_URL + "fetchAppAndPlan")
//   .then((response) => {
//     if (response.data) {
//       localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
//     } else {
//       localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
//     }
//     return response.data;
//   });
// };

// const subscriptionChargesDetail = () => {
//     return axiosInstance.post(SUBSCRIPTION_URL + "subscribe")
//     .then((response) => {
//       if (response.data) {
//         localStorage.setItem("subscriptionchargesdetail", JSON.stringify(response.data));
//       } else {
//         localStorage.setItem("subscriptionchargesdetail", JSON.stringify(response.data));
//       }
  
//       return response.data;
//     });
//   };

const subscriptionService = {
    // subscriptionPlan,
    // subscriptionChargesDetail,
};

export default subscriptionService;
