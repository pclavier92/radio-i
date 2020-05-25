import React, { useEffect, useState } from 'react';
import radioiApi from '../../apis/radioi-api';
import { useRadio } from './radio-provider';
import SongItem from '../../common-components/song-item/song-item';
import subscriptionsApi from '../../apis/subscriptions-api';

const PlayedSongs = () => {
  const radio = useRadio();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        data: { playedSongs }
      } = await radioiApi.getRadioPlayedSongs(radio.hash);
      playedSongs.sort((a, b) => a.position - b.position);
      setSongs(playedSongs);
    })();
  }, []);

  useEffect(() => {
    const onPlaySong = song => {
      setSongs([...songs, song]);
    };
    subscriptionsApi.addPlaySongListener(onPlaySong);
    return () => subscriptionsApi.removePlaySongListener(onPlaySong);
  }, [songs]);

  return (
    <section className="section-played-songs">
      <div className="row">
        <h2>Played Songs</h2>
        <div className="songs-container">
          {songs.length > 0 ? (
            songs.map(({ songId, position }) => (
              <SongItem key={position} songId={songId} />
            ))
          ) : (
            <h3>No songs played yet...</h3>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlayedSongs;
