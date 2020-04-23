import React from 'react';

import localStorage from './local-storage';
import { useAuthentication } from './Authentication';

// PROVISIONAL
const LOCAL_SERVER_URL = 'http://localhost:8888';

const Header = () => {
  const { accessToken, setAccessToken, setRefreshToken } = useAuthentication();

  const logOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clearApiTokens();
  };

  return (
    <header>
      <div className="row">
        <div className="col span-1-of-2">
          <h1>RadioI</h1>
        </div>
        <div className="col span-1-of-2">
          {accessToken ? (
            <button onClick={logOut} className="btn btn-logout">
              Logout
            </button>
          ) : (
            <a href={`${LOCAL_SERVER_URL}/login`} className="btn btn-login">
              Login with Spotify
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
