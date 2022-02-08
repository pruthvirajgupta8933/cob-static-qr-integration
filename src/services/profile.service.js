import axios from "axios";

const BASE_URL = "https://cobtest.sabpaisa.in/auth-service/client";

const createClintCode = (object) => {
  console.log("profileservice",object)
  return axios.post(BASE_URL + "/create", object);
};


const updateClientProfile = (object,clientId)=>{
    return axios.put(BASE_URL + "/update/"+clientId, object);
}


const profileService = {
    createClintCode,
    updateClientProfile
};

export default profileService;
