class TokenService {
  getLocalrefreshToken() {
    const authToken = JSON.parse(sessionStorage.getItem("rt"));
    return authToken;
  }

  getLocalAccessToken() {
    const authToken = JSON.parse(sessionStorage.getItem("at"));
    return authToken;
  }

  updateLocalAccessToken(token) {
    let authToken = JSON.parse(sessionStorage.getItem("at"));
    authToken = token;
    sessionStorage.setItem("at", JSON.stringify(authToken));
  }


  setUser(data) {
    sessionStorage.setItem("at", JSON.stringify(data?.accessToken));
    sessionStorage.setItem("rt", JSON.stringify(data.refreshToken));
  }

  setCategory() {
    sessionStorage.setItem("categoryId", 1)
  }

  setUserData(data) {
    sessionStorage.setItem("user", JSON.stringify(data));
  }

  removeUser() {
    sessionStorage.removeItem("authToken");
  }
}

export default new TokenService();
