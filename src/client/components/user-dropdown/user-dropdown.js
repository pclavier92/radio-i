import React, { useCallback, useState, Fragment } from 'react';

import authService from '../../services/authentication';

import localStorage from '../../local-storage';
import { useAuthentication } from '../../Authentication';

import './styles.css';

const UserDropdown = () => {
  const { user, setAuthenticated } = useAuthentication();
  const [open, setOpen] = useState(false);

  const logOut = useCallback(() => {
    setAuthenticated(false);
    authService.logOut();
  }, []);

  const toggleDropdown = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div className="user-dropdown">
      <button type="button" onClick={toggleDropdown} className="btn btn-user">
        {user && (
          <Fragment>
            <img alt={user.display_name} src={user.images[0].url} />
            <p>{user.display_name}</p>
          </Fragment>
        )}
        {open ? (
          <i className="material-icons">arrow_drop_up</i>
        ) : (
          <i className="material-icons">arrow_drop_down</i>
        )}
      </button>
      {open && (
        <div className="user-button-dropdown">
          <ul>
            <li>
              <button type="button" onClick={logOut}>
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
