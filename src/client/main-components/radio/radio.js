import React, { useEffect, useMemo, useState } from 'react';

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
import PlayedSongs from './played-songs';
import { RadioProvider } from './radio-provider';

import './styles.css';

const Radio = ({ radio }) => {
  const { user } = useAuthentication();
  const [playedSongs, setPlayedSongs] = useState([]);
  const [radioQueue, setRadioQueue] = useState([]);
  const [listeners, setListeners] = useState(0);
  const isOwner = useMemo(() => user && user.hash === radio.hash, [user]);
  const isActiveUser = isOwner || radio.isCollaborative;

  useEffect(() => {
    try {
      subscriptionsApi.subscribe(radio.hash);
      subscriptionsApi.onListenersUpdate(({ listeners }) => {
        setListeners(listeners);
      });
    } catch (error) {
      console.error(error);
    }
    return () => {
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
            <RadioPlayer
              radioQueue={radioQueue}
              setRadioQueue={setRadioQueue}
            />
          </div>
          <div className="col span-2-of-3">
            <RigthPanel playedSongs={playedSongs} radioQueue={radioQueue} />
          </div>
        </div>
      </section>
      <PlayedSongs playedSongs={playedSongs} setPlayedSongs={setPlayedSongs} />
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
