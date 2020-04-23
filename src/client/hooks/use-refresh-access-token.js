import { useCallback } from 'react';
import axios from 'axios';

import localStorage from '../local-storage';

import useInterval from './use-interval';

// PROVISIONAL
const LOCAL_SERVER_URL = 'http://localhost:8888';

const getRefreshAccessToken = (refreshToken, callback) => {
  axios
    .get(`${LOCAL_SERVER_URL}/refresh_token`, {
      params: { refresh_token: refreshToken }
    })
    .then(callback)
    .catch(e => console.log(e));
};

const useRefreshAccessToken = (
  refreshToken,
  expiration,
  setAccessToken,
  setRefreshToken
) => {
  // Update access token before it expires
  const requestCallback = useCallback(
    ({ data: { access_token, refresh_token } }) => {
      setAccessToken(access_token);
      localStorage.setApiAccessToken(access_token);
      if (refresh_token) {
        setRefreshToken(refresh_token);
        localStorage.setApiRefreshToken(refresh_token);
      }
    },
    [setAccessToken, setRefreshToken]
  );
  const refreshAccessToken = useCallback(() => {
    if (refreshToken) {
      getRefreshAccessToken(refreshToken, requestCallback);
    }
  }, [refreshToken, requestCallback]);

  useInterval(refreshAccessToken, (expiration - 1) * 1000);
};

export default useRefreshAccessToken;
