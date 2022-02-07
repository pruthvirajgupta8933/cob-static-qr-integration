import axios from "axios";

const BASE_URL = "https://cobtest.sabpaisa.in/auth-service/client";

const createClintCode = (object) => {
  return axios.post(BASE_URL + "/create", object);
};


const updateClientProfile = (object)=>{
    return axios.post(BASE_URL + "/update", object);
}


const profileService = {
    createClintCode,
    updateClientProfile
};

export default profileService;
