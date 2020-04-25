import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import useInterval from "./hooks/use-interval";
import { useAuthentication } from "./Authentication";
import SongCard from "./components/song-card";

const PROGRESS_INTERVAL = 1000; // 1 seg
const UPDATE_INTERVAL = 10 * 1000; // 10 seg

const INITIAL_CURRENTLY_PLAYING = Object.freeze({
  item: { duration_ms: 0 },
  progress_ms: 0
});

const getCurrentlyPlaying = accessToken =>
  axios
    .get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: "json"
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
    isFetching.current = true;
    const { data } = await getCurrentlyPlaying(accessToken);
    isFetching.current = false;
    if (data && data.is_playing) {
      setCurrentlyPlaying(data);
    } else {
      setCurrentlyPlaying(INITIAL_CURRENTLY_PLAYING);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchCurrentlyPlaying();
    }
  }, [accessToken]);

  const getCurrentProgress = useCallback(() => {
    if (duration_ms > 0) {
      if (progress_ms > duration_ms) {
        fetchCurrentlyPlaying();
      } else {
        setCurrentlyPlaying({
          ...currentlyPlaying,
          progress_ms: progress_ms + PROGRESS_INTERVAL
        });
      }
    }
  }, [progress_ms, duration_ms, fetchCurrentlyPlaying]);

  useInterval(getCurrentProgress, PROGRESS_INTERVAL);
  useInterval(fetchCurrentlyPlaying, UPDATE_INTERVAL);

  return (
    <div className="now-playing">
      <SongCard song={item} duration={duration_ms} progress={progress_ms} />
    </div>
  );
};

export default NowPlaying;
