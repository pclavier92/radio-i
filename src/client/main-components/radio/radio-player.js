import React, { Fragment, useEffect, useState, useCallback } from 'react';

import radioiApi from '../../apis/radioi-api';
import subscriptionsApi from '../../apis/subscriptions-api';

import RadioQueue from '../../common-components/radio-queue';

import NowPlaying from './now-playing';
import { useRadio } from './radio-provider';

const RadioPlayer = () => {
  const radio = useRadio();
  const [started, setStarted] = useState(false);
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
    subscriptionsApi.onAddToQueue(({ songId, position }) => {
      const queue = [...radioQueue, { songId, position }];
      queue.sort((a, b) => a.position - b.position);
      setRadioQueue(queue);
    });
    // Set callback everytime the queue updates
    subscriptionsApi.onRemoveFromQueue(({ position }) => {
      debugger;
      const queue = radioQueue.filter(
        song => song.position !== parseInt(position)
      );
      debugger;
      setRadioQueue(queue);
    });
  }, [radioQueue]);

  return (
    <Fragment>
      <NowPlaying
        radio={radio}
        started={started}
        setStarted={setStarted}
        shiftQueue={shiftQueue}
      />
      <RadioQueue queue={radioQueue} started={started} />
    </Fragment>
  );
};

export default RadioPlayer;
