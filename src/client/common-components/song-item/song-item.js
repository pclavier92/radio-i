import React, { Fragment, useEffect, useState } from 'react';

import spotifyWebApi from '../../apis/spotify-web-api';

import Spinner from '../spinner';

import './styles.css';

const SongItem = ({ songId }) => {
  const [item, setItem] = useState(null);

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
        </Fragment>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default SongItem;
