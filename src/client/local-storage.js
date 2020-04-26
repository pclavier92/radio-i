const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const EXPIRATION = 'expiration_timestamp';

class LocalStorage {
  constructor() {
    this.storage = window.localStorage;
  }

  setAccessToken(accessToken) {
    this.storage.setItem(ACCESS_TOKEN, accessToken);
  }

  setRefreshToken(refreshToken) {
    this.storage.setItem(REFRESH_TOKEN, refreshToken);
  }

  setExpiration(expiration) {
    this.storage.setItem(EXPIRATION, expiration);
  }

  getApiTokens() {
    const accessToken = this.storage.getItem(ACCESS_TOKEN);
    const refreshToken = this.storage.getItem(REFRESH_TOKEN);
    const expirationTimestamp = this.storage.getItem(EXPIRATION);
    return { accessToken, refreshToken, expirationTimestamp };
  }

  clearApiTokens() {
    this.storage.removeItem(ACCESS_TOKEN);
    this.storage.removeItem(REFRESH_TOKEN);
    this.storage.removeItem(EXPIRATION);
  }
}

export default new LocalStorage();
