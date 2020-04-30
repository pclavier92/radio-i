import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuthentication } from './Authentication';

const Lobby = () => {
  const history = useHistory();
  const { user } = useAuthentication();
  const [radioname, setRadioname] = useState('');
  const [makePublic, setMakePublic] = useState(false);
  const stream = useMemo(() => user && user.hash, [user]);

  const onInputChange = useCallback(e => setRadioname(e.target.value), []);
  const onCheckboxChange = useCallback(
    e => setMakePublic(e.target.checked),
    []
  );
  const onStartRadioClick = useCallback(
    e => {
      if (radioname !== '') {
        e.preventDefault();
        history.push(`/radio?stream=${stream}`);
      }
    },
    [stream, radioname]
  );

  return (
    <section className="section-lobby">
      <div className="row">
        <div className="col span-1-of-2">
          <div className="lobby-left-box">
            <h2>Give your radio a name</h2>
            <h2>& start playing some music</h2>
            <form>
              <input
                type="text"
                name="radio-name"
                id="radio-name"
                maxLength="35"
                required
                onChange={onInputChange}
              />
              <button
                type="submit"
                className="btn btn-login"
                onClick={onStartRadioClick}
              >
                Start your radio
              </button>

              <label htmlFor="make-public" className="make-public">
                <input
                  type="checkbox"
                  onChange={onCheckboxChange}
                  name="make-public"
                  id="make-public"
                />
                <span className="checkmark">&nbsp;</span>
              </label>

              <h3>Make Radio Public</h3>
            </form>
          </div>
        </div>
        <div className="col span-1-of-2">
          <div className="lobby-right-box">
            <h2>...or start listening to some radios</h2>
          </div>
        </div>
        <span className="photo-by">
          Photo by &nbsp;
          <a href="https://unsplash.com/@rexcuando?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Eric Nopanen
          </a>
        </span>
      </div>
    </section>
  );
};

const BaseHome = () => (
  <section className="section-home">
    <div className="row">
      <div className="home-text-box">
        <h2>Create a radio.</h2>
        <h2>Share it with friends.</h2>
        <h2>Let everyone listen to what you play live!</h2>
      </div>
      <span>
        Photo by &nbsp;
        <a href="https://unsplash.com/@rexcuando?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Eric Nopanen
        </a>
      </span>
    </div>
  </section>
);

const Home = () => {
  const { authenticated } = useAuthentication();
  return <Fragment>{authenticated ? <Lobby /> : <BaseHome />}</Fragment>;
};

export default Home;
