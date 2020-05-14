import React from 'react';

import './styles.css';

const InverseSpotifyButton = ({ children, onClick }) => (
  <button type="submit" className="btn-inverse-spotify" onClick={onClick}>
    {children}
  </button>
);

export default InverseSpotifyButton;
