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


  //   axiosInstanceJWT.interceptors.response.use(
  //     (response) => {
  //       return response
  //     },
  //     (error) => {
  //       return new Promise((resolve) => {
  //         const originalRequest = error.config
  //         const refreshToken = TokenService.getLocalrefreshToken()
  //         // console.log("error.response", error.response)
  //         // console.log("error.response.status", error.response.status)
  //         // console.log("error.config", error.config)
  //         // console.log("!error.config.__isRetryRequest", !error.config.__isRetryRequest)
  //         // console.log("refreshToken", refreshToken)
  //         if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest && refreshToken) {
  //           // console.log("true conditions")
  //           originalRequest._retry = true
  //           const response = fetch(API_URL.BASE_URL_COB + "/auth-service/auth/refresh-token", {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               refresh: refreshToken,
  //             }),
  //           })
  //             .then((res) => res.json())
  //             .then((res) => {

  //               // localStorage.set(res.access, 'token')
  //               TokenService.updateLocalAccessToken(res.access);
  //               return axiosInstanceJWT(originalRequest)
  //             }).catch(err => {
  //               authService.logout();
  //               window.location.reload();
  //               console.log("catch err --------------logout----------")
  //             })
  //           resolve(response)
  //         }
  //         return Promise.reject(error)
  //       })
  //     },
  //   )



  axiosInstanceJWT.interceptors.response.use(
    (response) => {
      // Successfully received response, simply return it
      return response;
    },
    (error) => {
      console.log("error-setup",error)
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
            authService.logout();
            window.location.reload();
            // Log or handle logout error scenario
            console.error("Refresh token failure, logging out.", err);
            return Promise.reject(err); // Ensure the promise chain correctly handles the error
          });

      }

      // For other types of errors, including 500, directly reject the promise with the error
      return Promise.reject(error);
    },
  );


};



export default setup;
