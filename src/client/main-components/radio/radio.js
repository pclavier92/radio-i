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
import { RadioProvider } from './radio-provider';

import './styles.css';
import useScript from '../../hooks/use-script';

const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js';

const Radio = ({ radio }) => {
  const { user } = useAuthentication();
  const [loading, setLoading] = useState(true);
  const [listeners, setListeners] = useState(0);
  const isOwner = useMemo(() => user && user.hash === radio.hash, [user]);
  const isActiveUser = isOwner || radio.isCollaborative;

  useScript(SPOTIFY_PLAYER_SCRIPT); // load spotify player

  useEffect(() => {
    try {
      const onReady = () => setLoading(false);
      spotifySdk.start(onReady);
      subscriptionsApi.subscribe(radio.hash);
      subscriptionsApi.onListenersUpdate(({ listeners }) => {
        setListeners(listeners);
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      spotifySdk.disconnect();
      subscriptionsApi.unsubscribe('Radio player component unmounting');
    };
  }, []);

  const value = useMemo(() => ({
    ...radio,
    isActiveUser
  }));

  return (
    <RadioProvider value={value}>
      <section className="section-radio">
        <div className="row">
          <div className="radio-header">
            <div className="row">
              <div className="col span-1-of-3">
                <h3>{radio.name}</h3>
              </div>
              <div className="col span-1-of-3">
                <h3>Listeners: {listeners}</h3>
              </div>
              <div className="col span-1-of-3"></div>
              <SharePopUp />
            </div>
          </div>
          <div className="col span-1-of-3">
            {loading ? <Spinner /> : <RadioPlayer radio={radio} />}
          </div>
          <div className="col span-2-of-3">
            <RigthPanel />
          </div>
        </div>
      </section>
    </RadioProvider>
  );
};

const RadioRouter = () => {
  const [radio, setRadio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authenticated } = useAuthentication();

  const q = useQuery();
  const radioId = q.get('id');

  useEffect(() => {
    if (radioId && authenticated) {
      (async () => {
        try {
          const { data } = await radioiApi.getRadio(radioId);
          setRadio(data);
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setRadio(null);
            setLoading(false);
          } else {
            console.error(error);
          }
        }
      })();
    } else {
      setLoading(false);
    }
  }, [radioId, authenticated]);

  if (loading) {
    return <Spinner />;
  }

  if (radioId) {
    if (authenticated) {
      if (radio) {
        return <Radio radio={radio} />;
      } else {
        return <NotFound />;
      }
    } else {
      return <AuthenticationRequired />;
    }
  } else {
    return <NotFound />;
  }
};

export default RadioRouter;
