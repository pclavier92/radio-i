const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

class LocalStorage {
  constructor() {
    this.storage = window.localStorage;
  }

  setApiAccessToken(accessToken) {
    this.storage.setItem(ACCESS_TOKEN, accessToken);
  }

  setApiRefreshToken(refreshToken) {
    this.storage.setItem(REFRESH_TOKEN, refreshToken);
  }

  setApiTokens(accessToken, refreshToken) {
    this.storage.setItem(ACCESS_TOKEN, accessToken);
    this.storage.setItem(REFRESH_TOKEN, refreshToken);
  }

  getApiTokens() {
    const accessToken = this.storage.getItem(ACCESS_TOKEN);
    const refreshToken = this.storage.getItem(REFRESH_TOKEN);
    return { accessToken, refreshToken };
  }

  clearApiTokens() {
    this.storage.removeItem(ACCESS_TOKEN);
    this.storage.removeItem(REFRESH_TOKEN);
  }
}

export default new LocalStorage();
