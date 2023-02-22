import {axiosInstanceJWT} from "../utilities/axiosInstance";

class UserService {
  login(data) {
    return axiosInstanceJWT.post('/auth-service/auth/login',data);
  }

}

export default new UserService();
