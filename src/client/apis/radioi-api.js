import axios from 'axios';

import { serverUrl } from '../config';

const refreshAccessToken = () => {
  const refreshToken = this.authentication.getRefreshToken();
  return axios.get(`${serverUrl}/refresh_token`, {
    params: { refresh_token: refreshToken }
  });
};

const startRadio = (id, userId, name, isPublic) =>
  axios.post(
    `${serverUrl}/api/radio`,
    { id, userId, name, isPublic },
    {
      'Content-Type': 'application/json'
    }
  );

const getRadio = id => axios.get(`${serverUrl}/api/radio?id=${id}`);

export default { refreshAccessToken, startRadio, getRadio };
