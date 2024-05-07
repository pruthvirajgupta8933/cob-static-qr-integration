import API_URL from "../config";

import { axiosInstanceJWT } from "../utilities/axiosInstance";
import authService from "./auth.service";
import TokenService from "./token.service";

const setup = async (store) => {
  axiosInstanceJWT.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      console.log("token", token)
      console.log("tokent", typeof token)

      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
      } else {
        console.log("Token expired")
      }
      return config;
    },
    (error) => {
      console.log("error", error)
      return Promise.reject(error);
    }
  );





  axiosInstanceJWT.interceptors.response.use(
    (response) => {
      console.log("response1", response)
      // Successfully received response, simply return it
      return response;
    },
    (error) => {

      console.log("error1", error.response)
      const refreshToken = TokenService.getLocalrefreshToken();
      // This promise handles the refresh logic for 401 errors specifically
      if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest && refreshToken) {

        // if (refreshToken) {
        const originalRequest = error.config;
        originalRequest.__isRetryRequest = true; // Mark the request as retried

        // Attempt to refresh token and retry the original request
        return fetch(API_URL.BASE_URL_COB + "/auth-service/auth/refresh-token", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
          .then((res) => res.json())
          .then((res) => {
            TokenService.updateLocalAccessToken(res.access);
            axiosInstanceJWT.defaults.headers.common["Authorization"] = 'Bearer ' + res.access;
            return axiosInstanceJWT(originalRequest);
          })
          .catch((err) => {
            if (error.response.status === 401) {

              // console.log(err.config.url)
              if (err.config.url.includes("/auth-service/auth/refresh-token")) {
                // Log or handle logout error scenario
                console.error("Refresh token failure, logging out.", err);
                authService.logout();
                window.location.reload();
              }
            }
            return Promise.reject(err); // Ensure the promise chain correctly handles the error
          });

      }

      // if token not send on the request
      if (error.response && error.response.status === 403) {
        console.error("Token not found.");
        authService.logout();
        window.location.reload();
      }

      // For other types of errors, including 500, directly reject the promise with the error
      return Promise.reject(error);
    },
  );


};



export default setup;
