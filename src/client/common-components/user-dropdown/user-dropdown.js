import React, { useCallback, useState, Fragment } from 'react';

import { useAuthentication } from '../../main-components/authentication/authentication';

import { withLastClickInside } from '../with-last-click-inside';

import './styles.css';

const UserDropdown = ({ lastClickInside }) => {
  const { user, logOut } = useAuthentication();
  const [open, setOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setOpen(!open);
  }, [open]);

  debugger;

  return (
    <div className="user-dropdown">
      <button type="button" onClick={toggleDropdown} className="btn-user">
        {user && (
          <Fragment>
            {user.images.lenght > 0 ? (
              <img alt="" src={user.images[0].url} />
            ) : (
              <i className="material-icons no-image-user">person</i>
            )}
            <p>{user.display_name}</p>
          </Fragment>
        )}
        {open ? (
          <i className="material-icons">arrow_drop_up</i>
        ) : (
          <i className="material-icons">arrow_drop_down</i>
        )}
      </button>
      {lastClickInside && open && (
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

export default withLastClickInside(UserDropdown);
