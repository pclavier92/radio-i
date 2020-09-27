import React, { Fragment, useMemo } from 'react';

import ProgessBar from 'Components/progress-bar';
import RotatingText from 'Components/rotating-text';
import { msToMinutesSeconds } from 'Utils';

import Card from './card';

import './styles.css';

const MAX_H4_HEIGHT = 35;
const MAX_H5_HEIGHT = 30;
const MAX_H6_HEIGHT = 28;
const IMG_RESOLUTION = 300;

const SongCard = ({ song, duration, progress }) => {
  const name = song.name && song.name;
  const album = song.album && song.album.name;
  const cover =
    song.album && song.album.images.find(i => i.height === IMG_RESOLUTION).url;
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
    <Card>
      {name ? (
        <Fragment>
          <div className="cover">
            <img src={cover} alt="" />
          </div>
          <div className="content">
            <div className="song-details">
              <RotatingText id={name} maxHeight={MAX_H4_HEIGHT}>
                <h4>{name}</h4>
              </RotatingText>
              <RotatingText id={artits} maxHeight={MAX_H5_HEIGHT}>
                <h5>{artits}</h5>
              </RotatingText>
              <RotatingText id={album} maxHeight={MAX_H6_HEIGHT}>
                <h6>{album}</h6>
              </RotatingText>

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
    </Card>
  );
};

export default SongCard;
