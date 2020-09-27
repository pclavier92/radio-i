import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import radioiApi from 'Apis/radioi-api';

import RadioDisplayItem from './radio-display-item';

const RadiosDisplay = () => {
  const history = useHistory();
  const [latestRadios, setLatestRadios] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await radioiApi.getLatestRadio();
      setLatestRadios(data);
    })();
  }, []);

  const goToRadio = useCallback(id => {
    history.push(`/radio?id=${id}`);
  }, []);

  return (
    <section className="section-radios-display">
      <div className="row">
        <h2>...or start listening to some radios</h2>
        <ul className="radios-list">
          {latestRadios.length > 0 ? (
            latestRadios.map(({ hash, radioName, isCollaborative }) => (
              <RadioDisplayItem
                key={hash}
                radioName={radioName}
                isCollaborative={isCollaborative}
                onClick={() => goToRadio(hash)}
              />
            ))
          ) : (
            <h3>The are no active radios right now </h3>
          )}
        </ul>
      </div>
    </section>
  );
};

export default RadiosDisplay;
