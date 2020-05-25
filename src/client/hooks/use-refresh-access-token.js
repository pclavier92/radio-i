import { useCallback, useState } from 'react';

import authService from '../services/authentication';

import radioiApi from '../apis/radioi-api';
import useInterval from './use-interval';

const FIVE_MINUTES = 5 * 60 * 1000; // ms
const HALF_HOUR = 30 * 60 * 1000; // 30 minutes

const useRefreshAccessToken = () => {
  const [refreshInterval, setRefreshInterval] = useState(FIVE_MINUTES);

  // Update access token before it expires
  const refreshAccessToken = useCallback(async () => {
    const timeInMs = new Date().getTime();
    const expiration = authService.getExpiration();
    if (expiration - timeInMs < FIVE_MINUTES) {
      try {
        const {
          data: { access_token, refresh_token }
        } = await radioiApi.refreshAccessToken();
        console.log(
          new Date().toUTCString() + ' - Access Refreshed Successfully'
        );
        authService.setAccessToken(access_token);
        const expirationTimestamp = timeInMs + HALF_HOUR;
        authService.setExpiration(expirationTimestamp);
        if (refresh_token) {
          authService.setAccessToken(refresh_token);
        }
      } catch (e) {
        console.log('It was not possible to refresh access token', e);
        // prevents refreshAccessToken to be called again
        setRefreshInterval(null);
      }
    }
  }, []);

  useInterval(refreshAccessToken, refreshInterval);
};

export default useRefreshAccessToken;
