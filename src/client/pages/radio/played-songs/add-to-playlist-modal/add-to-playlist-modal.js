import React, { useRef } from 'react';

import SpotifyButton from 'Components/spotify-button';
import { useOnClickOutside } from 'Components/with-on-click-outside';

import './styles.css';

const AddToPlaylistModal = ({ open, onClickOutside }) => {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, onClickOutside);

  const openClass = open ? 'open-modal' : '';
  return (
    <div className={`playlists-modal ${openClass}`}>
      <div className="modal-content" ref={modalRef}>
        <h2>Add Song To Playlist</h2>
        <div className="select-new-or-existent-playlist">
          <SpotifyButton>Add to existent playlist</SpotifyButton>
          <span> OR </span>
          <SpotifyButton>Add to new playlist</SpotifyButton>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
