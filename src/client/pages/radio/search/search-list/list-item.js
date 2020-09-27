import React, { useState, useCallback, useEffect } from 'react';

import radioiApi from 'Apis/radioi-api';
import useQuery from 'Hooks/use-query';
import { msToMinutesSeconds } from 'Utils';

const ListItem = ({
  item: { id, name: songName, duration_ms: duration, album, artists },
  playedSongs,
  radioQueue
}) => {
  const [mainArtist] = artists;
  const [songAdded, setSongAdded] = useState(false);

  const q = useQuery();
  const radioId = q.get('id');

  useEffect(() => {
    const playedOrQueued = [...playedSongs, ...radioQueue].some(
      song => song.songId === id
    );
    if (playedOrQueued) {
      setSongAdded(true);
    } else {
      setSongAdded(false);
    }
  }, [id, playedSongs, radioQueue]);

  const addSong = useCallback(() => {
    radioiApi.addSongToRadio(radioId, id, duration);
  }, [radioId, id, duration]);

  return (
    <li className="row" onClick={addSong}>
      <div className="col span-1-of-12">
        {songAdded ? (
          <i className="material-icons">check_circle</i>
        ) : (
          <i className="material-icons">add_circle_outline</i>
        )}
      </div>
      <div className="col span-4-of-12">{songName}</div>
      <div className="col span-3-of-12">{mainArtist.name}</div>
      <div className="col span-3-of-12">{album.name}</div>
      <div className="col span-1-of-12">{msToMinutesSeconds(duration)}</div>
    </li>
  );
};

export default ListItem;
