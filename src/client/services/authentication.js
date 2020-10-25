class AuthService {
  constructor() {
    this.accessToken = null;
  }

  getAccessToken() {
    return this.accessToken;
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  logOut() {
    this.accessToken = null;
  }
}

export default new AuthService();
