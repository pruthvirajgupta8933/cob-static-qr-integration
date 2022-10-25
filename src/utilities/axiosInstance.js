import axios from "axios";
  
  
export const axiosInstanceAuth = axios.create({
    headers:{ Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69"}
});


  
export const axiosInstance = axios.create({
    headers:{ 

     }
});

export const kycValidatorAuth = axios.create({
    headers: {
        Authorization: "2044c5ea-d46f-4e9e-8b7a-2aa73ce44e69",
        "api-key":"6fecdd37ceb7416f89ef60623952d852"

    }
})

