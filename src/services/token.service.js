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


  setUser(authToken) {
    sessionStorage.setItem("at", JSON.stringify(authToken?.accessToken));
    sessionStorage.setItem("rt", JSON.stringify(authToken.refreshToken));
  }

  removeUser() {
    sessionStorage.removeItem("authToken");
  }
}

export default new TokenService();
