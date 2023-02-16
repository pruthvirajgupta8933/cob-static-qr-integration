import api from './api';

class UserService {
  getPublicContent() {
    return api.get('/books');
  }
}

export default new UserService();
