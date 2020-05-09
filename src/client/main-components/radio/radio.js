import React, { useEffect, useMemo, useState, Fragment } from 'react';

import spotifySdk from '../../spotify-sdk';
import radioiApi from '../../apis/radioi-api';
import subscriptionsApi from '../../apis/subscriptions-api';
import authService from '../../services/authentication';
import useQuery from '../../hooks/use-query';
import Spinner from '../../common-components/spinner';

import NotFound from '../not-found';
import AuthenticationRequired from '../auth-required';
import { useAuthentication } from '../authentication';

import Search from './search';
import RadioPlayer from './radio-player';

import './styles.css';
import useScript from '../../hooks/use-script';

const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js';

const Radio = ({ radio }) => {
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [listeners, setListeners] = useState(null);
  const isOwner = useMemo(() => user && user.hash === radio.hash, [user]);

  useScript(SPOTIFY_PLAYER_SCRIPT); // load spotify player

  useEffect(() => {
    const onReady = () => setLoading(false);
    spotifySdk.start(onReady);
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <section className="section-radio">
          <div className="row">
            <div className="row">
              <div className="radio-title">
                <h3>
                  {radio.name} by {radio.userName} | Listeners {listeners}
                </h3>
              </div>
            </div>
            <div className="col span-1-of-3">
              <RadioPlayer radio={radio} setListeners={setListeners} />
            </div>
            <div className="col span-2-of-3">{isOwner && <Search />}</div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

const RadioRouter = () => {
  const [radio, setRadio] = useState(null);
  const { authenticated } = useAuthentication();

  const q = useQuery();
  const radioId = useMemo(() => q.get('id'), []);

  useEffect(() => {
    if (authenticated && radioId) {
      (async () => {
        try {
          const { data } = await radioiApi.getRadio(radioId);
          setRadio(data);
          subscriptionsApi.subscribe(radioId);
        } catch (error) {
          if (error.response.status === 404) {
            console.log('Radio doesnt exists');
          }
        }
      })();
    }
  }, [authenticated]);

  if (!radioId) {
    return <NotFound />;
  } else if (authenticated) {
    if (radio) {
      return <Radio radio={radio} />;
    } else {
      return <NotFound />;
    }
  } else {
    return <AuthenticationRequired />;
  }
};

export default RadioRouter;
