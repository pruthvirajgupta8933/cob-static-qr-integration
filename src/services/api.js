import axios from "axios";

const instance = axios.create({
  baseURL: "https://0c7e-103-106-192-134.in.ngrok.io",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
