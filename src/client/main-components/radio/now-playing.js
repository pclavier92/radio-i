import React, { useCallback, useEffect, useRef, useState } from 'react';

import useInterval from '../../hooks/use-interval';
import SongCard from '../../common-components/song-card';
import spotifyWebApi from '../../apis/spotify-web-api';
import subscriptionsApi from '../../apis/subscriptions-api';
import radioiApi from '../../apis/radioi-api';

const PROGRESS_INTERVAL = 1000; // 1 seg

const NowPlaying = ({ radio, shiftQueue, setListeners }) => {
  const [song, setSong] = useState({});
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState(null);

  const getSongDataAndPlayIt = useCallback(async (songId, timestamp) => {
    const { data } = await spotifyWebApi.getSongData(songId);
    const progressMs = new Date().getTime() - timestamp;
    await spotifyWebApi.playSongFrom(data.uri, progressMs);
    setSong(data);
    setDuration(data.duration_ms);
    setProgress(progressMs);
    setProgressInterval(PROGRESS_INTERVAL);
  }, []);

  useEffect(() => {
    const { songId, timestamp } = radio;
    if (songId) {
      getSongDataAndPlayIt(songId, timestamp);
    }
  }, [radio]);

  useEffect(() => {
    subscriptionsApi.onPlaySong(({ songId, timestamp, subscriptions }) => {
      shiftQueue();
      setListeners(subscriptions);
      getSongDataAndPlayIt(songId, timestamp);
    });
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
