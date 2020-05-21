import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment
} from 'react';

import useInterval from '../../hooks/use-interval';
import SongCard, { Card } from '../../common-components/song-card';
import MuteButton from '../../common-components/mute-button';
import spotifyWebApi from '../../apis/spotify-web-api';
import subscriptionsApi from '../../apis/subscriptions-api';

const MAX_VOLUME = 100;
const PROGRESS_INTERVAL = 1000; // 1 seg

const NowPlaying = ({ radio, started, setStarted, shiftQueue }) => {
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

  const startPlaying = useCallback(async () => {
    await spotifyWebApi.setVolume(MAX_VOLUME);
    setStarted(true);
  }, []);

  return (
    <div className="now-playing">
      {started ? (
        <Fragment>
          <SongCard song={song} duration={duration} progress={progress} />
          <MuteButton setVolume={setVolume} />
        </Fragment>
      ) : (
        <Fragment>
          <SongCard song={song} duration={duration} progress={progress} />
          <div className="play-to-start">
            <div className="container" onClick={startPlaying}>
              <i className="material-icons">play_circle_outline</i>
              <h3>Start Listening</h3>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default NowPlaying;
