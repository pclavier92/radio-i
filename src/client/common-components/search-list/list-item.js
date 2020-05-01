import React, { useState, useCallback, useEffect } from 'react';

import spotifyWebApi from '../../apis/spotify-web-api';
import { msToMinutesSeconds } from '../../utils';

const ListItem = ({
  item: {
 name: songName, duration_ms: duration, album, artists, uri 
}
}) => {
  const [mainArtist] = artists;
  const [songAdded, setSongAdded] = useState(false);

  useEffect(() => {
    setSongAdded(false);
  }, [uri]);

  const addSong = useCallback(() => {
    if (!songAdded) {
      setSongAdded(true);
      const startPosition = 0;
      spotifyWebApi.playSongFrom(uri, startPosition);
    }
  }, [songAdded, uri]);

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
