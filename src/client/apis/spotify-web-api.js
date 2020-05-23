import axios from 'axios';

import authService from '../services/authentication';

const baseURL = 'https://api.spotify.com';
const version = '/v1';
const spotifyUrl = `${baseURL + version}`;

const UNAUTHORIZED = 401;

class SpotifyWebApi {
  constructor() {
    this.deviceId = null;
  }

  setDeviceId(deviceId) {
    this.deviceId = deviceId;
  }

  // If user is not authenticated (or access token expired) it will
  // try to refresh the access token and make the request again
  async makeRequestWithRetry(requestConfig) {
    let response = null;
    try {
      response = await axios.request(requestConfig);
    } catch (error) {
      if (error.response.status === UNAUTHORIZED) {
        try {
          await authService.refreshAuthentication();
          response = await axios.request(requestConfig);
        } catch (e) {
          console.log(e);
          console.log(error);
          console.log(requestConfig);
        }
      } else {
        console.log(error);
        console.log(requestConfig);
      }
    }
    return response;
  }

  getUserInfo() {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'get',
      url: `${spotifyUrl}/me`,
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    return this.makeRequestWithRetry(requestConfig);
  }

  getUserInfoById(userId) {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'get',
      url: `${spotifyUrl}/users/${userId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    return this.makeRequestWithRetry(requestConfig);
  }

  playSongFrom(uri, position) {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'put',
      url: `${spotifyUrl}/me/player/play`,
      params: { device_id: this.deviceId },
      data: { uris: [uri], position_ms: position },
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    this.makeRequestWithRetry(requestConfig);
  }

  setVolume(volume) {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'put',
      url: `${spotifyUrl}/me/player/volume`,
      params: { volume_percent: volume, device_id: this.deviceId },
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    this.makeRequestWithRetry(requestConfig);
  }

  pausePlayer() {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'put',
      url: `${spotifyUrl}/me/player/pause`,
      params: { device_id: this.deviceId },
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    this.makeRequestWithRetry(requestConfig);
  }

  getCurrentlyPlaying() {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'get',
      url: `${spotifyUrl}/me/player/currently-playing`,
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    return this.makeRequestWithRetry(requestConfig);
  }

  getSearchResults(searchInput) {
    const accessToken = authService.getAccessToken();
    const encodedInput = encodeURIComponent(searchInput);
    const requestConfig = {
      method: 'get',
      url: `${spotifyUrl}/search?q=${encodedInput}&type=track&offset=0&limit=20`,
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    return this.makeRequestWithRetry(requestConfig);
  }

  getTopArtists() {
    const accessToken = authService.getAccessToken();

    const requestConfig = {
      method: 'get',
      url: `${spotifyUrl}/me/top/artists?time_range=medium_term&limit=50&offset=0`,
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    return this.makeRequestWithRetry(requestConfig);
  }

  getSongData(songId) {
    const accessToken = authService.getAccessToken();
    const requestConfig = {
      method: 'get',
      url: `${spotifyUrl}/tracks/${songId}`,
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    };
    return this.makeRequestWithRetry(requestConfig);
  }
}

export default new SpotifyWebApi();
