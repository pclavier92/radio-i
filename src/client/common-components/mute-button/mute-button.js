import React, { useState, useCallback } from 'react';

import './styles.css';

const MuteButton = ({ setVolume }) => {
  const [muted, setMuted] = useState(false);

  const onClick = useCallback(() => {
    setVolume(!muted);
    setMuted(!muted);
    console.log(muted);
  }, [muted]);

  return (
    <div className="mute-button" onClick={onClick}>
      {muted ? (
        <i className="material-icons">volume_off</i>
      ) : (
        <i className="material-icons">volume_up</i>
      )}
    </div>
  );
};

export default MuteButton;
