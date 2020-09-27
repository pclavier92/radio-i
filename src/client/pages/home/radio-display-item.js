import React from 'react';

import SpotifyButton from 'Components/spotify-button';

const RadioDisplayItem = ({ radioName, isCollaborative, onClick }) => (
  <li>
    <SpotifyButton onClick={onClick}>Go to Radio</SpotifyButton>
    <h3>{radioName}</h3>
    {isCollaborative ? (
      <span>
        <h5>Collaborative</h5>
        <i className="material-icons">check_circle</i>
      </span>
    ) : null}
  </li>
);

export default RadioDisplayItem;
