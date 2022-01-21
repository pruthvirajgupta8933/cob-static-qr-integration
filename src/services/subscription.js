import axios from "axios";

const SUBSCRIPTION_URL = "http://18.216.47.58:8081/client-subscription-service/";

const subscriptionPlan = () => {
  return axios.get(SUBSCRIPTION_URL + "fetchAppAndPlan")
  .then((response) => {
    if (response.data) {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    } else {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const subscriptionChargesDetail = () => {
    return axios.post(SUBSCRIPTION_URL + "subscribe")
    .then((response) => {
      if (response.data) {
        localStorage.setItem("subscriptionchargesdetail", JSON.stringify(response.data));
      } else {
        localStorage.setItem("subscriptionchargesdetail", JSON.stringify(response.data));
      }
  
      return response.data;
    });
  };

const subscriptionService = {
    subscriptionPlan,
    subscriptionChargesDetail,
};

export default subscriptionService;
