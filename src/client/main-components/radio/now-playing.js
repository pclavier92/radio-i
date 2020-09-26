import React, { useCallback, useEffect, useState, Fragment } from 'react';

import useInterval from '../../hooks/use-interval';
import SongCard from '../../common-components/song-card';
import MuteButton from '../../common-components/mute-button';
import spotifyWebApi from '../../apis/spotify-web-api';
import subscriptionsApi from '../../apis/subscriptions-api';

import { useRadio } from './radio-provider';

const MAX_VOLUME = 100;
const PROGRESS_INTERVAL = 1000; // 1 seg

const NowPlaying = ({ loading, started, setStarted }) => {
  const radio = useRadio();
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

  useEffect(() => {
    const { songId, timestamp } = radio;
    if (!loading && songId) {
      getSongDataAndPlay(songId, timestamp);
    }
  }, [loading]);

  useEffect(() => {
    const onPlaySong = ({ songId, timestamp }) => {
      getSongDataAndPlay(songId, timestamp);
    };
    subscriptionsApi.addPlaySongListener(onPlaySong);
    return () => subscriptionsApi.removePlaySongListener(onPlaySong);
  }, []);

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

  const setVolume = useCallback(async muted => {
    const volume = muted ? 0 : 100;
    await spotifyWebApi.setVolume(volume);
  }, []);

  const startPlaying = useCallback(async () => {
    await spotifyWebApi.setVolume(MAX_VOLUME);
    setStarted(true);
  }, []);

  return (
    <Fragment>
      {!loading && (
        <div className="now-playing">
          <SongCard song={song} duration={duration} progress={progress} />
          {started ? (
            <MuteButton setVolume={setVolume} />
          ) : (
            <div className="play-to-start">
              <div className="container" onClick={startPlaying}>
                <i className="material-icons">play_circle_outline</i>
                <h3>Start Listening</h3>
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default NowPlaying;
