import React, { Fragment, useEffect, useState, useCallback } from 'react';

import spotifyWebApi from 'Apis/spotify-web-api';
import Spinner from 'Components/spinner';

import AddToPlaylistModal from '../add-to-playlist-modal';

import './styles.css';

const SongItem = ({ songId }) => {
  const [item, setItem] = useState(null);
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);

  const onClickOutside = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await spotifyWebApi.getSongData(songId);
      const name = data.name;
      const image = data.album.images[2].url;
      const artist = data.artists[0].name;
      setItem({ name, image, artist });
    })();
  }, [songId]);

  return (
    <div className="song-item">
      {item ? (
        <Fragment>
          <img alt="" src={item.image} />
          <div className="song-item-info">
            <h5>{item.name}</h5>
            <h6>{item.artist}</h6>
          </div>
          <i className="material-icons" onClick={openModal}>
            playlist_add
          </i>
          <AddToPlaylistModal open={open} onClickOutside={onClickOutside} />
        </Fragment>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default SongItem;
