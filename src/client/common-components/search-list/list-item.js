import React, { useState, useCallback, useEffect } from 'react';

import radioiApi from '../../apis/radioi-api';
import { msToMinutesSeconds } from '../../utils';
import { useAuthentication } from '../../main-components/authentication';

const ListItem = ({
  item: { id, name: songName, duration_ms: duration, album, artists }
}) => {
  const [mainArtist] = artists;
  const [songAdded, setSongAdded] = useState(false);
  const { user } = useAuthentication();

  useEffect(() => {
    setSongAdded(false);
  }, [id]);

  const addSong = useCallback(() => {
    if (!songAdded) {
      setSongAdded(true);
      radioiApi.addSongToRadio(user.hash, id, duration);
    }
  }, [songAdded, id]);

  return (
    <li className="row" onClick={addSong}>
      <div className="col span-4-of-12">{songName}</div>
      <div className="col span-3-of-12">{mainArtist.name}</div>
      <div className="col span-3-of-12">{album.name}</div>
      <div className="col span-2-of-12">{msToMinutesSeconds(duration)}</div>
      <div>
        {songAdded ? (
          <i className="material-icons">playlist_add_check</i>
        ) : (
          <i className="material-icons">playlist_add</i>
        )}
      </div>
    </li>
  );
};

export default ListItem;
