import React, { useCallback, useEffect, useRef, useState } from 'react';

import spotifyWebApi from '../../apis/spotify-web-api';
import useInterval from '../../hooks/use-interval';
import SongCard from '../../common-components/song-card';

const PROGRESS_INTERVAL = 1000; // 1 seg
const UPDATE_INTERVAL = 10 * 1000; // 10 seg

const INITIAL_CURRENTLY_PLAYING = Object.freeze({
  item: { duration_ms: 0 },
  progress_ms: 0
});

const NowPlaying = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(
    INITIAL_CURRENTLY_PLAYING
  );
  const { item, progress_ms } = currentlyPlaying;
  const { duration_ms } = item;
  const isFetching = useRef(false);

  const getCurrentlyPlaying = useCallback(async () => {
    isFetching.current = true;
    const { data } = await spotifyWebApi.getCurrentlyPlaying();
    isFetching.current = false;
    if (data && data.is_playing) {
      setCurrentlyPlaying(data);
    } else {
      setCurrentlyPlaying(INITIAL_CURRENTLY_PLAYING);
    }
  }, []);

  useEffect(() => {
    getCurrentlyPlaying();
  }, []);

  const getCurrentProgress = useCallback(() => {
    if (duration_ms > 0) {
      if (progress_ms > duration_ms) {
        getCurrentlyPlaying();
      } else {
        setCurrentlyPlaying({
          ...currentlyPlaying,
          progress_ms: progress_ms + PROGRESS_INTERVAL
        });
      }
    }
  }, [progress_ms, duration_ms, getCurrentlyPlaying]);

  useInterval(getCurrentProgress, PROGRESS_INTERVAL);
  useInterval(getCurrentlyPlaying, UPDATE_INTERVAL);

  return (
    <div className="now-playing">
      <SongCard song={item} duration={duration_ms} progress={progress_ms} />
    </div>
  );
};

export default NowPlaying;
