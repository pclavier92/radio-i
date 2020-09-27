import React, { Fragment, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import radioiApi from 'Apis/radioi-api';
import SpotifyButton from 'Components/spotify-button';
import InverseSpotifyButton from 'Components/spotify-button';

const RadioStarted = ({ id, setRadioExists }) => {
  const history = useHistory();
  const goToRadio = useCallback(() => {
    history.push(`/radio?id=${id}`);
  }, [id]);
  const stopRadio = useCallback(async () => {
    await radioiApi.stopRadio();
    setRadioExists(false);
  }, [id]);
  return (
    <Fragment>
      <h2>Your radio is broadcasting!</h2>
      <div className="row">
        <div className="col span-1-of-2">
          <SpotifyButton onClick={goToRadio}>Go to Radio</SpotifyButton>
        </div>
        <div className="col span-1-of-2">
          <InverseSpotifyButton onClick={stopRadio}>
            Stop Radio
          </InverseSpotifyButton>
        </div>
      </div>
    </Fragment>
  );
};

export default RadioStarted;
