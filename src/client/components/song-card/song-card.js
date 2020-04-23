import React, { Fragment, useMemo } from 'react';

import ProgessBar from '../progress-bar/progress-bar';

import './styles.css';

import { msToMinutesSeconds } from '../../utils';

/* h4
Most Really Pretty Girls Have -
Stop Selling Her Drugs (feat. -
*/
/* h3
If This Is House I Want My Money Back -
*/

const SongCard = ({ song, duration, progress }) => {
  const name = song.name && song.name;
  const album = song.album && song.album.name;
  const cover = song.album && song.album.images[0].url;
  const artits = useMemo(
    () => song.artists && song.artists.map(artist => artist.name).join(' - '),
    [song]
  );
  const formatedDuration = useMemo(() => msToMinutesSeconds(duration), [
    duration
  ]);
  const formatedProgress = useMemo(() => msToMinutesSeconds(progress), [
    progress
  ]);
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
              <h5>{artits}</h5>
              <h6>{album}</h6>
              <div className="progress">
                <p>
                  {formatedProgress}
                  <span>{formatedDuration}</span>
                </p>
                <ProgessBar completed={completed} />
              </div>
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
