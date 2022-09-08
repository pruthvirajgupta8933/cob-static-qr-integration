import authHeader from "./auth-header";
import { axiosInstance } from "../utilities/axiosInstance";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axiosInstance.get(API_URL + "all");
};

const getUserBoard = () => {
  return axiosInstance.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axiosInstance.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axiosInstance.get(API_URL + "admin", { headers: authHeader() });
};

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default userService