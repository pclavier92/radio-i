import React, { useContext, useEffect, useMemo, useState } from 'react';

import useRefreshAccessToken from './hooks/use-refresh-access-token';

import authService from './services/authentication';

import spotifyWebApi from './apis/spotify-web-api';

const authentication = React.createContext({});

const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      authService.getAuthentication();
      setAuthenticated(true);
      window.location.hash = '';
      (async () => {
        const { data } = await spotifyWebApi.getUserInfo();
        setUser(data);
      })();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const authValue = useMemo(
    () => ({
      user,
      authenticated,
      setAuthenticated
    }),
    [user, authenticated, setAuthenticated]
  );

  useRefreshAccessToken();

  return (
    <authentication.Provider value={authValue}>
      {children}
    </authentication.Provider>
  );
};

const useAuthentication = () => useContext(authentication);

export { AuthenticationProvider, useAuthentication };
