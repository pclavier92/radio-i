const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const EXPIRATION = 'expiration_timestamp';
const LAST_LOCATION = 'last_location';

class Storage {
  constructor() {
    this.local = window.localStorage;
    this.session = window.sessionStorage;
  }

  setAccessToken(accessToken) {
    this.local.setItem(ACCESS_TOKEN, accessToken);
  }

  setRefreshToken(refreshToken) {
    this.local.setItem(REFRESH_TOKEN, refreshToken);
  }

  setExpiration(expiration) {
    this.local.setItem(EXPIRATION, expiration);
  }

  getApiTokens() {
    const accessToken = this.local.getItem(ACCESS_TOKEN);
    const refreshToken = this.local.getItem(REFRESH_TOKEN);
    const expirationTimestamp = this.local.getItem(EXPIRATION);
    return { accessToken, refreshToken, expirationTimestamp };
  }

  clearApiTokens() {
    this.local.removeItem(ACCESS_TOKEN);
    this.local.removeItem(REFRESH_TOKEN);
    this.local.removeItem(EXPIRATION);
  }

  setLastLocation(location) {
    this.session.setItem(LAST_LOCATION, location);
  }

  getLastLocation() {
    const lastLocation = this.session.getItem(LAST_LOCATION);
    this.session.removeItem(LAST_LOCATION);
    return lastLocation;
  }
}

export default new Storage();
