import api from './api';

class UserService {
  getPublicContent() {
    return api.post('/demo');
  }
  getUserBoard() {
    const url=`https://staging-payout.sabpaisa.in/api/getByClientCode/`;
    return api.get(url);
  }
  login(data) {
    return api.post('/auth-service/auth/login',data);
  }


}

export default new UserService();
