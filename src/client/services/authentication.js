import { getHashParams } from '../utils';
import localStorage from '../local-storage';

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiration = null;
    this.localStorage = localStorage;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getExpirationTime() {
    return this.expiration;
  }

  getAuthentication() {
    let access = null;
    let refresh = null;
    let expiration = null;
    const { access_token, refresh_token, expires_in, error } = getHashParams();
    if (access_token) {
      access = access_token;
      refresh = refresh_token;
      expiration = new Date().getTime() + expires_in * 1000;
    } else {
      const {
        accessToken,
        refreshToken,
        expirationTimestamp
      } = this.localStorage.getApiTokens();
      access = accessToken;
      refresh = refreshToken;
      expiration = expirationTimestamp;
    }
    if (!access) {
      throw error;
    }

    this.accessToken = access;
    this.refreshToken = refresh;
    this.expiration = expiration;
    this.localStorage.setAccessToken(access);
    this.localStorage.setRefreshToken(refresh);
    this.localStorage.setExpiration(expiration);
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    this.localStorage.setAccessToken(accessToken);
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    this.localStorage.setRefreshToken(refreshToken);
  }

  logOut() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiration = null;
    this.localStorage.clearApiTokens();
  }
}

export default new AuthService();
