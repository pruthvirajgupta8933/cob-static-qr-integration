import API_URL from "../../config";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";


const clientDetailsListApi=(postData)=>{
    return axiosInstanceAuth
    .post(API_URL.CLIENT_DETAIL,postData)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err));

}

export const sandBoxService={
    clientDetailsListApi

}