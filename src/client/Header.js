import React from 'react';

import UserDropdown from './components/user-dropdown';

import { serverUrl } from './config';
import { useAuthentication } from './Authentication';

const Header = () => {
  const { authenticated } = useAuthentication();

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
            <a href={`${serverUrl}/login`} className="btn btn-login">
              Login with Spotify
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
