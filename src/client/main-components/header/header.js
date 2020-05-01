import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import storage from '../../services/storage';
import { serverUrl } from '../../config';
import { useAuthentication } from '../authentication';
import UserDropdown from '../../common-components/user-dropdown';
import SpotifyButton from '../../common-components/spotify-button';

import './styles.css';

const Header = () => {
  const location = useLocation();
  const { authenticated } = useAuthentication();
  const login = useCallback(() => {
    const { pathname, search } = location;
    storage.setLastLocation(pathname + search);
    window.location.href = `${serverUrl}/login`;
  }, []);

  return (
    <header>
      <div className="row">
        <div className="col span-1-of-2">
          <Link className="logo" to="/">
            <h1>RadioI</h1>
          </Link>
        </div>
        <div className="col span-1-of-2">
          {authenticated ? (
            <UserDropdown />
          ) : (
            <SpotifyButton onClick={login}>Login with Spotify</SpotifyButton>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
