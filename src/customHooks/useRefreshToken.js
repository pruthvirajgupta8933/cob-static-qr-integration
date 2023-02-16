import { useContext, useDebugValue } from "react";
import axios, { axiosPrivate, axiosRefreshToken } from '../utilities/axiosInstance';
import AuthContext from "../context/AuthProvider";
import useAuth from './useAuth';

// important replace variable fromt the refresh token resp. = 2 location

const useRefreshToken = () => {
    const { auth } = useContext(AuthContext);
    const { setAuth } = useAuth();
    const refresh = async () => {
        // config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;    
        // const config = {
        //     headers: { 'Content-Type': 'application/json','Authorization':  `Bearer ${auth?.accessToken}`},
        //     withCredentials: true
        // }
        // console.log("axiosRefreshToken",axiosRefreshToken.interceptors.request.use)
        let refreshTokenAuth = auth.refreshToken
        const localhostRefreshToken = JSON.parse(localStorage.getItem("sp-token"));

        if(!refreshTokenAuth){
            refreshTokenAuth = localhostRefreshToken.refreshToken
        }
        // console.log(typeof(refreshTokenAuth))
        // console.log("refreshTokenAuth",refreshTokenAuth)

        axiosRefreshToken.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${refreshTokenAuth}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )
        const response = await axiosRefreshToken.post('/v1/auth/refresh');

       if(auth==='undefined'){
        setAuth(localhostRefreshToken)
       }

        setAuth(prev => {
            localStorage.setItem("sp-token", JSON.stringify({ ...prev, accessToken: response.data.JWT, refreshToken: response.data.refresh}))
            return { ...prev, accessToken: response.data.JWT }
        });
      
        return response.data.JWT;
    }
    return refresh;
};

export default useRefreshToken;
