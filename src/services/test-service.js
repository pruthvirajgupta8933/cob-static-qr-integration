import api from './api';

class UserService {
  getPublicContent() {
    return api.get('/books');
  }
  getUserBoard() {
    return api.get('/books');
  }

}

export default new UserService();
