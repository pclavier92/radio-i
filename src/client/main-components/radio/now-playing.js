import React, { useCallback, useEffect, useRef, useState } from 'react';

import useInterval from '../../hooks/use-interval';
import SongCard from '../../common-components/song-card';
import MuteButton from '../../common-components/mute-button';
import spotifyWebApi from '../../apis/spotify-web-api';
import subscriptionsApi from '../../apis/subscriptions-api';

const PROGRESS_INTERVAL = 1000; // 1 seg

const NowPlaying = ({ radio, shiftQueue }) => {
  const [song, setSong] = useState({});
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressInterval] = useState(null);

  const getSongDataAndPlay = useCallback(async (songId, timestamp) => {
    const { data } = await spotifyWebApi.getSongData(songId);
    const progressMs = new Date().getTime() - timestamp;
    await spotifyWebApi.playSongFrom(data.uri, progressMs);
    setSong(data);
    setDuration(data.duration_ms);
    setProgress(progressMs);
    setProgressInterval(PROGRESS_INTERVAL);
  }, []);

  const setVolume = useCallback(async muted => {
    const volume = muted ? 0 : 100;
    await spotifyWebApi.setVolume(volume);
  }, []);

  useEffect(() => {
    const { songId, timestamp } = radio;
    if (songId) {
      getSongDataAndPlay(songId, timestamp);
    }
  }, [radio]);

  useEffect(() => {
    subscriptionsApi.onPlaySong(({ songId, timestamp }) => {
      shiftQueue();
      getSongDataAndPlay(songId, timestamp);
    });
  }, [shiftQueue]);

  const getCurrentProgress = useCallback(() => {
    if (duration > 0) {
      if (progress > duration) {
        setSong({});
        setDuration(0);
        setProgress(0);
        setProgressInterval(null);
        spotifyWebApi.pausePlayer();
      } else {
        setProgress(progress + PROGRESS_INTERVAL);
      }
    }
  }, [progress, duration]);

  useInterval(getCurrentProgress, progressInterval);

  return (
    <div className="now-playing">
      <SongCard song={song} duration={duration} progress={progress} />
      <MuteButton setVolume={setVolume} />
    </div>
  );
};

export default NowPlaying;
