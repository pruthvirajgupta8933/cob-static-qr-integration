import API_URL from "../../config"
import { axiosInstanceJWT } from "../../utilities/axiosInstance"
import { getQueryStr } from "../../utilities/generateURLQueryParams";

export const adminTableList = (postData) => {
    return axiosInstanceJWT.post(API_URL.TABLE_LIST)
}

export const superAdminGetFilters = (postData) => {
    return axiosInstanceJWT.post(API_URL.ADMIN_GET_FILTERS, postData)
}

// export const superAdminFetchData = (postData) => {
//     return axiosInstanceJWT.post(API_URL.SUPER_ADMIN_FETH_DATA, postData)
// }


export const superAdminFetchData = async (bodyData, queryData) => {
    const url = `${API_URL.SUPER_ADMIN_FETH_DATA}`;
    const apiUrl = getQueryStr(url, queryData);
    return axiosInstanceJWT.post(apiUrl, bodyData);
};

export const superAdminExportToXl = async (postData) => {
    const url = `${API_URL.SUPER_EXPORT_ADMIN}`;
    return axiosInstanceJWT.post(url, postData, {
        responseType: 'arraybuffer'
    });
};