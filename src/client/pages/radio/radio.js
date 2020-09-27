import React, { useEffect, useMemo, useState } from 'react';

import subscriptionsApi from 'Apis/subscriptions-api';
import { useAuthentication } from 'Context/authentication';

import RigthPanel from './right-panel';
import RadioPlayer from './radio-player/radio-player';
import PlayedSongs from './played-songs';
import ShareButton from './share-button';
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
              <ShareButton />
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

export default Radio;
