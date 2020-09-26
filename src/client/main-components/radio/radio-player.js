import React, { Fragment, useEffect, useState } from 'react';

import useScript from '../../hooks/use-script';
import spotifySdk from '../../spotify-sdk';
import RadioQueue from '../../common-components/radio-queue';

import NowPlaying from './now-playing';
import Spinner from '../../common-components/spinner';

const SPOTIFY_PLAYER_SCRIPT = 'https://sdk.scdn.co/spotify-player.js';

const RadioPlayer = ({ radioQueue, setRadioQueue }) => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useScript(SPOTIFY_PLAYER_SCRIPT); // load spotify player

  useEffect(() => {
    try {
      const onReady = () => setLoading(false);
      spotifySdk.start(onReady);
    } catch (error) {
      console.error(error);
    }
    return () => {
      spotifySdk.disconnect();
    };
  }, []);

  return (
    <Fragment>
      {loading && <Spinner />}
      <NowPlaying loading={loading} started={started} setStarted={setStarted} />
      <RadioQueue
        loading={loading}
        started={started}
        radioQueue={radioQueue}
        setRadioQueue={setRadioQueue}
      />
    </Fragment>
  );
};

export default RadioPlayer;
