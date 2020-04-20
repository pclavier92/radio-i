import React, {
 useCallback, useEffect, useRef, useState 
} from 'react';
import axios from 'axios';

import useInterval from '../hooks/useInterval';

import SongCard from './song-card/SongCard';

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
  const isFetching = useRef(false);

  const fetchCurrentlyPlaying = useCallback(async () => {
    console.log('fetching song!!');
    const { data } = await getCurrentlyPlaying(token);
    isFetching.current = false;
    if (data) {
      setCurrentlyPlaying(data);
    } else {
      setCurrentlyPlaying(INITIAL_CURRENTLY_PLAYING);
    }
  }, [token]);

  const getCurrentProgress = useCallback(() => {
    if (progress_ms > duration_ms) {
      isFetching.current = true;
      fetchCurrentlyPlaying();
    } else {
      setCurrentlyPlaying({
        ...currentlyPlaying,
        progress_ms: progress_ms + PROGRESS_INTERVAL
      });
    }
  }, [progress_ms, duration_ms, fetchCurrentlyPlaying]);

  useEffect(() => {
    isFetching.current = true;
    fetchCurrentlyPlaying();
  }, []);

  useInterval(getCurrentProgress, PROGRESS_INTERVAL);

  return (
    <div className="now-playing">
      <SongCard song={item} duration={duration_ms} progress={progress_ms} />
    </div>
  );
};

export default NowPlaying;
