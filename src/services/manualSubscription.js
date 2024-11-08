import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";

const getSubscriptions = () => axiosInstanceJWT.get(API_URL.SUBSCRIPTIONS);
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

export default {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  deleteSubscription,
  updateSubscription,
};
