import axios from 'axios';

import { serverUrl } from '../config';
import authService from '../services/authentication';

class RadioIApi {
  constructor() {
    this.authentication = authService;
  }

  refreshAccessToken() {
    const refreshToken = this.authentication.getRefreshToken();
    return axios.get(`${serverUrl}/refresh_token`, {
      params: { refresh_token: refreshToken }
    });
  }
}

export default new RadioIApi();
