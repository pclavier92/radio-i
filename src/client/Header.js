import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import storage from './services/storage';
import { serverUrl } from './config';
import { useAuthentication } from './Authentication';
import UserDropdown from './components/user-dropdown';

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
          <h1>RadioI</h1>
        </div>
        <div className="col span-1-of-2">
          {authenticated ? (
            <UserDropdown />
          ) : (
            <button type="button" onClick={login} className="btn btn-login">
              Login with Spotify
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
