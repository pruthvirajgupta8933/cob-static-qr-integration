import API_URL from "../config";
import { axiosInstanceJWT } from "../utilities/axiosInstance";
export const getInfoBulletin = async () => {
  try {
    const response = await axiosInstanceJWT.get(
      API_URL.GET_INFORMATION_BULLETIN
    );
    return response.data;
  } catch (error) {
    // Handle errors here, e.g., log them or throw an exception
    console.error("Error fetching data:", error);
    throw error;
  }
};
