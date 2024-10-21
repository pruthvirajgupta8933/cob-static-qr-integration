import axios from "axios";
import { decode as base64_decode } from "base-64";
import { Buffer } from "buffer";

const username = "0007";
const passwordEncoded = "Admin@007";
// const password = base64_decode(passwordEncoded); // Decode Base64 password
const basicAuth = Buffer.from(
  `${username}:${passwordEncoded}`,
  "utf-8"
).toString("base64");

export const axiosInstanceAuth = axios.create({
  headers: { Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69" },
});

export const axiosInstance = axios.create({
  headers: {},
});

export const kycValidatorAuth = axios.create({
  headers: {
    "api-key": "cb1c45b3ee43416884a720f02d449d8d",
  },
});

export const bankValidatorAuth = axios.create({
  headers: {
    "api-key": "cb1c45b3ee43416884a720f02d449d8d", //befisc
  },
});

export const cinValidatorAuth = axios.create({
  headers: {
    "api-key": "b553fcecb9094b90804d8c954f251046",
  },
});

// Instance for JWT
export const axiosInstanceJWT = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69",
  },
});

export const axiosInstanceAuthSubscription = axios.create({
  headers: {
    Authorization: `Basic ${basicAuth}`,
    "auth-token": "1df54c0f7fb14fb19812a1341f0a5884",
  },
});
