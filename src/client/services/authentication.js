import { getHashParams } from '../utils';
import storage from './storage';

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiration = null;
    this.storage = storage;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getExpiration() {
    return this.expiration;
  }

  getAuthentication() {
    let access = null;
    let refresh = null;
    let expiration = null;
    let redirected = false;
    const { access_token, refresh_token, expires_in, error } = getHashParams();
    if (access_token) {
      access = access_token;
      refresh = refresh_token;
      expiration = new Date().getTime() + expires_in * 1000;
      redirected = true;
    } else {
      const {
        accessToken,
        refreshToken,
        expirationTimestamp
      } = this.storage.getApiTokens();
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
    this.storage.setAccessToken(access);
    this.storage.setRefreshToken(refresh);
    this.storage.setExpiration(expiration);

    return { redirected };
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    this.storage.setAccessToken(accessToken);
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    this.storage.setRefreshToken(refreshToken);
  }

  setExpiration(expiration) {
    this.expiration = expiration;
    this.storage.setExpiration(expiration);
  }

  logOut() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiration = null;
    this.storage.clearApiTokens();
  }
}

export default new AuthService();
