import React, {
 useContext, useEffect, useState, useCallback 
} from 'react';
import axios from 'axios';

import useRefreshAccessToken from './hooks/use-refresh-access-token';

import localStorage from './local-storage';
import { getHashParams } from './utils';

const authentication = React.createContext({});

const AuthenticationProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiration, setExpiration] = useState(3600);
  const [error, setError] = useState();

  const getUserInfo = useCallback(() => {
    console.log(accessToken);
    axios
      .get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'json'
      })
      .then(({ data }) => console.log('/me', data))
      .catch(e => console.log(e));
  }, [accessToken]);

  useEffect(() => {
    const apiTokens = localStorage.getApiTokens();
    if (apiTokens.accessToken && apiTokens.refreshToken) {
      const {
        accessToken: access_token,
        refreshToken: refresh_token
      } = apiTokens;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setApiTokens(access_token, refresh_token);
    } else {
      const {
        access_token,
        refresh_token,
        expires_in,
        error
      } = getHashParams();
      setExpiration(expires_in);
      setError(error);
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setApiTokens(access_token, refresh_token);
    }
  }, []);

  useRefreshAccessToken(
    refreshToken,
    expiration,
    setAccessToken,
    setRefreshToken
  );

  useEffect(() => {
    // Why dough? User provider??
    if (accessToken) {
      window.location.hash = '';
      getUserInfo();
    }
  }, [accessToken]);

  const authenticationValue = {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken
  };

  return (
    <authentication.Provider value={authenticationValue}>
      {children}
    </authentication.Provider>
  );
};

const useAuthentication = () => useContext(authentication);

export { AuthenticationProvider, useAuthentication };
