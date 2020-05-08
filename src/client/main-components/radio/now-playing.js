import React, { useCallback, useEffect, useRef, useState } from 'react';

import useInterval from '../../hooks/use-interval';
import SongCard from '../../common-components/song-card';
import spotifyWebApi from '../../apis/spotify-web-api';
import subscriptionsApi from '../../apis/subscriptions-api';
import radioiApi from '../../apis/radioi-api';

const PROGRESS_INTERVAL = 1000; // 1 seg
const UPDATE_INTERVAL = 10 * 1000; // 10 seg

const INITIAL_CURRENTLY_PLAYING = Object.freeze({
  item: { duration_ms: 0 },
  progress_ms: 0
});

const NowPlaying = ({ radio, shiftQueue, setListeners }) => {
  const [song, setSong] = useState({});
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState(null);

  useEffect(() => {
    (async () => {
      const { songId, timestamp } = radio;
      const { data } = await spotifyWebApi.getSongData(songId);
      const progressMs = new Date().getTime() - timestamp;
      setSong(data);
      setDuration(data.duration_ms);
      setProgress(progressMs);
      setProgressInterval(PROGRESS_INTERVAL);
    })();
  }, [radio]);

  useEffect(() => {
    subscriptionsApi.onPlaySong(
      async ({ songId, timestamp, subscriptions }) => {
        const { data } = await spotifyWebApi.getSongData(songId);
        const progressMs = new Date().getTime() - timestamp;
        await spotifyWebApi.playSongFrom(data.uri, progressMs);
        setSong(data);
        setDuration(data.duration_ms);
        setProgress(progressMs);
        setListeners(subscriptions);
        setProgressInterval(PROGRESS_INTERVAL);
        shiftQueue();
      }
    );
  }, [shiftQueue]);

  const getCurrentProgress = useCallback(() => {
    if (duration > 0) {
      if (progress > duration) {
        setProgressInterval(null);
      } else {
        setProgress(progress + PROGRESS_INTERVAL);
      }
    }
  }, [progress, duration]);

  useInterval(getCurrentProgress, progressInterval);

  return (
    <div className="now-playing">
      <SongCard song={song} duration={duration} progress={progress} />
    </div>
  );
};

export default NowPlaying;
