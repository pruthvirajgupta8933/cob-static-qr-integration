import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";

const searchFilterService = () => {
  return axiosInstanceJWT
    .get(API_URL.searchQuery)
    .then((response) => {
      return response;
    });
};
export const SearchService = {
    searchFilterService,
  };
  