import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react';
import { useHistory } from 'react-router-dom';

import radioiApi from '../../apis/radioi-api';
import SpotifyButton from '../../common-components/spotify-button';
import InverseSpotifyButton from '../../common-components/inverse-spotify-button';
import PhotoBy from '../../common-components/photo-by';
import CustomCheckbox from '../../common-components/custom-checkbox';

import { useAuthentication } from '../authentication';

import './styles.css';

const StartRadio = ({ id }) => {
  const history = useHistory();
  const [radioname, setRadioname] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const onInputChange = useCallback(e => setRadioname(e.target.value), []);
  const onPublicChange = useCallback(e => setIsPublic(e.target.checked), []);
  const onCollaborativeChange = useCallback(
    e => setIsCollaborative(e.target.checked),
    []
  );
  const onAnonymousChange = useCallback(
    e => setIsAnonymous(e.target.checked),
    []
  );
  const startRadio = useCallback(
    async e => {
      e.preventDefault();
      try {
        await radioiApi.startRadio(
          id,
          radioname,
          isPublic,
          isCollaborative,
          isAnonymous
        );
        history.push(`/radio?id=${id}`);
      } catch (e) {
        console.log('Could not create radio');
      }
    },
    [id, radioname, isPublic, isCollaborative, isAnonymous]
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
          spellCheck="false"
          maxLength="35"
          onChange={onInputChange}
        />
        <div className="row">
          <div className="col span-1-of-2">
            <SpotifyButton onClick={startRadio}>Start your radio</SpotifyButton>
          </div>
          <div className="col span-1-of-2">
            <div>
              <CustomCheckbox
                id="is-public"
                onChange={onPublicChange}
                className="radio-option-checkbox"
              />
              <h3>Public Radio</h3>
            </div>
            <div>
              <CustomCheckbox
                id="is-collaborative"
                onChange={onCollaborativeChange}
                className="radio-option-checkbox"
              />
              <h3>Collaborative Radio</h3>
            </div>
            <div>
              <CustomCheckbox
                id="is-anonymous"
                onChange={onAnonymousChange}
                className="radio-option-checkbox"
              />
              <h3>Anonymous Radio</h3>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

const RadioStarted = ({ id }) => {
  const history = useHistory();
  const goToRadio = useCallback(() => {
    history.push(`/radio?id=${id}`);
  }, [id]);
  const stopRadio = useCallback(async () => {
    await radioiApi.stopRadio();
    window.location.reload(false);
  }, [id]);
  return (
    <Fragment>
      <h2>Your radio is broadcasting!</h2>
      <div className="row">
        <div className="col span-1-of-2">
          <SpotifyButton onClick={goToRadio}>Go to Radio</SpotifyButton>
        </div>
        <div className="col span-1-of-2">
          <InverseSpotifyButton onClick={stopRadio}>
            Stop Radio
          </InverseSpotifyButton>
        </div>
      </div>
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
        } catch (error) {
          if (error.response.status === 404) {
            setRadioExists(false);
          } else {
            console.log(error);
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
