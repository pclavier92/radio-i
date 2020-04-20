import React, { Fragment, useMemo } from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

import './styles.css';

const msToMinSeconds = (ms) => {
  if (ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const min = Math.floor(totalSeconds / 60);
    let sec = Math.floor(totalSeconds % 60);
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `${min}:${sec}`;
  }
  return '0:00';
};

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#dfdfdd'
  },
  barColorPrimary: {
    backgroundColor: 'rgb(51, 81, 117)'
  }
})(LinearProgress);

const SongCard = ({ song, duration, progress }) => {
  const name = song.name && song.name;
  const album = song.album && song.album.name;
  const cover = song.album && song.album.images[0].url;
  const artits = useMemo(
    () => song.artists && song.artists.map(artist => artist.name).join(' - '),
    [song]
  );
  const formatedDuration = useMemo(() => msToMinSeconds(duration), [duration]);
  const formatedProgress = useMemo(() => msToMinSeconds(progress), [progress]);
  const completed = progress ? (progress * 100) / duration : 0;

  return (
    <div className="card clearfix">
      {name ? (
        <Fragment>
          <div className="cover">
            <img src={cover} alt={album} />
          </div>
          <div className="content">
            <div className="song-details">
              <h4>{name}</h4>
              <h5>{album}</h5>
              <h6>{artits}</h6>
              <p>
                {formatedProgress}
                <span>{formatedDuration}</span>
              </p>
              <ColorLinearProgress variant="determinate" value={completed} />
            </div>
          </div>
        </Fragment>
      ) : (
        <div className="row no-song">
          <h3>No song playing...</h3>
        </div>
      )}
    </div>
  );
};

export default SongCard;
