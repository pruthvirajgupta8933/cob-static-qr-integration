import API_URL from "../config";

import { axiosInstanceJWT } from "../utilities/axiosInstance";
import authService from "./auth.service";
import TokenService from "./token.service";

const setup = async (store) => {
  axiosInstanceJWT.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  axiosInstanceJWT.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      return new Promise((resolve) => {
        const originalRequest = error.config
        const refreshToken = TokenService.getLocalrefreshToken()
        // console.log("error.response", error.response)
        // console.log("error.response.status", error.response.status)
        // console.log("error.config", error.config)
        // console.log("!error.config.__isRetryRequest", !error.config.__isRetryRequest)
        // console.log("refreshToken", refreshToken)
        if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest && refreshToken) {
          console.log("true conditions")
          originalRequest._retry = true
          const response = fetch(API_URL.BASE_URL_COB + "/auth-service/auth/refresh-token", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          })
            .then((res) => res.json())
            .then((res) => {

              // localStorage.set(res.access, 'token')
              TokenService.updateLocalAccessToken(res.access);
              return axiosInstanceJWT(originalRequest)
            }).catch(err => {
              authService.logout();
              window.location.reload();
              console.log("catch err --------------logout----------")
            })
          resolve(response)
        }
        return Promise.reject(error)
      })
    },
  )
};

export default setup;
