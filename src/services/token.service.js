class TokenService {
  getLocalrefreshToken() {
    const authToken = JSON.parse(localStorage.getItem("rt"));
    return authToken;
  }

  getLocalAccessToken() {
    const authToken = JSON.parse(localStorage.getItem("at"));
    return authToken;
  }

  updateLocalAccessToken(token) {
    let authToken = JSON.parse(localStorage.getItem("at"));
    authToken = token;
    localStorage.setItem("at", JSON.stringify(authToken));
  }


  setUser(data) {
    localStorage.setItem("at", JSON.stringify(data?.accessToken));
    localStorage.setItem("rt", JSON.stringify(data.refreshToken));
  }

  setCategory() {
    localStorage.setItem("categoryId", 1)
  }

  setUserData(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  removeUser() {
    localStorage.removeItem("authToken");
  }
}

export default new TokenService();
