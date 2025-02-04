import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import { getQueryStr } from "../../utilities/generateURLQueryParams";


export const fetchTransactionHistoryDoitc = (paramData) => {
  // console.log("dd")
  return axiosInstanceJWT.post(API_URL.GET_DOITC_MERCHANT_TXN_HISTORY, paramData);
}


export const fetchSettledTransactionHistoryDsoitc = (paramData) => {
  return axiosInstanceJWT.post(API_URL.GET_DOITC_SETTLED_TXN_HISTORY, paramData);
}



export const branchTransactionReport = (paramData) => {
  return axiosInstanceJWT.post(API_URL.branchTransactionView, paramData);
}

// export const branchTransactionReport = (postData) => {


//   const url = `${API_URL.branchTransactionView}`
//   const apiUrl = getQueryStr(url, postData)

//   return axiosInstanceJWT.post(apiUrl)
// }


