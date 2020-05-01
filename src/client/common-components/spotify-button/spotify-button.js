import React from 'react';

import './styles.css';

const SpotifyButton = ({ children, onClick }) => (
  <button type="submit" className="btn-spotify" onClick={onClick}>
    {children}
  </button>
);

export default SpotifyButton;
