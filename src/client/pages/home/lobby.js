import React, { Fragment, useEffect, useMemo, useState } from 'react';

import radioiApi from 'Apis/radioi-api';
import Spinner from 'Components/spinner';
import { useAuthentication } from 'Context/authentication';

import StartRadio from './start-radio';
import RadioStarted from './radio-started';
import RadiosDisplay from './radio-display';

const Lobby = () => {
  const [loading, setLoading] = useState(true);
  const [radioExists, setRadioExists] = useState(false);
  const { user } = useAuthentication();
  const id = useMemo(() => user && user.hash, [user]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          await radioiApi.getRadio(id);
          setRadioExists(true);
          setLoading(false);
        } catch (error) {
          if (error.response.status === 404) {
            setRadioExists(false);
            setLoading(false);
          } else {
            console.log(error);
          }
        }
      })();
    }
  }, [id]);

  return (
    <Fragment>
      <section className="section-lobby background-img">
        <div className="row">
          <div className="col span-1-of-2">
            <div className="lobby-left-box">
              {loading ? (
                <Spinner />
              ) : radioExists ? (
                <RadioStarted id={id} setRadioExists={setRadioExists} />
              ) : (
                <StartRadio id={id} />
              )}
            </div>
          </div>
          <div className="col span-1-of-2"></div>
        </div>
      </section>
      {!loading && !radioExists && <RadiosDisplay />}
    </Fragment>
  );
};

export default Lobby;
