import React, {
 useContext, useEffect, useState, useCallback 
} from 'react';
import axios from 'axios';

import { getHashParams } from './utils';

const authentication = React.createContext({});

const AuthenticationProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [error, setError] = useState(null);

  const getUserInfo = useCallback(() => {
    axios
      .get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'json'
      })
      .then(({ data }) => console.log('/me', data))
      .catch(e => console.log(e));
  }, [accessToken]);

  useEffect(() => {
    const { access_token, refresh_token, error } = getHashParams();
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setError(error);
  }, []);

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
    setAccessToken
  };

  return (
    <authentication.Provider value={authenticationValue}>
      {children}
    </authentication.Provider>
  );
};

const useAuthentication = () => useContext(authentication);

export { AuthenticationProvider, useAuthentication };
