import React, { Fragment, useEffect, useState } from 'react';

import radioiApi from '../../apis/radioi-api';
import spotifyWebApi from '../../apis/spotify-web-api';

import Spinner from '../spinner';

import './styles.css';

const RadioQueue = ({ id }) => {
  const [radioQueue, setRadioQueue] = useState([]);
  useEffect(() => {
    (async () => {
      const {
        data: { queue }
      } = await radioiApi.getRadioQueue(id);
      queue.sort((a, b) => a.position - b.position);
      setRadioQueue(queue);
    })();
  }, []);

  return (
    <div className="radio-queue">
      {radioQueue.map((song, index) => (
        <RadioQueueItem key={index} data={song} />
      ))}
    </div>
  );
};

const RadioQueueItem = ({ data: { songId } }) => {
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
    <div className="radio-queue-item">
      {item ? (
        <Fragment>
          <img alt="" src={item.image} />
          <div className="queue-item-info-container">
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

export default RadioQueue;
