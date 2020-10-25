import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useHistory } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';

import spotifyWebApi from 'Apis/spotify-web-api';
import radioiApi from 'Apis/radioi-api';
import subscriptionsApi from 'Apis/subscriptions-api';
import authService from 'Services/authentication';
import storage from 'Services/storage';

const authentication = React.createContext({});

const nonce = 'user-hash-key';

const oneMinute = 60 * 1000;

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
    const startRefreshCycle = async () => {
      const {
        data: { access_token, expires_in }
      } = await radioiApi.refreshAccessToken();
      if (access_token && expires_in) {
        authService.setAccessToken(access_token);
        setTimeout(startRefreshCycle, expires_in * 60 - oneMinute);
      } else {
        // TODO - log out
        authService.logOut();
      }
    };
    (async () => {
      try {
        await startRefreshCycle();
        console.log(new Date().toUTCString() + ' - Authenticated Successfully');
        const { data } = await spotifyWebApi.getUserInfo();
        data.hash = sha256(nonce + data.id).toString();
        setUser(data);
        setAuthenticated(true);
        const lastLocation = storage.getLastLocation();
        lastLocation && history.push(lastLocation);
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

  return (
    <authentication.Provider value={authValue}>
      {children}
    </authentication.Provider>
  );
};

const useAuthentication = () => useContext(authentication);

export { AuthenticationProvider, useAuthentication };
