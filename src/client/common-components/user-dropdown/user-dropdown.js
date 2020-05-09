import React, { useCallback, useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import authService from '../../services/authentication';
import { useAuthentication } from '../../main-components/authentication/authentication';

import './styles.css';

const UserDropdown = () => {
  const history = useHistory();
  const { user, setAuthenticated } = useAuthentication();
  const [open, setOpen] = useState(false);

  const logOut = useCallback(() => {
    setAuthenticated(false);
    authService.logOut();
    history.push('/');
  }, []);

  const toggleDropdown = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div className="user-dropdown">
      <button type="button" onClick={toggleDropdown} className="btn-user">
        {user && (
          <Fragment>
            <img alt="" src={user.images[0].url} />
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
              <button type="button">Switch Device</button>
            </li>
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
