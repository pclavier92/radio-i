import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react';
import { useHistory } from 'react-router-dom';

import SpotifyButton from '../../common-components/spotify-button';
import PhotoBy from '../../common-components/photo-by';
import CustomCheckbox from '../../common-components/custom-checkbox';
import { useAuthentication } from '../authentication';
import radioiApi from '../../apis/radioi-api';

import './styles.css';

const StartRadio = ({ id }) => {
  const { user } = useAuthentication();
  const history = useHistory();
  const [radioname, setRadioname] = useState('');
  const [makePublic, setMakePublic] = useState(false);

  const onInputChange = useCallback(e => setRadioname(e.target.value), []);
  const onCheckboxChange = useCallback(
    e => setMakePublic(e.target.checked),
    []
  );
  const startRadio = useCallback(
    async e => {
      if (radioname !== '') {
        e.preventDefault();
        try {
          await radioiApi.startRadio(id, user.id, radioname, makePublic);
          history.push(`/radio?id=${id}`);
        } catch (e) {
          console.log('Could not create radio');
        }
      }
    },
    [id, radioname]
  );

  return (
    <Fragment>
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
        <SpotifyButton onClick={startRadio}>Start your radio</SpotifyButton>
        <CustomCheckbox
          onChange={onCheckboxChange}
          className="make-public-checkbox"
        />
        <h3>Make Radio Public</h3>
      </form>
    </Fragment>
  );
};

const RadioStarted = ({ id }) => {
  const history = useHistory();
  const goToRadio = useCallback(() => {
    history.push(`/radio?id=${id}`);
  }, [id]);
  return (
    <Fragment>
      <h2>Your radio is live!</h2>
      <SpotifyButton onClick={goToRadio}>Go to Radio</SpotifyButton>
    </Fragment>
  );
};

const Lobby = () => {
  const [radioExists, setRadioExists] = useState(false);
  const { user } = useAuthentication();
  const id = useMemo(() => user && user.hash, [user]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          await radioiApi.getRadio(id);
          setRadioExists(true);
          debugger;
        } catch (error) {
          if (error.response.status === 404) {
            console.log('Radio doesnt exists');
          }
        }
      })();
    }
  }, [id]);

  return (
    <section className="section-lobby background-img">
      <div className="row">
        <div className="col span-1-of-2">
          <div className="lobby-left-box">
            {radioExists ? <RadioStarted id={id} /> : <StartRadio id={id} />}
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

const Home = () => (
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

const HomeRouter = () => {
  const { authenticated } = useAuthentication();
  return <Fragment>{authenticated ? <Lobby /> : <Home />}</Fragment>;
};

export default HomeRouter;
