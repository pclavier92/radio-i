import axios from 'axios';

import { serverUrl } from '../config';

import authService from '../services/authentication';

const logOut = () => {
  const accessToken = authService.getAccessToken();
  return axios.delete(`${serverUrl}/logout`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

const refreshSession = () => {
  const accessToken = authService.getAccessToken();
  return axios.get(`${serverUrl}/refresh_session`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

const refreshAccessToken = () => {
  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();
  return axios.get(`${serverUrl}/refresh_token`, {
    params: { access_token: accessToken, refresh_token: refreshToken }
  });
};

const startRadio = (id, name, isPublic) => {
  const accessToken = authService.getAccessToken();
  return axios.post(
    `${serverUrl}/api/radio`,
    { id, name, isPublic },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
};

const getRadio = id => {
  const accessToken = authService.getAccessToken();
  return axios.get(`${serverUrl}/api/radio`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

const addSongToRadio = (radioId, songId, duration) => {
  const accessToken = authService.getAccessToken();
  return axios.post(
    `${serverUrl}/api/radio/song`,
    { radioId, songId, duration },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
};

const getRadioQueue = id => {
  const accessToken = authService.getAccessToken();
  return axios.get(`${serverUrl}/api/radio/queue`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export default {
  logOut,
  refreshSession,
  refreshAccessToken,
  startRadio,
  getRadio,
  addSongToRadio,
  getRadioQueue
};
