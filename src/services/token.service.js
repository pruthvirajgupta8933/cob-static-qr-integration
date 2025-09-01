class TokenService {
  getLocalrefreshToken() {
    const authToken = localStorage.getItem("rt");
    return authToken;
  }

  getLocalAccessToken() {
    let authToken = localStorage.getItem("at")
    return authToken;
  }

  updateLocalAccessToken(token) {
    let authToken = localStorage.getItem("at");
    authToken = token;
    localStorage.setItem("at", authToken);
  }


  setUser(data) {
    localStorage.setItem("at", data?.accessToken);
    localStorage.setItem("rt", data.refreshToken);
  }

  setCategory() {
    localStorage.setItem("categoryId", 1)
  }

  setUserData(data) {
    localStorage.setItem("user", data);
  }

  removeUser() {
    localStorage.removeItem("authToken");
  }
}

export default new TokenService();
