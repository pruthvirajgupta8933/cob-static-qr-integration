import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";


const getSubscriptions = () => axiosInstanceJWT.get(API_URL.SUBSCRIPTIONS);

const getSubscriptionByClientCode = (clientCode) => { return axiosInstanceJWT.get(`${API_URL.GET_SUBSCRIPTIONS}/?client_code=${clientCode}`); }


const getSubscriptionById = (id) =>
  axiosInstanceJWT.get(`${API_URL.SUBSCRIPTIONS}/${id}`);

const createSubscription = (requestParam) =>
  axiosInstanceJWT.post(`${API_URL.SUBSCRIPTIONS}/create/`, requestParam);

const deleteSubscription = (id) =>
  axiosInstanceJWT.delete(`${API_URL.SUBSCRIPTIONS}/${id}/delete/`);

const updateSubscription = (id, requestParam) =>
  axiosInstanceJWT.patch(
    `${API_URL.SUBSCRIPTIONS}/${id}/update/`,
    requestParam
  );

const manualSubscriptionService = {
  getSubscriptions,
  getSubscriptionById,
  getSubscriptionByClientCode,
  createSubscription,
  deleteSubscription,
  updateSubscription,
};

export default manualSubscriptionService