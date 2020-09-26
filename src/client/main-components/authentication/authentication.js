import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useHistory } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';

import storage from '../../services/storage';
import useRefreshAccessToken from '../../hooks/use-refresh-access-token';
import authService from '../../services/authentication';
import spotifyWebApi from '../../apis/spotify-web-api';
import radioiApi from '../../apis/radioi-api';
import subscriptionsApi from '../../apis/subscriptions-api';

const authentication = React.createContext({});

const nonce = 'user-hash-key';

const AuthenticationProvider = ({ children }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const logOut = useCallback(() => {
    subscriptionsApi.unsubscribe('Logging out');
    radioiApi.logOut(); // do not wait for log out
    authService.logOut();
    setAuthenticated(false);
    history.push('/');
  }, []);

  useEffect(() => {
    const authenticate = async () => {
      const { data } = await spotifyWebApi.getUserInfo();
      data.hash = sha256(nonce + data.id).toString();
      setUser(data);
      setAuthenticated(true);
    };
    (async () => {
      try {
        const { redirected } = authService.getAuthentication();
        if (redirected) {
          console.log(
            new Date().toUTCString() + ' - Authenticated with Spotify'
          );
          await authenticate();
          const lastFullPath = storage.getLastLocation();
          const path = lastFullPath || '/';
          history.push(path);
        } else {
          await radioiApi.refreshSession();
          console.log(
            new Date().toUTCString() + ' - Session Refreshed Successfully'
          );
          await authenticate();
        }
      } catch (e) {
        logOut();
      }
      setLoading(false);
    })();
  }, []);

  const authValue = useMemo(
    () => ({
      loading,
      user,
      authenticated,
      logOut
    }),
    [loading, user, authenticated, logOut]
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
