import React from 'react';
import axios from 'axios';

import { useAuthentication } from './Authentication';

// PROVISIONAL
const LOCAL_SERVER_URL = 'http://localhost:8888';

const Header = () => {
  const { accessToken, refreshToken, setAccessToken } = useAuthentication();

  const refreshAccessToken = () => {
    if (refreshToken) {
      axios
        .get(`${LOCAL_SERVER_URL}/refresh_token`, {
          params: { refresh_token: refreshToken }
        })
        .then(({ data: { access_token } }) => setAccessToken(access_token));
    }
  };

  return (
    <header>
      <div className="row">
        <div className="col span-1-of-2">
          <h1>RadioI</h1>
        </div>
        <div className="col span-1-of-2">
          {accessToken ? (
            <button onClick={refreshAccessToken} className="btn btn-secondary">
              Refresh access token
            </button>
          ) : (
            <a href={`${LOCAL_SERVER_URL}/login`} className="btn btn-primary">
              Login with Spotify
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
