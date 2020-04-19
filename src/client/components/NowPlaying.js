import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import useInterval from '../hooks/useInterval';

import MediaControlCard from './MediaControlCard';

const PROGRESS_INTERVAL = 1000; // ms

const INITIAL_CURRENTLY_PLAYING = Object.freeze({
  item: { duration_ms: 0 },
  progress_ms: 0
});

const getCurrentlyPlaying = token => axios
    .get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'json'
    })
    .catch(e => console.log(e));

const NowPlaying = ({ token }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(
    INITIAL_CURRENTLY_PLAYING
  );
  const { item, progress_ms } = currentlyPlaying;
  const { duration_ms } = item;

  const fetchCurrentlyPlaying = useCallback(async () => {
    const { data } = await getCurrentlyPlaying(token);
    if (data) {
      setCurrentlyPlaying(data);
    }
  }, [token]);

  const getCurrentProgress = useCallback(() => {
    if (progress_ms > duration_ms) {
      fetchCurrentlyPlaying();
    } else {
      setCurrentlyPlaying({
        ...currentlyPlaying,
        progress_ms: progress_ms + PROGRESS_INTERVAL
      });
    }
  }, [progress_ms, duration_ms, fetchCurrentlyPlaying]);

  useEffect(() => {
    fetchCurrentlyPlaying();
  }, []);

  useInterval(getCurrentProgress, PROGRESS_INTERVAL);

  const completed = item ? (progress_ms * 100) / duration_ms : 0;

  return (
    <div className="now-playing">
      <MediaControlCard song={item} completed={completed} />
    </div>
  );
};

export default NowPlaying;
