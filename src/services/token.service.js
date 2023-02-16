class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("refresh"));
    return user;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("JWT"));
    return user;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("JWT"));
    console.log(user,'dd');
    user = token;
    localStorage.setItem("JWT", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  setUser(user) {
    console.log(JSON.stringify(user));
    // localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("JWT", JSON.stringify(user.JWT));
    localStorage.setItem("refresh", JSON.stringify(user.refresh));
  }

  removeUser() {
    localStorage.removeItem("user");
  }
}

export default new TokenService();
