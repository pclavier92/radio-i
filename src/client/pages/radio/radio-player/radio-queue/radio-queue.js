import React, { Fragment, useEffect, useState, useCallback } from 'react';

import radioiApi from 'Apis/radioi-api';
import spotifyWebApi from 'Apis/spotify-web-api';
import subscriptionsApi from 'Apis/subscriptions-api';
import Spinner from 'Components/spinner';

import { useRadio } from '../../radio-provider';

import './styles.css';

const RadioQueue = ({ loading, started, radioQueue, setRadioQueue }) => {
  const radio = useRadio();

  useEffect(() => {
    (async () => {
      const {
        data: { queue }
      } = await radioiApi.getRadioQueue(radio.hash);
      queue.sort((a, b) => a.position - b.position);
      setRadioQueue(queue);
    })();
  }, []);

  useEffect(() => {
    const shiftQueue = () => {
      const queue = radioQueue.slice(1);
      setRadioQueue(queue);
    };
    subscriptionsApi.addPlaySongListener(shiftQueue);
    subscriptionsApi.onAddToQueue(({ songId, position }) => {
      const queue = [...radioQueue, { songId, position }];
      queue.sort((a, b) => a.position - b.position);
      setRadioQueue(queue);
    });
    subscriptionsApi.onRemoveFromQueue(({ position }) => {
      const queue = radioQueue.filter(
        song => song.position !== parseInt(position)
      );
      setRadioQueue(queue);
    });
    return () => subscriptionsApi.removePlaySongListener(shiftQueue);
  }, [radioQueue]);

  const transparent = !started ? 'transparent' : '';
  return (
    <Fragment>
      {!loading && (
        <div className={`radio-queue ${transparent}`}>
          {radioQueue.length > 0 ? (
            radioQueue.map((song, index) => (
              <RadioQueueItem key={index} data={song} />
            ))
          ) : (
            <div className="empty-queue">
              <h3>Empty Queue</h3>
              <i className="material-icons">queue_music</i>
            </div>
          )}
        </div>
      )}
    </Fragment>
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
