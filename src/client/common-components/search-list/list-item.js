import React, { useState, useCallback, useEffect } from 'react';

import radioiApi from '../../apis/radioi-api';
import useQuery from '../../hooks/use-query';
import { msToMinutesSeconds } from '../../utils';

const ListItem = ({
  item: { id, name: songName, duration_ms: duration, album, artists }
}) => {
  const [mainArtist] = artists;
  const [songAdded, setSongAdded] = useState(false);

  const q = useQuery();
  const radioId = q.get('id');

  useEffect(() => {
    setSongAdded(false);
  }, [id]);

  const addSong = useCallback(() => {
    if (!songAdded) {
      setSongAdded(true);
      radioiApi.addSongToRadio(radioId, id, duration);
    }
  }, [radioId, songAdded, id, duration]);

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
