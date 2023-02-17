import axiosInstance from "./api";
import TokenService from "./token.service";


const setup = async (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token =  TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;  
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "/auth-service/auth/login" && err.response) {
        // Access Token was expired
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
          const rs = await axiosInstance.post("/auth-service/auth/refresh-token", {
              refresh_token: TokenService.getLocalrefreshToken(),
            });
            const  accessTok  = rs.data.accessToken;
            // dispatch(refreshToken(accessToken));
            TokenService.updateLocalAccessToken(accessTok);

            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
