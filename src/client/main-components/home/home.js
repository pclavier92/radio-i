import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import SpotifyButton from '../../common-components/spotify-button';
import PhotoBy from '../../common-components/photo-by';
import CustomCheckbox from '../../common-components/custom-checkbox';
import { useAuthentication } from '../authentication';
import radioiApi from '../../apis/radioi-api';

import './styles.css';

const Lobby = () => {
  const history = useHistory();
  const { user } = useAuthentication();
  const [radioname, setRadioname] = useState('');
  const [makePublic, setMakePublic] = useState(false);
  const id = useMemo(() => user && user.hash, [user]);

  const onInputChange = useCallback(e => setRadioname(e.target.value), []);
  const onCheckboxChange = useCallback(
    e => setMakePublic(e.target.checked),
    []
  );
  const onStartRadioClick = useCallback(
    e => {
      if (radioname !== '') {
        e.preventDefault();
        radioiApi.startRadio(id, radioname, makePublic);
        history.push(`/radio?id=${id}`);
      }
    },
    [id, radioname]
  );

  return (
    <section className="section-lobby background-img">
      <div className="row">
        <div className="col span-1-of-2">
          <div className="lobby-left-box">
            <h2>Give your radio a name</h2>
            <h2>& start playing some music</h2>
            <form autoComplete="off">
              <input
                type="text"
                name="radio-name"
                id="radio-name"
                maxLength="35"
                required
                onChange={onInputChange}
              />
              <SpotifyButton onClick={onStartRadioClick}>
                Start your radio
              </SpotifyButton>

              <CustomCheckbox className="make-public-checkbox" />
              <h3>Make Radio Public</h3>
            </form>
          </div>
        </div>
        <div className="col span-1-of-2">
          <div className="lobby-right-box">
            <h2>...or start listening to some radios</h2>
          </div>
        </div>
        <PhotoBy ph="Matt Botsford" link="https://unsplash.com/@mattbotsford" />
      </div>
    </section>
  );
};

const BaseHome = () => (
  <section className="section-home background-img">
    <div className="row">
      <div className="home-text-box">
        <h2>Create a radio.</h2>
        <h2>Share it with friends.</h2>
        <h2>Let everyone listen to what you play live!</h2>
      </div>
      <PhotoBy ph="Eric Nopanen" link="https://unsplash.com/@rexcuando" />
    </div>
  </section>
);

const Home = () => {
  const { authenticated } = useAuthentication();
  return <Fragment>{authenticated ? <Lobby /> : <BaseHome />}</Fragment>;
};

export default Home;
