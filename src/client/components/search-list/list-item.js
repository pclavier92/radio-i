import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

import { msToMinutesSeconds } from "../../utils";

import { useAuthentication } from "../../Authentication";

const startPlayingSong = (accessToken, uri) =>
  axios
    .put(
      "https://api.spotify.com/v1/me/player/play",
      {
        uris: [uri],
        position_ms: 0
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "json"
      }
    )
    .catch(e => console.log(e));

const ListItem = ({
  item: { name: songName, duration_ms: duration, album, artists, uri }
}) => {
  const [mainArtist] = artists;
  const [songAdded, setSongAdded] = useState(false);
  const { accessToken } = useAuthentication();

  useEffect(() => {
    setSongAdded(false);
  }, [uri]);

  const addSong = useCallback(() => {
    if (!songAdded) {
      setSongAdded(true);
      startPlayingSong(accessToken, uri);
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
