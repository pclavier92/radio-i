import React from 'react';

import './styles.css';

const PhotoBy = ({ ph, link }) => (
  <span className="photo-by">
    Photo by &nbsp;
    <a href={link} target="_blank" rel="noopener noreferrer">
      {ph}
    </a>
  </span>
);

export default PhotoBy;
