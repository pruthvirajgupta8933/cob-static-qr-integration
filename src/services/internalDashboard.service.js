// internalDashboardService.js
import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";
export const getApprovedCount = async (fromDate, toDate) => {
  try {
    const response = await axiosInstanceJWT.get(
      `${API_URL.KYC_FOR_ONBOARDED}?search=Approved&order_by=-approved_date&search_map=approved_date&page=1&page_size=10&from_date=${fromDate}&to_date=${toDate}`
    );

    return response.data.count;
  } catch (error) {
    // Handle errors here, e.g., log them or throw an exception
    console.error('Error fetching approved count:', error);
    throw error;
  }
};



export const getMyMerchantsCount = async (loginId) => {
    try {
      const response = await axiosInstanceJWT.post(
        `${API_URL.MY_MERCHANT_LIST}?page=1&page_size=10&order_by=-login_id&kyc_status=Approved`,
        { created_by: loginId }
      );
  
      return response.data.count;
    } catch (error) {
      // // Handle errors here, e.g., log them or throw an exception
      // console.error('Error fetching My Merchants count:', error);
      throw error;
    }
  };