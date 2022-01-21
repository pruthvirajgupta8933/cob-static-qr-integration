import axios from "axios";

const SUBSCRIPTION_URL = "http://18.216.47.58:8081/client-subscription-service/";

const subscriptionPlan = () => {
  return axios.get(SUBSCRIPTION_URL + "fetchAppAndPlan")
  .then((response) => {
    if (response.data) {
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    }else{
      localStorage.setItem("subscriptionplan", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const subscription = () => {
    return axios.get(SUBSCRIPTION_URL + "subscribe")
    .then((response) => {
      if (response.data) {
        localStorage.setItem("subscribe", JSON.stringify(response.data));
      }else{
        localStorage.setItem("subscribe", JSON.stringify(response.data));
      }
  
      return response.data;
    });
  };

const subscriptionService = {
    subscriptionPlan,
    subscription,
};

export default subscriptionService;
