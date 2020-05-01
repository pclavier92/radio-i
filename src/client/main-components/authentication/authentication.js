import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';

import storage from '../../services/storage';
import useRefreshAccessToken from '../../hooks/use-refresh-access-token';
import authService from '../../services/authentication';
import spotifyWebApi from '../../apis/spotify-web-api';

const authentication = React.createContext({});

const nonce = 'user-hash-key';

const AuthenticationProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const { redirected } = authService.getAuthentication();
      setAuthenticated(true);
      if (redirected) {
        const lastFullPath = storage.getLastLocation();
        const path = lastFullPath || '/';
        history.push(path);
      }
      (async () => {
        const { data } = await spotifyWebApi.getUserInfo();
        data.hash = sha256(nonce + data.id);
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
