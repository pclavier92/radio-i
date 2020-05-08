import React, { Fragment, useEffect, useState, useCallback } from 'react';

import radioiApi from '../../apis/radioi-api';
import subscriptionsApi from '../../apis/subscriptions-api';

import RadioQueue from '../../common-components/radio-queue';

import NowPlaying from './now-playing';

const RadioPlayer = ({ radio, setListeners }) => {
  const [radioQueue, setRadioQueue] = useState([]);

  const shiftQueue = useCallback(() => {
    const queue = radioQueue.slice(1);
    setRadioQueue(queue);
  }, [radioQueue]);

  useEffect(() => {
    (async () => {
      const {
        data: { queue }
      } = await radioiApi.getRadioQueue(radio.hash);
      queue.sort((a, b) => a.position - b.position);
      setRadioQueue(queue);
    })();
  }, []);

  useEffect(() => {
    // Set callback everytime the queue updates
    subscriptionsApi.onAddToQueue(({ songId, position, subscriptions }) => {
      const queue = [...radioQueue, { songId, position }];
      queue.sort((a, b) => a.position - b.position);
      setRadioQueue(queue);
      setListeners(subscriptions);
    });
  }, [radioQueue]);

  return (
    <Fragment>
      <NowPlaying
        radio={radio}
        shiftQueue={shiftQueue}
        setListeners={setListeners}
      />
      <RadioQueue queue={radioQueue} />
    </Fragment>
  );
};

export default RadioPlayer;