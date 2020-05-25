import React, { useEffect, useState } from 'react';
import radioiApi from '../../apis/radioi-api';
import { useRadio } from './radio-provider';
import SongItem from '../../common-components/song-item/song-item';

const PlayedSongs = () => {
  const radio = useRadio();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    (async () => {
      const {
        data: { playedSongs }
      } = await radioiApi.getRadioPlayedSongs(radio.hash);
      setSongs(playedSongs);
    })();
  }, []);

  return (
    <section className="section-played-songs">
      <div className="row">
        <h2>Played Songs</h2>
        <div className="songs-container">
          {songs.map(({ songId, position }) => (
            <SongItem key={position} songId={songId} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayedSongs;
