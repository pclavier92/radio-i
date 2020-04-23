import React, {
 useCallback, useEffect, useRef, useState 
} from 'react';
import axios from 'axios';

import useInterval from './hooks/use-interval';
import { useAuthentication } from './Authentication';
import SongCard from './components/song-card';

const PROGRESS_INTERVAL = 1000; // ms

const INITIAL_CURRENTLY_PLAYING = Object.freeze({
  item: { duration_ms: 0 },
  progress_ms: 0
});

const getCurrentlyPlaying = accessToken => axios
    .get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'json'
    })
    .catch(e => console.log(e));

const NowPlaying = () => {
  const { accessToken } = useAuthentication();

  const [currentlyPlaying, setCurrentlyPlaying] = useState(
    INITIAL_CURRENTLY_PLAYING
  );
  const { item, progress_ms } = currentlyPlaying;
  const { duration_ms } = item;
  const isFetching = useRef(false);

  const fetchCurrentlyPlaying = useCallback(async () => {
    const { data } = await getCurrentlyPlaying(accessToken);
    isFetching.current = false;
    if (data) {
      setCurrentlyPlaying(data);
    } else {
      setCurrentlyPlaying(INITIAL_CURRENTLY_PLAYING);
    }
  }, [accessToken]);

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

  useInterval(getCurrentProgress, PROGRESS_INTERVAL);

  return (
    <div className="now-playing">
      <SongCard song={item} duration={duration_ms} progress={progress_ms} />
    </div>
  );
};

export default NowPlaying;
