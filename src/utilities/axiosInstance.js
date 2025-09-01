import axios from "axios";
import { Buffer } from "buffer";

const username = "0007";
const passwordEncoded = "Admin@007";
const basicAuth = Buffer.from(
  `${username}:${passwordEncoded}`,
  "utf-8"
).toString("base64");

export const axiosInstanceAuth = axios.create({
  headers: { Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69" }, //.env - REACT_APP_AUTH
});

export const axiosInstance = axios.create({
  headers: {},
});


//.env - REACT_APP_AUTH
export const kycValidatorAuth = axios.create({
  headers: {
    "api-key": "f394aa8c23ed4bfbb318e07caff47188",
  },
});

//.env REACT_APP_KYC_VALID_AUTH
export const bankValidatorAuth = axios.create({
  headers: {
    "api-key": "f394aa8c23ed4bfbb318e07caff47188", //befisc
  },
});

//.env REACT_APP_KYC_VALID_AUTH
export const cinValidatorAuth = axios.create({
  headers: {
    "api-key": "f394aa8c23ed4bfbb318e07caff47188",
  },
});

// Instance for JWT
//.env REACT_APP_AUTH
export const axiosInstanceJWT = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69",
  },
});

//.env REACT_APP_SUBCRIPTION_AUTH
export const axiosInstanceAuthSubscription = axios.create({
  headers: {
    Authorization: `Basic ${basicAuth}`,
    "auth-token": "1df54c0f7fb14fb19812a1341f0a5884",
  },
});


//.env REACT_APP_ENACH_AUTH
////////////////////For E-Nach 
export const axiosInstanceEmandateAuthApiKey = axios.create({
  headers: {
    'api-key': '4d93c7cf31324fcd9be6912dc06ffe9c'
  }

})
