import axios from "axios";

export const axiosInstanceAuth = axios.create({
    headers:{ Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69"}
});


export const axiosInstance = axios.create({ });

export const kycValidatorAuth = axios.create({
    headers: {
        "api-key":"6fecdd37ceb7416f89ef60623952d852"
    }
})

// Instance for JWT
const BASE_URL = 'http://localhost:2020';

 axios.create({
    baseURL: BASE_URL
});

export const axiosRefreshToken = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true
});

//Instance for axios JWT instance
 const instance = axios.create({
    baseURL: "https://0c7e-103-106-192-134.in.ngrok.io",
    headers: {
      "Content-Type": "application/json",
    },
  });
export default instance;
  