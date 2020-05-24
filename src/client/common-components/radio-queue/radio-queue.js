import React, { Fragment, useEffect, useState, useCallback } from 'react';

import radioiApi from '../../apis/radioi-api';
import spotifyWebApi from '../../apis/spotify-web-api';
import { useRadio } from '../../main-components/radio/radio-provider';

import Spinner from '../spinner';

import './styles.css';

const RadioQueue = ({ queue, started }) => {
  const transparent = !started ? 'transparent' : '';
  return (
    <div className={`radio-queue ${transparent}`}>
      {queue.map((song, index) => (
        <RadioQueueItem key={index} data={song} />
      ))}
    </div>
  );
};

const RadioQueueItem = ({ data: { songId, position } }) => {
  const radio = useRadio();
  const [item, setItem] = useState(null);

  const removeSongFromQueue = useCallback(async () => {
    await radioiApi.removeSongFromQueue(radio.hash, position);
  }, [position]);

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
    <div className="radio-queue-item">
      {item ? (
        <Fragment>
          <img alt="" src={item.image} />
          <div className="queue-item-info-container">
            <h5>{item.name}</h5>
            <h6>{item.artist}</h6>
          </div>
          {radio.isActiveUser && (
            <i className="material-icons" onClick={removeSongFromQueue}>
              delete_forever
            </i>
          )}
        </Fragment>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default RadioQueue;
