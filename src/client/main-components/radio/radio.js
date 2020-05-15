import React, { useEffect, useMemo, useState, Fragment } from 'react';

import spotifySdk from '../../spotify-sdk';
import radioiApi from '../../apis/radioi-api';
import subscriptionsApi from '../../apis/subscriptions-api';
import useQuery from '../../hooks/use-query';
import Spinner from '../../common-components/spinner';
import SharePopUp from '../../common-components/share-pop-up';

import NotFound from '../not-found';
import AuthenticationRequired from '../auth-required';
import { useAuthentication } from '../authentication';

import RigthPanel from './right-panel';
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
    try {
      const onReady = () => setLoading(false);
      spotifySdk.start(onReady);
      subscriptionsApi.subscribe(radio.hash);
    } catch (error) {
      console.log(error);
    }
    return () => {
      spotifySdk.disconnect();
      subscriptionsApi.unsubscribe();
    };
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <section className="section-radio">
          <div className="row">
            <div className="radio-header">
              <div className="row">
                <div className="col span-1-of-3">
                  <h3>
                    {radio.name} by {radio.userName}
                  </h3>
                </div>
                <div className="col span-1-of-3">
                  <h3>Listeners: {listeners}</h3>
                </div>
                <div className="col span-1-of-3">&nspb;</div>
                <SharePopUp />
              </div>
            </div>
            <div className="col span-1-of-3">
              <RadioPlayer radio={radio} setListeners={setListeners} />
            </div>
            <div className="col span-2-of-3">
              <RigthPanel isOwner={isOwner} />
            </div>
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
        } catch (error) {
          if (error.response.status === 404) {
            setRadio(null);
          } else {
            console.log(error);
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
