import React, { useEffect, useState } from 'react';
import radioiApi from '../../apis/radioi-api';
import { useRadio } from './radio-provider';
import SongItem from '../../common-components/song-item/song-item';
import subscriptionsApi from '../../apis/subscriptions-api';

const PlayedSongs = ({ playedSongs, setPlayedSongs }) => {
  const radio = useRadio();

  useEffect(() => {
    (async () => {
      const {
        data: { playedSongs: songs }
      } = await radioiApi.getRadioPlayedSongs(radio.hash);
      songs.sort((a, b) => a.position - b.position);
      setPlayedSongs(songs);
    })();
  }, []);

  useEffect(() => {
    const onPlaySong = song => {
      setPlayedSongs([...playedSongs, song]);
    };
    subscriptionsApi.addPlaySongListener(onPlaySong);
    return () => subscriptionsApi.removePlaySongListener(onPlaySong);
  }, [playedSongs]);

  return (
    <section className="section-played-songs">
      <div className="row">
        <h2>Played Songs</h2>
        <div className="songs-container">
          {playedSongs.length > 0 ? (
            playedSongs.map(({ songId, position }) => (
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
