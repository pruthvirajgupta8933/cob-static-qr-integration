import api from './api';

class UserService {
  getPublicContent() {
    return api.post('/demo');
  }
  getUserBoard() {
    return api.post('/demo');
  }
  login(data) {
    return api.post('/auth-service/auth/login',data);
  }

}

export default new UserService();
